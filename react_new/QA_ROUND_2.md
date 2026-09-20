# QA Round 2 — QNB React Back Office

_Started / closed: 2026-09-19 ~22:10 Asia/Calcutta (IST)_  
_Scope: tighten bugs + Flutter parity after Round 1; SoftFetch inventory; design token pass on shared chrome; user_management entitlement helpers. Round 3 deferred._

## Preconditions (from Round 1)

- SoftFetch→CSV already done where CSV modules exist (feature, DB, apple_pay, change_password_cfg, FAQ, bank, force update, MFA, …)
- DONE 9 / PARTIAL ~59 / COMING_SOON 1; tests 162; build green

## Checklist

### A. UI (layout / components)

| # | Check | Screens | Status | Notes |
|---|---|---|---|---|
| A1 | Page header + Add align with city template | FAQ, bank, force, MFA, city, user | PASS | GenericCrudPage / CityTablePage / UserManagementPage |
| A2 | UIDataTable columns + sticky header | Same | PASS | Shared table |
| A3 | UIRightPanel add/edit/view | GenericCrud + user | PASS | Tokenized panel CSS this round |
| A4 | Login hero / form | Login | PASS | Prior DONE; `--qnb-login-*` |
| A5 | Dashboard shell + SideMenu | Dashboard | PASS | SideMenu `--sm-*` now aliases `--qnb-sidebar-*` |
| A6 | Partner stepper layout | partner_onboarding | PASS | Spacing/radius/fs on `--qnb-*` |
| A7 | Empty / loading / error | GenericCrud | OPEN | Needs live API |
| A8 | RTL / Arabic labels | FAQ/bank/MFA AR | OPEN | Manual |

### B. Design (`--qnb-*` / typography / spacing / radius)

| # | Check | Target | Status | Notes |
|---|---|---|---|---|
| B1 | StatusChip tones on tokens | StatusChip.css | **FIXED R2** | `--qnb-chip-*` |
| B2 | UIDialog / UIRightPanel on tokens | Dialog, Panel | **FIXED R2** | white/border/slate/scrim tokens |
| B3 | FilterDropdown / HoverActionIcon | UIDataTable | **FIXED R2** | `--qnb-fs-*` + filter hover tokens |
| B4 | SideMenu local vars → sidebar tokens | SideMenu | **FIXED R2** | `--sm-bg` → `var(--qnb-sidebar-bg)` etc. |
| B5 | Partner stepper spacing/radius | PartnerStepperPage.css | **FIXED R2** | `--qnb-space-*` / `--qnb-radius-*` / `--qnb-fs-*` |
| B6 | GenericCrud page spacing | GenericCrudPage.css | PASS | R1 |
| B7 | Login / Home chart hexes | Home charts | DEFER | Flutter-ported chart palette; not primary chrome |
| B8 | typography.css sizes on forms/tables | UIText / chips / filters | PASS (improved) | |

### C. Functionality

| # | Check | Module | Status | Notes |
|---|---|---|---|---|
| C1 | List / create / update / delete paths | DONE modules + PARTIAL SoftFetch | PASS (unit) | Offline seed fallback |
| C2 | Active status switch / filter | GenericCrudForm UISwitch + summary | PASS | |
| C3 | Role/group dropdowns on user form | user_management | **FIXED R2** | Was free-text; now `fetchRoleDropdown` / `fetchGroupDropdown` |
| C4 | Search users helper | user_management | PASS | `searchUsers` |
| C5 | Pending approve/reject helpers | pending_approvals | PASS (code) | SoftFetch action path |

### D. Logic (mapRow / payload vs Flutter)

| # | Check | Status | Notes |
|---|---|---|---|
| D1 | mapRow `...row` must not overwrite coercions | **FIXED R2** | Bulk-fixed **68** services (R1 only covered DONE set) |
| D2 | FAQ/bank/MFA/force/user mapRow | PASS | Remain spread-first |
| D3 | Master country/currency/unit/language mapRow + CSV comments | **FIXED R2** | Comments no longer mislabel SoftFetch |
| D4 | groupService mapRow | **FIXED R2** | Added |
| D5 | user create/update includes `userGroup` | **FIXED R2** | |

### E. Integration / SoftFetch

| # | Check | Status | Notes |
|---|---|---|---|
| E1 | Replace SoftFetch if CSV exists | PASS | No remaining SoftFetch with a CSV URL module (re-verified) |
| E2 | Wrong bases (data vs bo) | PASS | City stays `base: 'data'`; country/etc default `bo` |
| E3 | error_management URLs | NOT PROMOTED | No CSV / Flutter url.dart; SoftFetch `error/*` documented |
| E4 | pending_approvals | Documented | CSV only `graphql`; list SoftFetch `pending-approval/list` |
| E5 | Vite proxy / live auth | OPEN | Needs VPN/host |

## SoftFetch inventory (remaining — no CSV row)

### Feature-level (26)

| Service | fetchAll path | Note |
|---|---|---|
| `E-statement/services/E-statementService.js` | `e-statement/getAll` | no CSV row |
| `adapter/services/adapterService.js` | `adapter/getAll` | no CSV row |
| `api_call/services/api_callService.js` | `api-call/getAll` | no CSV row |
| `app_library/services/app_libraryService.js` | `app-library/getAll` | no CSV row |
| `customer_jounrey/services/customer_jounreyService.js` | `customer-journey/getAll` | no CSV row |
| `data_cleansing/services/data_cleansingService.js` | `data-cleansing/getAll` | no CSV row |
| `dc_city_master/services/dc_city_masterService.js` | `dc-city/getAll` | no CSV row |
| `digital__instant_onboarding/services/digital__instant_onboardingService.js` | `onboarding/getAll` | no CSV row |
| `dynamic_screen/services/dynamic_screenService.js` | `dynamic-screen/getAll` | no CSV row |
| `error_configuration/services/error_configurationService.js` | `error-config/getAll` | no CSV row |
| `error_management/services/error_managementService.js` | `error/getAll` | no CSV row |
| `finance/services/financeService.js` | `salary-advance/getAll` | no CSV row |
| `finance_calculator/services/finance_calculatorService.js` | `finance-calculator/getAll` | no CSV row |
| `finance_offer/services/finance_offerService.js` | `finance-offer/getAll` | no CSV row |
| `follow_us/services/follow_usService.js` | `reach-us/getAll` | no CSV row |
| `funnel/services/funnelService.js` | `funnel/getAll` | no CSV row |
| `gateway_sync/services/gateway_syncService.js` | `gateway/getAll` | no CSV row |
| `instant_finance/services/instant_financeService.js` | `instant-finance/getAll` | no CSV row |
| `kiosk_locator/services/kioskLocatorService.js` | `kiosk-locator/getall` | no CSV row |
| `merchant_management/services/merchant_managementService.js` | `merchant/getAll` | no CSV row |
| `oci_user/services/oci_userService.js` | `oci-user/getAll` | no CSV row |
| `pending_approvals/services/pending_approvalsService.js` | `pending-approval/list` | SoftFetch list; CSV only graphql |
| `profanity_check/services/profanity_checkService.js` | `profanity/getAll` | no CSV row |
| `profile_control/services/profile_controlService.js` | `profile-control/getAll` | no CSV row |
| `release_management/services/release_managementService.js` | `release/getAll` | no CSV row |
| `workflow_configuration/services/workflow_configurationService.js` | `workflow/config/getAll` | no CSV row |

### other_config children (32) — inferred BO paths

| Service | fetchAll |
|---|---|
| `afaqService.js` | `afaq/getAll` |
| `athkarService.js` | `athkar/getAll` |
| `beneficiaryService.js` | `beneficiary/getAll` |
| `cardService.js` | `card/getAll` |
| `card_issuanceService.js` | `card-issuance/getAll` |
| `card_spendService.js` | `card-spend/getAll` |
| `charityService.js` | `charity/getAll` |
| `cheque_bookService.js` | `cheque-book/getAll` |
| `cheque_depositService.js` | `cheque-deposit/getAll` |
| `connectivity_hubService.js` | `connectivity-hub/getAll` |
| `direct_remittanceService.js` | `direct-remittance/getAll` |
| `direct_remittance_typeService.js` | `direct-remittance-type/getAll` |
| `eipoService.js` | `eipo-company/getAll` |
| `employment_mastersService.js` | `employment-master/getAll` |
| `favoriteService.js` | `favorite/getAll` |
| `google_payService.js` | `google-pay/getAll` |
| `master_categoryService.js` | `master-category/getAll` |
| `mccgService.js` | `mccg/getAll` |
| `mq_configurationService.js` | `mq-config/getAll` |
| `notification_templateService.js` | `notification-template/getAll` |
| `onboarding_mgmtService.js` | `onboarding-mgmt/getAll` |
| `other_configService.js` | `account-class/getall` |
| `product_contentService.js` | `product-content/getAll` |
| `report_templateService.js` | `report-template/getAll` |
| `riskService.js` | `risk/getAll` |
| `rtp_account_typeService.js` | `rtp-account-type/getAll` |
| `rtp_purposeService.js` | `rtp-purpose/getAll` |
| `sectorService.js` | `sector/getAll` |
| `storiesService.js` | `stories/getAll` |
| `western_union_emailService.js` | `wu-email/getAll` |
| `western_union_historyService.js` | `wu-history/getAll` |
| `widget_cfgService.js` | `widget/getAll` |

**No CSV replacement available** for the above — leave SoftFetch until Flutter datasource / Freezed DTOs are extracted.

## Promotion honesty (PARTIAL stays PARTIAL)

| Module | Decision | Reason |
|---|---|---|
| `user_management` | Stay **PARTIAL** | Role/group dropdowns + domain/product/subproduct/access **helpers** added; full GraphQL entitlement matrix UI still missing |
| `error_management` | Stay **PARTIAL** | SoftFetch `error/*` not in CSV; URLs not Flutter-justified for DONE |
| `master` | Stay **PARTIAL** | City DONE-quality; country/currency/unit/language CSV-deepened; channel/iban lighter — folder not DONE |
| SoftFetch-only features | Stay **PARTIAL** | No CSV to earn DONE |

**DONE count remains 9** (login, dashboard, bo_app_bar, common, ui_menu_navigation, FAQ_management, bank_management, force_update_configuration, mfa_management).

## Bugs found & fixed this round

| ID | Severity | Description | Fix |
|---|---|---|---|
| R2-01 | Medium | `mapRow` `...row` after coercions in ~68 PARTIAL services (R1 only fixed DONE) | Moved `...row` first across createCrudService mapRows |
| R2-02 | Medium | User form role/group were free-text (C5 open from R1) | Wired `fetchRoleDropdown` / `fetchGroupDropdown` into UserForm |
| R2-03 | Low | Shared chrome (StatusChip, Dialog, Panel, Filter, HoverAction) raw `#hex` | Tokenized to `--qnb-chip-*` / slate / scrim / fs / space / radius |
| R2-04 | Low | SideMenu `--sm-*` duplicated hex instead of `--qnb-sidebar-*` | Alias to sidebar tokens |
| R2-05 | Low | Partner stepper raw px / `#fff` / fallback maroon | `--qnb-space-*`, `--qnb-primary`, `--qnb-radius-pill` |
| R2-06 | Low | Master country/currency/unit/language comments said SoftFetch despite CSV URLs | Corrected comments |
| R2-07 | Low | groupService lacked mapRow | Added spread-first mapRow |
| R2-08 | Info | Entitlement GraphQL gaps for user_management | Added `fetchDomain/Product/SubProduct/AccessDropdown` helpers (UI matrix deferred) |

## Tests / build

- `npm test` — **167 passed** (was 162; +5: entitlement helpers, country mapRow, error mapRow)
- `npm run build` — **green** (chunk >500kb warning only)
- WIP tarball refreshed: `/workspace/qnb-react-new-wip.tar.gz`

## Open for live / browser QA

1. User role/group dropdowns against live BO DD endpoints
2. SoftFetch modules smoke (error, pending, other_config children)
3. SideMenu / dialog / chip contrast on staging
4. Partner stepper volume + auth token edge steps (still lag Flutter)

## Exit criteria for Round 2

- [x] Automated tests green and grown (167)
- [x] Build green
- [x] SoftFetch inventory documented; no CSV left unwired
- [x] mapRow spread bug closed for PARTIAL set
- [x] Design tokens on shared CRUD chrome + SideMenu + partner stepper
- [x] user_management entitlement helpers landed; **not** falsely promoted to DONE
- [ ] Live/browser spot-check (needs environment)
- [ ] Round 3 **not started** this pass
