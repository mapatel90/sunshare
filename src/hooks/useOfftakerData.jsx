'use client'
import { useState, useEffect } from 'react'
import { apiGet , apiPost } from '@/lib/api'

const useOfftakerData = () => {
  const [offtakers, setOfftakers] = useState([])
  const [loadingOfftakers, setLoadingOfftakers] = useState(false)
  const [error, setError] = useState(null)

  const fetchOfftakers = async () => {
    try {
      setLoadingOfftakers(true)
      setError(null)

      const payload = { user_role: 3 }

      const response = await apiPost('/api/users/GetUserByRole', payload)

      if (response.success) {
        const list = response.data ?? []
        setOfftakers(list)
      } else {
        setOfftakers([])
      }
    } catch (err) {
      console.error('Error fetching offtakers:', err)
      setError(err.message)
      setOfftakers([])
    } finally {
      setLoadingOfftakers(false)
    }
  }

  // fetchOfftakerById implementation (uncommented)
  const fetchOfftakerById = async (id) => {
    try {
      setError(null)
      const response = await apiGet(`/api/users/${id}`)
      if (response.success) {
        return response.data
      }
      return null
    } catch (err) {
      console.error('Error fetching offtaker details:', err)
      setError(err.message)
      return null
    }
  }

  useEffect(() => {
    fetchOfftakers()
  }, [])

  return {
    offtakers,
    loadingOfftakers,
    error,
    fetchOfftakers,
    fetchOfftakerById, // make available
  }
}

export default useOfftakerData