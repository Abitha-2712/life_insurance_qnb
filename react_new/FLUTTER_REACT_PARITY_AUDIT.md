# Flutter → React Parity Audit

_Generated: 2026-09-20 00:16 IST_  
_Target write path: `D:\\react_new\\FLUTTER_REACT_PARITY_AUDIT.md`_  
_Machine: MANTIS (`44e5b519-06cb-4a7b-ba2a-ea4604831770`)_

## Provenance / honesty

| Source | Used for | Confidence |
|---|---|---|
| Live `E:\\qnb_life\\qnb-insurance-ui\\lib\\features` | Feature folder enumeration + `baseUrlOverride` / `dataurl` grep | **NOT READ** — executor subagent Shell/Read ignored `machineId` (commands ran on Linux box `hostname=cursor`) |
| Live `D:\\react_new\\src\\features` | Feature folders, SoftFetch services, shell files | **NOT READ** — same machine-routing gap |
| Box snapshot `/workspace/qnb-react-new-wip.tar.gz` (2026-09-19) | React feature list, SoftFetch/`createCrudService` bases, vite proxy | Medium (may lag live `D:\\react_new`) |
| `MIGRATION_STATUS.md` / `QA_ROUND_3.md` | Flutter feature matrix (69), SoftFetch inventory | Medium |
| Flutter sample refs `flutter-refs/sample-city/*` | `baseUrlOverride: dataurl` pattern | High for city/dc_city pattern only |
| `/workspace/mantis-sidemenu-search` (copied from MANTIS) | SideMenu search panel | High for menu search |
| User note | IdleSessionGuard, LogoutConfirmDialog, data-api:8443, X-Managed-Cookie already present on live React | Accepted as asserted; not re-verified on disk |

**Blocker:** This executor cannot `CopyFromBox` / machine-Shell. Parent must place this file on `D:\\react_new\\` or re-run audit with machine-routed tools against live disks.

---

## Summary

| Metric | Value | Notes |
|---|---|---|
| Flutter feature folders (matrix) | **69** | From `MIGRATION_STATUS.md` (claimed = live `lib/features`; **not re-listed from E:**) |
| React feature folders (snapshot) | **69** | Top-level under `src/features` in wip tarball |
| DONE / PARTIAL / COMING_SOON | 9 / 59 / 1 | Per migration status; not a folder-count gap |
| SoftFetch feature-level (no CSV) | **26** | Hit `createCrudService` default `base:'bo'` unless overridden |
| SoftFetch `other_config` children | **~32** | Explicitly **"inferred BO paths"** |
| Known Flutter→`data` pattern | city (+ samples) use `baseUrlOverride: dataurl` | React `cityService` correctly `base:'data'`; many SoftFetch peers do **not** |
| Shell (idle / logout / menu search / cookie) | **Mostly present per user note + MANTIS SideMenu copy** | Snapshot tarball **lacks** IdleSessionGuard/LogoutConfirmDialog/X-Managed-Cookie strings — live disk claimed ahead of snapshot |

**Bottom line:** Folder-level coverage looks numerically matched (~69↔69), but **API base fidelity** (bo vs data vs wfc) and **SoftFetch honesty** are the real parity debt. Shell chrome is largely addressed on live React per user note; snapshot still shows `/data-api` and `/bo-api` both targeting **8444**.

---

## Shell status

| Item | Expected (Flutter parity) | Evidence | Status |
|---|---|---|---|
| Idle session timeout guard | Idle logout / session expiry | User note: `IdleSessionGuard` already on live React; **absent from Sep-19 wip tarball grep** | **Likely DONE on live** (verify on `D:`) |
| Logout confirm dialog | Confirm before logout | User note: `LogoutConfirmDialog`; not in snapshot | **Likely DONE on live** |
| Menu search / SideMenu search panel | Flutter `UiSliderMenu` search + recents | `menuSearch.js` + `SideMenu.jsx` search panel present in MANTIS copy and migrate-pack | **DONE** |
| Cookie / proxy — data API port | Flutter `dataurl` **8443** | User note: `data-api:8443` already; snapshot vite still documents `/data-api` → **8444** same as BO for cookie sharing | **Live claimed fixed; snapshot still 8444 — verify vite on D:** |
| `X-Managed-Cookie` | Proxy/header bridge for HttpOnly cookies | User note already; **no matches** in snapshot `src/` | **Likely DONE on live** |

### Snapshot vite note (may be stale vs live)

- `FLUTTER_BO_ORIGIN = https://34.18.92.50:8444`
- Proxies: `/data-api`, `/bo-api`, `/wfc-api` all target that origin (data rewritten to same service path as BO in snapshot).
- Comment acknowledges Flutter dataurl is 8443 but deliberately collapsed to 8444 for browser cookie parity.

---

## Feature gaps

### Counts

- Flutter (matrix): **69** folders  
- React (snapshot top-level): **69** folders  

### In Flutter matrix, not React top-level folder

| Flutter name | React disposition |
|---|---|
| `bo_app_bar` | Nested under `dashboard` (DONE) — not a missing feature |
| `coming_soon` | COMING_SOON page; may live outside `src/features` or as shared page — **confirm on live** |
| `login` | Under `auth` |
| `ui_menu_navigation` | Under `dashboard` / menu modules |
| `digital _instant_onboarding` (space in matrix) | React folder `digital__instant_onboarding` — **naming drift** |

### In React top-level, not Flutter matrix name

| React name | Likely Flutter home |
|---|---|
| `auth` | Flutter `login` (+ auth stack) |
| `atm_locator` / `branch_locator` / `kiosk_locator` | May sit under Flutter features with different folder names or shared locator modules — **needs live E: listing** |
| `digital__instant_onboarding` | Flutter `digital _instant_onboarding` (naming) |

### Depth / quality gaps (not folder absence)

- **59 PARTIAL** modules: GenericCrud + SoftFetch often stand in for full Flutter forms/workflows.
- **`user_management`**: entitlement / GraphQL matrix UI lag (documented).
- **`master`**: folder PARTIAL; city is the gold `base:'data'` template; other master children need same discipline.
- **`other_config`**: ~32 SoftFetch children with **inferred** paths.
- **`pending_approvals`**: SoftFetch list; CSV only GraphQL.
- **`error_management`**: SoftFetch inferred `error/*`; no CSV.

---

## Top API mismatches

### Flutter pattern (sample — high confidence)

```dart
// city_datasource.dart / dc_city_master_datasource.dart
final dio = networkClient.customDio(baseUrlOverride: dataurl);
```

`dataurl` ⇒ React should use `createCrudService` / `apiRequest` with **`base: 'data'`** (proxy `/data-api`).

### React `createCrudService` default

```js
base = 'bo'  // default in createCrudService.js
```

### Mismatches / risks

| Area | Flutter intent | React snapshot | Risk |
|---|---|---|---|
| `master/city` | `dataurl` | `base: 'data'` | Aligned (template) |
| `dc_city_master` | `dataurl` (sample datasource) | SoftFetch **no** `base:'data'` → default **bo** | **High** — wrong host/path family |
| SoftFetch 26 feature-level | Unknown until live `lib/network` grep | Mostly default **bo** + literal SoftFetch paths | Medium–High |
| `other_config` ×32 | Need Flutter datasources | Comments say **"inferred BO paths"** | High — speculative endpoints |
| `workflow_new` / menu | wfc | Some `base:'wfc'` (menuService, workflow_new) | Partially aligned |
| `dashboard` metrics | data | `base:'data'` in dashboardService | Aligned |
| Auth / many CRUD CSV | bo | `base:'bo'` | Generally aligned |
| Proxy ports | data **8443**, bo **8444** | Snapshot both → 8444; user says live data-api:**8443** | Verify live vite + `X-Managed-Cookie` |

### SoftFetch services still saying "inferred" (sample)

All under `other_config/services/*` with header: *"SoftFetch CRUD (inferred BO paths; deepen when Flutter datasource available)."*  
Examples: `cheque_bookService`, `afaqService`, `cardService`, `western_union_emailService`, … (full set ~32).

Feature-level SoftFetch without CSV (26):  
`E-statement`, `adapter`, `api_call`, `app_library`, `customer_jounrey`, `data_cleansing`, `dc_city_master`, `digital__instant_onboarding`, `dynamic_screen`, `error_configuration`, `error_management`, `finance`, `finance_calculator`, `finance_offer`, `follow_us`, `funnel`, `gateway_sync`, `instant_finance`, `kiosk_locator`, `merchant_management`, `oci_user`, `pending_approvals`, `profanity_check`, `profile_control`, `release_management`, `workflow_configuration`.

---

## Ordered next fixes

1. **Re-run this audit on live disks** with machine-routed Shell (`machineId=44e5b519-…`): `dir` both feature trees + `rg baseUrlOverride|dataurl` under Flutter `lib` + confirm shell file paths on `D:\\react_new`.
2. **Fix `dc_city_master` (and any Flutter-`dataurl` peer) to `base:'data'`** — mirror `cityService`.
3. **Grep Flutter `lib/network` + every `*datasource.dart` for `baseUrlOverride`** → spreadsheet of path → `bo|data|wfc`; apply to React services.
4. **Deepen SoftFetch 26** against real Flutter URLs (replace inferred literals; prefer CSV/`urls/*` when present).
5. **Deepen `other_config` children (32)** — stop shipping inferred paths; wire or mark Coming Soon per Flutter.
6. **Verify live vite**: `/data-api` → **8443**, `/bo-api` → **8444**, `/wfc-api` correct; confirm `X-Managed-Cookie` end-to-end.
7. **Confirm shell files on disk**: `IdleSessionGuard`, `LogoutConfirmDialog`, SideMenu search panel wired in app shell (not just helpers).
8. **Normalize naming**: `digital__instant_onboarding` vs Flutter `digital _instant_onboarding`; document `auth`↔`login`, locators.
9. **`user_management` entitlement matrix** UI (known PARTIAL).
10. **`pending_approvals`**: replace SoftFetch list with real GraphQL/CSV flow if Flutter uses GraphQL.
11. **Promote only after live API smoke** (VPN) — keep DONE count honest.
12. **Master siblings** (country/currency/language/…) — audit each for `data` vs `bo` like city.
13. **Remove seed/memory fallbacks** from production SoftFetch once endpoints verified (offline seed masks 404s).
14. **Workflow / WFC** consistency pass (`workflow_configuration` still SoftFetch).
15. **Write/refresh this file on `D:\\react_new`** after live pass so the audit tracks the real trees.

---

## Appendix A — React feature folders (snapshot, n=69)

- `Apply_sub_product`
- `CMS`
- `E-statement`
- `FAQ_management`
- `Parameter_maintenance`
- `about_QNB`
- `adapter`
- `api_call`
- `app_library`
- `apply_for_product`
- `apply_product_subproduct`
- `atm_locator`
- `auth`
- `bank_management`
- `banner_configuration`
- `blocklist_imei`
- `blocklist_ip`
- `branch_locator`
- `common`
- `configuration_parameters`
- `customer_360_view`
- `customer_jounrey`
- `customer_service`
- `customer_support`
- `dashboard`
- `data_base_configuration`
- `data_cleansing`
- `dc_city_master`
- `default_parameter`
- `digital__instant_onboarding`
- `dynamic_screen`
- `error_configuration`
- `error_management`
- `feature_management`
- `finance`
- `finance_calculator`
- `finance_offer`
- `follow_us`
- `force_update_configuration`
- `funnel`
- `gateway_sync`
- `instant_finance`
- `kiosk_locator`
- `license_management`
- `limit_setup`
- `master`
- `menu_maintenance`
- `merchant_management`
- `mfa_management`
- `oci_user`
- `offer_discount_management`
- `other_config`
- `partner_onboarding`
- `pending_approvals`
- `profanity_check`
- `profile_control`
- `push_notification`
- `ready_to_sync_table`
- `release_management`
- `rule_management`
- `screen_configuration`
- `segment_access_management`
- `sms_configuration`
- `sync_table_management`
- `transfer_config`
- `user_management`
- `user_name_rules`
- `workflow_configuration`
- `workflow_new`

## Appendix B — Flutter feature folders (from MIGRATION_STATUS matrix, n=69)

- `about_QNB`
- `adapter`
- `api_call`
- `apply_for_product`
- `apply_product_subproduct`
- `Apply_sub_product`
- `app_library`
- `bank_management`
- `banner_configuration`
- `blocklist_imei`
- `blocklist_ip`
- `bo_app_bar`
- `CMS`
- `coming_soon`
- `common`
- `configuration_parameters`
- `customer_360_view`
- `customer_jounrey`
- `customer_service`
- `customer_support`
- `dashboard`
- `data_base_configuration`
- `data_cleansing`
- `dc_city_master`
- `default_parameter`
- `digital _instant_onboarding`
- `dynamic_screen`
- `E-statement`
- `error_configuration`
- `error_management`
- `FAQ_management`
- `feature_management`
- `finance`
- `finance_calculator`
- `finance_offer`
- `follow_us`
- `force_update_configuration`
- `funnel`
- `gateway_sync`
- `instant_finance`
- `license_management`
- `limit_setup`
- `login`
- `master`
- `menu_maintenance`
- `merchant_management`
- `mfa_management`
- `oci_user`
- `offer_discount_management`
- `other_config`
- `Parameter_maintenance`
- `partner_onboarding`
- `pending_approvals`
- `profanity_check`
- `profile_control`
- `push_notification`
- `ready_to_sync_table`
- `release_management`
- `rule_management`
- `screen_configuration`
- `segment_access_management`
- `sms_configuration`
- `sync_table_management`
- `transfer_config`
- `ui_menu_navigation`
- `user_management`
- `user_name_rules`
- `workflow_configuration`
- `workflow_new`

## Appendix C — SoftFetch feature-level (26)

- `E-statement`
- `adapter`
- `api_call`
- `app_library`
- `customer_jounrey`
- `data_cleansing`
- `dc_city_master`
- `digital__instant_onboarding`
- `dynamic_screen`
- `error_configuration`
- `error_management`
- `finance`
- `finance_calculator`
- `finance_offer`
- `follow_us`
- `funnel`
- `gateway_sync`
- `instant_finance`
- `kiosk_locator`
- `merchant_management`
- `oci_user`
- `pending_approvals`
- `profanity_check`
- `profile_control`
- `release_management`
- `workflow_configuration`
