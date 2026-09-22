import { describe, it, expect } from 'vitest'
import service from '@/features/FAQ_management/services/FAQ_managementService'
import { faqManagementUrls } from '@/core/api/urls/faq_managementUrls'

describe('FAQ_managementService.test', () => {
  it('uses CSV faq_managementUrls', () => {
    expect(service.urls.fetchAll).toBe(faqManagementUrls.getall)
    expect(service.urls.create).toBe(faqManagementUrls.save)
    expect(service.urls.update).toBe(faqManagementUrls.update)
    expect(service.urls.delete).toBe(faqManagementUrls.delete)
  })

  it('mapRow normalizes EN/AR question/answer and category', () => {
    const mapped = service.mapRow({
      faqId: 9,
      code: 'F9',
      englishLabel: 'What is IBAN?',
      arabicLabel: 'ما هو الآيبان؟',
      answerEn: 'International Bank Account Number',
      categoryCode: 'ACCOUNTS',
      seq: 3,
    })
    expect(mapped.id).toBe('9')
    expect(mapped.faqCode).toBe('F9')
    expect(mapped.question).toBe('What is IBAN?')
    expect(mapped.questionAr).toBe('ما هو الآيبان؟')
    expect(mapped.answer).toBe('International Bank Account Number')
    expect(mapped.category).toBe('ACCOUNTS')
    expect(mapped.sequence).toBe('3')
  })

  it('save/remove/fetchAll are functions', () => {
    expect(typeof service.save).toBe('function')
    expect(typeof service.remove).toBe('function')
    expect(typeof service.fetchAll).toBe('function')
  })
})
