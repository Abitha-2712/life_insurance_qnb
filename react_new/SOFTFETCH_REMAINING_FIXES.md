# SoftFetch remaining fixes

_Generated: 2026-09-20 01:02 IST (box prepared; live Flutter scan pending MANTIS apply)_  
_Machine: MANTIS `44e5b519-06cb-4a7b-ba2a-ea4604831770`_  
_Target: `D:\react_new\SOFTFETCH_REMAINING_FIXES.md`_

## Executor blocker

Executor Shell/Read **ignore `machineId`** (runs on Linux box). Live writes require parent:
1. CopyFromBox `/workspace/softfetch-remaining/APPLY_SOFTFETCH_REMAINING_FIXES.ps1` → `%TEMP%\APPLY_SOFTFETCH_REMAINING_FIXES.ps1` (prefer Temp; CopyFromBox to `D:\` often refused)
2. Optionally seed `/workspace/softfetch-remaining/patched-react/**` into `%TEMP%\qnb-softfetch-seed\` then copy into `D:\react_new\`
3. Shell(**machineId=`44e5b519-06cb-4a7b-ba2a-ea4604831770`**):  
   `powershell -NoProfile -ExecutionPolicy Bypass -File $env:TEMP\APPLY_SOFTFETCH_REMAINING_FIXES.ps1`

## Counts (box-prepared patches; before live Flutter sync)

| Metric | Value |
|---|---|
| Fixed (high-confidence patches prepared) | **14** |
| Still failing (AUTH probe G-00001 / 404 after path align) | **13** |
| Stubs left | **2** |

## Do not regress

- Vite `http://127.0.0.1:5173`
- `/data-api` → `:8443` strips Cookie
- `client.js` skips X-Managed-Cookie for `base==='data'`
- `cproduct/getAll`, `csubproduct/getAll`; Service Report table

## Key path / method changes

| Item | Before | After | Evidence |
|---|---|---|---|
| `channel/list` | POST | **GET** | AUTH 405 → GET 200/000000 on data+bo |
| `units/all` | POST | **GET** | POST 405 → GET 200/000000 |
| `stories` SoftFetch | `stories/getAll` (bad prior patch) | **`story-management/get-all`** | Probe OK; `stories/getAll` → G-00001 |
| Master channel CRUD | default bo + seed | **`base:'wfc'`** `bko-channel/fetchAll` | Probe OK |
| branch / atm / blocklist_* / formconfig / lookup / theme SoftFetch | missing `base` (default bo) | **`base:'data'`** | Flutter URL modules + dataurl pattern |
| `dashboardUrls.graphql` | missing key | **`graphql`** (WFC) | Flutter pending_approval/dashboard; upstream **404** on insurance |
| menuScreen `block_list_*` | treated as SoftFetch API | **route stubs** (document) | Flutter `menu_screen_url.dart` |

## Fixed files (prepared under `/workspace/softfetch-remaining/patched-react/`)

1. `src/features/banner_configuration/services/banner_configurationService.js` — units/all GET; base data; fetchChannels GET; no seed
2. `src/features/master/channel/services/channelService.js` — base wfc; fetchChannelDropdown GET channel/list; no seed
3. `src/features/other_config/services/storiesService.js` — story-management/get-all; no seed
4. `src/features/branch_locator/services/branchLocatorService.js` — base data
5. `src/features/atm_locator/services/atmLocatorService.js` — base data
6. `src/features/blocklist_ip/services/blocklist_ipService.js` — base data
7. `src/features/blocklist_imei/services/blocklist_imeiService.js` — base data
8. `src/features/configuration_parameters/services/configuration_parametersService.js` — base data formconfig
9. `src/features/screen_configuration/services/screen_configurationService.js` — base data theme
10. `src/features/other_config/services/lookupService.js` — base data
11. `src/features/other_config/services/lookupTypeService.js` — base data
12. `src/features/pending_approvals/services/pending_approvalsService.js` — base bo; no seed; graphql soft
13. `src/core/api/urls/dashboardUrls.js` — graphql + transferViewCount
14. `src/core/api/urls/i18_maintenanceUrls.js` — GET-only note

## Still failing (upstream AUTH probe after cookie-strip parity)

These keep Flutter-aligned paths/bases but returned **401 G-00001** (or **404**) with Bearer on direct upstream — likely entitlement / module not deployed on insurance, not React path typos:

- `data/iban/blockedIbanList`, `country/blockedCountryList`, `currency/blockedCurrencyList`
- `data/imei-block/list`, `data/backoffice-service/ip-block/list`
- `data/branch-locator/getall`
- `data/formconfig/getAll`, `formfieldmaster/getAll`
- `data/lookup-feature/getAll`, `data/api/lookup/getAll`
- `data/theme/config/fetch`, `data/theme/font/fetch`
- `bo/pending-approval/list`
- **`wfc/graphql` → 404** (stub)

Contrast: `data/atm/getAll`, `data/channel/list` GET, `data/units/all` GET, `data/story-management/get-all`, `wfc/bko-channel/fetchAll` succeed.

## Stubs left

1. **graphql** / workflowCounts — Flutter path `graphql` on WFC; insurance stack 404
2. **menuScreenUrls** `block_list_country|currency|beneficiary|iban`, `partner_listing` — navigation route names, not SoftFetch APIs

## Parent apply checklist

```
# A) Seed patched files (Temp → D:)
CopyFromBox each file under /workspace/softfetch-remaining/patched-react/
  → C:\Users\manti\AppData\Local\Temp\qnb-softfetch-seed\<same relative path>
Then machineId Shell:
  robocopy %TEMP%\qnb-softfetch-seed D:\react_new /E

# B) Live Flutter sync + report
CopyFromBox APPLY_SOFTFETCH_REMAINING_FIXES.ps1 → %TEMP%\
powershell -NoProfile -ExecutionPolicy Bypass -File %TEMP%\APPLY_SOFTFETCH_REMAINING_FIXES.ps1
# writes D:\react_new\SOFTFETCH_REMAINING_FIXES.md
```
