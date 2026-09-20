# QA Round 1 — QNB React Back Office

_Started: 2026-09-19 22:05 Asia/Calcutta (IST)_  
_Scope: polish / parity hardening after SoftFetch→CSV alignment for CSV-backed modules._  
_Rounds 2–3 deferred._

## Preconditions (met)

- [x] SoftFetch debt **largely cleared where CSV endpoints exist** (feature_management, data_base_configuration, apple_pay, change_password_cfg + prior waves)
- [x] Remaining SoftFetch modules are **no-CSV** inferred paths (documented below)
- [x] Multi-step Flutter gaps documented (below)
- [x] Build green; tests 162 passed

## Multi-step / designer gaps (known — not R1 blockers for CRUD screens)

| Area | Gap | Impact |
|---|---|---|
| `banner_configuration` | Rich banner editor / media picker | Visual content authoring |
| `workflow_configuration` / `workflow_new` | GraphQL workflow designer canvas | Complex approval design |
| `partner_onboarding` | Volume + auth token edge steps | Partner stepper completeness |
| `user_management` | Product/subproduct/access entitlement GraphQL wiring | Full role/group entitlement UI |
| SoftFetch-only modules (no CSV) | Exact Freezed DTO field names unknown | Field-level API parity |
| `error_management` | No CSV URL module | SoftFetch `error/*` until Flutter url.dart found |

## Checklist

### A. UI (layout / components)

| # | Check | Screens | Status | Notes |
|---|---|---|---|---|
| A1 | Page header + Add button align with city template | FAQ, bank, force update, MFA, city | PASS (code) | GenericCrudPage / CityTablePage |
| A2 | UIDataTable columns render; sticky header | Same + user | PASS (code) | Tokenized headers |
| A3 | UIRightPanel open/close for add/edit/view | GenericCrud screens | PASS (code) | Shared panel |
| A4 | Login hero / form layout | Login | PASS (code) | Prior DONE |
| A5 | Dashboard shell + SideMenu | Dashboard | PASS (code) | Prior DONE |
| A6 | Empty / loading / error states | GenericCrud | OPEN | Manual against live API |
| A7 | RTL / Arabic labels display | FAQ/bank/MFA AR fields | OPEN | Manual |

### B. Color / size / text (`--qnb-*`)

| # | Check | Target | Status | Notes |
|---|---|---|---|---|
| B1 | UIText uses `--qnb-fs-*` / `--qnb-on-surface` | UIText | PASS | Component CSS |
| B2 | UIButton primary/outline/danger on tokens | UIButton | PASS | Component CSS |
| B3 | Table header/cell/pager on `--qnb-*` | UIDataTable | PASS | Wave token pass |
| B4 | GenericCrud page spacing/error on tokens | GenericCrudPage.css | PASS | Wave token pass |
| B5 | Login uses `--qnb-*` (no invented palette) | LoginPage | PASS | Prior |
| B6 | Home metric cards use dashboard tokens | HomePage | PASS (partial) | Light pass; chart hexes remain Flutter-ported |
| B7 | No raw `#hex` on primary chrome of top 10 screens | Login, Home, City, FAQ, Bank, Force, MFA, User, SideMenu, GenericCrud | OPEN | Spot-check in browser |

### C. Function (CRUD / actions)

| # | Check | Module | Status | Notes |
|---|---|---|---|---|
| C1 | List load (online or seed offline) | FAQ, bank, force, MFA, city | PASS (unit) | Service tests + offline seed |
| C2 | Create / update payload shape | Same | PASS (unit) | mapRow / build*Body |
| C3 | Delete / soft-delete | Force update soft status N | PASS (unit) | buildDeleteBody |
| C4 | Status chip + filter | GenericCrud | PASS (code) | Shared |
| C5 | User role/group dropdown helpers | user_management | OPEN | Needs live BO |
| C6 | Pending approval approve/reject helpers | pending_approvals | OPEN | SoftFetch list path |

### D. Logic

| # | Check | Status | Notes |
|---|---|---|---|
| D1 | Required field validation before save | PASS (code) | GenericCrudForm / UserForm |
| D2 | lockOnEdit for code keys | PASS (code) | FAQ/bank/MFA |
| D3 | mapRow coerces ids/priority/ports to strings | PASS (unit) | Spread-order fixed this wave |
| D4 | Offline seed fallback when API down | PASS (code) | createCrudService |
| D5 | Force-update delete → modify with status N | PASS (unit) | |

### E. Integration

| # | Check | Status | Notes |
|---|---|---|---|
| E1 | Vite proxy `/bo-api` `/data-api` `/wfc-api` | OPEN | Needs VPN/host |
| E2 | Auth headers (channel, App-Id, serviceId, Bearer, cookies) | PASS (code) | client.js parity |
| E3 | City uses `base: 'data'` | PASS (unit) | cityServiceMeta |
| E4 | CSV URL paths match `API_ENDPOINTS_LIST.csv` for DONE modules | PASS (unit) | Service URL assertions |
| E5 | Login RP encrypt + MFA/OTP flow | OPEN | Manual live |

## Bugs found & fixed this round

| ID | Severity | Description | Fix |
|---|---|---|---|
| R1-01 | Medium | `mapRow` `...row` spread overwrote `String()` coercions (priority/port) | Spread moved first in mapRow (MFA, DB, FAQ, bank, force, feature, user) |
| R1-02 | Low | SoftFetch paths for feature/DB/apple/password ignored CSV modules | Wired to URL modules |
| R1-03 | Low | UIDataTable / GenericCrud used raw hex / non-qnb spacing | Tokenized to `--qnb-*` |

## Open for live / browser QA (parent / human)

1. Walk FAQ → Bank → Force Update → MFA → City → User against live BO
2. Confirm table header contrast and Add button brand color on staging
3. Login + MFA OTP end-to-end
4. Pending approvals action against real workflow API

## Exit criteria for Round 1

- [x] Automated tests green (162)
- [x] Build green
- [x] Checklist drafted; code-level items closed
- [ ] Live/browser spot-check of top screens (needs environment)
- [ ] No Sev-1/2 open from live pass

When live pass completes, mark Round 1 **closed** and start Round 2 (deeper SoftFetch DTO parity + multi-step flows).
