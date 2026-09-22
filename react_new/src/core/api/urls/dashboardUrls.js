/**
 * From Flutter:
 * - lib/network/url/dashboard_url.dart
 * - row2 metrics: faq/cproduct/csubproduct/offer (dataurl)
 * - recent_activity_url.dart, transaction_datasource (txnMetrics)
 */
export const dashboardUrls = {
  accessControl: 'bo-menu/access',
  loginCount: 'login/count',
  uniqueLogins: 'login/unique-logins',
  kycCount: 'kyc/count?categoryCode=EKYCPOST',
  onboardingCount: 'onboarding/onboarding-counts',
  pendingRequestCount: 'pending-request/workflow/count',
  finNonFinCount: 'transfer/fin-nonFinCount',
  ibBillPaymentCount: 'biller/bill/count',
  ibLoginCountStat: 'login/count/unit',
  ibBillPaymentCountUri: 'biller/bill/count',
  functionalitySuccessCountUri: 'transfer/functionList',
  topFiveTransactionsUri: 'transfer/topFiveTransactions',
  topFiveTransactions: 'transfer/topFiveTransactions',
  unitWiseIbLoginStatUri: 'transfer/fin-nonFinCount/',
  userBehaviour: 'login/count/hour-wise',
  ibUnitWiseLoginCount: 'login/count/unit',
  featureList: 'features/list',
  problemsraisedcount: 'issue/count',
  appUserCount: 'login/user-count',
  topFailureTransactions: 'transfer/topFailureTransactions',
  liveUsersCount: 'login/count/hour-wise',
  transferViewCount: 'transfer/viewCount',
  /** Flutter DashboardUrl.loginAuditGraph / loginAuditRecentLogs */
  loginAuditGraph: 'dashboard/graph',
  loginAuditRecentLogs: 'dashboard/recent-auditlogs',
  /** Flutter transaction_datasource — baseUrl (bo) */
  txnMetrics: 'transfer/txnMetrics',
  /** Flutter RecentActivityUrl.getActivityLog — baseUrl (bo) */
  recentActivity: 'recent-activity/Activity-Log',
  /** Flutter Row2Metrics — dataurl hosts */
  faqGetAll: 'faq/getAll',
  productGetAll: 'cproduct/getAll',
  subProductGetAll: 'csubproduct/getAll',
  offerGetAll: 'offer/getAll',
  /**
   * Flutter PendingApprovalUrls.subProductCount + baseUrlWFC → …/workflow-insurance/graphql
   * Flutter also has root gateway const graphql = 'https://…:8444/graphql' (graphqlDio).
   */
  graphql: 'graphql',
}

export default dashboardUrls
