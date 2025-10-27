import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { api } from '../../lib/api';

const LocationSelector = ({ 
  selectedCountry, 
  selectedState, 
  selectedCity, 
  onCountryChange, 
  onStateChange, 
  onCityChange, 
  disabled = false,
  required = false,
  className = "",
  showLabels = true 
}) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({
    countries: false,
    states: false,
    cities: false
  });

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry);
      // Reset state and city when country changes
      if (onStateChange) onStateChange('');
      if (onCityChange) onCityChange('');
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState);
      // Reset city when state changes
      if (onCityChange) onCityChange('');
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const fetchCountries = async () => {
    try {
      setLoading(prev => ({ ...prev, countries: true }));
      const response = await api.get('/locations/countries');
      if (response.data.success) {
        setCountries(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(prev => ({ ...prev, countries: false }));
    }
  };

  const fetchStates = async (countryId) => {
    try {
      setLoading(prev => ({ ...prev, states: true }));
      const response = await api.get(`/locations/countries/${countryId}/states`);
      if (response.data.success) {
        setStates(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setLoading(prev => ({ ...prev, states: false }));
    }
  };

  const fetchCities = async (stateId) => {
    try {
      setLoading(prev => ({ ...prev, cities: true }));
      const response = await api.get(`/locations/states/${stateId}/cities`);
      if (response.data.success) {
        setCities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setLoading(prev => ({ ...prev, cities: false }));
    }
  };

  return (
    <div className={className}>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            {showLabels && (
              <Form.Label>
                Country {required && <span className="text-danger">*</span>}
              </Form.Label>
            )}
            <Form.Select
              value={selectedCountry || ''}
              onChange={(e) => onCountryChange && onCountryChange(e.target.value)}
              disabled={disabled || loading.countries}
              required={required}
            >
              <option value="">
                {loading.countries ? 'Loading countries...' : 'Select Country'}
              </option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name} ({country.code})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            {showLabels && (
              <Form.Label>
                State/Province {required && <span className="text-danger">*</span>}
              </Form.Label>
            )}
            <Form.Select
              value={selectedState || ''}
              onChange={(e) => onStateChange && onStateChange(e.target.value)}
              disabled={disabled || loading.states || !selectedCountry}
              required={required}
            >
              <option value="">
                {loading.states ? 'Loading states...' : 'Select State/Province'}
              </option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name} {state.code && `(${state.code})`}
                </option>
              ))}
            </Form.Select>
            {loading.states && (
              <div className="d-flex align-items-center mt-1">
                <Spinner size="sm" className="me-2" />
                <small className="text-muted">Loading states...</small>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            {showLabels && (
              <Form.Label>
                City {required && <span className="text-danger">*</span>}
              </Form.Label>
            )}
            <Form.Select
              value={selectedCity || ''}
              onChange={(e) => onCityChange && onCityChange(e.target.value)}
              disabled={disabled || loading.cities || !selectedState}
              required={required}
            >
              <option value="">
                {loading.cities ? 'Loading cities...' : 'Select City'}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </Form.Select>
            {loading.cities && (
              <div className="d-flex align-items-center mt-1">
                <Spinner size="sm" className="me-2" />
                <small className="text-muted">Loading cities...</small>
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default LocationSelector;