# StockPilot — Shopify Inventory Operations Dashboard

**Functional prototype · simulated store data**

StockPilot is an inventory operations dashboard concept for Shopify merchants. It helps a store team spot variants at risk of selling out, adjust restock thresholds, review alerts, and export the current inventory view.

> **Portfolio demo:** all products and inventory values are sample data. This prototype is not connected to a Shopify store and does not read or change merchant data.

## What works in this prototype

- Inventory overview with tracked, low-stock, out-of-stock, and open-alert totals.
- Clickable summary cards and inventory search/status filters.
- Per-variant restock thresholds and alert review actions.
- Recent activity for threshold changes and alert actions.
- CSV export that follows the current search and status filter.
- English and Spanish interface preference.
- Responsive dashboard layout.

The browser UI talks to a small Node.js demo server. Changes live in memory and reset when the server restarts. schema.sql describes a PostgreSQL starting point; the app does not use that database yet.

## Run locally

Requires Node.js 20 or newer. The prototype uses Node built-ins and has no runtime package dependencies.

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The server binds to localhost and uses sample inventory for Kōra Studio.

## Stack

- Node.js and node:http for the local demo API.
- HTML, CSS, and vanilla JavaScript for the dashboard.
- PostgreSQL schema draft for future shop, inventory, alert, and webhook records.

## Next phase: real Shopify integration

1. Register and install the app through Shopify's supported OAuth flow.
2. Read products and inventory with the Shopify Admin GraphQL API and minimum required scopes.
3. Subscribe to inventory webhooks, verify signatures, and deduplicate deliveries.
4. Persist shop sessions, inventory rules, and alerts in PostgreSQL; remove shop data when the app is uninstalled.
5. Install on development stores and record a portfolio walkthrough using demo data.

The intended first production version is read-only: it observes inventory and helps merchants act on alerts without changing products, quantities, or orders.

## Portfolio framing

Present this project as **Shopify Inventory Operations Dashboard — Functional Prototype**. It demonstrates the dashboard interaction model, inventory-alert logic, bilingual UI, and CSV workflow. Keep the simulated-data disclosure visible until OAuth, the Admin API, webhooks, and persistence are implemented.
<img width="1876" height="950" alt="Captura de pantalla 2026-11-15 145109" src="https://github.com/user-attachments/assets/40b78a59-c602-496c-9298-163b738190d1" />

<img width="1868" height="951" alt="Captura de pantalla 2026-11-15 145056" src="https://github.com/user-attachments/assets/60218f3a-1f50-4370-9680-3f1d4668a49e" />

