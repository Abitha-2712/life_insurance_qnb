# SoftFetch base+path fixes

_Generated: 2026-09-20 00:29 IST_
_Machine: MANTIS `44e5b519-06cb-4a7b-ba2a-ea4604831770`_

## Method
1. Scan Flutter `lib/**/*datasource*.dart` (+ `features/**/data/**/*.dart`) for `baseUrlOverride: dataurl|wfc|baseUrl`.
2. Resolve URL paths from `lib/network/url/**/*.dart` constants referenced by datasources.
3. Patch React `createCrudService` SoftFetch services: set `base` + string urls when Flutter host is data/wfc (or path-only when inferred BO).
4. Special-case `getSegmentList` path; priority CMS/home modules first.
5. Writes use `UTF8Encoding($false)` (no BOM).

## Counts

| Metric | Value |
|---|---|
| Fixed (files written) | **75** |
| Remaining SoftFetch lacking base data/wfc or still inferred | **108** |
| Flutter datasource host signals | 187 |
| Map keys | 316 |
| Skipped (Flutter host=bo) | 31 |

## Changes

| File | base | fetchAll | create/manage | Flutter source | Note |
|---|---|---|---|---|---|
| src\features\segment_access_management\services\segment_access_managementService.js | data | segemntAccessManagement/getAll |  | lib\features\segment_access_management\data\datasource\segment_access_management_datasource.dart | base+path aligned to Flutter |
| src\features\FAQ_management\services\FAQ_managementService.js | data | /bko-domain/fetchAll |  | lib\features\FAQ_management\data\datasource\faq_management_datasource.dart | base+path aligned to Flutter |
| src\features\bank_management\services\bank_managementService.js | data |  |  | lib\features\bank_management\data\datasource\bank_management_datasource.dart | base+path aligned to Flutter |
| src\features\about_QNB\services\about_QNBService.js | data |  |  | lib\features\about_QNB\data\datasource\about_qnb_datasource.dart | base+path aligned to Flutter |
| src\features\atm_locator\services\atmLocatorService.js | data |  |  | lib\features\workflow_new\atm_locator\data\datasource\atm_locator_datasource.dart | base+path aligned to Flutter |
| src\features\branch_locator\services\branchLocatorService.js | data |  |  | lib\features\workflow_new\branch_locator_management\data\datasource\branch_locator_datasource.dart | base+path aligned to Flutter |
| src\features\kiosk_locator\services\kioskLocatorService.js | data | kiosk/getAll |  | lib\features\workflow_new\kiosk_locator_management\data\datasource\kiosk_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\employment_mastersService.js | data |  |  | lib\features\master\employment_masters\employment_master_country\data\datasource\employment_master_country_datasource.dart | base+path aligned to Flutter |
| src\features\adapter\services\adapterService.js | data |  |  | lib\features\adapter\data\datasource\adapter_workflow_datasource.dart | base+path aligned to Flutter |
| src\features\api_call\services\api_callService.js | data |  |  | lib\features\api_call\data\datasource\api_call_datasource.dart | base+path aligned to Flutter |
| src\features\apply_for_product\services\apply_for_productService.js | data | cproduct/getAll |  | lib\features\apply_for_product\data\datasource\apply_product_datasource.dart | base+path aligned to Flutter |
| src\features\Apply_sub_product\services\Apply_sub_productService.js | data |  |  | lib\features\Apply_sub_product\data\datasource\customer_segment_datasource.dart | base+path aligned to Flutter |
| src\features\blocklist_imei\services\blocklist_imeiService.js | data |  |  | lib\features\blocklist_imei\data\datasource\block_imei_datasource.dart | base+path aligned to Flutter |
| src\features\CMS\services\CMSService.js | data | ${dataurl}panel-static-info/fetchByCriteria |  | lib\features\CMS\story_report\data\datasource\story_report_datasource.dart | base+path aligned to Flutter |
| src\features\configuration_parameters\services\configuration_parametersService.js | data | formfieldmaster/getAll |  | lib\features\configuration_parameters\data\datasource\form_field_datasource.dart | base+path aligned to Flutter |
| src\features\customer_service\services\customer_serviceService.js | data |  |  | lib\features\customer_service\utility_service_management\data\datasource\utility_service_details_datasource.dart | base+path aligned to Flutter |
| src\features\customer_support\services\customer_supportService.js | data |  |  | lib\features\customer_support\data\datasource\customer_search_datasource.dart | base+path aligned to Flutter |
| src\features\digital__instant_onboarding\services\digital__instant_onboardingService.js | data |  |  | lib\features\digital _instant_onboarding\onboarding_management\data\datasource\onboarding_management_datasource.dart | base+path aligned to Flutter |
| src\features\dynamic_screen\services\dynamic_screenService.js | data |  |  | lib\features\dynamic_screen\data\datasource\dynamic_screen_datasource.dart | base+path aligned to Flutter |
| src\features\error_configuration\services\error_configurationService.js | data | error-config/getAll |  | lib\features\error_management\data\datasource\error_management_datasource.dart | base+path aligned to Flutter |
| src\features\error_management\services\error_managementService.js | data | error-config/getAll |  | lib\features\error_management\data\datasource\error_management_datasource.dart | base+path aligned to Flutter |
| src\features\feature_management\services\productService.js | data | rproducts/getall |  | lib\features\workflow_new\product_management\data\datasource\product_managements_datasource.dart | base+path aligned to Flutter |
| src\features\feature_management\services\subProductService.js | data | rproducts/getall |  | lib\features\workflow_new\product_management\data\datasource\product_managements_datasource.dart | base+path aligned to Flutter |
| src\features\finance\services\financeService.js | data |  |  | lib\features\finance_offer\data\datasource\finance_config_datasource.dart | base+path aligned to Flutter |
| src\features\finance_calculator\services\finance_calculatorService.js | data |  |  | lib\features\finance_calculator\data\datasource\finance_calculator_datasource.dart | base+path aligned to Flutter |
| src\features\finance_offer\services\finance_offerService.js | data |  |  | lib\features\finance_offer\data\datasource\finance_offer_datasource.dart | base+path aligned to Flutter |
| src\features\follow_us\services\follow_usService.js | data | followus/getAll |  | lib\features\follow_us\data\datasource\follow_us_datasource.dart | base+path aligned to Flutter |
| src\features\gateway_sync\services\gateway_syncService.js | data |  |  | lib\features\gateway_sync\data\datasource\gateway_sync_datasource.dart | base+path aligned to Flutter |
| src\features\limit_setup\services\feesLimitService.js | data | customerSeg/get-All |  | lib\features\limit_setup\transfer_limit_configuration\data\datasource\segment_based_datasource.dart | base+path aligned to Flutter |
| src\features\limit_setup\services\limit_setupService.js | data | customerSeg/get-All |  | lib\features\limit_setup\transfer_limit_configuration\data\datasource\segment_based_datasource.dart | base+path aligned to Flutter |
| src\features\merchant_management\services\merchant_managementService.js | data |  |  | lib\features\merchant_management\data\datasource\merchant_management_datasource.dart | base+path aligned to Flutter |
| src\features\mfa_management\services\mfa_managementService.js | data |  |  | lib\features\mfa_management\data\datasource\mfa_management_datasource.dart | base+path aligned to Flutter |
| src\features\oci_user\services\oci_userService.js | data |  |  | lib\features\oci_user\data\datasource\oci_user_popup_datasource.dart | base+path aligned to Flutter |
| src\features\offer_discount_management\services\offer_discount_managementService.js | data |  |  | lib\features\offer_discount_management\offer_management\data\datasource\offer_management_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\accountClassService.js | data | BoLookUp/list |  | lib\features\other_config\western_union_ email_management\data\datasource\western_union_email_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\accountTypeService.js | data | BoLookUp/list |  | lib\features\other_config\western_union_ email_management\data\datasource\western_union_email_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\afaqService.js | data |  |  | lib\features\other_config\afaq_management\data\datasource\afaq_working_schedule_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\athkarService.js | data |  |  | lib\features\CMS\athkar_management\data\datasource\athkar_management_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\beneficiaryService.js | bo (paths only) | /api/v1/beneficiaries/view/cooling-pending |  | lib\features\limit_setup\beneficiary_cooling_pending\data\datasource\beneficiary_cooling_pending_datasource.dart | path fix; host remains bo |
| src\features\other_config\services\cardService.js | data |  |  | lib\features\CMS\card_issuance\data\datasource\prepaid_card_issuance_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\change_password_cfgService.js | data | password-config/getAll | password-config/action | lib\features\user_management\password_configuration\data\datasource\password_configuration_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\charityService.js | data |  |  | lib\features\CMS\charity_management\data\datasource\charity_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\cheque_bookService.js | data | /domain/list |  | lib\features\other_config\cheque_book_management\data\datasource\cheque_book_reason_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\cheque_depositService.js | data |  |  | lib\features\other_config\cheque_deposit\data\datasource\cheque_deposit_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\connectivity_hubService.js | data | third-party/get-all | third-party/create | lib\features\screen_configuration\connectivity_hub\data\datasource\connectivity_hub_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\direct_remittance_typeService.js | data |  |  | lib\features\master\direct_remittance\data\datasource\direct_remittance_type_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\direct_remittanceService.js | data |  |  | lib\features\master\direct_remittance\data\datasource\direct_remittance_type_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\eipoService.js | data |  |  | lib\features\transfer_config\eIPO_company_configuration\data\datasource\eIPO_company_config_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\master_categoryService.js | data | gateway_audit/getAll |  | lib\features\master\transfer_type\data\datasource\transfer_type_dropdown.dart | base+path aligned to Flutter |
| src\features\other_config\services\mccgService.js | data |  |  | lib\features\master\mccg\data\datasource\mccg_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\mq_configurationService.js | data |  |  | lib\features\screen_configuration\mq_configuration\data\datasource\mq_configuration_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\notification_templateService.js | data | BoLookUp/list |  | lib\features\digital _instant_onboarding\notification_template\data\datasource\notification_template_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\onboarding_mgmtService.js | data |  |  | lib\features\digital _instant_onboarding\onboarding_management\data\datasource\onboarding_management_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\other_configService.js | data | BoLookUp/list |  | lib\features\other_config\western_union_ email_management\data\datasource\western_union_email_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\product_contentService.js | data |  |  | lib\features\master\product_content_management\data\datasource\product_content_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\report_templateService.js | data |  |  | lib\features\CMS\report_template\data\datasource\report_template_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\riskService.js | data |  |  | lib\features\master\risk\data\datasource\risk_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\rtp_account_typeService.js | data | account-class/dropdown |  | lib\features\transfer_config\rtp_account_type_management\data\datasource\rtp_account_type_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\rtp_purposeService.js | data | BoLookUp/list |  | lib\features\other_config\western_union_ email_management\data\datasource\western_union_email_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\sectorService.js | data |  |  | lib\features\master\sector\data\datasource\sector_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\western_union_emailService.js | data | BoLookUp/list |  | lib\features\other_config\western_union_ email_management\data\datasource\western_union_email_datasource.dart | base+path aligned to Flutter |
| src\features\other_config\services\western_union_historyService.js | data | BoLookUp/list |  | lib\features\other_config\western_union_ email_management\data\datasource\western_union_email_datasource.dart | base+path aligned to Flutter |
| src\features\push_notification\services\push_notificationService.js | data | csubproduct/subproduct-DD |  | lib\features\push_notification\costomer_segment\data\datasource\segment_mapping_datasource.dart | base+path aligned to Flutter |
| src\features\ready_to_sync_table\services\ready_to_sync_tableService.js | data |  |  | lib\features\ready_to_sync_table\data\datasource\ready_to_sync_table_datasource.dart | base+path aligned to Flutter |
| src\features\release_management\services\release_managementService.js | data |  |  | lib\features\release_management\data\datasource\release_management_datasource.dart | base+path aligned to Flutter |
| src\features\screen_configuration\services\screen_configurationService.js | data | department/departmentDD |  | lib\features\screen_configuration\terms_and_conditions_disclaimer\data\datasource\disclaimer_datasource.dart | base+path aligned to Flutter |
| src\features\screen_configuration\services\termsDisclaimerService.js | data |  |  | lib\features\screen_configuration\terms_and_conditions_disclaimer\data\datasource\disclaimer_datasource.dart | base+path aligned to Flutter |
| src\features\sms_configuration\services\sms_configurationService.js | data |  |  | lib\features\sms_configuration\data\datasource\sms_configuration_datasource.dart | base+path aligned to Flutter |
| src\features\transfer_config\services\transfer_configService.js | data | account-class/dropdown |  | lib\features\transfer_config\rtp_account_type_management\data\datasource\rtp_account_type_datasource.dart | base+path aligned to Flutter |
| src\features\user_management\services\user_managementService.js | data | password-config/getAll | password-config/action | lib\features\user_management\password_configuration\data\datasource\password_configuration_datasource.dart | base+path aligned to Flutter |
| src\features\user_name_rules\services\passwordConfigService.js | data | password-config/getAll | password-config/action | lib\features\user_management\password_configuration\data\datasource\password_configuration_datasource.dart | base+path aligned to Flutter |
| src\features\user_name_rules\services\passwordPolicyService.js | data | password-config/getAll | password-config/action | lib\features\user_management\password_configuration\data\datasource\password_configuration_datasource.dart | base+path aligned to Flutter |
| src\features\user_name_rules\services\user_name_rulesService.js | data |  |  | lib\features\user_name_rules\data\datasource\username_rules_datasource.dart | base+path aligned to Flutter |
| src\features\workflow_configuration\services\workflow_configurationService.js | data |  |  | lib\features\workflow_configuration\manage_user\data\datasource\manage_user_datasource.dart | base+path aligned to Flutter |
| src\core\api\urls\customer_segmentUrls.js | (urls) | segemntAccessManagement/getAll |  | lib\features\segment_access_management\data\datasource\segment_access_management_datasource.dart | getSegmentList 404 path fix |

## Remaining

- D:\react_new\src\features\about_QNB\services\about_QNBService.js | flutterHost=data inferred=False
- D:\react_new\src\features\adapter\services\adapterService.js | flutterHost=data inferred=False
- D:\react_new\src\features\api_call\services\api_callService.js | flutterHost=data inferred=False
- D:\react_new\src\features\apply_for_product\services\apply_for_productService.js | flutterHost=data inferred=False
- D:\react_new\src\features\apply_product_subproduct\services\apply_product_subproductService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\Apply_sub_product\services\Apply_sub_productService.js | flutterHost=data inferred=False
- D:\react_new\src\features\app_library\services\app_libraryService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\atm_locator\services\atmLocatorService.js | flutterHost=data inferred=False
- D:\react_new\src\features\bank_management\services\bank_managementService.js | flutterHost=data inferred=False
- D:\react_new\src\features\banner_configuration\services\banner_configurationService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\blocklist_imei\services\blocklist_imeiService.js | flutterHost=data inferred=False
- D:\react_new\src\features\blocklist_ip\services\blocklist_ipService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\branch_locator\services\branchLocatorService.js | flutterHost=data inferred=False
- D:\react_new\src\features\CMS\services\CMSService.js | flutterHost=data inferred=False
- D:\react_new\src\features\common\crud\createCrudService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\configuration_parameters\services\configuration_parametersService.js | flutterHost=data inferred=False
- D:\react_new\src\features\customer_360_view\services\customer_360_viewService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\customer_jounrey\services\customer_jounreyService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\customer_service\services\customer_serviceService.js | flutterHost=data inferred=False
- D:\react_new\src\features\data_base_configuration\services\data_base_configurationService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\data_cleansing\services\data_cleansingService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\default_parameter\services\default_parameterService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\digital__instant_onboarding\services\digital__instant_onboardingService.js | flutterHost=data inferred=False
- D:\react_new\src\features\dynamic_screen\services\dynamic_screenService.js | flutterHost=data inferred=False
- D:\react_new\src\features\E-statement\services\E-statementService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\error_configuration\services\error_configurationService.js | flutterHost=data inferred=False
- D:\react_new\src\features\error_management\services\error_managementService.js | flutterHost=data inferred=True
- D:\react_new\src\features\FAQ_management\services\FAQ_managementService.js | flutterHost=data inferred=False
- D:\react_new\src\features\feature_management\services\domainService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\feature_management\services\feature_managementService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\feature_management\services\productService.js | flutterHost=data inferred=False
- D:\react_new\src\features\feature_management\services\subProductService.js | flutterHost=data inferred=False
- D:\react_new\src\features\finance\services\financeService.js | flutterHost=data inferred=False
- D:\react_new\src\features\finance_calculator\services\finance_calculatorService.js | flutterHost=data inferred=False
- D:\react_new\src\features\finance_offer\services\finance_offerService.js | flutterHost=data inferred=False
- D:\react_new\src\features\follow_us\services\follow_usService.js | flutterHost=data inferred=False
- D:\react_new\src\features\force_update_configuration\services\force_update_configurationService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\funnel\services\funnelService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\gateway_sync\services\gateway_syncService.js | flutterHost=data inferred=False
- D:\react_new\src\features\instant_finance\services\instant_financeService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\kiosk_locator\services\kioskLocatorService.js | flutterHost=data inferred=False
- D:\react_new\src\features\license_management\services\license_managementService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\limit_setup\services\feesLimitService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\limit_setup\services\limit_setupService.js | flutterHost=data inferred=False
- D:\react_new\src\features\master\channel\services\channelService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\master\country\services\countryService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\master\currency\services\currencyService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\master\iban\services\ibanService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\master\language\services\languageService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\master\unit\services\unitService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\menu_maintenance\services\menu_maintenanceService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\merchant_management\services\merchant_managementService.js | flutterHost=data inferred=False
- D:\react_new\src\features\mfa_management\services\mfa_managementService.js | flutterHost=data inferred=False
- D:\react_new\src\features\oci_user\services\oci_userService.js | flutterHost=data inferred=False
- D:\react_new\src\features\offer_discount_management\services\discountService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\offer_discount_management\services\offer_discount_managementService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\accountClassService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\other_config\services\accountTypeService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\other_config\services\afaqService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\android_configService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\other_config\services\athkarService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\beneficiaryService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\other_config\services\change_password_cfgService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\charityService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\cheque_bookService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\cheque_depositService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\connectivity_hubService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\direct_remittanceService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\direct_remittance_typeService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\eipoService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\employment_mastersService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\favoriteService.js | flutterHost=bo inferred=True
- D:\react_new\src\features\other_config\services\lookupService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\other_config\services\lookupTypeService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\other_config\services\master_categoryService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\mccgService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\mq_configurationService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\notification_templateService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\onboarding_mgmtService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\other_configService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\product_contentService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\report_templateService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\riskService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\rtp_account_typeService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\rtp_purposeService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\other_config\services\sectorService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\western_union_emailService.js | flutterHost=data inferred=False
- D:\react_new\src\features\other_config\services\western_union_historyService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\other_config\services\widget_cfgService.js | flutterHost=bo inferred=True
- D:\react_new\src\features\Parameter_maintenance\services\Parameter_maintenanceService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\partner_onboarding\services\partner_onboardingService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\pending_approvals\services\pending_approvalsService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\profanity_check\services\profanity_checkService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\profile_control\services\profile_controlService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\push_notification\services\push_notificationService.js | flutterHost=data inferred=False
- D:\react_new\src\features\release_management\services\release_managementService.js | flutterHost=data inferred=False
- D:\react_new\src\features\rule_management\services\rule_managementService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\screen_configuration\services\screen_configurationService.js | flutterHost=data inferred=False
- D:\react_new\src\features\screen_configuration\services\termsDisclaimerService.js | flutterHost=data inferred=False
- D:\react_new\src\features\sync_table_management\services\sync_table_managementService.js | flutterHost=unknown inferred=False
- D:\react_new\src\features\transfer_config\services\transfer_configService.js | flutterHost=data inferred=False
- D:\react_new\src\features\user_management\services\groupService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\user_management\services\roleService.js | flutterHost=bo inferred=False
- D:\react_new\src\features\user_management\services\user_managementService.js | flutterHost=data inferred=False
- D:\react_new\src\features\user_name_rules\services\passwordConfigService.js | flutterHost=data inferred=False
- D:\react_new\src\features\user_name_rules\services\passwordPolicyService.js | flutterHost=data inferred=False
- D:\react_new\src\features\user_name_rules\services\user_name_rulesService.js | flutterHost=data inferred=False
- D:\react_new\src\features\workflow_configuration\services\workflow_configurationService.js | flutterHost=data inferred=False

## Files changed (list)

- D:\react_new\src\features\segment_access_management\services\segment_access_managementService.js
- D:\react_new\src\features\FAQ_management\services\FAQ_managementService.js
- D:\react_new\src\features\bank_management\services\bank_managementService.js
- D:\react_new\src\features\about_QNB\services\about_QNBService.js
- D:\react_new\src\features\atm_locator\services\atmLocatorService.js
- D:\react_new\src\features\branch_locator\services\branchLocatorService.js
- D:\react_new\src\features\kiosk_locator\services\kioskLocatorService.js
- D:\react_new\src\features\other_config\services\employment_mastersService.js
- D:\react_new\src\features\adapter\services\adapterService.js
- D:\react_new\src\features\api_call\services\api_callService.js
- D:\react_new\src\features\apply_for_product\services\apply_for_productService.js
- D:\react_new\src\features\Apply_sub_product\services\Apply_sub_productService.js
- D:\react_new\src\features\blocklist_imei\services\blocklist_imeiService.js
- D:\react_new\src\features\CMS\services\CMSService.js
- D:\react_new\src\features\configuration_parameters\services\configuration_parametersService.js
- D:\react_new\src\features\customer_service\services\customer_serviceService.js
- D:\react_new\src\features\customer_support\services\customer_supportService.js
- D:\react_new\src\features\digital__instant_onboarding\services\digital__instant_onboardingService.js
- D:\react_new\src\features\dynamic_screen\services\dynamic_screenService.js
- D:\react_new\src\features\error_configuration\services\error_configurationService.js
- D:\react_new\src\features\error_management\services\error_managementService.js
- D:\react_new\src\features\feature_management\services\productService.js
- D:\react_new\src\features\feature_management\services\subProductService.js
- D:\react_new\src\features\finance\services\financeService.js
- D:\react_new\src\features\finance_calculator\services\finance_calculatorService.js
- D:\react_new\src\features\finance_offer\services\finance_offerService.js
- D:\react_new\src\features\follow_us\services\follow_usService.js
- D:\react_new\src\features\gateway_sync\services\gateway_syncService.js
- D:\react_new\src\features\limit_setup\services\feesLimitService.js
- D:\react_new\src\features\limit_setup\services\limit_setupService.js
- D:\react_new\src\features\merchant_management\services\merchant_managementService.js
- D:\react_new\src\features\mfa_management\services\mfa_managementService.js
- D:\react_new\src\features\oci_user\services\oci_userService.js
- D:\react_new\src\features\offer_discount_management\services\offer_discount_managementService.js
- D:\react_new\src\features\other_config\services\accountClassService.js
- D:\react_new\src\features\other_config\services\accountTypeService.js
- D:\react_new\src\features\other_config\services\afaqService.js
- D:\react_new\src\features\other_config\services\athkarService.js
- D:\react_new\src\features\other_config\services\beneficiaryService.js
- D:\react_new\src\features\other_config\services\cardService.js
- D:\react_new\src\features\other_config\services\change_password_cfgService.js
- D:\react_new\src\features\other_config\services\charityService.js
- D:\react_new\src\features\other_config\services\cheque_bookService.js
- D:\react_new\src\features\other_config\services\cheque_depositService.js
- D:\react_new\src\features\other_config\services\connectivity_hubService.js
- D:\react_new\src\features\other_config\services\direct_remittance_typeService.js
- D:\react_new\src\features\other_config\services\direct_remittanceService.js
- D:\react_new\src\features\other_config\services\eipoService.js
- D:\react_new\src\features\other_config\services\master_categoryService.js
- D:\react_new\src\features\other_config\services\mccgService.js
- D:\react_new\src\features\other_config\services\mq_configurationService.js
- D:\react_new\src\features\other_config\services\notification_templateService.js
- D:\react_new\src\features\other_config\services\onboarding_mgmtService.js
- D:\react_new\src\features\other_config\services\other_configService.js
- D:\react_new\src\features\other_config\services\product_contentService.js
- D:\react_new\src\features\other_config\services\report_templateService.js
- D:\react_new\src\features\other_config\services\riskService.js
- D:\react_new\src\features\other_config\services\rtp_account_typeService.js
- D:\react_new\src\features\other_config\services\rtp_purposeService.js
- D:\react_new\src\features\other_config\services\sectorService.js
- D:\react_new\src\features\other_config\services\western_union_emailService.js
- D:\react_new\src\features\other_config\services\western_union_historyService.js
- D:\react_new\src\features\push_notification\services\push_notificationService.js
- D:\react_new\src\features\ready_to_sync_table\services\ready_to_sync_tableService.js
- D:\react_new\src\features\release_management\services\release_managementService.js
- D:\react_new\src\features\screen_configuration\services\screen_configurationService.js
- D:\react_new\src\features\screen_configuration\services\termsDisclaimerService.js
- D:\react_new\src\features\sms_configuration\services\sms_configurationService.js
- D:\react_new\src\features\transfer_config\services\transfer_configService.js
- D:\react_new\src\features\user_management\services\user_managementService.js
- D:\react_new\src\features\user_name_rules\services\passwordConfigService.js
- D:\react_new\src\features\user_name_rules\services\passwordPolicyService.js
- D:\react_new\src\features\user_name_rules\services\user_name_rulesService.js
- D:\react_new\src\features\workflow_configuration\services\workflow_configurationService.js
- D:\react_new\src\core\api\urls\customer_segmentUrls.js
