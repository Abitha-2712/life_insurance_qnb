import { useCallback, useEffect, useRef, useState } from 'react'
import { isApiSuccess } from '@/core/api/client'

export function useCrudList(service) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const serviceRef = useRef(service)
  serviceRef.current = service

  const softFetch = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await serviceRef.current.fetchAll()
      if (!isApiSuccess(res)) throw new Error('Fetch failed')
      setRows(res.data || [])
    } catch (err) {
      setError(err?.message || 'Fetch failed')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await serviceRef.current.fetchAll()
        if (cancelled) return
        if (!isApiSuccess(res)) throw new Error('Fetch failed')
        setRows(res.data || [])
      } catch (err) {
        if (cancelled) return
        setError(err?.message || 'Fetch failed')
        setRows([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const upsert = useCallback(
    async (payload) => {
      const res = await serviceRef.current.save(payload)
      if (!isApiSuccess(res)) throw new Error('Save failed')
      await softFetch()
    },
    [softFetch],
  )

  const remove = useCallback(
    async (id, row) => {
      const res = await serviceRef.current.remove(id, row)
      if (!isApiSuccess(res)) throw new Error('Delete failed')
      await softFetch()
    },
    [softFetch],
  )

  return { rows, setRows, loading, error, softFetch, reload: softFetch, upsert, remove }
}

export default useCrudList
