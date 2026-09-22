# QNB React SoftFetch / menu full-flow verify

_Generated: 2026-09-20 (Asia/Calcutta)_  
_App: `D:\react_new` @ Vite `http://127.0.0.1:5173`_  
_Login: ram123 (session via Vite proxy)_

## SoftFetch getAll probe (createCrudService fetchAll)

| Run | OK | FAIL | Total |
|---|---|---|---|
| Earlier baseline | 39 | 45 | 84 |
| After HC path/body + Apply_sub_product | 41 | 44 | 85 |
| **Latest (features/subProduct → fetchByCriteria)** | **43** | **42** | **85** |

Report on disk: `D:\react_new\MENU_GETALL_PROBE.md`

### Fixed this pass (React path/base/body)

1. **customer_360_view** — `blockUnblock/detail` + `fetchBody: { unitId:'PRD', channelId:'BO' }` → **OK**
2. **Apply_sub_product** — `data` + `csubproduct/getAll` (was wrongly wfc `bko-subProduct`) → **OK**
3. **dc_city_master** — path `city-master/getAll` (was invented `dc-city/getAll`) — path Flutter-aligned; still **G-00001** (entitlement)
4. **isApiSuccess** (`client.js`) — HTTP 200 with missing `status.code` treated as success (Flutter DTO parity)
5. **feature_management** — live `bko-features/fetchAll` returns empty 200; switched to **`bko-features/fetchByCriteria`** + `{ domainId:'BO' }` → **OK**
6. **feature_management/subProduct** — same for **`bko-subProduct/fetchByCriteria`** + `{ domainId:'BO' }` → **OK**

High-confidence bases already correct on disk: branch/imei/formconfig → data; IP block → wfc; IBAN/theme → bo; pending → wfc.

### Remaining FAIL (~42) — not more SoftFetch URL inventing

| Bucket | Approx | Action |
|---|---|---|
| **Backend / entitlement** (Flutter path already wired; G-00001 on data and/or bo) | ~14–20 | Needs server role/entitlement for ram123 or upstream fix |
| **SoftFetch placeholders** (invented `*/getAll`, not in Flutter API CSV) | ~22 | Keep marked; no fake endpoints |
| **city-master/getAll** | 1 | Path fixed; still G-00001 |

Do **not** flip hosts again for these — dual-host probe already showed G-00001 on both where tried.

### UI menu crawl (earlier)

174 dashboard routes: **93 clean / 81 with SoftFetch fails** — see `MENU_UI_CRAWL.md`. SoftFetch probe above is the authoritative list/fix driver.

### Do not regress

- `/data-api` → `:8443`, strip Cookie / no BO JSESSIONID on data
- `/bo-api` + `/wfc-api` → `:8444`
- `bko-*` masters stay **wfc**
- No mock/seed SoftFetch fallbacks

### Next useful steps (optional)

1. Spot-check green SoftFetch screens in the UI (Customer 360, Apply Sub Product, Feature / Sub Product management).
2. Backend: grant ram123 entitlements for the Flutter-aligned G-00001 list in `MENU_GETALL_FIXES.md`.
3. Placeholders: either wire real Flutter datasources when found, or leave Coming Soon / remove SoftFetch stubs.
