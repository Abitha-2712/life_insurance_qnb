# SoftFetch param remap (all GenericCrudPage features)

Generated: 2026-09-20T04:00:59.568Z

| Remapped | Already mapped | Empty SUCCESS | API fail |
|---|---|---|---|
| 31 | 19 | 8 | 42 |

## Remapped SoftFetch pages

- src/features/apply_product_subproduct/pages/ApplyProductSubproductPage.jsx ← `csubproduct/getAll` keys: subProductId, subProductCode, productId, productName, nameEn, nameAr, descriptionEn, descriptionAr, enableFlag, priority, imageEn, imageAr
- src/features/atm_locator/pages/AtmLocatorPage.jsx ← `atm/getAll` keys: locatorId, code, city, cityInArabic, fullAddress, fullAddressArb, latitude, longitude, workingHours, workingHoursInArb, installationDate, cashDeposit
- src/features/bank_management/pages/BankManagementPage.jsx ← `bankDetails/getAll` keys: bankId, bicCode, bankNameEn, bankNameAr, status, fawranStatus, bankCode, createdBy, createdDate, lastModifiedBy, lastModifiedDate
- src/features/customer_service/pages/CRMServicePage.jsx ← `crm-service-type/get-all` keys: id, serviceType, serviceName, code, categoryName, department, assignee, sendSms, slaTime, status
- src/features/data_base_configuration/pages/DatabaseConfigurationPage.jsx ← `dbconfig/getDbConfig` keys: id, dbType, hostName, port, database, username, password, encryptedPassword, action
- src/features/default_parameter/pages/DefaultParameterPage.jsx ← `api/default-config/getAll` keys: id, parameterName, parameterValue, domainId, status, createdDate, modifiedDate
- src/features/digital__instant_onboarding/pages/DigitalInstantOnboardingPage.jsx ← `customerOnboarding/getAll` keys: stateId, customerId, mobileNumber, qatarIdNo, title, onboardingStatus, currentStep, isPrepaid, resumeCount, updatedAt
- src/features/FAQ_management/pages/FAQManagementPage.jsx ← `faq/getAll` keys: faqId, englishQuestion, englishResponse, arabicQuestion, arabicResponse, startDate, endDate, rowNumber, domainId, channelIds, channelNames, status
- src/features/feature_management/pages/DomainManagementPage.jsx ← `bko-domain/fetchAll` keys: domainId, domainDesc, status, createdBy, createdTime, modifiedBy, modifiedTime, priority
- src/features/feature_management/pages/FeatureManagementPage.jsx ← `bko-features/fetchByCriteria` keys: functionCode, functionDesc, priority, productCode, subProductCode, status, domainId
- src/features/feature_management/pages/SubProductManagementPage.jsx ← `bko-subProduct/fetchByCriteria` keys: subProductCode, subProductDesc, productCode, subProductUrl, priority, status, domainId, childMenuFlag, domainDesc, productDesc
- src/features/license_management/pages/LicenseManagementPage.jsx ← `bko-license/fetchAll` keys: licenseId, domainName, expiryDate, warningStatus, alertStatus, status, notificationDeliveries
- src/features/master/channel/pages/ChannelTablePage.jsx ← `bko-channel/fetchAll` keys: channelId, channelDesc, description, status
- src/features/master/unit/pages/UnitTablePage.jsx ← `bko-unit/fetchAll` keys: id, unitId, description, color, unitDesc, countryCode, timeZone, baseCur, cur2, cur3, iban, branchCode
- src/features/mfa_management/pages/MFAManagementPage.jsx ← `mfa/getall` keys: mfaId, mfaName, mfaType, mfaFailCount, effectiveFrom, effectiveTo, status
- src/features/offer_discount_management/pages/DiscountManagementPage.jsx ← `offer/getAll` keys: offerId, partnerName, productName, offerTitle, offerDescription, offerTag, termsAndConditions, offerType, rewardType, rewardValue, redemptionMethod, redemptionLimitPerUser
- src/features/offer_discount_management/pages/OfferDiscountPage.jsx ← `offer/getAll` keys: offerId, partnerName, productName, offerTitle, offerDescription, offerTag, termsAndConditions, offerType, rewardType, rewardValue, redemptionMethod, redemptionLimitPerUser
- src/features/other_config/pages/AccountTypePage.jsx ← `accountType/getAll` keys: id, applicationType, accountType, nameEn, nameAr, cardIssuance, descriptionEn, descriptionAr, createdBy, createdDate, modifiedBy, modifiedDate
- src/features/other_config/pages/AndroidConfigPage.jsx ← `android-config/list` keys: id, fcmMode, fcmProjectId, fcmGoogleCredsJson, jpushAppKey, jpushMasterSecret, status
- src/features/other_config/pages/ApplePayPage.jsx ← `apple-pay/getAll` keys: id, binNumber, status, createdBy, createdDate, modifiedBy, modifiedDate
- src/features/other_config/pages/CardManagementPage.jsx ← `card-bin/getAll` keys: id, code, bin, productType, cardType, issuance, provider, minRange, maxRange, cardArtUrl, image, imageName
- src/features/other_config/pages/CardSpendPage.jsx ← `card-spend-category/getAll?page=0&size=50` keys: id, code, nameEn, nameAr, cardSpendImageUrl, cardSpendImage, cardSpendImageName, colorPicker, status, createdBy, createdDate, modifiedBy
- src/features/other_config/pages/GooglePayPage.jsx ← `googlepay/bin/getAll` keys: id, bin, status
- src/features/other_config/pages/OtherConfigurationPage.jsx ← `account-class/getall` keys: id, accountType, classCode, englishDescription, arabicDescription, currency, openAccount, openAccountCount, availableForNtq, segmentClasses, controlActions, minAmount
- src/features/profanity_check/pages/ProfanityCheckPage.jsx ← `profanity/getAll` keys: id, profanityWordsEn, profanityWordsAr, action, status, createdBy, modifiedBy
- src/features/rule_management/pages/RuleManagementPage.jsx ← `bko-rule/fetchAll` keys: id, domainId, domainDesc, product, productDesc, subProduct, subProductDesc, ruleName, selfAuthorizer, subRuleList, subRuleDefinitions
- src/features/sms_configuration/pages/SMSConfigurationPage.jsx ← `api/otpControlConfig/getall` keys: configId, channelIds, channelName, categoryId, otpLength, otpType, otpExpirySecond, maxInvalidSession, maxInvalidUser, blockDurationMin, maxResendCount, deliveryMode
- src/features/user_management/pages/GroupManagementPage.jsx ← `bko-grp/fetchAll` keys: id, grpName, remarks, unitId, unitDesc, domainId, domainDesc, groupDesc, status, product, segmentCode
- src/features/user_management/pages/RoleManagementPage.jsx ← `bko-role/fetchAll` keys: roleId, userLevel, userLevelName, userRoleHierarchy, status, domainId, domainDesc, groupIds, groupNames
- src/features/user_name_rules/pages/PasswordPolicyPage.jsx ← `bko-password-policy/fetchByCriteria` keys: policyId, policyName, channelNames, domainId, categoryName, status, rules, domainDesc
- src/features/user_name_rules/pages/UsernameRulesPage.jsx ← `usernamerule/getAll` keys: id, ruleName, ruleDescription, userMsgEn, userMsgAr, value, status, createdBy, createdDate, modifiedDate, modifiedBy

## SoftFetch API fail (not remapped)

- src/features/about_QNB/pages/AboutQNBPage.jsx `data/disclaimer/summary` 401 G-00001
- src/features/adapter/pages/AdapterTablePage.jsx `data/adapter/getAll` 401 G-00001
- src/features/api_call/pages/APICallPage.jsx `data/api-call/getAll` 401 G-00001
- src/features/app_library/pages/AppLibraryPage.jsx `bo/app-library/getAll` 401 G-00001
- src/features/blocklist_imei/pages/BlocklistIMEIPage.jsx `data/imei-block/getAll` 401 G-00001
- src/features/blocklist_ip/pages/BlocklistIPPage.jsx `wfc/backoffice-service/ip-block/list` 401 G-00001
- src/features/branch_locator/pages/BranchLocatorPage.jsx `data/branch-locator/getall` 401 G-00001
- src/features/configuration_parameters/pages/ConfigurationParametersPage.jsx `data/formconfig/getAll` 401 G-00001
- src/features/customer_jounrey/pages/CustomerJourneyPage.jsx `bo/customer-journey/getAll` 401 G-00001
- src/features/customer_support/pages/CustomerSupportPage.jsx `data/api/customer/details` 401 G-00001
- src/features/dc_city_master/pages/DCCityMasterPage.jsx `data/city-master/getAll` 401 G-00001
- src/features/dynamic_screen/pages/DynamicScreenPage.jsx `data/dynamic-screen/getAll` 401 G-00001
- src/features/E-statement/pages/EStatementPage.jsx `bo/e-statement/getAll` 401 G-00001
- src/features/error_configuration/pages/ErrorConfigurationPage.jsx `data/error-config/getAll` 401 G-00001
- src/features/error_management/pages/ErrorManagementPage.jsx `data/error-config/getAll` 401 G-00001
- src/features/finance/pages/FinancePage.jsx `data/salary-advance/getAll` 401 G-00001
- src/features/follow_us/pages/FollowUsReachUsPage.jsx `data/followus/getAll` 401 G-00001
- src/features/force_update_configuration/pages/ForceUpdatePage.jsx `bo/forceUpdate/summary` 401 G-00001
- src/features/funnel/pages/FunnelPage.jsx `bo/funnel/getAll` 401 G-00001
- src/features/instant_finance/pages/InstantFinancePage.jsx `bo/instant-finance/getAll` 401 G-00001
- src/features/kiosk_locator/pages/KioskLocatorPage.jsx `data/kiosk/getAll` 401 G-00001
- src/features/master/iban/pages/IbanBlocklistPage.jsx `bo/iban/blockedIbanList` 401 G-00001
- src/features/menu_maintenance/pages/MenuEntitlementPage.jsx `bo/txn/menus/entitlement` 401 G-00001
- src/features/merchant_management/pages/MerchantManagementPage.jsx `data/merchantmaster/getAll` 401 G-00001
- src/features/oci_user/pages/OCINotificationPage.jsx `data/oci-user/getAll` 401 G-00001
- src/features/oci_user/pages/OCIUserManagementPage.jsx `data/oci-user/getAll` 401 G-00001
- src/features/other_config/pages/CardIssuancePage.jsx `data/instant-credit-card/getAll` 401 G-00001
- src/features/other_config/pages/ChangePasswordConfigPage.jsx `data/password-config/getAll` 401 G-00001
- src/features/Parameter_maintenance/pages/ParameterMaintenancePage.jsx `bo/backoffice-service/parameter/list` 401 G-00001
- src/features/partner_onboarding/pages/PartnerOnboardingPage.jsx `bo/partners/list?statusType=active` 401 G-00001
- src/features/pending_approvals/pages/PendingApprovalsPage.jsx `wfc/pending-approval/list` 401 G-00001
- src/features/profile_control/pages/ProfileControlPage.jsx `bo/profile-control/getAll` 401 G-00001
- src/features/push_notification/pages/PushNotificationPage.jsx `data/push-notification/customer/subscriptionList` 401 G-00001
- src/features/ready_to_sync_table/pages/ReadyToSyncPage.jsx `data/migration/table-list` 401 G-00001
- src/features/release_management/pages/ReleaseManagementPage.jsx `data/release-management/get-all` 401 G-00001
- src/features/screen_configuration/pages/ScreenConfigurationPage.jsx `bo/theme/config/fetch` 401 G-00001
- src/features/screen_configuration/pages/TermsDisclaimerPage.jsx `data/disclaimer/summary` 401 G-00001
- src/features/segment_access_management/pages/SegmentAccessPage.jsx `bo/customerSeg/getSegmentList` 404 G-00001
- src/features/sync_table_management/pages/SyncTableManagementPage.jsx `bo/migration/table-list` 401 G-00001
- src/features/user_name_rules/pages/PasswordConfigPage.jsx `data/password-config/getAll` 401 G-00001
- src/features/workflow_configuration/pages/WorkflowConfigurationPage.jsx `data/workflow/config/getAll` 401 G-00001
- src/features/workflow_new/pages/WorkflowNewPage.jsx `wfc/pending-request/workflow/list` 401 G-00001