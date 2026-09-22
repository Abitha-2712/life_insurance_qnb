/** URL registry — generated from API_ENDPOINTS_LIST.csv + hand aliases. */
import { accessManagementUrls } from './access_managementUrls'
import { accountClassUrls } from './account_classUrls'
import { accountTypeUrls } from './account_typeUrls'
import { androidUrls } from './androidUrls'
import { appleUrls } from './appleUrls'
import { atmLocatorUrls } from './atm_locatorUrls'
import { bankManagementUrls } from './bank_managementUrls'
import { bannerConfigurationUrls } from './banner_configurationUrls'
import { blockListUrls } from './block_listUrls'
import { blocklistIpUrls } from './blocklist_ipUrls'
import { branchLocatorUrls } from './branch_locatorUrls'
import { campaignMessagesUrls } from './campaign_messagesUrls'
import { channelUrls } from './channelUrls'
import { childMenuUrls } from './child_menuUrls'
import { configurationParaUrls } from './configuration_paraUrls'
import { countryUrls } from './countryUrls'
import { crmServiceUrls } from './crm_serviceUrls'
import { currencyUrls } from './currencyUrls'
import { customerSegmentUrls } from './customer_segmentUrls'
import { customerSupportUrls } from './customer_supportUrls'
import { customerTypeUrls } from './customer_typeUrls'
import { customerViewUrls } from './customer_viewUrls'
import { dashboardUrls } from './dashboardUrls'
import { databaseUrls } from './databaseUrls'
import { defaultParameterUrls } from './default_parameterUrls'
import { disclaimerUrls } from './disclaimerUrls'
import { domainManagementUrls } from './domain_managementUrls'
import { faqManagementUrls } from './faq_managementUrls'
import { forceUpdateUrls } from './force_updateUrls'
import { i18MaintenanceUrls } from './i18_maintenanceUrls'
import { languageUrls } from './languageUrls'
import { licenseManagementUrls } from './license_managementUrls'
import { loginUrls } from './loginUrls'
import { cityUrls } from './cityUrls'
import { logoutUrls } from './logoutUrls'
import { lookupUrls } from './lookupUrls'
import { lookupTypeUrls } from './lookup_typeUrls'
import { manageUserUrls } from './manage_userUrls'
import { menuScreenUrls } from './menuScreenUrls'
import { menuUrls } from './menuUrls'
import { menuEntitlementUrls } from './menu_entitlementUrls'
import { mfaManagementUrls } from './mfa_managementUrls'
import { offerUrls } from './offerUrls'
import { otpControlUrls } from './otp_controlUrls'
import { parameterUrls } from './parameterUrls'
import { partnerOnboardingUrls } from './partner_onboardingUrls'
import { partnershipUrls } from './partnershipUrls'
import { passwordConfigurationUrls } from './password_configurationUrls'
import { passwordPolicyUrls } from './password_policyUrls'
import { pendingApprovalUrls } from './pending_approvalUrls'
import { productUrls } from './productUrls'
import { productManagementUrls } from './product_managementUrls'
import { pushNotificationUrls } from './push_notificationUrls'
import { recentActivityUrls } from './recent_activityUrls'
import { ruleManagementUrls } from './rule_managementUrls'
import { segmentMappingUrls } from './segment_mappingUrls'
import { subProductManagementUrls } from './sub_product_managementUrls'
import { subProductsManagementUrls } from './sub_products_managementUrls'
import { syncTableUrls } from './sync_tableUrls'
import { themeConfigUrls } from './theme_configUrls'
import { thirdPartyUrls } from './third_partyUrls'
import { transferControlUrls } from './transfer_controlUrls'
import { transferTypeUrls } from './transfer_typeUrls'
import { unitUrls } from './unitUrls'
import { userActionUrls } from './user_actionUrls'
import { userRoleManagementUrls } from './user_role_managementUrls'
import { usernameRuleUrls } from './username_ruleUrls'
import { userrrrUrls } from './userrrrUrls'

export const urls = {
  login: loginUrls.login || loginUrls.loginUrl,
  getRp: loginUrls.getRp,
  mfaValidate: loginUrls.mfaValidation,
  otpValidate: loginUrls.otpVerification,
  logout: logoutUrls.logoutUrl || 'auth/logout',
  menu: menuUrls.access,
  menuAccess: menuUrls.access,
  dashboard: dashboardUrls,
  city: {
    fetchAll: cityUrls.fetchAll,
    create: cityUrls.save,
    update: cityUrls.update,
    delete: cityUrls.delete,
    dropdown: cityUrls.dropdown,
  },
  cityUrls,
  accessManagement: accessManagementUrls,
  accountClass: accountClassUrls,
  accountType: accountTypeUrls,
  android: androidUrls,
  apple: appleUrls,
  atmLocator: atmLocatorUrls,
  bankManagement: bankManagementUrls,
  bannerConfiguration: bannerConfigurationUrls,
  blockList: blockListUrls,
  blocklistIp: blocklistIpUrls,
  branchLocator: branchLocatorUrls,
  campaignMessages: campaignMessagesUrls,
  channel: channelUrls,
  childMenu: childMenuUrls,
  configurationPara: configurationParaUrls,
  country: countryUrls,
  crmService: crmServiceUrls,
  currency: currencyUrls,
  customerSegment: customerSegmentUrls,
  customerSupport: customerSupportUrls,
  customerType: customerTypeUrls,
  customerView: customerViewUrls,
  database: databaseUrls,
  defaultParameter: defaultParameterUrls,
  disclaimer: disclaimerUrls,
  domainManagement: domainManagementUrls,
  faqManagement: faqManagementUrls,
  forceUpdate: forceUpdateUrls,
  i18Maintenance: i18MaintenanceUrls,
  language: languageUrls,
  licenseManagement: licenseManagementUrls,
  loginUrls: loginUrls,
  logoutUrls: logoutUrls,
  lookup: lookupUrls,
  lookupType: lookupTypeUrls,
  manageUser: manageUserUrls,
  menuScreen: menuScreenUrls,
  menuUrls: menuUrls,
  menuEntitlement: menuEntitlementUrls,
  mfaManagement: mfaManagementUrls,
  offer: offerUrls,
  otpControl: otpControlUrls,
  parameter: parameterUrls,
  partnerOnboarding: partnerOnboardingUrls,
  partnership: partnershipUrls,
  passwordConfiguration: passwordConfigurationUrls,
  passwordPolicy: passwordPolicyUrls,
  pendingApproval: pendingApprovalUrls,
  product: productUrls,
  productManagement: productManagementUrls,
  pushNotification: pushNotificationUrls,
  recentActivity: recentActivityUrls,
  ruleManagement: ruleManagementUrls,
  segmentMapping: segmentMappingUrls,
  subProductManagement: subProductManagementUrls,
  subProductsManagement: subProductsManagementUrls,
  syncTable: syncTableUrls,
  themeConfig: themeConfigUrls,
  thirdParty: thirdPartyUrls,
  transferControl: transferControlUrls,
  transferType: transferTypeUrls,
  unit: unitUrls,
  userAction: userActionUrls,
  userRoleManagement: userRoleManagementUrls,
  usernameRule: usernameRuleUrls,
  userrrr: userrrrUrls,
}

export { cityUrls, accessManagementUrls, accountClassUrls, accountTypeUrls, androidUrls, appleUrls, atmLocatorUrls, bankManagementUrls, bannerConfigurationUrls, blockListUrls, blocklistIpUrls, branchLocatorUrls, campaignMessagesUrls, channelUrls, childMenuUrls, configurationParaUrls, countryUrls, crmServiceUrls, currencyUrls, customerSegmentUrls, customerSupportUrls, customerTypeUrls, customerViewUrls, dashboardUrls, databaseUrls, defaultParameterUrls, disclaimerUrls, domainManagementUrls, faqManagementUrls, forceUpdateUrls, i18MaintenanceUrls, languageUrls, licenseManagementUrls, loginUrls, logoutUrls, lookupUrls, lookupTypeUrls, manageUserUrls, menuScreenUrls, menuUrls, menuEntitlementUrls, mfaManagementUrls, offerUrls, otpControlUrls, parameterUrls, partnerOnboardingUrls, partnershipUrls, passwordConfigurationUrls, passwordPolicyUrls, pendingApprovalUrls, productUrls, productManagementUrls, pushNotificationUrls, recentActivityUrls, ruleManagementUrls, segmentMappingUrls, subProductManagementUrls, subProductsManagementUrls, syncTableUrls, themeConfigUrls, thirdPartyUrls, transferControlUrls, transferTypeUrls, unitUrls, userActionUrls, userRoleManagementUrls, usernameRuleUrls, userrrrUrls }
export default urls
