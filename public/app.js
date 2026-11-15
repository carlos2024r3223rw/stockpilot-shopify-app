const isHostedDemo = !['localhost', '127.0.0.1', '::1'].includes(location.hostname);
const stored = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
};
const hostedInventory = [
  { id: 'var-001', product: 'Heavyweight Boxy Hoodie', sku: 'KOR-HDY-BLK-M', option: 'Washed Black / M', available: 4, threshold: 5, location: 'New York Warehouse', image: 'hoodie', reviewed: false },
  { id: 'var-002', product: 'Heavyweight Boxy Hoodie', sku: 'KOR-HDY-BLK-XL', option: 'Washed Black / XL', available: 0, threshold: 3, location: 'New York Warehouse', image: 'hoodie', reviewed: false },
  { id: 'var-003', product: 'Oversized Graphic Tee', sku: 'KOR-TEE-BONE-L', option: 'Bone / L', available: 18, threshold: 6, location: 'New York Warehouse', image: 'tee', reviewed: false },
  { id: 'var-004', product: 'Parachute Cargo Pants', sku: 'KOR-CGO-OLV-M', option: 'Olive / M', available: 2, threshold: 5, location: 'New York Warehouse', image: 'cargo', reviewed: false },
  { id: 'var-005', product: 'Crossbody Utility Bag', sku: 'KOR-BAG-BLK-OS', option: 'Black / One size', available: 11, threshold: 4, location: 'New York Warehouse', image: 'bag', reviewed: false },
  { id: 'var-006', product: 'Distressed Washed Cap', sku: 'KOR-CAP-ASH-OS', option: 'Ash / One size', available: 3, threshold: 5, location: 'New York Warehouse', image: 'cap', reviewed: false }
];
const hostedActivity = [
  { id: 'demo-activity-1', type: 'alert_reviewed', variantId: 'var-001', createdAt: new Date(Date.now() - 8 * 60_000).toISOString() },
  { id: 'demo-activity-2', type: 'threshold_changed', variantId: 'var-006', previous: 3, next: 5, createdAt: new Date(Date.now() - 24 * 60_000).toISOString() },
  { id: 'demo-activity-3', type: 'alert_generated', variantId: 'var-002', alertStatus: 'out', createdAt: new Date(Date.now() - 47 * 60_000).toISOString() },
  { id: 'demo-activity-4', type: 'alert_generated', variantId: 'var-004', alertStatus: 'low', createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString() }
];
const state = {
  inventory: isHostedDemo ? stored('stockpilot-demo-inventory', hostedInventory) : [],
  activity: isHostedDemo ? stored('stockpilot-demo-activity', hostedActivity) : [],
  filter: 'all', query: '', language: localStorage.getItem('stockpilot-language') || 'en'
};
const icons = { hoodie: '\u25a7', tee: '\u25b1', cargo: '\u25a4', bag: '\u25b1', cap: '\u25d2' };
const $ = (selector) => document.querySelector(selector);
const copy = {
  en: {
    workspace: 'WORKSPACE', overview: 'Overview', inventory: 'Inventory', alerts: 'Alerts', planTitle: 'Stay ahead of stockouts', planCopy: 'StockPilot keeps your next restock in view.', exploreInventory: 'Explore inventory', settings: 'Settings', apps: 'Apps', demoStore: 'Demo store', storeOwner: 'Store owner', connection: 'Shopify demo data', help: 'Help', summary: 'Inventory summary', demoInventory: 'Demo inventory', recentActivity: 'Recent activity', activitySub: 'The latest changes to your demo inventory and alerts.', demoActivity: 'Demo activity', activityEmpty: 'No recent activity yet.', eventLow: 'Low-stock alert generated', eventOut: 'Out-of-stock alert generated', eventReviewed: 'Alert marked as reviewed', eventThreshold: 'Restock threshold changed', eventThresholdDetail: (before, next) => 'Minimum changed from ' + before + ' to ' + next + ' units', exportCsv: 'Export CSV', exportDone: (count) => count + ' inventory rows exported',
    demoNotice: 'Sample inventory is shown here. Shopify sync is not connected yet.', demoInfo: 'How this demo works', pageTitle: 'Inventory overview', pageSub: 'A clear view of what needs your attention.', reviewAll: 'Review all alerts', trackedVariants: 'Tracked variants', acrossCatalog: 'Across your catalog', lowStock: 'Low stock', atOrBelow: 'At or below threshold', outStock: 'Out of stock', needsRestock: 'Needs a restock', openAlerts: 'Open alerts', awaitingReview: 'Waiting for your review', needsAttention: 'Needs attention', alertSub: 'Items at or below their restock threshold.', viewInventory: 'View inventory', inventoryHealth: 'Inventory health', inventorySub: 'Stock levels by product variant.', searchProducts: 'Search products', filterInventory: 'Filter inventory', allInventory: 'All inventory', needsAttentionFilter: 'Needs attention', healthy: 'Healthy', product: 'PRODUCT', location: 'LOCATION', available: 'AVAILABLE', status: 'STATUS', threshold: 'THRESHOLD', footerProduct: 'Inventory intelligence for Shopify', footerDemo: 'Portfolio prototype - Demo data only', preferences: 'PREFERENCES', language: 'Language', languageHelp: 'Choose the language for the StockPilot interface.', cancel: 'Cancel', save: 'Save changes', units: 'units', markReviewed: 'Mark reviewed', reviewed: 'Reviewed', review: 'Review', noAlerts: 'You are all caught up. No open stock alerts.', rows: (n, total) => n + ' of ' + total + ' variants', languageSaved: 'Language preference saved', alertReviewed: 'Alert marked as reviewed', allReviewed: 'All open demo alerts reviewed', thresholdSaved: (n) => 'Demo threshold set to ' + n + ' units', loadError: 'Could not load demo inventory', updateError: 'Could not update this demo alert', thresholdError: 'Could not update this demo threshold', decrease: (name) => 'Decrease threshold for ' + name, increase: (name) => 'Increase threshold for ' + name
  },
  es: {
    workspace: 'ESPACIO DE TRABAJO', overview: 'Resumen', inventory: 'Inventario', alerts: 'Alertas', planTitle: 'Anticip\u00edpate a los agotados', planCopy: 'StockPilot te ayuda a tener presente la pr\u00f3xima reposici\u00f3n.', exploreInventory: 'Ver inventario', settings: 'Configuraci\u00f3n', apps: 'Apps', demoStore: 'Tienda demo', storeOwner: 'Propietario de la tienda', connection: 'Datos demo de Shopify', help: 'Ayuda', summary: 'Resumen del inventario', demoInventory: 'Inventario de demo', recentActivity: 'Actividad reciente', activitySub: 'Los \u00faltimos cambios en el inventario y las alertas de demo.', demoActivity: 'Actividad de demo', activityEmpty: 'Todav\u00eda no hay actividad reciente.', eventLow: 'Se gener\u00f3 una alerta de pocas existencias', eventOut: 'Se gener\u00f3 una alerta de producto agotado', eventReviewed: 'Alerta marcada como revisada', eventThreshold: 'Se cambi\u00f3 el m\u00ednimo de reposici\u00f3n', eventThresholdDetail: (before, next) => 'M\u00ednimo cambiado de ' + before + ' a ' + next + ' unidades', exportCsv: 'Exportar CSV', exportDone: (count) => 'Se exportaron ' + count + ' filas del inventario',
    demoNotice: 'Aqu\u00ed se muestra inventario de ejemplo. A\u00fan no est\u00e1 conectado con Shopify.', demoInfo: 'C\u00f3mo funciona esta demo', pageTitle: 'Resumen de inventario', pageSub: 'Una vista clara de lo que requiere tu atenci\u00f3n.', reviewAll: 'Revisar todas las alertas', trackedVariants: 'Variantes monitoreadas', acrossCatalog: 'En todo el cat\u00e1logo', lowStock: 'Pocas existencias', atOrBelow: 'En el m\u00ednimo o por debajo', outStock: 'Agotado', needsRestock: 'Necesita reposici\u00f3n', openAlerts: 'Alertas pendientes', awaitingReview: 'Esperando revisi\u00f3n', needsAttention: 'Requiere atenci\u00f3n', alertSub: 'Art\u00edculos en el m\u00ednimo de reposici\u00f3n o por debajo.', viewInventory: 'Ver inventario', inventoryHealth: 'Estado del inventario', inventorySub: 'Existencias por variante de producto.', searchProducts: 'Buscar productos', filterInventory: 'Filtrar inventario', allInventory: 'Todo el inventario', needsAttentionFilter: 'Requiere atenci\u00f3n', healthy: 'Disponible', product: 'PRODUCTO', location: 'UBICACI\u00d3N', available: 'DISPONIBLE', status: 'ESTADO', threshold: 'M\u00cdNIMO', footerProduct: 'Control de inventario para Shopify', footerDemo: 'Prototipo de portafolio - Solo datos de demo', preferences: 'PREFERENCIAS', language: 'Idioma', languageHelp: 'Elige el idioma de la interfaz de StockPilot.', cancel: 'Cancelar', save: 'Guardar cambios', units: 'unidades', markReviewed: 'Marcar revisada', reviewed: 'Revisada', review: 'Revisar', noAlerts: 'Todo al d\u00eda. No tienes alertas de inventario pendientes.', rows: (n, total) => n + ' de ' + total + ' variantes', languageSaved: 'Preferencia de idioma guardada', alertReviewed: 'Alerta marcada como revisada', allReviewed: 'Todas las alertas de demo se marcaron como revisadas', thresholdSaved: (n) => 'M\u00ednimo de demo actualizado a ' + n + ' unidades', loadError: 'No se pudo cargar el inventario de demo', updateError: 'No se pudo actualizar esta alerta de demo', thresholdError: 'No se pudo actualizar este m\u00ednimo de demo', decrease: (name) => 'Bajar el m\u00ednimo de ' + name, increase: (name) => 'Subir el m\u00ednimo de ' + name
  }
};
const statusKeys = { low: 'lowStock', out: 'outStock', healthy: 'healthy' };
const t = (key, ...args) => typeof copy[state.language][key] === 'function' ? copy[state.language][key](...args) : copy[state.language][key];

function applyLanguage(language) {
  state.language = language === 'es' ? 'es' : 'en';
  localStorage.setItem('stockpilot-language', state.language);
  document.documentElement.lang = state.language;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  $('#today-date').textContent = new Intl.DateTimeFormat(state.language === 'es' ? 'es-SV' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase();
  $('#language-select').value = state.language;
  document.querySelectorAll('[data-card-view]').forEach((button) => {
    const labelKey = { all: 'trackedVariants', low: 'lowStock', out: 'outStock', alerts: 'openAlerts' }[button.dataset.cardView];
    button.setAttribute('aria-label', t('viewInventory') + ': ' + t(labelKey));
  });
  renderAlerts();
  renderInventory();
  renderActivity();
}

async function request(path, options = {}) {
  if (isHostedDemo) {
    const method = options.method || 'GET';
    const statusOf = (item) => item.available === 0 ? 'out' : item.available <= item.threshold ? 'low' : 'healthy';
    const persist = () => {
      localStorage.setItem('stockpilot-demo-inventory', JSON.stringify(state.inventory));
      localStorage.setItem('stockpilot-demo-activity', JSON.stringify(state.activity.slice(0, 50)));
    };
    if (method === 'GET' && path === '/api/stock') return state.inventory.map((item) => ({ ...item, status: statusOf(item) }));
    if (method === 'GET' && path === '/api/summary') {
      const flagged = state.inventory.filter((item) => item.available <= item.threshold);
      return { tracked: state.inventory.length, low: flagged.filter((item) => item.available > 0).length, out: flagged.filter((item) => item.available === 0).length, openAlerts: flagged.filter((item) => !item.reviewed).length };
    }
    if (method === 'GET' && path === '/api/activity') return state.activity.slice(0, 12).map((event) => {
      const item = state.inventory.find((variant) => variant.id === event.variantId);
      return { ...event, product: item?.product || 'Unknown product', option: item?.option || '' };
    });
    const acknowledge = path.match(/^\/api\/alerts\/([\w-]+)\/acknowledge$/);
    if (method === 'POST' && acknowledge) {
      const item = state.inventory.find((variant) => variant.id === acknowledge[1]);
      if (!item || item.available > item.threshold) throw new Error('Alert not found');
      if (!item.reviewed) {
        item.reviewed = true;
        state.activity.unshift({ id: 'activity-' + Date.now(), type: 'alert_reviewed', variantId: item.id, createdAt: new Date().toISOString() });
        persist();
      }
      return { ok: true, id: item.id };
    }
    const update = path.match(/^\/api\/stock\/([\w-]+)\/threshold$/);
    if (method === 'PUT' && update) {
      const item = state.inventory.find((variant) => variant.id === update[1]);
      const next = JSON.parse(options.body || '{}').threshold;
      if (!item) throw new Error('Variant not found');
      if (!Number.isInteger(next) || next < 0 || next > 9999) throw new Error('Invalid threshold');
      const previous = item.threshold;
      const wasFlagged = item.available <= previous;
      item.threshold = next;
      const isFlagged = item.available <= next;
      if (previous !== next) state.activity.unshift({ id: 'activity-' + Date.now(), type: 'threshold_changed', variantId: item.id, previous, next, createdAt: new Date().toISOString() });
      if (!wasFlagged && isFlagged) {
        item.reviewed = false;
        state.activity.unshift({ id: 'activity-' + (Date.now() + 1), type: 'alert_generated', variantId: item.id, alertStatus: item.available === 0 ? 'out' : 'low', createdAt: new Date().toISOString() });
      }
      persist();
      return { ok: true, threshold: next, status: item.available === 0 ? 'out' : isFlagged ? 'low' : 'healthy' };
    }
    throw new Error('Unsupported demo request');
  }
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!response.ok) throw new Error('Request failed');
  return response.json();
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('visible');
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => el.classList.remove('visible'), 2400);
}

function badge(item) { return '<span class=\"status-pill ' + item.status + '\">' + t(statusKeys[item.status]) + '</span>'; }
function thumb(item) { return '<span class=\"product-thumb thumb-' + item.image + '\" aria-hidden=\"true\">' + (icons[item.image] || '\u25a6') + '</span>'; }

function renderSummary(summary) {
  $('#stat-tracked').textContent = summary.tracked;
  $('#stat-low').textContent = summary.low;
  $('#stat-out').textContent = summary.out;
  $('#stat-alerts').textContent = summary.openAlerts;
  $('#alert-badge').textContent = summary.openAlerts;
  $('#nav-count').textContent = summary.openAlerts;
}

function renderAlerts() {
  const attention = state.inventory.filter((item) => item.status !== 'healthy' && !item.reviewed);
  $('#alert-list').innerHTML = attention.length ? attention.map((item) =>
    '<div class=\"alert-row\">' + thumb(item) +
    '<div class=\"product-main\"><strong>' + item.product + '</strong><small>' + item.option + ' - ' + item.sku + '</small></div>' +
    '<div class=\"alert-location\">' + item.location + '</div>' +
    '<div class=\"alert-stock\"><strong>' + item.available + ' ' + t('units') + '</strong><small>' + t('threshold') + ': ' + item.threshold + ' ' + t('units') + '</small></div>' +
    badge(item) + '<button class=\"row-action acknowledge\" data-id=\"' + item.id + '\" type=\"button\">' + t('markReviewed') + '</button></div>'
  ).join('') : '<div class=\"empty-state\">' + t('noAlerts') + '</div>';
}

function renderInventory() {
  const rows = state.inventory.filter((item) => {
    const text = (item.product + ' ' + item.sku + ' ' + item.option).toLowerCase();
    const matchesQuery = text.includes(state.query.toLowerCase());
    const matchesFilter = state.filter === 'all' || (state.filter === 'attention' ? item.status !== 'healthy' : item.status === state.filter);
    return matchesQuery && matchesFilter;
  });
  $('#inventory-body').innerHTML = rows.map((item) =>
    '<tr><td><div class=\"table-product\">' + thumb(item) + '<strong>' + item.product + '<br><span class=\"sku\">' + item.option + '</span></strong></div></td>' +
    '<td class=\"sku\">' + item.sku + '</td><td>' + item.location + '</td>' +
    '<td class=\"qty ' + (item.available === 0 ? 'zero' : '') + '\">' + item.available + ' ' + t('units') + '</td><td>' + badge(item) + '</td>' +
    '<td><div class=\"threshold-stepper\"><button type=\"button\" aria-label=\"' + t('decrease', item.product) + '\" data-step=\"-1\" data-id=\"' + item.id + '\">-</button><strong>' + item.threshold + '</strong><button type=\"button\" aria-label=\"' + t('increase', item.product) + '\" data-step=\"1\" data-id=\"' + item.id + '\">+</button></div></td>' +
    '<td>' + (item.status === 'healthy' ? '<span aria-hidden=\"true\">-</span>' : '<button class=\"row-action acknowledge\" data-id=\"' + item.id + '\" type=\"button\">' + (item.reviewed ? t('reviewed') : t('review')) + '</button>') + '</td></tr>'
  ).join('');
  $('#row-count').textContent = t('rows', rows.length, state.inventory.length);
}

function relativeTime(timestamp) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(timestamp).getTime()) / 1000));
  let value = seconds;
  let unit = 'second';
  if (seconds >= 86400) { value = Math.round(seconds / 86400); unit = 'day'; }
  else if (seconds >= 3600) { value = Math.round(seconds / 3600); unit = 'hour'; }
  else if (seconds >= 60) { value = Math.round(seconds / 60); unit = 'minute'; }
  return new Intl.RelativeTimeFormat(state.language === 'es' ? 'es-SV' : 'en-US', { numeric: 'auto' }).format(-value, unit);
}

function renderActivity() {
  const list = $('#activity-list');
  if (!list) return;
  const events = state.activity;
  list.innerHTML = events.length ? events.map((event) => {
    const titleKey = event.type === 'threshold_changed' ? 'eventThreshold'
      : event.type === 'alert_reviewed' ? 'eventReviewed'
        : event.alertStatus === 'out' ? 'eventOut' : 'eventLow';
    const detail = event.type === 'threshold_changed'
      ? t('eventThresholdDetail', event.previous, event.next)
      : event.product + ' - ' + event.option;
    const icon = event.type === 'alert_reviewed' ? 'reviewed' : event.type === 'threshold_changed' ? 'threshold' : event.alertStatus;
    return '<li class=\"activity-item\"><span class=\"activity-icon ' + icon + '\" aria-hidden=\"true\">' +
      (event.type === 'alert_reviewed' ? '\u2713' : event.type === 'threshold_changed' ? '\u2195' : event.alertStatus === 'out' ? '!' : '\u2198') +
      '</span><div class=\"activity-copy\"><strong>' + t(titleKey) + '</strong><small>' + detail + '</small></div>' +
      '<time datetime=\"' + event.createdAt + '\">' + relativeTime(event.createdAt) + '</time></li>';
  }).join('') : '<li class=\"activity-empty\">' + t('activityEmpty') + '</li>';
}

async function refresh() {
  const response = await Promise.all([request('/api/stock'), request('/api/summary'), request('/api/activity')]);
  state.inventory = response[0];
  state.activity = response[2];
  renderSummary(response[1]);
  renderAlerts();
  renderInventory();
  renderActivity();
}

function showInventory(filter) {
  state.filter = filter;
  $('#filter').value = filter;
  renderInventory();
  $('#inventory').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function exportInventoryCsv() {
  const headers = state.language === 'es'
    ? ['Producto', 'Variante', 'SKU', 'Ubicación', 'Disponible', 'Estado', 'Mínimo de reposición', 'Alerta revisada']
    : ['Product', 'Variant', 'SKU', 'Location', 'Available', 'Status', 'Restock threshold', 'Alert reviewed'];
  const rows = state.inventory.filter((item) => {
    const text = (item.product + ' ' + item.sku + ' ' + item.option).toLowerCase();
    return text.includes(state.query.toLowerCase()) && (state.filter === 'all' || (state.filter === 'attention' ? item.status !== 'healthy' : item.status === state.filter));
  });
  const escapeCell = (value) => {
    const safe = String(value).replace(/[\r\n]+/g, ' ').replace(/^([=+@-])/g, "'$1");
    return '"' + safe.replace(/"/g, '""') + '"';
  };
  const content = [headers, ...rows.map((item) => [item.product, item.option, item.sku, item.location, item.available, t(statusKeys[item.status]), item.threshold, item.reviewed ? (state.language === 'es' ? 'Sí' : 'Yes') : 'No'])]
    .map((row) => row.map(escapeCell).join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF', content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'stockpilot-inventory-' + new Date().toISOString().slice(0, 10) + '.csv';
  link.click();
  URL.revokeObjectURL(url);
  toast(t('exportDone', rows.length));
}

document.addEventListener('click', async (event) => {
  const card = event.target.closest('[data-card-view]');
  if (card) {
    const view = card.dataset.cardView;
    document.querySelectorAll('[data-card-view]').forEach((el) => el.classList.toggle('is-selected', el === card));
    if (view === 'alerts') $('#alerts').scrollIntoView({ behavior: 'smooth', block: 'start' });
    else showInventory(view);
  }
  const acknowledge = event.target.closest('.acknowledge');
  if (acknowledge && acknowledge.textContent.trim() !== t('reviewed')) {
    try {
      await request('/api/alerts/' + acknowledge.dataset.id + '/acknowledge', { method: 'POST' });
      await refresh();
      toast(t('alertReviewed'));
    } catch { toast(t('updateError')); }
  }
  const step = event.target.closest('[data-step]');
  if (step) {
    const item = state.inventory.find((row) => row.id === step.dataset.id);
    if (!item) return;
    const nextThreshold = Math.max(0, item.threshold + Number(step.dataset.step));
    try {
      await request('/api/stock/' + item.id + '/threshold', { method: 'PUT', body: JSON.stringify({ threshold: nextThreshold }) });
      await refresh();
      toast(t('thresholdSaved', nextThreshold));
    } catch { toast(t('thresholdError')); }
  }
});

$('#filter').addEventListener('change', (event) => { state.filter = event.target.value; renderInventory(); });
$('#search').addEventListener('input', (event) => { state.query = event.target.value; renderInventory(); });
$('#show-all').addEventListener('click', () => showInventory('all'));
$('#export-inventory').addEventListener('click', exportInventoryCsv);
$('#review-all').addEventListener('click', async () => {
  const pending = state.inventory.filter((item) => item.status !== 'healthy' && !item.reviewed);
  for (const item of pending) await request('/api/alerts/' + item.id + '/acknowledge', { method: 'POST' });
  await refresh();
  toast(t('allReviewed'));
});
$('#settings-button').addEventListener('click', () => {
  $('#language-select').value = state.language;
  $('#settings-dialog').showModal();
});
$('#save-settings').addEventListener('click', () => {
  applyLanguage($('#language-select').value);
  $('#settings-dialog').close();
  toast(t('languageSaved'));
});

applyLanguage(state.language);
refresh().catch(() => toast(t('loadError')));
