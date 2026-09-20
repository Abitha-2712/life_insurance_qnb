import { Navigate, Route, Routes } from 'react-router-dom'
import routes, { dashboardChildPaths } from '@/app/routes'
import { RedirectIfAuthed, RequireAuth } from '@/core/router/guards'
import LoginPage from '@/features/auth/pages/LoginPage/LoginPage'
import DashboardShell from '@/features/dashboard/components/DashboardShell/DashboardShell'
import HomePage from '@/features/dashboard/pages/HomePage/HomePage'
import ComingSoonPage from '@/features/common/pages/ComingSoonPage/ComingSoonPage'
import CityTablePage from '@/features/master/city/pages/CityTablePage/CityTablePage'
import APICallPage from '@/features/api_call/pages/APICallPage'
import AboutQNBPage from '@/features/about_QNB/pages/AboutQNBPage'
import AccountClassPage from '@/features/other_config/pages/AccountClassPage'
import AccountTypePage from '@/features/other_config/pages/AccountTypePage'
import ChequeBookPage from '@/features/other_config/pages/ChequeBookPage'
import ChequeDepositPage from '@/features/other_config/pages/ChequeDepositPage'
import WesternUnionEmailPage from '@/features/other_config/pages/WesternUnionEmailPage'
import WesternUnionHistoryPage from '@/features/other_config/pages/WesternUnionHistoryPage'
import AfaqManagementPage from '@/features/other_config/pages/AfaqManagementPage'
import BeneficiaryConfigPage from '@/features/other_config/pages/BeneficiaryConfigPage'
import CharityManagementPage from '@/features/other_config/pages/CharityManagementPage'
import CardManagementPage from '@/features/other_config/pages/CardManagementPage'
import CardSpendPage from '@/features/other_config/pages/CardSpendPage'
import CardIssuancePage from '@/features/other_config/pages/CardIssuancePage'
import GooglePayPage from '@/features/other_config/pages/GooglePayPage'
import ApplePayPage from '@/features/other_config/pages/ApplePayPage'
import AndroidConfigPage from '@/features/other_config/pages/AndroidConfigPage'
import DirectRemittancePage from '@/features/other_config/pages/DirectRemittancePage'
import DirectRemittanceTypePage from '@/features/other_config/pages/DirectRemittanceTypePage'
import RtpPurposePage from '@/features/other_config/pages/RtpPurposePage'
import RtpAccountTypePage from '@/features/other_config/pages/RtpAccountTypePage'
import ConnectivityHubPage from '@/features/other_config/pages/ConnectivityHubPage'
import MqConfigurationPage from '@/features/other_config/pages/MqConfigurationPage'
import MasterCategoryPage from '@/features/other_config/pages/MasterCategoryPage'
import AthkarManagementPage from '@/features/other_config/pages/AthkarManagementPage'
import StoriesManagementPage from '@/features/other_config/pages/StoriesManagementPage'
import OnboardingManagementPage from '@/features/other_config/pages/OnboardingManagementPage'
import EmploymentMastersPage from '@/features/other_config/pages/EmploymentMastersPage'
import NotificationTemplatePage from '@/features/other_config/pages/NotificationTemplatePage'
import SectorPage from '@/features/other_config/pages/SectorPage'
import MccgPage from '@/features/other_config/pages/MccgPage'
import FavoritePage from '@/features/other_config/pages/FavoritePage'
import WidgetConfigPage from '@/features/other_config/pages/WidgetConfigPage'
import RiskManagementPage from '@/features/other_config/pages/RiskManagementPage'
import EipoCompanyConfigPage from '@/features/other_config/pages/EipoCompanyConfigPage'
import ProductContentPage from '@/features/other_config/pages/ProductContentPage'
import ReportTemplatePage from '@/features/other_config/pages/ReportTemplatePage'
import ChangePasswordConfigPage from '@/features/other_config/pages/ChangePasswordConfigPage'
import AdapterTablePage from '@/features/adapter/pages/AdapterTablePage'
import AppLibraryPage from '@/features/app_library/pages/AppLibraryPage'
import ApplyProductSubproductPage from '@/features/apply_product_subproduct/pages/ApplyProductSubproductPage'
import ApplyforProductPage from '@/features/apply_for_product/pages/ApplyforProductPage'
import ApplySubProductPage from '@/features/Apply_sub_product/pages/ApplySubProductPage'
import AtmLocatorPage from '@/features/atm_locator/pages/AtmLocatorPage'
import BankManagementPage from '@/features/bank_management/pages/BankManagementPage'
import BannerConfigurationPage from '@/features/banner_configuration/pages/BannerConfigurationPage'
import BlocklistIMEIPage from '@/features/blocklist_imei/pages/BlocklistIMEIPage'
import BlocklistIPPage from '@/features/blocklist_ip/pages/BlocklistIPPage'
import BranchLocatorPage from '@/features/branch_locator/pages/BranchLocatorPage'
import CRMServicePage from '@/features/customer_service/pages/CRMServicePage'
import ChannelTablePage from '@/features/master/channel/pages/ChannelTablePage'
import ConfigurationParametersPage from '@/features/configuration_parameters/pages/ConfigurationParametersPage'
import CountryTablePage from '@/features/master/country/pages/CountryTablePage'
import CurrencyTablePage from '@/features/master/currency/pages/CurrencyTablePage'
import Customer360Page from '@/features/customer_360_view/pages/Customer360Page'
import CustomerJourneyPage from '@/features/customer_jounrey/pages/CustomerJourneyPage'
import CustomerSupportPage from '@/features/customer_support/pages/CustomerSupportPage'
import DCCityMasterPage from '@/features/dc_city_master/pages/DCCityMasterPage'
import DataCleansingPage from '@/features/data_cleansing/pages/DataCleansingPage'
import DatabaseConfigurationPage from '@/features/data_base_configuration/pages/DatabaseConfigurationPage'
import DefaultParameterPage from '@/features/default_parameter/pages/DefaultParameterPage'
import DomainManagementPage from '@/features/feature_management/pages/DomainManagementPage'
import DynamicScreenPage from '@/features/dynamic_screen/pages/DynamicScreenPage'
import EStatementPage from '@/features/E-statement/pages/EStatementPage'
import ErrorConfigurationPage from '@/features/error_configuration/pages/ErrorConfigurationPage'
import ErrorManagementPage from '@/features/error_management/pages/ErrorManagementPage'
import FAQManagementPage from '@/features/FAQ_management/pages/FAQManagementPage'
import FeatureManagementPage from '@/features/feature_management/pages/FeatureManagementPage'
import FinanceCalculatorPage from '@/features/finance_calculator/pages/FinanceCalculatorPage'
import FinanceOfferPage from '@/features/finance_offer/pages/FinanceOfferPage'
import FollowUsReachUsPage from '@/features/follow_us/pages/FollowUsReachUsPage'
import PreferencePersonaPage from '@/features/preference/pages/PreferencePersonaPage'
import ReachUsPage from '@/features/reach_us/pages/ReachUsPage'
import ForceUpdatePage from '@/features/force_update_configuration/pages/ForceUpdatePage'
import ApplicationVersionPage from '@/features/other_config/pages/ApplicationVersionPage'
import FunnelPage from '@/features/funnel/pages/FunnelPage'
import GatewaySyncPage from '@/features/gateway_sync/pages/GatewaySyncPage'
import GroupManagementPage from '@/features/user_management/pages/GroupManagementPage'
import InstantFinancePage from '@/features/instant_finance/pages/InstantFinancePage'
import IbanBlocklistPage from '@/features/master/iban/pages/IbanBlocklistPage'
import KioskLocatorPage from '@/features/kiosk_locator/pages/KioskLocatorPage'
import PartnerStepperPage from '@/features/partner_onboarding/pages/PartnerStepperPage'
import LanguageTablePage from '@/features/master/language/pages/LanguageTablePage'
import LicenseManagementPage from '@/features/license_management/pages/LicenseManagementPage'
import LookupTypesPage from '@/features/other_config/pages/LookupTypesPage'
import LookupsPage from '@/features/other_config/pages/LookupsPage'
import MFAManagementPage from '@/features/mfa_management/pages/MFAManagementPage'
import MenuEntitlementPage from '@/features/menu_maintenance/pages/MenuEntitlementPage'
import MerchantManagementPage from '@/features/merchant_management/pages/MerchantManagementPage'
import OCIUserManagementPage from '@/features/oci_user/pages/OCIUserManagementPage'
import OfferDiscountPage from '@/features/offer_discount_management/pages/OfferDiscountPage'
import OffersCategoryPage from '@/features/CMS/offers_category/pages/OffersCategoryPage'
import DiscountManagementPage from '@/features/offer_discount_management/pages/DiscountManagementPage'
import CMSi18nPage from '@/features/CMS/pages/CMSi18nPage'
import FinancePage from '@/features/finance/pages/FinancePage'
import TermsDisclaimerPage from '@/features/screen_configuration/pages/TermsDisclaimerPage'
import TermsConditionsPage from '@/features/screen_configuration/pages/TermsConditionsPage'
import LimitSetupPage from '@/features/limit_setup/pages/LimitSetupPage'
import FeesLimitPage from '@/features/limit_setup/pages/FeesLimitPage'
import PendingApprovalsPage from '@/features/pending_approvals/pages/PendingApprovalsPage'
import OCINotificationPage from '@/features/oci_user/pages/OCINotificationPage'
import ParameterMaintenancePage from '@/features/Parameter_maintenance/pages/ParameterMaintenancePage'
import PartnerOnboardingPage from '@/features/partner_onboarding/pages/PartnerOnboardingPage'
import PasswordConfigPage from '@/features/user_name_rules/pages/PasswordConfigPage'
import PasswordPolicyPage from '@/features/user_name_rules/pages/PasswordPolicyPage'
import ProductManagementPage from '@/features/feature_management/pages/ProductManagementPage'
import ProfanityCheckPage from '@/features/profanity_check/pages/ProfanityCheckPage'
import ProfileControlPage from '@/features/profile_control/pages/ProfileControlPage'
import PushNotificationPage from '@/features/push_notification/pages/PushNotificationPage'
import ReadyToSyncPage from '@/features/ready_to_sync_table/pages/ReadyToSyncPage'
import ReleaseManagementPage from '@/features/release_management/pages/ReleaseManagementPage'
import RoleManagementPage from '@/features/user_management/pages/RoleManagementPage'
import RuleManagementPage from '@/features/rule_management/pages/RuleManagementPage'
import SMSConfigurationPage from '@/features/sms_configuration/pages/SMSConfigurationPage'
import ScreenConfigurationPage from '@/features/screen_configuration/pages/ScreenConfigurationPage'
import SegmentAccessPage from '@/features/segment_access_management/pages/SegmentAccessPage'
import SubProductManagementPage from '@/features/feature_management/pages/SubProductManagementPage'
import SyncTableManagementPage from '@/features/sync_table_management/pages/SyncTableManagementPage'
import TransferControlPage from '@/features/transfer_config/pages/TransferControlPage'
import UnitTablePage from '@/features/master/unit/pages/UnitTablePage'
import UserManagementPage from '@/features/user_management/pages/UserManagementPage'
import UsernameRulesPage from '@/features/user_name_rules/pages/UsernameRulesPage'
import WorkflowConfigurationPage from '@/features/workflow_configuration/pages/WorkflowConfigurationPage'
import WorkflowNewPage from '@/features/workflow_new/pages/WorkflowNewPage'

/** Map dashboard child path â†’ page (generated + dedicated overrides; overrides win). */
const featurePageByPath = {
  'BlockList_IP': BlocklistIPPage,
  'License_Management': LicenseManagementPage,
  'Notifications_Management': PushNotificationPage,
  'Parameter_Maintenance': ParameterMaintenancePage,
  'Partner_Listing': PartnerOnboardingPage,
  'Ready_To_Sync': ReadyToSyncPage,
  'User_name': UsernameRulesPage,
  'about_Qnb': AboutQNBPage,
  'access_product_management': FeatureManagementPage,
  'account_class': AccountClassPage,
  'account_type': AccountTypePage,
  'adapter_table': AdapterTablePage,
  'afaq_management': AfaqManagementPage,
  'api_call': APICallPage,
  'app-library': AppLibraryPage,
  'apple_pay': ApplePayPage,
  'android_config': AndroidConfigPage,
  'application_version_management': ApplicationVersionPage,
  'apply_product': ApplyforProductPage,
  'apply_product_subproduct': ApplyProductSubproductPage,
  'athkar_management': AthkarManagementPage,
  'atm_locator': AtmLocatorPage,
  'bank_management': BankManagementPage,
  'banner-configuration': BannerConfigurationPage,
  'beneficiary_add': BeneficiaryConfigPage,
  'beneficiary_cooling_off': BeneficiaryConfigPage,
  'beneficiary_cooling_pending': BeneficiaryConfigPage,
  'beneficiary_edit': BeneficiaryConfigPage,
  'beneficiary_nav': BeneficiaryConfigPage,
  'block_user': Customer360Page,
  'blocklist_imei': BlocklistIMEIPage,
  'bo_user_action': CustomerSupportPage,
  'branch_locator': BranchLocatorPage,
  'card': CardManagementPage,
  'card_issuance_management': CardIssuancePage,
  'card_spend': CardSpendPage,
  'category_code': MasterCategoryPage,
  'change_password': ChangePasswordConfigPage,
  'channel_nav': ChannelTablePage,
  'charity_management': CharityManagementPage,
  'cheque_book_management': ChequeBookPage,
  'cheque_deposit': ChequeDepositPage,
  'child_management': MenuEntitlementPage,
  'city': CityTablePage,
  'coming_soon': ComingSoonPage,
  'configuration_para': ConfigurationParametersPage,
  'connectivity_hub': ConnectivityHubPage,
  'consolidate_e_statement': EStatementPage,
  'country_nav': CountryTablePage,
  'crm_department': CRMServicePage,
  'crm_service_management': CRMServicePage,
  'currency_nav': CurrencyTablePage,
  'customer-journey': CustomerJourneyPage,
  'customer-segment': SegmentAccessPage,
  'customer_search': Customer360Page,
  'block_unblock_users': Customer360Page,
  'data_cleansing': DataCleansingPage,
  'database_config': DatabaseConfigurationPage,
  'dc_city_master': DCCityMasterPage,
  'default_parameter': DefaultParameterPage,
  'direct_remittance': DirectRemittancePage,
  'direct_remittance_type': DirectRemittanceTypePage,
  'discount_management': DiscountManagementPage,
  'domain_management': DomainManagementPage,
  'dynamic_screen': DynamicScreenPage,
  'eIPO_company_configuration': EipoCompanyConfigPage,
  'employment_masters': EmploymentMastersPage,
  'error_configuration': ErrorConfigurationPage,
  'error_management': ErrorManagementPage,
  'error_master': ErrorManagementPage,
  'faq_management': FAQManagementPage,
  'favorite': FavoritePage,
  'favorite_list': FavoritePage,
  'fawran_rules': RuleManagementPage,
  'fees_limit': FeesLimitPage,
  'finance_calculator': FinanceCalculatorPage,
  'finance_offer': FinanceOfferPage,
  'fingerprint_management': ScreenConfigurationPage,
  'force_update': ForceUpdatePage,
  'funnel': FunnelPage,
  'gateway_configuration': GatewaySyncPage,
  'gateway_sync': GatewaySyncPage,
  'global_transfer_limit': LimitSetupPage,
  'google_pay': GooglePayPage,
  'group_manage_add': GroupManagementPage,
  'group_manage_edit': GroupManagementPage,
  'group_management': GroupManagementPage,
  'i18n-management': CMSi18nPage,
  'iban_nav': IbanBlocklistPage,
  'instant_finance': InstantFinancePage,
  'kiosk_locator': KioskLocatorPage,
  'link_configuration': FollowUsReachUsPage,
  'manage_links': FollowUsReachUsPage,
  'logging_event': CustomerSupportPage,
  'logging_exception': CustomerSupportPage,
  'lookup_types': LookupTypesPage,
  'lookups': LookupsPage,
  'master_category_management': MasterCategoryPage,
  'master_country_nav': CountryTablePage,
  'master_currency_nav': CurrencyTablePage,
  'master_language_nav': LanguageTablePage,
  'mccg': MccgPage,
  'menu-entitlement': MenuEntitlementPage,
  'merchant_management': MerchantManagementPage,
  'mfa_management': MFAManagementPage,
  'mq_configuration': MqConfigurationPage,
  'notification/customer-segment': NotificationTemplatePage,
  'notification/messages-campaign': NotificationTemplatePage,
  'notification/push-notification': PushNotificationPage,
  'notification_template': NotificationTemplatePage,
  'oci_user_management': OCIUserManagementPage,
  'oci_user_notification': OCINotificationPage,
  'offer_management': OfferDiscountPage,
  'offer_static_info': OfferDiscountPage,
  'offers_category': OffersCategoryPage,
  'offers_rewards_management': OfferDiscountPage,
  'onboarding_management': OnboardingManagementPage,
  'onboarding_product_configuration': OnboardingManagementPage,
  'otp-bio_matrix': SMSConfigurationPage,
  'otp_config': SMSConfigurationPage,
  'partner_stepper': PartnerStepperPage,
  'password_configurations': PasswordConfigPage,
  'password_policy': PasswordPolicyPage,
  'pending-request': PendingApprovalsPage,
  'pending-request-nav': WorkflowConfigurationPage,
  'pending_approval': PendingApprovalsPage,
  'pending_approval_nav': WorkflowConfigurationPage,
  'preference': PreferencePersonaPage,
  'product_content_management': ProductContentPage,
  'product_management': ProductManagementPage,
  'products _management': ProductContentPage,
  'profanity_check': ProfanityCheckPage,
  'profile_control': ProfileControlPage,
  'reach_us': ReachUsPage,
  'follow_us': FollowUsReachUsPage,
  'ready_to_sync_table': ReadyToSyncPage,
  'release_management': ReleaseManagementPage,
  'report_template_maintanance': ReportTemplatePage,
  'retail_product': ProductManagementPage,
  'retail_subproduct': SubProductManagementPage,
  'risk_mangement': RiskManagementPage,
  'rm_contact': FollowUsReachUsPage,
  'role-management': RoleManagementPage,
  'role_based_access': RoleManagementPage,
  'role_management': UserManagementPage,
  'rtp_account_type_management': RtpAccountTypePage,
  'rtp_transfer_purpose_management': RtpPurposePage,
  'rule-management': RuleManagementPage,
  'salary_advance': FinancePage,
  'sector': SectorPage,
  'sector_management': CardSpendPage,
  'segment_access_management': SegmentAccessPage,
  'show-case': AppLibraryPage,
  'sms_configuration': SMSConfigurationPage,
  'splash_screen_maintenance': DynamicScreenPage,
  'stories_management': StoriesManagementPage,
  'story_report': StoriesManagementPage,
  'sub_product_management': SubProductManagementPage,
  'subproduct': ApplySubProductPage,
  'apply_sub_product': ApplySubProductPage,
  'Apply_sub_product': ApplySubProductPage,
  'table-migration': SyncTableManagementPage,
  'table-migration-list': SyncTableManagementPage,
  'template_creation': ReportTemplatePage,
  'term-condition': TermsConditionsPage,
  'terms_and_conditions': TermsConditionsPage,
  'terms&condition_disclaimer': TermsDisclaimerPage,
  'theme_config': ScreenConfigurationPage,
  'transaction-error-details': CustomerSupportPage,
  'transaction-error-details-landing': CustomerSupportPage,
  'transaction-error-table': CustomerSupportPage,
  'transfer_control': TransferControlPage,
  'transfer_limit': LimitSetupPage,
  'transfer_type': TransferControlPage,
  'unit_nav': UnitTablePage,
  'user_creation': UserManagementPage,
  'utility_service_management': CRMServicePage,
  'western_union_email': WesternUnionEmailPage,
  'western_union_history': WesternUnionHistoryPage,
  'widget': WidgetConfigPage,
}

function stubPath(child) {
  return child.startsWith('/') ? child.replace(/^\//, '') : child
}

function resolveFeaturePage(child) {
  return featurePageByPath[child] || ComingSoonPage
}

function App() {
  const stubChildren = dashboardChildPaths.filter((p) => p !== '')

  return (
    <Routes>
      <Route path={routes.root} element={<Navigate to={routes.login} replace />} />
      <Route
        path={routes.login}
        element={
          <RedirectIfAuthed>
            <LoginPage />
          </RedirectIfAuthed>
        }
      />

      <Route
        path={routes.dashboard}
        element={
          <RequireAuth>
            <DashboardShell />
          </RequireAuth>
        }
      >
        <Route index element={<HomePage />} />
        {stubChildren.map((child) => {
          const Page = resolveFeaturePage(child)
          return <Route key={child} path={stubPath(child)} element={<Page />} />
        })}
        <Route path="*" element={<ComingSoonPage />} />
      </Route>

      <Route path="/customer-journey" element={<RequireAuth><DashboardShell /></RequireAuth>}>
        <Route index element={<CustomerJourneyPage />} />
      </Route>
      <Route path="/customer-segment" element={<RequireAuth><DashboardShell /></RequireAuth>}>
        <Route index element={<SegmentAccessPage />} />
      </Route>
      <Route path="/profile_control" element={<RequireAuth><DashboardShell /></RequireAuth>}>
        <Route index element={<ProfileControlPage />} />
      </Route>
      <Route path="/instant_finance" element={<RequireAuth><DashboardShell /></RequireAuth>}>
        <Route index element={<InstantFinancePage />} />
      </Route>
      <Route path="/merchant_management" element={<RequireAuth><DashboardShell /></RequireAuth>}>
        <Route index element={<MerchantManagementPage />} />
      </Route>
      <Route path="/app-library" element={<RequireAuth><DashboardShell /></RequireAuth>}>
        <Route index element={<AppLibraryPage />} />
      </Route>
      <Route path="/show-case" element={<RequireAuth><DashboardShell /></RequireAuth>}>
        <Route index element={<AppLibraryPage />} />
      </Route>
      <Route path="/pending-request" element={<RequireAuth><DashboardShell /></RequireAuth>}>
        <Route index element={<WorkflowNewPage />} />
      </Route>
      <Route path="/pending_approval" element={<RequireAuth><DashboardShell /></RequireAuth>}>
        <Route index element={<WorkflowNewPage />} />
      </Route>
      <Route path="/transaction-error-details" element={<RequireAuth><DashboardShell /></RequireAuth>}>
        <Route index element={<CustomerSupportPage />} />
      </Route>

      <Route path="*" element={<Navigate to={routes.login} replace />} />
    </Routes>
  )
}

export default App




