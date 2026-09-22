# SoftFetch full inventory (React vs Flutter)

Generated: 2026-09-20T03:57:56.107Z

| Metric | Count |
|---|---|
| SoftFetch services | 120 |
| Flutter URL constants | 687 |
| Generic SoftFetch pages | 124 |
| High-confidence SoftFetch path mismatch | 2 |
| SoftFetch with weak/no Flutter SoftFetch match | 36 |

## SoftFetch path mismatches (fix SoftFetch getAll)

- **digital__instant_onboarding** `onboarding/getAll` → SoftFetch Flutter `customerOnboarding/getAll` (getAllStates) — src/features/digital__instant_onboarding/services/digital__instant_onboardingService.js
- **push_notification** `push-notification/customer/subscriptionList` → SoftFetch Flutter `customer/subscriptionList` (getSubscribedCustomers) — src/features/push_notification/services/push_notificationService.js

## SoftFetch weak SoftFetch Flutter SoftFetch match SoftFetch (review SoftFetch)

- **adapter** `adapter/getAll` base=data — src/features/adapter/services/adapterService.js
- **api_call** `api-call/getAll` base=data — src/features/api_call/services/api_callService.js
- **app_library** `app-library/getAll` base=bo — src/features/app_library/services/app_libraryService.js
- **banner_configuration** `-` base=data — src/features/banner_configuration/services/banner_configurationService.js
- **common** `-` base=bo — src/features/common/crud/createCrudService.js
- **customer_jounrey** `customer-journey/getAll` base=bo — src/features/customer_jounrey/services/customer_jounreyService.js
- **dynamic_screen** `dynamic-screen/getAll` base=data — src/features/dynamic_screen/services/dynamic_screenService.js
- **E-statement** `e-statement/getAll` base=bo — src/features/E-statement/services/E-statementService.js
- **error_configuration** `error-config/getAll` base=data — src/features/error_configuration/services/error_configurationService.js
- **error_management** `error-config/getAll` base=data — src/features/error_management/services/error_managementService.js
- **finance** `salary-advance/getAll` base=data — src/features/finance/services/financeService.js
- **follow_us** `followus/getAll` base=data — src/features/follow_us/services/follow_usService.js
- **funnel** `funnel/getAll` base=bo — src/features/funnel/services/funnelService.js
- **kiosk_locator** `kiosk/getAll` base=data — src/features/kiosk_locator/services/kioskLocatorService.js
- **oci_user** `oci-user/getAll` base=data — src/features/oci_user/services/oci_userService.js
- **other_config** `-` base=bo — src/features/other_config/services/beneficiaryService.js
- **other_config** `-` base=data — src/features/other_config/services/charityService.js
- **other_config** `-` base=data — src/features/other_config/services/connectivity_hubService.js
- **other_config** `-` base=data — src/features/other_config/services/direct_remittance_typeService.js
- **other_config** `-` base=bo — src/features/other_config/services/favoriteService.js
- **other_config** `-` base=data — src/features/other_config/services/master_categoryService.js
- **other_config** `-` base=data — src/features/other_config/services/mccgService.js
- **other_config** `-` base=data — src/features/other_config/services/mq_configurationService.js
- **other_config** `-` base=data — src/features/other_config/services/notification_templateService.js
- **other_config** `-` base=data — src/features/other_config/services/product_contentService.js
- **other_config** `-` base=data — src/features/other_config/services/report_templateService.js
- **other_config** `-` base=data — src/features/other_config/services/riskService.js
- **other_config** `-` base=data — src/features/other_config/services/rtp_account_typeService.js
- **other_config** `-` base=data — src/features/other_config/services/rtp_purposeService.js
- **other_config** `-` base=data — src/features/other_config/services/sectorService.js
- **other_config** `-` base=data — src/features/other_config/services/western_union_emailService.js
- **other_config** `-` base=data — src/features/other_config/services/western_union_historyService.js
- **other_config** `-` base=bo — src/features/other_config/services/widget_cfgService.js
- **pending_approvals** `pending-approval/list` base=wfc — src/features/pending_approvals/services/pending_approvalsService.js
- **profile_control** `profile-control/getAll` base=bo — src/features/profile_control/services/profile_controlService.js
- **workflow_configuration** `workflow/config/getAll` base=data — src/features/workflow_configuration/services/workflow_configurationService.js