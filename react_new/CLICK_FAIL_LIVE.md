# Click SoftFetch failures — full left menu pass

Generated: 2026-09-20 09:12:50 IST
Unique failing endpoints: 49
Unique OK endpoints seen (never failed): 35

## Failures

| Host | Method | Path | HTTP | SoftFetch |
|---|---|---|---|---|
| bo | POST | `/backoffice-insurance/api/customer/details` | 401 | G-00001 |
| bo | POST | `/backoffice-insurance/api/v1/beneficiaries/view/cooling-pending` | 400 | - |
| bo | POST | `/backoffice-insurance/data-cleansing/getAll` | 401 | G-00001 |
| bo | POST | `/backoffice-insurance/e-statement/getAll` | 401 | G-00001 |
| bo | POST | `/backoffice-insurance/favorite/getAll` | 401 | G-00001 |
| bo | POST | `/backoffice-insurance/forceUpdate/summary` | 401 | G-00001 |
| bo | POST | `/backoffice-insurance/funnel/getAll` | 401 | G-00001 |
| bo | POST | `/backoffice-insurance/instant-finance/getAll` | 401 | G-00001 |
| bo | POST | `/backoffice-insurance/migration/table-list` | 401 | G-00001 |
| bo | POST | `/backoffice-insurance/profile-control/getAll` | 401 | G-00001 |
| bo | POST | `/backoffice-insurance/theme/config/fetch` | 401 | G-00001 |
| bo | POST | `/backoffice-insurance/txn/menus/entitlement` | 401 | G-00001 |
| bo | POST | `/backoffice-insurance/widget/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/afaq/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/api-call/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/athkar/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/banner/summary` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/branch-locator/getall` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/cheque-deposit/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/city-master/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/commonservice/public/screenId-dropdown` | 200 | 4800 |
| data | POST | `/backoffice-insurance/direct-remittance/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/direct-remittance-type/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/disclaimer/summary` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/domain/list` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/dynamic-screen/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/eipo-company/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/employment-master/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/error-config/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/finance-calculator/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/finance-offer/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/followus/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/formconfig/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/gateway/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/gateway_audit/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/imei-block/list` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/kiosk/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/language/summary` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/mccg/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/merchant/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/oci-user/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/onboarding-mgmt/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/password-config/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/push-notification/customer/subscriptionList` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/release/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/report-template/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/salary-advance/getAll` | 401 | G-00001 |
| data | POST | `/backoffice-insurance/third-party/get-all` | 401 | G-00001 |
| wfc | POST | `/workflow-insurance/backoffice-service/ip-block/list` | 401 | G-00001 |

## OK (proxied 200 without SoftFetch error code)

| Host | Method | Path |
|---|---|---|
| bo | POST | `/backoffice-insurance/api/default-config/getAll` |
| bo | POST | `/backoffice-insurance/api/otpControlConfig/getall` |
| bo | POST | `/backoffice-insurance/csubproduct/getAll` |
| bo | GET | `/backoffice-insurance/customerSeg/getSegmentList` |
| bo | POST | `/backoffice-insurance/dbconfig/getDbConfig` |
| bo | POST | `/backoffice-insurance/offer/getAll` |
| bo | POST | `/backoffice-insurance/profanity/getAll` |
| data | POST | `/backoffice-insurance/account-class/dropdown` |
| data | POST | `/backoffice-insurance/account-class/getall` |
| data | POST | `/backoffice-insurance/accountType/getAll` |
| data | POST | `/backoffice-insurance/atm/getAll` |
| data | POST | `/backoffice-insurance/bankDetails/getAll` |
| data | POST | `/backoffice-insurance/BoLookUp/list` |
| data | POST | `/backoffice-insurance/card-spend-category/getAll` |
| data | POST | `/backoffice-insurance/charity/getAll` |
| data | POST | `/backoffice-insurance/crm-service-type/get-all` |
| data | POST | `/backoffice-insurance/faq/getAll` |
| data | POST | `/backoffice-insurance/mfa/getall` |
| data | POST | `/backoffice-insurance/mq-config/getAll` |
| data | POST | `/backoffice-insurance/offer/getAll` |
| data | POST | `/backoffice-insurance/product-content/getAll` |
| data | POST | `/backoffice-insurance/story-management/get-all` |
| data | POST | `/backoffice-insurance/TransferControl/getAll` |
| data | POST | `/backoffice-insurance/txn/labels` |
| data | GET | `/backoffice-insurance/units/all` |
| wfc | POST | `/workflow-insurance/api/lookup/getAll` |
| wfc | POST | `/workflow-insurance/bko-domain/fetchAll` |
| wfc | POST | `/workflow-insurance/bko-grp/fetchAll` |
| wfc | POST | `/workflow-insurance/bko-grp/menu/access` |
| wfc | POST | `/workflow-insurance/bko-password-policy/fetchByCriteria` |
| wfc | POST | `/workflow-insurance/bko-product/fetchAll` |
| wfc | POST | `/workflow-insurance/bko-role/fetchAll` |
| wfc | POST | `/workflow-insurance/bko-rule/fetchAll` |
| wfc | POST | `/workflow-insurance/bko-subProduct/fetchByCriteria` |
| wfc | POST | `/workflow-insurance/lookup-feature/getAll` |
