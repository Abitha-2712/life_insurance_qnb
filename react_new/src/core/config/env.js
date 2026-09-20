/**
 * Runtime API bases — default to Vite proxy paths (dev).
 * Flutter sources: dataurl / baseUrl in lib/network/url/base_url.dart
 */
export const env = {
  dataApiBase: (import.meta.env.VITE_DATA_API || '/data-api').replace(/\/$/, ''),
  boApiBase: (import.meta.env.VITE_BO_API || '/bo-api').replace(/\/$/, ''),
  wfcApiBase: (import.meta.env.VITE_WFC_API || '/wfc-api').replace(/\/$/, ''),
  /** Flutter `const graphql = 'https://…:8444/graphql'` (graphqlDio) — not under WFC path. */
  graphqlApiBase: (import.meta.env.VITE_GRAPHQL_API || '/graphql-api').replace(/\/$/, ''),
  /** Login audit: http://…:8443/backoffice-service */
  serviceApiBase: (import.meta.env.VITE_SERVICE_API || '/service-api').replace(/\/$/, ''),
  channelName: 'Internet Banking',
  appId: 'BO',
  domainId: 'BO',
  categoryName: 'Login',
}


export default env
