import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiSave } from 'react-icons/fi';
import axios from 'axios';
import { apiPost, apiGet } from '@/lib/api'

const TabProjectType = ({ setFormData, formData, error, setError }) => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [offtakers, setOfftakers] = useState([]);
    const [loading, setLoading] = useState({
        countries: false,
        states: false,
        cities: false,
        offtakers: false
    });

    // Fetch countries on component mount
    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(prev => ({ ...prev, countries: true }));
            try {
                // Replace with your actual API endpoint
                const response = await apiGet('/api/countries');
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            } finally {
                setLoading(prev => ({ ...prev, countries: false }));
            }
        };

        const fetchOfftakers = async () => {
            setLoading(prev => ({ ...prev, offtakers: true }));
            try {
                // Replace with your actual API endpoint to get offtakers (users with role_id = 3)
                const response = await apiGet('/api/users/offtakers');
                setOfftakers(response.data);
            } catch (error) {
                console.error('Error fetching offtakers:', error);
            } finally {
                setLoading(prev => ({ ...prev, offtakers: false }));
            }
        };

        fetchCountries();
        fetchOfftakers();
    }, []);

    // Fetch states when country changes
    useEffect(() => {
        const fetchStates = async () => {
            if (formData.country) {
                setLoading(prev => ({ ...prev, states: true }));
                try {
                    // Replace with your actual API endpoint
                    const response = await apiGet(`/api/states?country_id=${formData.country}`);
                    setStates(response.data);
                } catch (error) {
                    console.error('Error fetching states:', error);
                } finally {
                    setLoading(prev => ({ ...prev, states: false }));
                }
            }
        };

        fetchStates();
    }, [formData.country]);

    // Fetch cities when state changes
    useEffect(() => {
        const fetchCities = async () => {
            if (formData.state) {
                setLoading(prev => ({ ...prev, cities: true }));
                try {
                    // Replace with your actual API endpoint
                    const response = await apiGet(`/api/cities?state_id=${formData.state}`);
                    setCities(response.data);
                } catch (error) {
                    console.error('Error fetching cities:', error);
                } finally {
                    setLoading(prev => ({ ...prev, cities: false }));
                }
            }
        };

        fetchCities();
    }, [formData.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOfftakerChange = async (e) => {
        const offtakerId = e.target.value;
        setFormData(prev => ({
            ...prev,
            offtaker: offtakerId
        }));

        if (offtakerId) {
            try {
                // Fetch offtaker details
                const response = await apiGet(`/api/users/${offtakerId}`);
                const offtakerData = response.data;

                // Update form with offtaker's address details
                setFormData(prev => ({
                    ...prev,
                    address1: offtakerData.address1 || '',
                    address2: offtakerData.address2 || '',
                    city: offtakerData.city_id || '',
                    state: offtakerData.state_id || '',
                    country: offtakerData.country_id || '',
                    zipcode: offtakerData.zipcode || ''
                }));

                // If state changes, it will trigger the cities fetch automatically
            } catch (error) {
                console.error('Error fetching offtaker details:', error);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Form submitted:', formData);
        // You can add validation and API call to save the project
    };

    return (
        <section className="step-body mt-4 body current">
            <form id="project-form" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="projectName" className="form-label">Project Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            id="projectName"
                            name="projectName"
                            value={formData.projectName || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="projectType" className="form-label">Project Type *</label>
                        <input
                            type="text"
                            className="form-control"
                            id="projectType"
                            name="projectType"
                            value={formData.projectType || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="col-md-12 mb-3">
                        <label htmlFor="offtaker" className="form-label">Offtaker *</label>
                        <select
                            className="form-select"
                            id="offtaker"
                            name="offtaker"
                            value={formData.offtaker || ''}
                            onChange={handleOfftakerChange}
                            required
                        >
                            <option value="">Select Offtaker</option>
                            {offtakers.map(offtaker => (
                                <option key={offtaker.id} value={offtaker.id}>
                                    {offtaker.name} ({offtaker.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-12 mb-3">
                        <label htmlFor="address1" className="form-label">Address 1 *</label>
                        <textarea
                            className="form-control"
                            id="address1"
                            name="address1"
                            rows="2"
                            value={formData.address1 || ''}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>

                    <div className="col-md-12 mb-3">
                        <label htmlFor="address2" className="form-label">Address 2</label>
                        <textarea
                            className="form-control"
                            id="address2"
                            name="address2"
                            rows="2"
                            value={formData.address2 || ''}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="country" className="form-label">Country *</label>
                        <select
                            className="form-select"
                            id="country"
                            name="country"
                            value={formData.country || ''}
                            onChange={handleInputChange}
                            required
                            disabled={loading.countries}
                        >
                            <option value="">Select Country</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="state" className="form-label">State *</label>
                        <select
                            className="form-select"
                            id="state"
                            name="state"
                            value={formData.state || ''}
                            onChange={handleInputChange}
                            required
                            disabled={!formData.country || loading.states}
                        >
                            <option value="">Select State</option>
                            {states.map(state => (
                                <option key={state.id} value={state.id}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="city" className="form-label">City *</label>
                        <select
                            className="form-select"
                            id="city"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleInputChange}
                            required
                            disabled={!formData.state || loading.cities}
                        >
                            <option value="">Select City</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="zipcode" className="form-label">Zipcode *</label>
                        <input
                            type="number"
                            className="form-control"
                            id="zipcode"
                            name="zipcode"
                            value={formData.zipcode || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="col-md-3 mb-3">
                        <label htmlFor="investorProfit" className="form-label">Investor Profit (%) *</label>
                        <input
                            type="number"
                            className="form-control"
                            id="investorProfit"
                            name="investorProfit"
                            value={formData.investorProfit || ''}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            max="100"
                            required
                        />
                    </div>

                    <div className="col-md-3 mb-3">
                        <label htmlFor="weshareProfit" className="form-label">Weshare Profit (%) *</label>
                        <input
                            type="number"
                            className="form-control"
                            id="weshareProfit"
                            name="weshareProfit"
                            value={formData.weshareProfit || ''}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            max="100"
                            required
                        />
                    </div>

                    <div className="col-md-3 mb-3">
                        <label htmlFor="status" className="form-label">Status *</label>
                        <select
                            className="form-select"
                            id="status"
                            name="status"
                            value={formData.status || 'active'}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="col-12 text-end mt-4">
                        <button type="submit" className="btn btn-primary">
                            <FiSave className="me-2" /> Save Project
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default TabProjectType;
export const ProjectTypeCard = ({ icon, title, description, id, isRequired, name, setFormData, formData, setError }) => {
    const handleOnChange = (e) => {
        const name = e.target.name
        const id = e.target.id
        let updatedType = { ...formData };

        if (name === "project-type") {
            updatedType = { ...updatedType, projectType: id };
            setError(false)
        }
        if (name === "project-manage") {
            updatedType = { ...updatedType, projectManage: id };
            setError(false)
        }
        if (name === "budget-spend") {
            updatedType = { ...updatedType, budgetsSpend: id };
            setError(false)
        }
        setFormData({ ...formData, ...updatedType });
    }

    const { projectType, projectManage, budgetsSpend } = formData
    return (
        <>

            <label className="w-100" htmlFor={id}>
                <input
                    className="card-input-element"
                    type="radio"
                    name={name}
                    id={id}
                    required={isRequired}
                    onClick={(e) => handleOnChange(e)}
                    defaultChecked={projectType === id || projectManage === id || budgetsSpend === id ? true : false}
                />
                <span className="card card-body d-flex flex-row justify-content-between align-items-center ">
                    <span className="hstack gap-3">
                        <span className="avatar-text">
                            {React.cloneElement(getIcon(icon), { size: "16", strokeWidth: "1.6" })}
                        </span>
                        <span>
                            <span className="d-block fs-13 fw-bold text-dark">{title}</span>
                            <span className="d-block text-muted mb-0" dangerouslySetInnerHTML={{ __html: description }} />
                        </span>
                    </span>
                </span>
            </label>
        </>
    )
}