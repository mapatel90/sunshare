'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiPost, apiGet } from '@/lib/api'
import useLocationData from '@/hooks/useLocationData'
import Swal from 'sweetalert2'
import { useLanguage } from '@/contexts/LanguageContext'

const UsersCreateForm = () => {
  const router = useRouter()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    userRole: '',
    address1: '',
    address2: '',
    countryId: '',
    stateId: '',
    cityId: '',
    zipcode: '',
    status: '1'
  })
  const [errors, setErrors] = useState({})
  const [roles, setRoles] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(false)

  const params = { status: 1 };   // e.g. 1

  const queryString = new URLSearchParams(params).toString();

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

  // Load active roles for the User Role dropdown
  useEffect(() => {
    let mounted = true
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

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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

      // Remove confirmPassword from submit data
      delete submitData.confirmPassword

      const response = await apiPost('/api/users', submitData)

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User created successfully',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          router.push('/admin/users/list')
        })
      }
    } catch (error) {
      console.error('Error creating user:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to create user'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* Personal Information */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="card-title mb-0">{lang('usersView.personalInformation')}</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">{lang('usersView.firstName')} <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={lang('placeholders.enterfirstname')}
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">{lang('usersView.lastName')} <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={lang('placeholders.enterlastname')}
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">{lang('authentication.email')} <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={lang('placeholders.enteremail')}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">{lang('usersView.phonenumber')}</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder={lang('placeholders.enterphonenumber')}
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
              <h6 className="card-title mb-0">{lang('usersView.accountInformation')}</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">{lang('authentication.password')} <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={lang('placeholders.enterpassword')}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">{lang('authentication.confirmPassword')} <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder={lang('placeholders.confirmPassword')}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">{lang('usersView.userRole')} <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${errors.userRole ? 'is-invalid' : ''}`}
                    name="userRole"
                    value={formData.userRole}
                    onChange={handleInputChange}
                    disabled={loadingRoles}
                  >
                    <option value="">{lang('common.selectRole')}</option>
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
                  <label className="form-label">{lang('common.status')}</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="1">{lang('common.active')}</option>
                    <option value="0">{lang('common.inactive')}</option>
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
              <h6 className="card-title mb-0">{lang('usersView.addressInformation')}</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">{lang('usersView.address1')}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    placeholder={lang('placeholders.enteraddress1')}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">{lang('usersView.address2')}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    placeholder={lang('placeholders.enteraddress2')}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">{lang('common.country')}</label>
                  <select
                    className="form-select"
                    value={formData.countryId}
                    onChange={(e) => handleLocationChange('country', e.target.value)}
                    disabled={loadingCountries}
                  >
                    <option value="">{lang('common.selectCountry')}</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">{lang('common.state')}</label>
                  <select
                    className="form-select"
                    value={formData.stateId}
                    onChange={(e) => handleLocationChange('state', e.target.value)}
                    disabled={loadingStates || !formData.countryId}
                  >
                    <option value="">{lang('common.selectState')}</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">{lang('common.city')}</label>
                  <select
                    className="form-select"
                    value={formData.cityId}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                    disabled={loadingCities || !formData.stateId}
                  >
                    <option value="">{lang('common.selectCity')}</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">{lang('common.zip')}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    placeholder={lang('placeholders.enterzipcode')}
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
                  Creating...
                </>
              ) : (
                lang('usersView.CreateUser')
                )}
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => router.push('/admin/users/list')}
              disabled={loading}
            >
              {lang('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default UsersCreateForm