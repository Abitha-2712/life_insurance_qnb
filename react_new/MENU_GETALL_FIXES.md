# SoftFetch getAll remaining fixes

_Generated: 2026-09-20 08:48 IST_  
_Machine: MANTIS `44e5b519-06cb-4a7b-ba2a-ea4604831770` (executor could not route Shell/Read via machineId — patches prepared under `/workspace/menu-flow/patched`)_  
_Target write: `D:\react_new\MENU_GETALL_FIXES.md`_  
_React snapshot: `/workspace/menu-flow/react` (from `qnb-react-new-wip.tar.gz`)_  
_Flutter evidence: `API_ENDPOINTS_LIST.csv` + sample `dc_city_master_datasource.dart` + user Flutter-sync notes_  
_Live probe: direct upstream `34.18.92.50:8443` (data) / `:8444` (bo|wfc) with fresh ram123 session_

## Executor blocker

Executor Shell/Read **ignore `machineId`**. Parent apply:

1. CopyFromBox each file under `/workspace/menu-flow/patched/` → `%TEMP%\qnb-menu-getall-seed\` (same relative paths; also copy this report into seed root)
2. CopyFromBox `/workspace/menu-flow/APPLY_MENU_GETALL_FIXES.ps1` → `%TEMP%\`
3. Shell(**machineId=`44e5b519-06cb-4a7b-ba2a-ea4604831770`**):
   `powershell -NoProfile -ExecutionPolicy Bypass -File $env:TEMP\APPLY_MENU_GETALL_FIXES.ps1`

## Counts

| Metric | Value |
|---|---|
| SoftFetch getAll probe (user) | **39 OK / 45 FAIL / 84 total** |
| **High-confidence React path/base/body fixes** | **9** |
| **Backend / entitlement (path already Flutter-aligned; G-00001 both hosts)** | **14** |
| **SoftFetch placeholders (not in Flutter API CSV; invented `*/getAll`)** | **22** |
| Patched files prepared under `/workspace/menu-flow/patched` | **42** (41 services + `client.js`) |

### High-confidence fixes (9)

| # | Failure / service | Flutter evidence | React change | Probe |
|---|---|---|---|---|
| 1 | `blockUnblock/detail` (`customer_360_view`) | `customer_view_url.dart` → `blockUnblock/detail` | **`fetchBody: { unitId:'PRD', channelId:'BO' }`**, `base:'bo'`, drop seed | **LIVE: empty → 000001 "unitId and channelId are required"; with body → 000000 SUCCESS** (bo + data) |
| 2 | `dc-city/getAll` (`dc_city_master`) | sample datasource `dataurl` + `city-master/getAll` / `city-master/manage` | **paths → `city-master/getAll|manage`**, **`base:'data'`**, manage action bodies, drop seed | path align; upstream still G-00001 (entitlement) after align |
| 3 | `branch-locator/getall` | `branch_locator_url.dart` + dataurl pattern | **`base:'data'`**, drop seed | path already CSV-correct; G-00001 both hosts |
| 4 | `imei-block/list` | `block_list_url.dart` | **`base:'data'`**, drop seed | path OK; G-00001 both hosts |
| 5 | `formconfig/getAll` | `configuration_para_url.dart` | **`base:'data'`**, drop seed | path OK; G-00001 both hosts |
| 6 | `backoffice-service/ip-block/list` | `blocklist_ip_url.dart`; **user: IP+lookup WFC** | **`base:'wfc'`**, drop seed | G-00001; base per user Flutter sync |
| 7 | `theme/config/fetch` | `theme_config_url.dart`; **user: theme BO** | **`base:'bo'`**, drop seed | overrides softfetch-remaining `data`; G-00001 |
| 8 | `iban/blockedIbanList` | `block_list_url.dart`; **user: IBAN BO** | **`base:'bo'`**, drop seed | overrides softfetch-remaining `data`; G-00001 |
| 9 | `pending-approval/list` | menu route; **user: pending WFC** | **`base:'wfc'`**, drop seed | overrides softfetch-remaining `bo`; G-00001 |

Also: **`isApiSuccess`** in `src/core/api/client.js` — HTTP 200 with missing `status.code` treated as success (Flutter DTO parity). SoftFetch `createCrudService` already accepted `res.ok`.

### Backend / entitlement (14) — do not invent path flips

Flutter CSV path already wired in React URL modules; live probe returns **401 G-00001** on data and/or bo (and wfc where tried). Seeds removed so SoftFetch no longer masks with offline demos.

| Path | Flutter source | React service | Recommended base |
|---|---|---|---|
| `disclaimer/summary` | `disclaimer_url.dart` | `termsDisclaimerService` | bo (default) |
| `forceUpdate/summary` | `force_update_url.dart` | `force_update_configurationService` | bo |
| `api/customer/details` | `customer_support_url.dart` | `customer_supportService` | bo (needs customerId for real use) |
| `password-config/getAll` | `password_configuration_url.dart` | `passwordConfigService` | bo |
| `backoffice-service/parameter/list` | `parameter_url.dart` | `Parameter_maintenanceService` | bo |
| `partners/list?statusType=active` | `partner_onboarding_url.dart` | `partner_onboardingService` | bo |
| `push-notification/customer/subscriptionList` | `push_notification_url.dart` | `push_notificationService` | bo |
| `migration/table-list` | `sync_table_url.dart` | `sync_table_managementService` | bo |
| `txn/menus/entitlement` | `menu_entitlement_url.dart` | `menu_maintenanceService` | bo |
| `pending-request/workflow/list` | dashboard only has **`.../count`** | `workflow_newService` (`base:'wfc'`) | **wfc** — SoftFetch list may be undeployed |
| `theme/font/fetch` | `theme_config_url.dart` | companion of screen_configuration | bo |
| `formfieldmaster/getAll` | configuration_para companion | (if SoftFetch) | data |
| `lookup-feature/getAll` / `api/lookup/getAll` | lookup urls | lookup SoftFetch (prior pass) | data |
| `graphql` | `pending_approval.dart` | dashboard soft | **stub / 404** on insurance WFC |

Control smoke (session valid): `data/atm/getAll` → 000000; `wfc/bko-channel/fetchAll` → 000000.

### SoftFetch placeholders (22) — not in Flutter `API_ENDPOINTS_LIST.csv`

Invented generic `*/getAll` SoftFetch services (no Flutter URL module). **Marked `SOFTFETCH_PLACEHOLDER`**; seeds removed; **no alternate paths invented**.

| SoftFetch path | React service |
|---|---|
| `adapter/getAll` | `adapterService` |
| `api-call/getAll` | `api_callService` |
| `app-library/getAll` | `app_libraryService` |
| `customer-journey/getAll` | `customer_jounreyService` |
| `onboarding/getAll` | `digital__instant_onboardingService` |
| `data-cleansing/getAll` | `data_cleansingService` |
| `dynamic-screen/getAll` | `dynamic_screenService` |
| `error-config/getAll` | `error_configurationService` |
| `salary-advance/getAll` | `financeService` |
| `finance-calculator/getAll` | `finance_calculatorService` |
| `finance-offer/getAll` | `finance_offerService` |
| `e-statement/getAll` | `E-statementService` |
| `followus/getAll` / SoftFetch `reach-us/getAll` | `follow_usService` (neither in Flutter CSV) |
| `gateway/getAll` | `gateway_syncService` |
| `kiosk/getAll` / SoftFetch `kiosk-locator/getall` | `kioskLocatorService` (patterned on branch; not in CSV) |
| `instant-finance/getAll` | `instant_financeService` |
| `funnel/getAll` | `funnelService` |
| `merchant/getAll` | `merchant_managementService` |
| `oci-user/getAll` | `oci_userService` |
| `instant-credit-card/getAll` | _(no SoftFetch service in snapshot; menu may route elsewhere / Coming Soon)_ |
| `profile-control/getAll` | `profile_controlService` |
| `release/getAll` | `release_managementService` |
| `workflow/config/getAll` | `workflow_configurationService` |

## Do not regress

- data-api `:8443` strips Cookie; Bearer-only
- all `bko-*` master services stay **wfc**; apply product / Service Report fixes
- IP+lookup **wfc**; theme+IBAN **bo**; pending **wfc** (this pass enforces those bases)
- Vite `http://127.0.0.1:5173` proxy layout

## Per-failure Flutter map (remaining 45)

| SoftFetch failure | Flutter datasource / URL | baseUrl | method | path | body/headers notes |
|---|---|---|---|---|---|
| adapter/getAll | — | — | — | — | **placeholder** |
| api-call/getAll | — | — | — | — | **placeholder** |
| disclaimer/summary | `disclaimer_url.dart` `fetchAllDisclaimer` | (BO default) | POST | `disclaimer/summary` | `{}`; entitlement |
| imei-block/list | `block_list_url.dart` `blockIMEIList` | **dataurl** | POST | `imei-block/list` | fixed base data |
| branch-locator/getall | `branch_locator_url.dart` `branchgetall` | **dataurl** | POST | `branch-locator/getall` | fixed base data |
| app-library/getAll | — | — | — | — | **placeholder** |
| formconfig/getAll | `configuration_para_url.dart` | **dataurl** | POST | `formconfig/getAll` | fixed base data |
| api/customer/details | `customer_support_url.dart` | BO | POST | `api/customer/details` | needs customerId |
| dc-city/getAll | `dc_city_master` sample | **dataurl** | POST | **`city-master/getAll`** | path fixed (was invented dc-city) |
| customer-journey/getAll | — | — | — | — | **placeholder** |
| onboarding/getAll | — | — | — | — | **placeholder** (dashboard has counts only) |
| data-cleansing/getAll | — | — | — | — | **placeholder** |
| dynamic-screen/getAll | — | — | — | — | **placeholder** |
| blockUnblock/detail | `customer_view_url.dart` | BO | POST | `blockUnblock/detail` | **unitId+channelId required** — fixed |
| error-config/getAll | — | — | — | — | **placeholder** |
| salary-advance/getAll | — | — | — | — | **placeholder** |
| finance-calculator/getAll | — | — | — | — | **placeholder** |
| finance-offer/getAll | — | — | — | — | **placeholder** |
| e-statement/getAll | — | — | — | — | **placeholder** |
| followus/getAll | — | — | — | — | **placeholder** |
| gateway/getAll | — | — | — | — | **placeholder** |
| kiosk/getAll | — | — | — | — | **placeholder** |
| forceUpdate/summary | `force_update_url.dart` | BO | POST | `forceUpdate/summary` | entitlement |
| instant-finance/getAll | — | — | — | — | **placeholder** |
| funnel/getAll | — | — | — | — | **placeholder** |
| iban/blockedIbanList | `block_list_url.dart` | **bo** (user) | POST | `iban/blockedIbanList` | base bo |
| merchant/getAll | — | — | — | — | **placeholder** |
| oci-user/getAll | — | — | — | — | **placeholder** |
| txn/menus/entitlement | `menu_entitlement_url.dart` | BO | POST | `txn/menus/entitlement` | entitlement |
| instant-credit-card/getAll | — | — | — | — | **placeholder / no service** |
| password-config/getAll | `password_configuration_url.dart` | BO | POST | `password-config/getAll` | entitlement |
| backoffice-service/parameter/list | `parameter_url.dart` | BO | POST | `backoffice-service/parameter/list` | entitlement |
| partners/list | `partner_onboarding_url.dart` | BO | POST | `partners/list?statusType=active` | entitlement |
| pending-approval/list | menu route; user WFC | **wfc** | POST | `pending-approval/list` | base wfc |
| profile-control/getAll | — | — | — | — | **placeholder** |
| push-notification/customer/subscriptionList | `push_notification_url.dart` | BO | POST | `push-notification/customer/subscriptionList` | entitlement |
| migration/table-list | `sync_table_url.dart` | BO | POST | `migration/table-list` | entitlement |
| release/getAll | — | — | — | — | **placeholder** |
| theme/config/fetch | `theme_config_url.dart` | **bo** (user) | POST | `theme/config/fetch` | base bo |
| workflow/config/getAll | — | — | — | — | **placeholder** |
| pending-request/workflow/list | dashboard `.../count` only | **wfc** | POST | SoftFetch list (undeployed?) | keep wfc; document |

## Patched file list (`/workspace/menu-flow/patched`)

1. `src/core/api/client.js` — isApiSuccess missing status.code
2. `src/features/customer_360_view/services/customer_360_viewService.js` — **LIVE-PROVEN body fix**
3. `src/features/dc_city_master/services/dc_city_masterService.js` — city-master + data
4. `src/features/branch_locator/services/branchLocatorService.js` — base data
5. `src/features/blocklist_imei/services/blocklist_imeiService.js` — base data
6. `src/features/configuration_parameters/services/configuration_parametersService.js` — base data
7. `src/features/blocklist_ip/services/blocklist_ipService.js` — base wfc
8. `src/features/screen_configuration/services/screen_configurationService.js` — base bo
9. `src/features/master/iban/services/ibanService.js` — base bo
10. `src/features/pending_approvals/services/pending_approvalsService.js` — base wfc
11. `src/features/workflow_new/services/workflow_newService.js` — base wfc + notes
12. `src/features/screen_configuration/services/termsDisclaimerService.js` — drop seed
13. `src/features/force_update_configuration/services/force_update_configurationService.js` — drop seed
14. `src/features/Parameter_maintenance/services/Parameter_maintenanceService.js` — drop seed
15. `src/features/user_name_rules/services/passwordConfigService.js` — drop seed
16. `src/features/push_notification/services/push_notificationService.js` — drop seed
17. `src/features/sync_table_management/services/sync_table_managementService.js` — drop seed
18. `src/features/menu_maintenance/services/menu_maintenanceService.js` — drop seed
19. `src/features/partner_onboarding/services/partner_onboardingService.js` — drop seed
20. `src/features/customer_support/services/customer_supportService.js` — drop seed
21–41. SoftFetch placeholder services (adapter, api_call, app_library, customer_jounrey, digital__instant_onboarding, data_cleansing, dynamic_screen, error_configuration, finance, finance_calculator, finance_offer, E-statement, follow_us, gateway_sync, kiosk_locator, instant_finance, funnel, merchant_management, oci_user, profile_control, release_management, workflow_configuration) — placeholder mark + drop seed

## Expected probe impact after apply

| Class | Before | After (expected) |
|---|---|---|
| `blockUnblock/detail` | FAIL biz 000001 | **OK 000000** (proven) |
| `dc-city/getAll` | FAIL wrong path | calls `city-master/getAll` (may still G-00001) |
| theme / IBAN / pending / IP bases | mixed | match user Flutter sync |
| SoftFetch placeholders | FAIL + seed mask | FAIL honest (no seed) |
| Entitlement G-00001 set | FAIL | FAIL (backend) |

**Fixed count (probe-visible): 1 proven** (`blockUnblock/detail`).  
**Fixed count (high-confidence wiring): 9**.  
**Backend/entitlement: 14**.  
**Placeholders: 22**.
