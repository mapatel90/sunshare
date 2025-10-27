'use client'
import { useState, useEffect } from 'react'
import { apiGet } from '@/lib/api'

const useLocationData = () => {
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [error, setError] = useState(null)

  // Fetch countries
  const fetchCountries = async () => {
    try {
      setLoadingCountries(true)
      setError(null)
      const response = await apiGet('/api/locations/countries')
      
      if (response.success) {
        setCountries(response.data)
      }
    } catch (err) {
      console.error('Error fetching countries:', err)
      setError(err.message)
    } finally {
      setLoadingCountries(false)
    }
  }

  // Fetch states by country ID
  const fetchStates = async (countryId) => {
    try {
      console.log('🏛️ Fetching states for country ID:', countryId)
      setLoadingStates(true)
      setError(null)
      const response = await apiGet(`/api/locations/countries/${countryId}/states`)
      
      console.log('🏛️ States API response:', response)
      if (response.success) {
        console.log('✅ States loaded:', response.data.length)
        setStates(response.data)
      } else {
        console.log('❌ States API failed:', response.message)
      }
    } catch (err) {
      console.error('❌ Error fetching states:', err)
      setError(err.message)
      setStates([])
    } finally {
      setLoadingStates(false)
    }
  }

  // Fetch cities by state ID
  const fetchCities = async (stateId) => {
    try {
      console.log('🏙️ Fetching cities for state ID:', stateId)
      setLoadingCities(true)
      setError(null)
      const response = await apiGet(`/api/locations/states/${stateId}/cities`)
      
      console.log('🏙️ Cities API response:', response)
      if (response.success) {
        console.log('✅ Cities loaded:', response.data.length)
        setCities(response.data)
      } else {
        console.log('❌ Cities API failed:', response.message)
      }
    } catch (err) {
      console.error('❌ Error fetching cities:', err)
      setError(err.message)
      setCities([])
    } finally {
      setLoadingCities(false)
    }
  }

  // Handle country change
  const handleCountryChange = (countryId) => {
    if (countryId) {
      setStates([])
      setCities([])
      fetchStates(countryId)
    } else {
      setStates([])
      setCities([])
    }
  }

  // Handle state change
  const handleStateChange = (stateId) => {
    if (stateId) {
      setCities([])
      fetchCities(stateId)
    } else {
      setCities([])
    }
  }

  // Load countries on mount
  useEffect(() => {
    fetchCountries()
  }, [])

  return {
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    error,
    fetchCountries,
    fetchStates,
    fetchCities,
    handleCountryChange,
    handleStateChange
  }
}

export default useLocationData;