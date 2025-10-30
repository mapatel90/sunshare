'use client'
import React, { useEffect, useState } from 'react'
import { FiSave } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { apiGet, apiPut } from '@/lib/api'
import useLocationData from '@/hooks/useLocationData'
import useOfftakerData from '@/hooks/useOfftakerData'
import Swal from 'sweetalert2'
import { showSuccessToast, showErrorToast } from '@/utils/topTost'
import { useLanguage } from '@/contexts/LanguageContext'
import InverterTab from './InverterTab';

const ProjectEditContent = ({ projectId }) => {
    const router = useRouter()
    const { lang } = useLanguage()
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

    const [loading, setLoading] = useState({ form: false, init: true })
    const [error, setError] = useState({})
    const [formData, setFormData] = useState({
        project_name: '',
        project_type: '',
        offtaker: '',
        address1: '',
        address2: '',
        countryId: '',
        stateId: '',
        cityId: '',
        zipcode: '',
        investorProfit: '',
        weshareprofite: '',
        status: ''
    })
    const steps = [
        { name: lang('projects.projectInformation', 'Project Information'), key: 'info' },
        { name: 'Inverter', key: 'inverter' }
    ];
    const [activeTab, setActiveTab] = useState('info');

    // Load existing project
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(prev => ({ ...prev, init: true }))
                const res = await apiGet(`/api/projects/${projectId}`)
                if (res?.success && res.data) {
                    const p = res.data
                    setFormData({
                        project_name: p.project_name || '',
                        project_type: p.project_type || '',
                        offtaker: String(p.offtaker_id || ''),
                        address1: p.address1 || '',
                        address2: p.address2 || '',
                        countryId: p.countryId || '',
                        stateId: p.stateId || '',
                        cityId: p.cityId || '',
                        zipcode: p.zipcode || '',
                        investorProfit: p.investor_profit || '',
                        weshareprofite: p.weshare_profit || '',
                        status: p.status === 1 ? 'active' : 'inactive'
                    })
                    if (p.countryId) handleCountryChange(p.countryId)
                    if (p.stateId) handleStateChange(p.stateId)
                }
            } catch (e) {
                console.error('Load project failed', e)
                showErrorToast(e.message || 'Failed to load project')
            } finally {
                setLoading(prev => ({ ...prev, init: false }))
            }
        }
        if (projectId) load()
    }, [projectId])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleLocationChange = (type, value) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        const requiredFields = ['project_name', 'project_type', 'offtaker', 'countryId', 'stateId', 'cityId']
        const errors = {}
        requiredFields.forEach(field => { if (!formData[field]) { errors[field] = lang('validation.required', 'Required') } })
        const numberRegex = /^[0-9]*\.?[0-9]*$/;
        if (formData.investorProfit && !numberRegex.test(formData.investorProfit)) {
            errors.investorProfit = lang('projects.onlynumbers', 'Only numbers are allowed (e.g. 1234.56)');
        }
        if (formData.weshareprofite && !numberRegex.test(formData.weshareprofite)) {
            errors.weshareprofite = lang('projects.onlynumbers', 'Only numbers are allowed (e.g. 1234.56)');
        }
        if (Object.keys(errors).length) { setError(errors); return }

        setLoading(prev => ({ ...prev, form: true }))
        try {
            const payload = {
                name: formData.project_name,
                type: formData.project_type,
                offtaker_id: Number(formData.offtaker),
                address1: formData.address1 || '',
                address2: formData.address2 || '',
                country_id: Number(formData.countryId),
                state_id: Number(formData.stateId),
                city_id: Number(formData.cityId),
                zipcode: formData.zipcode || '',
                investor_profit: formData.investorProfit || '0',
                weshare_profit: formData.weshareprofite || '0',
                status: formData.status === 'active' ? 1 : 0
            }
            const res = await apiPut(`/api/projects/${projectId}`, payload)
            if (res.success) {
                showSuccessToast(lang('projects.projectupdatedsuccessfully', 'Project updated successfully'))
                router.push('/admin/projects/list')
            } else {
                throw new Error(res.message || 'Update failed')
            }
        } catch (e) {
            console.error('Update project failed', e)
            showErrorToast(e.message || 'Failed to update project')
        } finally {
            setLoading(prev => ({ ...prev, form: false }))
        }
    }

    return (
        <div className="col-lg-12">
            <div className="card border-top-0">
                <div className="card-body p-0 wizard" id="project-edit-steps">
                    {/* Custom tab navigation (like create project) */}
                    <div className="steps clearfix">
                        <ul role="tablist" className="custom-steps">
                            {steps.map((step, i) => (
                                <li
                                    key={step.key}
                                    className={activeTab === step.key ? 'current' : ''}
                                    onClick={e => {
                                        e.preventDefault();
                                        setActiveTab(step.key);
                                    }}
                                >
                                    <a href="#" className="d-block fw-bold">{step.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="main-content">
                        {activeTab === 'info' && (
                            <form onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h6 className="card-title mb-0">{lang('projects.projectInformation', 'Project Information')}</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{lang('projects.projectName', 'Project Name')} <span className="text-danger">*</span></label>
                                                <input type="text" className={`form-control ${error.project_name ? 'is-invalid' : ''}`} name="project_name" value={formData.project_name} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{lang('projects.projectType', 'Project Type')} <span className="text-danger">*</span></label>
                                                <input type="text" className={`form-control ${error.project_type ? 'is-invalid' : ''}`} name="project_type" value={formData.project_type} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{lang('projects.selectOfftaker', 'Select Offtaker')} <span className="text-danger">*</span></label>
                                                <select className={`form-control ${error.offtaker ? 'is-invalid' : ''}`} name="offtaker" value={formData.offtaker} onChange={handleOfftakerChange} disabled={loadingOfftakers}>
                                                    <option value="">{lang('projects.selectOfftaker', 'Select Offtaker')}</option>
                                                    {offtakers.map(o => (
                                                        <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h6 className="card-title mb-0">{lang('projects.addressInformation', 'Address Information')}</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{lang('projects.addressLine1', 'Address Line 1')}</label>
                                                <input type="text" className={`form-control ${error.address1 ? 'is-invalid' : ''}`} name="address1" value={formData.address1} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{lang('projects.addressLine2', 'Address Line 2')}</label>
                                                <input type="text" className={`form-control ${error.address2 ? 'is-invalid' : ''}`} name="address2" value={formData.address2} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{lang('projects.country', 'Country')}</label>
                                                <select className={`form-select ${error.countryId ? 'is-invalid' : ''}`} value={formData.countryId} onChange={(e) => handleLocationChange('country', e.target.value)} disabled={loadingCountries}>
                                                    <option value="">{lang('projects.selectCountry', 'Select Country')}</option>
                                                    {countries.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                                </select>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{lang('projects.state', 'State')}</label>
                                                <select className={`form-select ${error.stateId ? 'is-invalid' : ''}`} value={formData.stateId} onChange={(e) => handleLocationChange('state', e.target.value)} disabled={loadingStates || !formData.countryId}>
                                                    <option value="">{lang('projects.selectState', 'Select State')}</option>
                                                    {states.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                                                </select>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{lang('projects.city', 'City')}</label>
                                                <select className={`form-select ${error.cityId ? 'is-invalid' : ''}`} value={formData.cityId} onChange={(e) => handleLocationChange('city', e.target.value)} disabled={loadingCities || !formData.stateId}>
                                                    <option value="">{lang('projects.selectCity', 'Select City')}</option>
                                                    {cities.map(ci => (<option key={ci.id} value={ci.id}>{ci.name}</option>))}
                                                </select>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{lang('projects.zipcode', 'Zip Code')}</label>
                                                <input type="text" className={`form-control ${error.zipcode ? 'is-invalid' : ''}`} name="zipcode" value={formData.zipcode} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{lang('projects.investorProfit', 'Investor Profit')} %</label>
                                                <input type="text" className={`form-control ${error.investorProfit ? 'is-invalid' : ''}`} name="investorProfit" value={formData.investorProfit} onChange={handleInputChange} />
                                                {error.investorProfit && (
                                                    <div className="invalid-feedback">{error.investorProfit}</div>
                                                )}
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{lang('projects.weshareprofite', 'Weshare profite')} %</label>
                                                <input type="text" className={`form-control ${error.weshareprofite ? 'is-invalid' : ''}`} name="weshareprofite" value={formData.weshareprofite} onChange={handleInputChange} />
                                                {error.weshareprofite && (
                                                    <div className="invalid-feedback">{error.weshareprofite}</div>
                                                )}
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{lang('projects.status', 'Status')}</label>
                                                <select className={`form-select ${error.status ? 'is-invalid' : ''}`} name="status" value={formData.status} onChange={handleInputChange}>
                                                    <option value="">{lang('projects.selectStatus', 'Select Status')}</option>
                                                    <option value="active">{lang('projects.active', 'Active')}</option>
                                                    <option value="inactive">{lang('projects.inactive', 'Inactive')}</option>
                                                </select>
                                            </div>
                                            {/* Actions inside Address Information */}
                                            <div className="col-12 mt-2 d-flex justify-content-end">
                                                <button type="submit" className="btn btn-primary" disabled={loading.form || loading.init}>
                                                    {loading.form ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                                                            {lang('common.saving', 'Saving')}...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiSave className="me-2" /> {lang('projects.updateProject', 'Update Project')}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                        {activeTab === 'inverter' && (
                            <InverterTab projectId={projectId} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectEditContent


