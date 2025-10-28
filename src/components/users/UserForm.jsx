'use client'
import React, { useState, useEffect } from 'react'
import { apiGet } from '@/lib/api'
import useLocationData from '@/hooks/useLocationData'
import { useLanguage } from '@/contexts/LanguageContext'

const UserForm = ({ initialData = {}, onSubmit, includePassword = false, excludeId = null, roles = [] }) => {
    const { lang } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [usernameChecking, setUsernameChecking] = useState(false)
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        username: '',
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

    useEffect(() => {
        if (initialData && Object.keys(initialData).length) {
            // avoid merging roles into formData (roles should be passed via roles prop)
            const data = { ...initialData }
            if (data.roles) delete data.roles
            setFormData(prev => ({ ...prev, ...data }))
        }
    }, [initialData])

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

    const validateForm = () => {
        const newErrors = {}

        if (!formData.username || !formData.username.trim()) {
            newErrors.username = 'Username is required'
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers and underscores'
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters long'
        }

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (includePassword) {
            if (!formData.password) newErrors.password = 'Password is required'
            else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long'
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
        }

        if (!formData.userRole) newErrors.userRole = 'User role is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const checkUsernameUnique = async (username) => {
        if (!username) return true
        // If excludeId provided, pass to API so backend can ignore current user
        setUsernameChecking(true)
        try {
            const qs = new URLSearchParams({ username, ...(excludeId ? { excludeId } : {}) }).toString()
            const res = await apiGet(`/api/users/check-username?${qs}`)
            if (res && res.success && res.data && typeof res.data.exists !== 'undefined') {
                return !res.data.exists
            }
            if (res && typeof res.exists !== 'undefined') return !res.exists
        } catch (err) {
            console.error('Username uniqueness check failed:', err)
        } finally {
            setUsernameChecking(false)
        }
        // Treat as unique if endpoint fails
        return true
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleLocationChangeLocal = (type, value) => {
        if (type === 'country') {
            setFormData(prev => ({ ...prev, countryId: value, stateId: '', cityId: '' }))
            handleCountryChange(value)
        } else if (type === 'state') {
            setFormData(prev => ({ ...prev, stateId: value, cityId: '' }))
            handleStateChange(value)
        } else if (type === 'city') {
            setFormData(prev => ({ ...prev, cityId: value }))
        }
    }

    const handleUsernameBlur = async () => {
        if (!formData.username) return
        const isUnique = await checkUsernameUnique(formData.username)
        if (!isUnique) setErrors(prev => ({ ...prev, username: 'Username is already taken' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return
        const unique = await checkUsernameUnique(formData.username)
        if (!unique) {
            setErrors(prev => ({ ...prev, username: 'Username is already taken' }))
            return
        }

        setLoading(true)
        try {
            const submitData = {
                ...formData,
                countryId: formData.countryId || null,
                stateId: formData.stateId || null,
                cityId: formData.cityId || null
            }
            // remove confirmPassword if present
            delete submitData.confirmPassword
            await onSubmit(submitData)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Combined User Info Card: Personal, Account, Address */}
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            {/* Personal Information (sub-section) */}
                            <div className="mb-4">
                                <h6 className="mb-3">{lang('usersView.personalInformation')}</h6>
                                <div className="row">
                                    <div className="col-md-3 mb-3">
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
                                    <div className="col-md-3 mb-3">
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
                                    <div className="col-md-3 mb-3">
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
                                    <div className="col-md-3 mb-3">
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

                            {/* Account Information (sub-section) */}
                            <div className="mb-4">
                                <h6 className="mb-3">{lang('usersView.accountInformation')}</h6>
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">{lang('usersView.username')} <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            onBlur={handleUsernameBlur}
                                            placeholder={lang('placeholders.enterusername')}
                                            autoComplete="off"
                                        />
                                        {usernameChecking && <div className="form-text">Checking availability...</div>}
                                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                    </div>
                                    {includePassword && (
                                        <>
                                            <div className="col-md-3 mb-3">
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
                                            <div className="col-md-3 mb-3">
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
                                        </>
                                    )}

                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">{lang('usersView.userRole')} <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-select ${errors.userRole ? 'is-invalid' : ''}`}
                                            name="userRole"
                                            value={formData.userRole}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">{lang('common.selectRole')}</option>
                                            {roles && roles.map(role => (
                                                <option key={role.id} value={role.id}>{role.name.charAt(0).toUpperCase() + role.name.slice(1)}</option>
                                            ))}
                                        </select>
                                        {errors.userRole && <div className="invalid-feedback">{errors.userRole}</div>}
                                    </div>
                                    <div className="col-md-3 mb-3">
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

                            {/* Address Information (sub-section) */}
                            <div>
                                <h6 className="mb-3">{lang('usersView.addressInformation')}</h6>
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
                                            onChange={(e) => handleLocationChangeLocal('country', e.target.value)}
                                            disabled={loadingCountries}
                                        >
                                            <option value="">{lang('common.selectCountry')}</option>
                                            {countries.map(country => (
                                                <option key={country.id} value={country.id}>{country.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">{lang('common.state')}</label>
                                        <select
                                            className="form-select"
                                            value={formData.stateId}
                                            onChange={(e) => handleLocationChangeLocal('state', e.target.value)}
                                            disabled={loadingStates || !formData.countryId}
                                        >
                                            <option value="">{lang('common.selectState')}</option>
                                            {states.map(state => (
                                                <option key={state.id} value={state.id}>{state.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">{lang('common.city')}</label>
                                        <select
                                            className="form-select"
                                            value={formData.cityId}
                                            onChange={(e) => handleLocationChangeLocal('city', e.target.value)}
                                            disabled={loadingCities || !formData.stateId}
                                        >
                                            <option value="">{lang('common.selectCity')}</option>
                                            {cities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
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

                            {/* Form Actions */}
                            <div className="card-footer d-flex justify-content-end col-md-12" style={{ paddingBottom: '0' }}>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                {includePassword ? 'Creating...' : 'Saving...'}
                                            </>
                                        ) : (
                                            includePassword ? lang('usersView.CreateUser') : 'Save'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </form>
    )
}

export default UserForm
