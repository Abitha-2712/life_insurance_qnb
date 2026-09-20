# QNB Life Back Office — Flutter → React Migration Status

_Last updated: 2026-09-19 22:17 Asia/Calcutta (IST)_

## Status meanings

- **DONE** — UI + service + routes close to Flutter for delivery of that module
- **PARTIAL** — Real list/CRUD (city template: UIDataTable + UIRightPanel + services hitting correct endpoints); field-level / multi-step Flutter flows may still lag
- **COMING_SOON** — Flutter itself is `coming_soon`
- **STUB** — Empty placeholder (avoided; prefer PARTIAL CRUD)

## Summary counts

- Flutter feature folders: **69**
- DONE: **9** (was 5)
- COMING_SOON: **1**
- PARTIAL: **59** (was 63)
- STUB: **0**

### Prior wave (DONE promotions + SoftFetch→CSV + QA R1)

**DONE (9):** FAQ, bank, force_update, MFA (+ login, dashboard, bo_app_bar, common, ui_menu_navigation).

**Not promoted:** error_management (SoftFetch), user_management (entitlement UI lag), master (folder PARTIAL).

### QA Round 2 wave (bugs + tokens + SoftFetch inventory)

- **mapRow R2-01:** `...row` spread-first fixed across **68** PARTIAL services (R1 only covered DONE set)
- **user_management:** role/group dropdowns wired; domain/product/subproduct/access **helpers** added — still **PARTIAL** (GraphQL entitlement matrix UI lag)
- **Design tokens:** StatusChip, UIDialog, UIRightPanel, FilterDropdown, HoverActionIcon, SideMenu→`--qnb-sidebar-*`, Partner stepper spacing/radius
- **SoftFetch inventory:** 26 feature-level + 32 other_config children documented in `QA_ROUND_2.md` (no CSV left unwired)
- **error_management / master:** honesty — stay PARTIAL
- **Tests:** 167 passed (was 162). **Build:** green.
- **QA Round 2:** **CLOSED** — see `QA_ROUND_2.md`.

### QA Round 3 wave (final polish / ship-ready)

- **Design tokens:** UIInput, UIDropdown, UISummaryStatusRow, UIToast, UITextArea → `--qnb-input-*` / `--qnb-summary-*` / `--qnb-toast-*`; partner stepper `6px` → `--qnb-space-6`
- **CSV wires:** `other_configService` → `accountClassUrls`; new `android_config` → `androidUrls` + page/route (**PARTIAL**, no Flutter AutoRoute)
- **Auth:** encrypt path unit tests (RP → `{ un, ps }`) + real RSA PEM encrypt success
- **SoftFetch remaining:** 26 feature-level + 32 other_config children (unchanged honesty; see `QA_ROUND_3.md`)
- **DONE stays 9** — no false promotions
- **Tests:** 173 passed (was 167). **Build:** green.
- **QA Round 3:** **CLOSED** — see `QA_ROUND_3.md`
- Artifacts: `/workspace/qnb-react-new-wip.tar.gz`, `/workspace/qnb-react-new.tar.gz`


## Infrastructure

| Area | Status |
|---|---|
| Architecture (`app/core/components/features/themes`) | Preserved |
| CSS tokens / brand colors | From themes/; UIDataTable + GenericCrudPage on `--qnb-*` |
| API URL modules | Generated from `API_ENDPOINTS_LIST.csv` (346) → `src/core/api/urls/*` |
| HTTP client headers | Flutter CommonRequestHeaders parity |
| Shared CRUD | `GenericCrudPage`, `GenericCrudForm`, `createCrudService`, `useCrudList` |
| UI library | Tables, dialogs, inputs, dropdown, switch, textarea, toast, right panel, … |
| Tests | Vitest + RTL — `npm test`, `npm run test:coverage` |
| Build | `npm run build` must succeed |

## Feature matrix

| Feature folder | Status | Notes |
|---|---|---|
| `about_QNB` | PARTIAL | disclaimerUrls; EN/AR title+content |
| `adapter` | PARTIAL | SoftFetch adapter/* (no CSV) |
| `api_call` | PARTIAL | SoftFetch api-call/* (no CSV) |
| `apply_for_product` | PARTIAL | productManagementUrls |
| `apply_product_subproduct` | PARTIAL | subProductsManagementUrls |
| `Apply_sub_product` | PARTIAL | subProductManagementUrls |
| `app_library` | PARTIAL | SoftFetch app-library/* (no CSV) |
| `bank_management` | **DONE** | bankDetails/* + EN/AR/SWIFT/address |
| `banner_configuration` | PARTIAL | Custom form; banner editor still lags |
| `blocklist_imei` | PARTIAL | blockListUrls |
| `blocklist_ip` | PARTIAL | blocklistIpUrls |
| `bo_app_bar` | DONE | BoAppBar under dashboard |
| `CMS` | PARTIAL | i18MaintenanceUrls |
| `coming_soon` | COMING_SOON | ComingSoonPage |
| `common` | DONE | GenericCrud + factories |
| `configuration_parameters` | PARTIAL | configurationParaUrls |
| `customer_360_view` | PARTIAL | customerViewUrls |
| `customer_jounrey` | PARTIAL | SoftFetch customer-journey/* |
| `customer_service` | PARTIAL | crmServiceUrls |
| `customer_support` | PARTIAL | customerSupportUrls + helpers |
| `dashboard` | DONE | Shell, SideMenu, Home |
| `data_base_configuration` | PARTIAL | **CSV** databaseUrls (was SoftFetch) |
| `data_cleansing` | PARTIAL | SoftFetch data-cleansing/* |
| `dc_city_master` | PARTIAL | SoftFetch dc-city/* |
| `default_parameter` | PARTIAL | defaultParameterUrls |
| `digital _instant_onboarding` | PARTIAL | SoftFetch onboarding/* |
| `dynamic_screen` | PARTIAL | SoftFetch dynamic-screen/* |
| `E-statement` | PARTIAL | SoftFetch e-statement/* |
| `error_configuration` | PARTIAL | SoftFetch error-config/* |
| `error_management` | PARTIAL | SoftFetch error/* (not in CSV) |
| `FAQ_management` | **DONE** | faq/* + EN/AR + category/channel |
| `feature_management` | PARTIAL | **CSV** accessManagementUrls + domain/product/subproduct |
| `finance` | PARTIAL | SoftFetch salary-advance/* |
| `finance_calculator` | PARTIAL | SoftFetch finance-calculator/* |
| `finance_offer` | PARTIAL | SoftFetch finance-offer/* |
| `follow_us` | PARTIAL | SoftFetch reach-us/* |
| `force_update_configuration` | **DONE** | forceUpdate/summary|modify |
| `funnel` | PARTIAL | SoftFetch funnel/* |
| `gateway_sync` | PARTIAL | SoftFetch gateway/* |
| `instant_finance` | PARTIAL | SoftFetch instant-finance/* |
| `license_management` | PARTIAL | licenseManagementUrls |
| `limit_setup` | PARTIAL | TransferControl urls |
| `login` | DONE | Login + RP + MFA/OTP |
| `master` | PARTIAL | City DONE-quality; country/currency/unit/language CSV; channel/iban lighter |
| `menu_maintenance` | PARTIAL | menu entitlement |
| `merchant_management` | PARTIAL | SoftFetch merchant/* |
| `mfa_management` | **DONE** | mfa/* + channel/priority EN/AR |
| `oci_user` | PARTIAL | SoftFetch oci-user/* |
| `offer_discount_management` | PARTIAL | offerUrls |
| `other_config` | PARTIAL | Many children; apple_pay + change_password_cfg now CSV |
| `Parameter_maintenance` | PARTIAL | parameterUrls |
| `partner_onboarding` | PARTIAL | partners/* stepper; volume/auth edge cases lag |
| `pending_approvals` | PARTIAL | SoftFetch list + dashboard count helper |
| `profanity_check` | PARTIAL | SoftFetch profanity/* |
| `profile_control` | PARTIAL | SoftFetch profile-control/* |
| `push_notification` | PARTIAL | push + campaign CSV |
| `ready_to_sync_table` | PARTIAL | syncTableUrls |
| `release_management` | PARTIAL | SoftFetch release/* |
| `rule_management` | PARTIAL | bko-rule/* |
| `screen_configuration` | PARTIAL | themeConfigUrls |
| `segment_access_management` | PARTIAL | customerSeg/* |
| `sms_configuration` | PARTIAL | otpControlUrls |
| `sync_table_management` | PARTIAL | syncTableUrls |
| `transfer_config` | PARTIAL | TransferControl |
| `ui_menu_navigation` | DONE | SideMenu |
| `user_management` | PARTIAL | manageUserUrls + role/group dropdowns + entitlement helpers; GraphQL matrix UI incomplete |
| `user_name_rules` | PARTIAL | usernameRule + password CSV |
| `workflow_configuration` | PARTIAL | SoftFetch + steps field |
| `workflow_new` | PARTIAL | Pending approvals + GraphQL helpers |

## Master sub-modules (under `master`)

| Sub | Status | Endpoints |
|---|---|---|
| city | DONE-quality | `master/city/fetchAll|create|update|delete` |
| country | PARTIAL→deeper | `bko-country/*` |
| currency | PARTIAL→deeper | `bko-currency/*` |
| unit | PARTIAL→deeper | `bko-unit/*` |
| language | PARTIAL→deeper | `bko-language/*` |
| channel | PARTIAL | `bko-channel/*` |
| iban (block list) | PARTIAL | `iban/blockedIbanList` + `iban/modifyBlockIban` |

## Remaining gaps (priority)

1. SoftFetch-only modules with **no CSV row** (adapter, api_call, app_library, journey, funnel, merchant, profanity, profile, onboarding, dynamic_screen, e-statement, data_cleansing, finance/*, release, gateway, oci_user, error_*) — need Flutter datasource / Freezed DTO parity
2. Banner rich editor, workflow GraphQL designer, partner volume/auth edge cases
3. User management multi-step product/subproduct/access entitlement GraphQL
4. CMS submodules / splash DynamicScreen
5. Code-split large App.jsx route table (build warns >500kb)
6. SoftFetch DTO deepen / multi-step banner + workflow designer / partner volume-auth edges (post R3)

## Verification

- `npm test` — **173 passed** (121 files)
- `npm run build` — **green** (chunk size warning only)
- WIP tarball: `/workspace/qnb-react-new-wip.tar.gz`
- Final tarball: `/workspace/qnb-react-new.tar.gz`
- QA_ROUND_1: closed (`QA_ROUND_1.md`)
- QA_ROUND_2: closed (`QA_ROUND_2.md`)
- QA_ROUND_3: **closed** (`QA_ROUND_3.md`)
