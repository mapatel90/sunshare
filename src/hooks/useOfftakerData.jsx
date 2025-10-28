'use client'
import { useState, useEffect } from 'react'
import { apiGet } from '@/lib/api'

const useOfftakerData = () => {
  const [offtakers, setOfftakers] = useState([])
  const [loadingOfftakers, setLoadingOfftakers] = useState(false)
  const [error, setError] = useState(null)

  const fetchOfftakers = async () => {
    try {
      setLoadingOfftakers(true)
      setError(null)
      // Use users endpoint filtered by role name "Offtaker"
      const response = await apiGet('/api/users?role=Offtaker&status=1&limit=1000')
      if (response.success) {
        // API returns { data: { users, pagination } }
        const list = response.data?.users ?? []
        setOfftakers(list)
      }
    } catch (err) {
      console.error('Error fetching offtakers:', err)
      setError(err.message)
      setOfftakers([])
    } finally {
      setLoadingOfftakers(false)
    }
  }

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
    fetchOfftakerById,
  }
}

export default useOfftakerData


