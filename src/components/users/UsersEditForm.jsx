'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiGet, apiPut } from '@/lib/api'
import useLocationData from '@/hooks/useLocationData'
import Swal from 'sweetalert2'

const UsersEditForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id')
  
  const [loading, setLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    userRole: '',
    address1: '',
    address2: '',
    countryId: '',
    stateId: '',
    cityId: '',
    zipcode: '',
    status: ''
  })
  const [errors, setErrors] = useState({})
  const [roles, setRoles] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(false)
  
  // Use location data hook
  const {
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    handleCountryChange,
    handleStateChange
  } = useLocationData()

  // Load user data
  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId])

  // Load active roles for the User Role dropdown
  useEffect(() => {
    let mounted = true
    const params = { status: 1 }
    const queryString = new URLSearchParams(params).toString()

    const fetchRoles = async () => {
      setLoadingRoles(true)
      try {
        const res = await apiGet(`/api/roles?${queryString}`)
        if (!mounted) return
        if (res && res.success && Array.isArray(res.data.roles)) {
          setRoles(res.data.roles)
        } else if (Array.isArray(res)) {
          // fallback in case api helper returns array directly
          setRoles(res)
        }
      } catch (err) {
        console.error('Error loading roles:', err)
      } finally {
        if (mounted) setLoadingRoles(false)
      }
    }

    fetchRoles()

    return () => { mounted = false }
  }, [])

  const fetchUser = async () => {
    try {
      setLoadingUser(true)
      const response = await apiGet(`/api/users/${userId}`)
      
      if (response.success) {
        const user = response.data
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          userRole: user.userRole?.toString() || '',
          address1: user.address1 || '',
          address2: user.address2 || '',
          countryId: user.countryId?.toString() || '',
          stateId: user.stateId?.toString() || '',
          cityId: user.cityId?.toString() || '',
          zipcode: user.zipcode || '',
          status: user.status?.toString() || ''
        })

        // Load location data if user has location info
        if (user.countryId) {
          handleCountryChange(user.countryId.toString())
        }
        if (user.stateId) {
          handleStateChange(user.stateId.toString())
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch user details'
      }).then(() => {
        router.push('/admin/users/list')
      })
    } finally {
      setLoadingUser(false)
    }
  }

  // Validation rules
  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.userRole) {
      newErrors.userRole = 'User role is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle location changes
  const handleLocationChange = (type, value) => {
    if (type === 'country') {
      setFormData(prev => ({
        ...prev,
        countryId: value,
        stateId: '',
        cityId: ''
      }))
      handleCountryChange(value)
    } else if (type === 'state') {
      setFormData(prev => ({
        ...prev,
        stateId: value,
        cityId: ''
      }))
      handleStateChange(value)
    } else if (type === 'city') {
      setFormData(prev => ({
        ...prev,
        cityId: value
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      const submitData = {
        ...formData,
        countryId: formData.countryId || null,
        stateId: formData.stateId || null,
        cityId: formData.cityId || null
      }

      const response = await apiPut(`/api/users/${userId}`, submitData)

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User updated successfully',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          router.push('/admin/users/list')
        })
      }
    } catch (error) {
      console.error('Error updating user:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update user'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingUser) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* Personal Information */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="card-title mb-0">Personal Information</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">Email Address <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="card-title mb-0">Account Information</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">User Role <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${errors.userRole ? 'is-invalid' : ''}`}
                    name="userRole"
                    value={formData.userRole}
                    onChange={handleInputChange}
                    disabled={loadingRoles}
                  >
                    <option value="">Select Role</option>
                    {loadingRoles ? (
                      <option value="">Loading roles...</option>
                    ) : (
                      roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name.charAt(0).toUpperCase() + role.name.slice(1)}</option>
                      ))
                    )}
                  </select>
                  {errors.userRole && <div className="invalid-feedback">{errors.userRole}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="0">Inactive</option>
                    <option value="1">Active</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="card-title mb-0">Address Information</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Address Line 1</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    placeholder="Enter address line 1"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Address Line 2</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    placeholder="Enter address line 2"
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Country</label>
                  <select
                    className="form-select"
                    value={formData.countryId}
                    onChange={(e) => handleLocationChange('country', e.target.value)}
                    disabled={loadingCountries}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">State</label>
                  <select
                    className="form-select"
                    value={formData.stateId}
                    onChange={(e) => handleLocationChange('state', e.target.value)}
                    disabled={loadingStates || !formData.countryId}
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">City</label>
                  <select
                    className="form-select"
                    value={formData.cityId}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                    disabled={loadingCities || !formData.stateId}
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    placeholder="Enter zip code"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="col-md-12">
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => router.push('/admin/users/list')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default UsersEditForm