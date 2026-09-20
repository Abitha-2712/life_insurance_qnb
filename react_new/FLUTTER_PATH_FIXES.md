# SoftFetch path fixes from Flutter + Postman (click-fail pass)

_Generated 2026-09-20 IST_  
_Reference: user Postman `master` collection (endpoints only; hosts ignored) + Flutter `lib/network/url`_

## Live-proven OK after path fix (Vite + ram123)

| Was (wrong SoftFetch) | Now (Flutter) | Host | Result |
|---|---|---|---|
| `domain/list` (cheque_book) | `cheque-config/getAll` | data | **000000** |
| `onboarding-mgmt/getAll` | `customerOnboarding/getAll` | data | **000000** |
| `cheque-deposit/getAll` | `cheque-deposit/get-all` | data | **000000** |
| `athkar/getAll` | `athkar/fetchAll` | data | **000000** |
| `eipo-company/getAll` | `eipo-company-config/get-all` | data | **000000** |
| `data-cleansing/getAll` | `data-cleansing/get-all` | bo (+ data) | **000000** |
| `gateway/getAll` | `gateway-sync/getAll` | data | **000000** |
| `finance-offer/getAll` | `finance-offer/get-all` | data | **000000** |
| `finance-calculator/getAll` | `finance-calculator/getall` | data | **000000** |
| `employment-master/getAll` | `dob/employer/getAll` | data | **000000** |
| `afaq/getAll` | `afaq-country-currencies/getAll` | data | **000000** |

## Path aligned to Flutter; still G-00001 (entitlement / undeployed)

| Was | Now | Notes |
|---|---|---|
| `favorite/getAll` | `api/v1/favorite-master/list` | Flutter favorite_url |
| `widget/getAll` | `api/v1/widget-master/list` | Flutter widget_url |
| `mccg/getAll` | `merchantmaster/mccg/getAll` | |
| `merchant/getAll` | `merchantmaster/getAll` | |
| `release/getAll` | `release-management/get-all` | |
| `imei-block/list` | `imei-block/getAll` | Flutter block_list_url |

## Path already matched Flutter (from click list) — entitlement only

disclaimer/summary, forceUpdate/summary, theme/config/fetch, formconfig/getAll, branch-locator/getall, city-master/getAll, txn/menus/entitlement, migration/table-list, ip-block/list, third-party/get-all, report-template/getAll, language/summary, password-config/getAll, push-notification/…, banner/summary, commonservice/public/screenId-dropdown (**200 / SoftFetch 4800**), etc.

## Still broken / needs body or different verb

- `api/v1/beneficiaries/view/cooling-pending` → **HTTP 400** with `{}` and several bodies tried — needs Flutter datasource request shape (not just path).

## Postman master collection note

Collection has 53 endpoints; useful for Domain/Language/Unit/Currency/Channel/`bko-*` and segment/lookup masters. Those React SoftFetch masters already use `bko-*` on WFC and were mostly OK in the earlier probe. Hosts in Postman (`:8443` vs `:18002`) were ignored per user.

## Files touched under `D:\react_new`

16 SoftFetch services + `block_listUrls.js` (IMEI) + `data_cleansing` base `bo`.
