# QA Round 3 — QNB React Back Office (final polish)

_Started / closed: 2026-09-19 ~22:15 Asia/Calcutta (IST)_  
_Scope: ship-ready polish after R1+R2 — design token pass on form chrome, SoftFetch honesty + last CSV wires, auth encrypt regression, README, dual tarballs. **No false DONE promotions.**_

## Preconditions (from Round 2)

- DONE **9** / PARTIAL **59** / COMING_SOON **1**
- Tests **167** → target grow without lying about DONE
- SoftFetch inventory documented; mapRow spread-first closed
- Shared chrome (chip/dialog/panel/filter/SideMenu/partner) tokenized in R2

## Checklist

### A. Full regression

| # | Check | Status | Notes |
|---|---|---|---|
| A1 | `npm test` | **PASS** | **173** passed (was 167; +6: auth encrypt path, encrypt success PEM, other_config CSV, android_config) |
| A2 | `npm run build` | **PASS** | Green; chunk >500kb warning only (App route table) |

### B. Design audit (`--qnb-*` / typography / spacing / radius)

| # | Check | Target | Status | Notes |
|---|---|---|---|---|
| B1 | Login hero / form | LoginPage | PASS | Already on `--qnb-login-*` (R1/R2) |
| B2 | Dashboard shell + SideMenu | Dashboard | PASS | SideMenu aliases `--qnb-sidebar-*` (R2) |
| B3 | GenericCrudPage spacing | GenericCrudPage.css | PASS | `--qnb-space-*` |
| B4 | Partner stepper leftovers | PartnerStepperPage.css | **FIXED R3** | `gap/padding: 6px` → `--qnb-space-6`; `--qnb-fs-11` |
| B5 | FAQ / bank / MFA / force forms | UIInput, UIDropdown, UITextArea | **FIXED R3** | Raw hex → form chrome tokens |
| B6 | Summary status chips | UISummaryStatusRow | **FIXED R3** | `--qnb-summary-active*` |
| B7 | Toasts | UIToast | **FIXED R3** | `--qnb-toast-*` |
| B8 | Home chart hexes | HomePage | DEFER | Chart palette (R2 defer); not primary chrome |
| B9 | New tokens | colors/spacing/typography | **ADDED R3** | Form chrome + `--qnb-space-6` + `--qnb-fs-11` |

### C. Functionality

| # | Check | Module | Status | Notes |
|---|---|---|---|---|
| C1 | Auth encrypt path unit tests | authService + encryptPassword | **FIXED R3** | Mocked RP→encrypt→`{ un, ps }`; real RSA PEM encrypt success |
| C2 | CRUD helpers | createCrudService / GenericCrud | PASS | Offline seed fallback unchanged |
| C3 | Entitlement helpers (R2) | user_management | PASS | role/group/domain/product/subproduct/access still covered |
| C4 | DONE module smoke | FAQ/bank/MFA/force | PASS | CSV URLs + mapRow spread-first |

### D. Logic (mapRow / payloads)

| # | Check | Status | Notes |
|---|---|---|---|
| D1 | Spot-check DONE mapRow | PASS | FAQ/bank/MFA/force remain `...row` first |
| D2 | PARTIAL mapRow scan | PASS | No remaining spread-after-coercion bugs |
| D3 | other_config mapRow | **FIXED R3** | Added when wiring accountClassUrls |

### E. Integration / SoftFetch

| # | Check | Status | Notes |
|---|---|---|---|
| E1 | Wire last CSV-backed SoftFetch | **FIXED R3** | `other_configService` → `accountClassUrls`; new `android_configService` → `androidUrls` + page/route |
| E2 | SoftFetch inventory honesty | PASS | 26 feature-level + 32 other_config children remain SoftFetch (no CSV) |
| E3 | Unused CSV (no SoftFetch/route in Flutter) | DOCUMENTED | `thirdPartyUrls`, `userActionUrls` (Flutter aliases `bo_user_action`→CustomerSupport), `childMenuUrls`, `productUrls`, `recentActivityUrls`, `segmentMappingUrls`, `logoutUrls`, `menuScreenUrls`, `partnershipUrls`, `userrrrUrls`, `customerTypeUrls` — exported via urls index only |
| E4 | pending_approvals | DOCUMENTED | SoftFetch list; CSV only graphql |
| E5 | Live VPN / browser | OPEN | Needs environment |

## SoftFetch remaining (honest)

### Feature-level (26) — no CSV row

Same set as R2: E-statement, adapter, api_call, app_library, customer_jounrey, data_cleansing, dc_city_master, digital__instant_onboarding, dynamic_screen, error_configuration, error_management, finance, finance_calculator, finance_offer, follow_us, funnel, gateway_sync, instant_finance, kiosk_locator, merchant_management, oci_user, pending_approvals, profanity_check, profile_control, release_management, workflow_configuration.

### other_config children (32) — inferred SoftFetch paths

afaq, athkar, beneficiary, card*, charity, cheque_*, connectivity_hub, direct_remittance*, eipo, employment_masters, favorite, google_pay, master_category, mccg, mq_configuration, notification_template, onboarding_mgmt, product_content, report_template, risk, rtp_*, sector, stories, western_union_*, widget_cfg.

**Removed from SoftFetch this round:** `other_configService` (now `accountClassUrls`), plus new CSV consumer `android_config` (not SoftFetch).

## Promotion honesty

| Module | Decision | Reason |
|---|---|---|
| FAQ / bank / force / MFA | Stay **DONE** | Still earned |
| login / dashboard / bo_app_bar / common / ui_menu_navigation | Stay **DONE** | |
| `android_config` | **PARTIAL** (new) | CSV wired + GenericCrud page, but Flutter has no dedicated AutoRoute table — not DONE |
| `other_config` | Stay **PARTIAL** | Folder still mostly SoftFetch children |
| `user_management` | Stay **PARTIAL** | Entitlement matrix UI still lag |
| `error_management` / SoftFetch-only | Stay **PARTIAL** | No CSV |

**DONE count remains 9.** PARTIAL remains **59** (android_config lives under other_config; no new Flutter feature folder).

## Bugs found & fixed this round

| ID | Severity | Description | Fix |
|---|---|---|---|
| R3-01 | Medium | Form chrome (UIInput/Dropdown/Summary/Toast/TextArea) still raw `#hex` / non-`--qnb` vars — affects all DONE CRUD screens | Tokenized to `--qnb-input-*` / `--qnb-summary-*` / `--qnb-toast-*` + fs/space/radius |
| R3-02 | Medium | `other_configService` SoftFetch string paths duplicated CSV `accountClassUrls` | Wired to `accountClassUrls` + mapRow |
| R3-03 | Low | CSV `androidUrls` had no feature consumer | Added `android_configService` + page + route (PARTIAL) |
| R3-04 | Low | Partner stepper still had literal `6px` gaps | `--qnb-space-6` |
| R3-05 | Medium | authService test was smoke-only (`module loads`) | Unit tests for RP→encrypt→login `{ un, ps }` |
| R3-06 | Low | encryptPassword had no success-path coverage | Real 512-bit RSA PEM encrypt assertion |
| R3-07 | Info | README stale (stubs / incomplete scripts) | Rewritten with run/test/gaps/QA summary |

## Tests / build / artifacts

- `npm test` — **173 passed** (121 files)
- `npm run build` — **green**
- WIP: `/workspace/qnb-react-new-wip.tar.gz`
- Final deliverable: `/workspace/qnb-react-new.tar.gz` (excludes `node_modules` + `dist`)

## Open for live / browser QA

1. Login RP + encrypt against VPN hosts
2. DONE CRUD screens against live BO (FAQ/bank/MFA/force)
3. SoftFetch modules smoke (error, pending, other_config SoftFetch children)
4. android_config list/manage against `android-config/*` (if BO exposes it)
5. Partner stepper volume/auth edge steps (still lag Flutter)
6. Code-split App.jsx route table (chunk warning)

## Exit criteria for Round 3

- [x] Full regression green (173 tests + build)
- [x] Design token pass on form chrome + partner leftovers
- [x] Auth encrypt path covered by unit tests
- [x] SoftFetch documented honestly; last CSV wires landed
- [x] README ship notes + QA round summary
- [x] Both tarballs produced
- [x] DONE promotions only if earned — **none**; stay at 9
- [ ] Live/browser spot-check (needs environment)
