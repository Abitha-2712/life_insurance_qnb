import { describe, it, expect } from 'vitest'
import service from '../cheque_bookService'

describe('cheque_bookService', () => {
  it('exposes Cheque Book Management endpoints', () => {
    expect(service.urls.fetchAll).toBe('cheque-book/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
