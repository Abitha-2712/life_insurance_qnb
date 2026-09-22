# SoftFetch HOST probe results (data vs bo vs wfc)

_Generated: 20/9/2026, 1:06:00 am IST_  
_User: ram123 (LOGIN SUCCESS, Bearer + JSESSIONID)_  
_Vite from box: NOT reachable (expected — MANTIS localhost)_  
_Direct upstream used: DATA `http://34.18.92.50:8443/backoffice-insurance`, BO/WFC `https://34.18.92.50:8444/...`_

## Auth rules applied

- **data (:8443)**: `Authorization: Bearer` ONLY — **no** BO `JSESSIONID` cookie (avoids G-00001)
- **bo / wfc (:8444)**: cookie + Bearer
- **Control**: `data/atm/getAll` with cookie → **500 G-00001**; bearer-only → **200/000000** (cookie-strip rule still valid)

## Results table

| path | host | method | status | bizCode | recommendation |
|---|---|---|---|---|---|
| `branch-locator/getall` | **data** | POST | 401 | G-00001 | keep **data** (Flutter-aligned); both hosts fail — entitlement / not deployed |
| `branch-locator/getall` | **bo** | POST | 401 | G-00001 | keep **data** (Flutter-aligned); both hosts fail — entitlement / not deployed |
| `iban/blockedIbanList` | **data** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `iban/blockedIbanList` | **bo** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `country/blockedCountryList` | **data** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `country/blockedCountryList` | **bo** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `currency/blockedCurrencyList` | **data** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `currency/blockedCurrencyList` | **bo** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `imei-block/list` | **data** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `imei-block/list` | **bo** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `backoffice-service/ip-block/list` | **data** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `backoffice-service/ip-block/list` | **bo** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `formconfig/getAll` | **data** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `formconfig/getAll` | **bo** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `formfieldmaster/getAll` | **data** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `formfieldmaster/getAll` | **bo** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `lookup-feature/getAll` | **data** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `lookup-feature/getAll` | **bo** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `api/lookup/getAll` | **data** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `api/lookup/getAll` | **bo** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `theme/config/fetch` | **data** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `theme/config/fetch` | **bo** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `theme/font/fetch` | **data** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `theme/font/fetch` | **bo** | POST | 401 | G-00001 | keep **data**; both fail — not a base flip |
| `pending-approval/list` | **data** | POST | 401 | G-00001 | keep **bo** (Flutter); data/bo/wfc all G-00001 |
| `pending-approval/list` | **bo** | POST | 401 | G-00001 | keep **bo** (Flutter); data/bo/wfc all G-00001 |
| `pending-approval/list` | **wfc** | POST | 401 | G-00001 | keep **bo** (Flutter); data/bo/wfc all G-00001 |
| `graphql` | **wfc** | POST | 404 | G-00001 | **stub** — not deployed on insurance WFC |
| `graphql` | **bo** | POST | 401 | G-00001 | **stub** — do not flip to bo |
| `faq/getAll` | **data** | POST | 200 | 000000 | use **data** (smoke OK) |
| `atm/getAll` | **data** | POST | 200 | 000000 | use **data** (smoke OK) |
| `channel/list` | **data** | GET | 200 | 000000 | use **data** (smoke OK) |
| `story-management/get-all` | **data** | POST | 200 | 000000 | use **data** (smoke OK) |
| `bko-channel/fetchAll` | **wfc** | POST | 200 | 000000 | use **wfc** (smoke OK) |
| `cproduct/getAll` | **data** | POST | 200 | 000000 | use **data** (smoke OK) |

## Per-path recommendation summary

| path | recommendation | evidence |
|---|---|---|
| `branch-locator/getall` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `iban/blockedIbanList` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `country/blockedCountryList` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `currency/blockedCurrencyList` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `imei-block/list` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `backoffice-service/ip-block/list` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `formconfig/getAll` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `formfieldmaster/getAll` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `lookup-feature/getAll` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `api/lookup/getAll` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `theme/config/fetch` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `theme/font/fetch` | keep **data** | data:401/G-00001; bo:401/G-00001 |
| `pending-approval/list` | keep **bo** | data/bo/wfc all 401/G-00001 |
| `graphql` | **stub / not deployed** | wfc:404; bo:401 |
| `faq/getAll` | use **data** | 200/000000 |
| `atm/getAll` | use **data** | 200/000000 |
| `channel/list` | use **data** GET | 200/000000 |
| `story-management/get-all` | use **data** | 200/000000 |
| `bko-channel/fetchAll` | use **wfc** | 200/000000 |
| `cproduct/getAll` | use **data** | 200/000000 |

## React services that should flip `base`

**None of the previously failing SoftFetch paths gain a working host by flipping.**  
data and bo both return **401 G-00001** (bearer-only on data; cookie+bearer on bo). Path/method aliases also failed identically.

### Do **not** flip (already correct / no winning host)

| Service | Current / recommended `base` | Why |
|---|---|---|
| `branchLocatorService.js` | **data** | both hosts fail; keep Flutter dataurl |
| `blocklist_iban` / country / currency (if SoftFetch) | **data** | both fail |
| `blocklist_imeiService.js` | **data** | both fail |
| `blocklist_ipService.js` | **data** | both fail |
| `configuration_parametersService.js` (formconfig) | **data** | both fail |
| `screen_configurationService.js` (theme) | **data** | both fail |
| `lookupService.js` / `lookupTypeService.js` | **data** | both fail |
| `pending_approvalsService.js` | **bo** | data/bo/wfc all fail; keep Flutter bo |
| `dashboardUrls.graphql` | **wfc** stub | 404 upstream — leave soft/stub |

### Confirmed correct (smoke — keep / ensure)

| Service | `base` | Probe |
|---|---|---|
| FAQ / atm locator | **data** | 200/000000 |
| `channelService` dropdown `channel/list` | **data** GET | 200/000000 |
| `storiesService` `story-management/get-all` | **data** | 200/000000 |
| Master channel `bko-channel/fetchAll` | **wfc** | 200/000000 |
| Product `cproduct/getAll` | **data** | 200/000000 |

### Root cause of remaining fails

Not React host mis-wiring. With correct auth modes, remaining modules still return **G-00001** on **both** `:8443` and `:8444` — insurance stack likely missing entitlements / controllers for branch-locator, blocklists, formconfig, lookup, theme, pending-approval. **graphql** is **404** on WFC (stub).

## Variant probe (aliases) — all still G-00001

Tried casing/aliases (`getAll`, `get-all`, GET, `ip-block/list`, `pending-approvals/list`, graphql `{__typename}`) — no success on either host.

## Artifacts

- `/workspace/softfetch-remaining/host-probe.js`
- `/workspace/softfetch-remaining/host-probe-results.json`
- `/workspace/softfetch-remaining/session.json` (cookie+token only, mode 600)
- `/workspace/softfetch-remaining/host-probe.out`
