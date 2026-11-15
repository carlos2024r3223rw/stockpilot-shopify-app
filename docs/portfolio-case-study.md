# Portfolio case study copy

## English

### StockPilot — Shopify Inventory Operations Dashboard

**Functional prototype · Node.js · JavaScript · Shopify Admin API planned**

StockPilot explores a practical problem for Shopify merchants: spotting low inventory early enough to plan a restock. The prototype turns variant-level stock into a focused operations view, with low-stock and sold-out alerts, editable restock thresholds, a review queue, recent activity, search, filters, CSV export, and English/Spanish interface settings.

**Problem**  Store teams need a quick way to identify which product variants need attention without scanning every SKU manually.

**Prototype solution**  A responsive dashboard highlights inventory states, links the summary to filtered product rows, lets the merchant adjust demo thresholds and review alerts, records those actions in a recent-activity feed, and exports the active view to CSV.

**Current scope**  The interface runs on simulated Kōra Studio inventory. It is not installed in Shopify and does not use Shopify OAuth, the Admin API, live webhooks, or a production database yet.

**Next phase**  Shopify authorization, read-only Admin GraphQL inventory sync, signed and idempotent inventory webhooks, and PostgreSQL persistence.

**Stack**  Node.js, HTML, CSS, vanilla JavaScript, PostgreSQL schema draft.

## Español

### StockPilot — Panel de operaciones de inventario para Shopify

**Prototipo funcional · Node.js · JavaScript · Integración con Shopify planificada**

StockPilot explora un problema práctico para comercios de Shopify: detectar a tiempo qué productos necesitan reposición. El prototipo convierte las existencias por variante en una vista de operaciones con alertas de pocas existencias y agotados, mínimos editables, una cola de revisión, actividad reciente, búsqueda, filtros, exportación CSV e interfaz en inglés y español.

**Problema**  El equipo de una tienda necesita encontrar rápido qué variantes requieren atención, sin revisar cada SKU manualmente.

**Solución del prototipo**  Un panel adaptable resalta el estado del inventario, conecta los resúmenes con filtros, permite ajustar mínimos de demo y revisar alertas, registra esas acciones en la actividad reciente y exporta a CSV la vista activa.

**Alcance actual**  La interfaz usa inventario simulado de Kōra Studio. Todavía no está instalada en Shopify ni usa OAuth, Admin API, webhooks en vivo o una base de datos de producción.

**Siguiente fase**  Autorización de Shopify, sincronización de inventario de solo lectura con Admin GraphQL, webhooks de inventario firmados e idempotentes y persistencia en PostgreSQL.

**Tecnologías**  Node.js, HTML, CSS, JavaScript sin framework y un esquema inicial de PostgreSQL.
