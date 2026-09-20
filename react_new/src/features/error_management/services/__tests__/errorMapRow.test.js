import { describe, it, expect } from 'vitest'
import service, { mapErrorRow } from '../error_managementService'

describe('error_managementService mapRow', () => {
  it('maps Flutter error-config fields and SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('error-config/getAll')
    expect(service.urls.create).toBe('error-config/add')
    expect(service.urls.update).toBe('error-config/update')
    expect(service.urls.delete).toBe('error-config/delete')
    const mapped = mapErrorRow({
      txnId: 7,
      mwErrCode: 'E001',
      ocsErrCode: 'O001',
      errDesc: 'Boom',
      mwErrDesc: 'MW boom',
      title: 'Title',
      provider: 'CORE',
      channelId: 'BO,MB',
      lang: 'en',
      serviceType: 'TRANSFER',
      status: 'Y',
    })
    expect(mapped.id).toBe('7')
    expect(mapped.mwErrCode).toBe('E001')
    expect(mapped.ocsErrCode).toBe('O001')
    expect(mapped.errDesc).toBe('Boom')
    expect(mapped.channelId).toBe('BO,MB')
  })
})
