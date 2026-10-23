# DPP_demo
Interactive Digital Product Passport (DPP) presales demonstrator by Dataciders. Explore battery value chains, role-based product information, regulatory requirements, Scope 1–3 emissions, system integration, AAS-based semantics, and product intelligence through interactive data flows, change simulations, and circular aftersales use cases.

## Entwicklung

```bash
cd frontend
npm install
npm run dev        # Entwicklungsserver
npm run build      # Typprüfung + Produktions-Build
```

## Struktur

- `Orga/` – Spezifikation (`Demoaufbau.md`, `README.md`), Seitenbeschreibungen in `pages/`, Referenzbilder in `assets/`
- `frontend/src/lib/pages.ts` – einzige Quelle der Fachseiten (Routen, Navigation, Verknüpfungen)
- `frontend/src/content/` – Inhaltsschicht mit Beispieldaten (Phase 1); Zugriff nur über die Hooks in `hooks/useContent.ts`, damit in Phase 2 die API-Anbindung an einer Stelle ersetzt werden kann
- `frontend/src/features/` – eine Seite je Ansicht, `components/` – gemeinsame UI-Bausteine
