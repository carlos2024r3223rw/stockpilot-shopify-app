import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicDir = join(root, 'public');
const port = Number(process.env.PORT || 3000);

// Clearly labeled sample data until the Shopify OAuth/API connection is configured.
const variants = [
  { id: 'var-001', product: 'Heavyweight Boxy Hoodie', sku: 'KOR-HDY-BLK-M', option: 'Washed Black / M', available: 4, threshold: 5, location: 'New York Warehouse', image: 'hoodie' },
  { id: 'var-002', product: 'Heavyweight Boxy Hoodie', sku: 'KOR-HDY-BLK-XL', option: 'Washed Black / XL', available: 0, threshold: 3, location: 'New York Warehouse', image: 'hoodie' },
  { id: 'var-003', product: 'Oversized Graphic Tee', sku: 'KOR-TEE-BONE-L', option: 'Bone / L', available: 18, threshold: 6, location: 'New York Warehouse', image: 'tee' },
  { id: 'var-004', product: 'Parachute Cargo Pants', sku: 'KOR-CGO-OLV-M', option: 'Olive / M', available: 2, threshold: 5, location: 'New York Warehouse', image: 'cargo' },
  { id: 'var-005', product: 'Crossbody Utility Bag', sku: 'KOR-BAG-BLK-OS', option: 'Black / One size', available: 11, threshold: 4, location: 'New York Warehouse', image: 'bag' },
  { id: 'var-006', product: 'Distressed Washed Cap', sku: 'KOR-CAP-ASH-OS', option: 'Ash / One size', available: 3, threshold: 5, location: 'New York Warehouse', image: 'cap' },
];

const reviewed = new Set();
const activity = [
  { id: 'demo-activity-1', type: 'alert_reviewed', variantId: 'var-001', createdAt: new Date(Date.now() - 8 * 60_000).toISOString() },
  { id: 'demo-activity-2', type: 'threshold_changed', variantId: 'var-006', previous: 3, next: 5, createdAt: new Date(Date.now() - 24 * 60_000).toISOString() },
  { id: 'demo-activity-3', type: 'alert_generated', variantId: 'var-002', alertStatus: 'out', createdAt: new Date(Date.now() - 47 * 60_000).toISOString() },
  { id: 'demo-activity-4', type: 'alert_generated', variantId: 'var-004', alertStatus: 'low', createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString() },
];
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };

function recordActivity(event) {
  activity.unshift({ id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString(), ...event });
  activity.splice(50);
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}

async function handle(req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/api/stock') {
    return send(res, 200, variants.map((item) => ({ ...item, reviewed: reviewed.has(item.id), status: item.available === 0 ? 'out' : item.available <= item.threshold ? 'low' : 'healthy' })));
  }
  if (req.method === 'GET' && url.pathname === '/api/summary') {
    const flagged = variants.filter((item) => item.available <= item.threshold);
    return send(res, 200, {
      tracked: variants.length,
      low: flagged.filter((item) => item.available > 0).length,
      out: flagged.filter((item) => item.available === 0).length,
      openAlerts: flagged.filter((item) => !reviewed.has(item.id)).length,
    });
  }
  if (req.method === 'GET' && url.pathname === '/api/activity') {
    const entries = activity.slice(0, 12).map((event) => {
      const variant = variants.find((item) => item.id === event.variantId);
      return { ...event, product: variant?.product || 'Unknown product', option: variant?.option || '' };
    });
    return send(res, 200, entries);
  }
  const acknowledge = url.pathname.match(/^\/api\/alerts\/([\w-]+)\/acknowledge$/);
  if (req.method === 'POST' && acknowledge) {
    const variant = variants.find((item) => item.id === acknowledge[1]);
    if (!variant || variant.available > variant.threshold) return send(res, 404, { error: 'Alert not found' });
    if (!reviewed.has(variant.id)) {
      reviewed.add(variant.id);
      recordActivity({ type: 'alert_reviewed', variantId: variant.id });
    }
    return send(res, 200, { ok: true, id: variant.id });
  }
  const thresholdUpdate = url.pathname.match(/^\/api\/stock\/([\w-]+)\/threshold$/);
  if (req.method === 'PUT' && thresholdUpdate) {
    const variant = variants.find((item) => item.id === thresholdUpdate[1]);
    if (!variant) return send(res, 404, { error: 'Variant not found' });
    let body = '';
    for await (const chunk of req) body += chunk;
    let value;
    try { value = JSON.parse(body).threshold; } catch { return send(res, 400, { error: 'Invalid JSON' }); }
    if (!Number.isInteger(value) || value < 0 || value > 9999) return send(res, 400, { error: 'Threshold must be an integer from 0 to 9999' });
    const previous = variant.threshold;
    const wasFlagged = variant.available <= previous;
    variant.threshold = value;
    const isFlagged = variant.available <= variant.threshold;
    if (previous !== value) recordActivity({ type: 'threshold_changed', variantId: variant.id, previous, next: value });
    if (!wasFlagged && isFlagged) {
      reviewed.delete(variant.id);
      recordActivity({ type: 'alert_generated', variantId: variant.id, alertStatus: variant.available === 0 ? 'out' : 'low' });
    }
    return send(res, 200, { ok: true, threshold: value, status: variant.available === 0 ? 'out' : isFlagged ? 'low' : 'healthy' });
  }
  if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true, mode: 'demo' });

  const relative = url.pathname === '/' ? 'index.html' : normalize(decodeURIComponent(url.pathname).replace(/^[/\\]+/, ''));
  const file = resolve(publicDir, relative);
  if (file !== publicDir && !file.startsWith(`${publicDir}${sep}`)) return send(res, 403, { error: 'Forbidden' });
  try {
    const content = await readFile(file);
    return send(res, 200, content, mime[extname(file)] || 'application/octet-stream');
  } catch {
    return send(res, 404, { error: 'Not found' });
  }
}

createServer((req, res) => {
  handle(req, res).catch(() => send(res, 500, { error: 'Unexpected server error' }));
}).listen(port, '127.0.0.1', () => {
  console.log(`StockPilot demo running at http://127.0.0.1:${port}`);
});
