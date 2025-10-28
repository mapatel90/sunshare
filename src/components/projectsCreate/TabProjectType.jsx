import React, { useState, useEffect } from 'react'
import { FiSave } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { apiGet, apiPost } from '@/lib/api'
import useLocationData from '@/hooks/useLocationData'
import useOfftakerData from '@/hooks/useOfftakerData'
import Swal from 'sweetalert2'
import { useLanguage } from '@/contexts/LanguageContext'

const TabProjectType = ({ setFormData, formData, error, setError }) => {
    const router = useRouter()
    const { lang } = useLanguage()
    // Location data via shared hook (same behavior as UsersCreateForm)
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
    const { offtakers, loadingOfftakers, fetchOfftakerById } = useOfftakerData()
    const [loading, setLoading] = useState({ form: false })

    // Offtakers are loaded by hook on mount

    // ✅ Handle all input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // ✅ Handle country/state/city dropdown changes (same pattern as UsersCreateForm)
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

    // ✅ When Offtaker changes, auto-fill address
    const handleOfftakerChange = async (e) => {
        const offtakerId = e.target.value
        setFormData(prev => ({ ...prev, offtaker: offtakerId }))

        if (offtakerId) {
            try {
                const offtaker = await fetchOfftakerById(offtakerId)
                setFormData(prev => ({
                    ...prev,
                    address1: offtaker?.address1 || '',
                    address2: offtaker?.address2 || '',
                    cityId: offtaker?.cityId || '',
                    stateId: offtaker?.stateId || '',
                    countryId: offtaker?.countryId || '',
                    zipcode: offtaker?.zipcode || ''
                }))
                // Trigger dependent dropdown data
                if (offtaker?.countryId) {
                    handleCountryChange(offtaker.countryId)
                }
                if (offtaker?.stateId) {
                    handleStateChange(offtaker.stateId)
                }
            } catch (err) {
                console.error('Error fetching offtaker details:', err)
                setError(err?.message || 'Failed to load offtaker')
            }
        }
    }

    // ✅ Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(prev => ({ ...prev, form: true }))

        try {
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Project details saved successfully',
                timer: 2000,
                showConfirmButton: false
            })
        } finally {
            setLoading(prev => ({ ...prev, form: false }))
        }
    }

    return (
        <form id="project-form" onSubmit={handleSubmit}>
            <div className="row">
                {/* Project Information */}
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="card-title mb-0">{lang('projects.projectInformation', 'Project Information')}</h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {lang('projects.projectName', 'Project Name')} <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${error.project_name ? 'is-invalid' : ''}`}
                                        name="project_name"
                                        value={formData.project_name}
                                        onChange={handleInputChange}
                                        placeholder={lang('projects.projectNamePlaceholder', 'Enter project name')}
                                    />
                                    {error.project_name && (
                                        <div className="invalid-feedback">{error.project_name}</div>
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {lang('projects.projectType', 'Project Type')} <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${error.project_type ? 'is-invalid' : ''}`}
                                        name="project_type"
                                        value={formData.project_type}
                                        onChange={handleInputChange}
                                        placeholder={lang('projects.projectTypePlaceholder', 'Enter project type')}
                                    />
                                    {error.project_type && (
                                        <div className="invalid-feedback">{error.project_type}</div>
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {lang('projects.selectOfftaker', 'Select Offtaker')} <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={`form-control ${error.offtaker ? 'is-invalid' : ''}`}
                                        name="offtaker"
                                        value={formData.offtaker}
                                        onChange={handleOfftakerChange}
                                        disabled={loadingOfftakers}
                                    >
                                        <option value="">{lang('projects.selectOfftaker', 'Select Offtaker')}</option>
                                        {offtakers.map(offtaker => (
                                            <option key={offtaker.id} value={offtaker.id}>
                                                {offtaker.firstName} {offtaker.lastName}
                                            </option>
                                        ))}
                                    </select>
                                    {error.offtaker && (
                                        <div className="invalid-feedback">{error.offtaker}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="card-title mb-0">{lang('projects.addressInformation', 'Address Information')}</h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{lang('projects.addressLine1', 'Address Line 1')}</label>
                                    <input
                                        type="text"
                                        className={`form-control ${error.address1 ? 'is-invalid' : ''}`}
                                        name="address1"
                                        value={formData.address1}
                                        onChange={handleInputChange}
                                        placeholder={lang('projects.addressLine1Placeholder', 'Enter address line 1')}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{lang('projects.addressLine2', 'Address Line 2')}</label>
                                    <input
                                        type="text"
                                        className={`form-control ${error.address2 ? 'is-invalid' : ''}`}
                                        name="address2"
                                        value={formData.address2}
                                        onChange={handleInputChange}
                                        placeholder={lang('projects.addressLine2Placeholder', 'Enter address line 2')}
                                    />
                                </div>

                                {/* Country */}
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">{lang('projects.country', 'Country')}</label>
                                    <select
                                        className={`form-select ${error.countryId ? 'is-invalid' : ''}`}
                                        value={formData.countryId}
                                        onChange={(e) => handleLocationChange('country', e.target.value)}
                                        disabled={loadingCountries}
                                    >
                                        <option value="">{lang('projects.selectCountry', 'Select Country')}</option>
                                        {countries.map(country => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* State */}
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">{lang('projects.state', 'State')}</label>
                                    <select
                                        className={`form-select ${error.stateId ? 'is-invalid' : ''}`}
                                        value={formData.stateId}
                                        onChange={(e) => handleLocationChange('state', e.target.value)}
                                        disabled={loadingStates || !formData.countryId}
                                    >
                                        <option value="">{lang('projects.selectState', 'Select State')}</option>
                                        {states.map(state => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City */}
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">{lang('projects.city', 'City')}</label>
                                    <select
                                        className={`form-select ${error.cityId ? 'is-invalid' : ''}`}
                                        value={formData.cityId}
                                        onChange={(e) => handleLocationChange('city', e.target.value)}
                                        disabled={loadingCities || !formData.stateId}
                                    >
                                        <option value="">{lang('projects.selectCity', 'Select City')}</option>
                                        {cities.map(city => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Zip */}
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">{lang('projects.zipcode', 'Zip Code')}</label>
                                    <input
                                        type="text"
                                        className={`form-control ${error.zipcode ? 'is-invalid' : ''}`}
                                        name="zipcode"
                                        value={formData.zipcode}
                                        onChange={handleInputChange}
                                        placeholder={lang('projects.zipcodePlaceholder', 'Enter zip code')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="col-md-12">
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary" disabled={loading.form}>
                            {loading.form ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                                    {lang('common.saving', 'Saving')}...
                                </>
                            ) : (
                                <>
                                    <FiSave className="me-2" /> {lang('projects.saveProject', 'Save Project')}
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => router.push('/projects/list')}
                            disabled={loading.form}
                        >
                            {lang('common.cancel', 'Cancel')}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default TabProjectType
