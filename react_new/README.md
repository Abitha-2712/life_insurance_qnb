# QNB Life — React Back Office

Flutter → React migration of `qnb-insurance-ui` / `qnb-insurance-ui-component`.

Architecture: see [`../docs/gatewayui-revamp-architecture.md`](../docs/gatewayui-revamp-architecture.md)  
Status: [`MIGRATION_STATUS.md`](./MIGRATION_STATUS.md)  
QA: [`QA_ROUND_1.md`](./QA_ROUND_1.md) · [`QA_ROUND_2.md`](./QA_ROUND_2.md) · [`QA_ROUND_3.md`](./QA_ROUND_3.md)

## Quick start

```bash
npm install
npm run dev          # Vite dev server (proxies /bo-api + /data-api)
npm test             # Vitest — 173 tests
npm run build        # production build → dist/
npm run lint         # oxlint
```

Copy `.env.example` → `.env` and point hosts at the BO / data URLs (Flutter `base_url.dart` parity). Restart `npm run dev` after `.env` changes.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local UI + Vite proxy |
| `npm test` / `npm run test:watch` | Unit tests |
| `npm run test:coverage` | Coverage |
| `npm run build` | Ship build |
| `npm run preview` | Preview production build |

## Structure

```txt
src/
  app/           routes + App shell
  core/          api, auth, i18n, config, crypto, router guards
  themes/        --qnb-* tokens (colors, typography, spacing, radius)
  components/    layout + ui primitives
  features/      domain modules (login, dashboard, FAQ, bank, MFA, …)
```

## Status snapshot (after QA Round 3)

| Status | Count | Notes |
|--------|------:|-------|
| **DONE** | **9** | `login`, `dashboard`, `bo_app_bar`, `common`, `ui_menu_navigation`, `FAQ_management`, `bank_management`, `force_update_configuration`, `mfa_management` |
| PARTIAL | 59 | City-template CRUD; SoftFetch or incomplete Flutter multi-step |
| COMING_SOON | 1 | Flutter `coming_soon` |
| STUB | 0 | |

### Known PARTIAL gaps (honest)

1. **SoftFetch-only** (no CSV): 26 feature services + 32 `other_config` children — need Flutter datasource / Freezed DTO parity before DONE.
2. **user_management** — role/group + entitlement **helpers** exist; GraphQL product/subproduct/access **matrix UI** still lag.
3. **error_management** — SoftFetch `error/*` not in CSV.
4. **partner_onboarding** — stepper chrome tokenized; volume/auth edge steps lag Flutter.
5. **banner / workflow designer / CMS splash** — richer Flutter editors not fully ported.
6. **android_config** — CSV wired + page (R3); Flutter has no dedicated AutoRoute table → stays PARTIAL under `other_config`.
7. Live VPN auth + browser QA still required; App chunk >500kb (code-split deferred).

### Login flow (DONE)

1. `POST` RP keys (`loginUrls.getRp`)
2. Encrypt password with JSEncrypt (`encryptPassword`)
3. `POST` login `{ un, ps }` + BO headers
4. MFA secure-value / OTP when `mfaYn === Y`

## QA rounds

| Round | Focus | Result |
|-------|--------|--------|
| R1 | SoftFetch→CSV where possible; DONE promotions; mapRow DONE set | 9 DONE; 162 tests |
| R2 | mapRow PARTIAL set; design tokens shared chrome; SoftFetch inventory; entitlement helpers | 167 tests; DONE stayed 9 |
| R3 | Form chrome tokens; auth encrypt tests; last CSV wires; README + tarballs | **173 tests**; DONE stayed 9 |

## Artifacts

- WIP: `/workspace/qnb-react-new-wip.tar.gz`
- Final (excludes `node_modules` + `dist`): `/workspace/qnb-react-new.tar.gz`
