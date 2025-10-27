import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Modal, Table, Alert, Spinner, Badge } from 'react-bootstrap';
import { api } from '../../lib/api';

const LocationManagement = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'country', 'state', 'city'
  const [formData, setFormData] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchLocationHierarchy();
  }, []);

  const fetchLocationHierarchy = async () => {
    try {
      setLoading(true);
      const response = await api.get('/locations/hierarchy');
      if (response.data.success) {
        setCountries(response.data.data);
      }
    } catch (error) {
      showAlert('Error fetching location data', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handleOpenModal = (type, parentData = null) => {
    setModalType(type);
    setFormData(parentData ? { parentId: parentData.id, parentName: parentData.name } : {});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let endpoint = '';
      let data = {};

      switch (modalType) {
        case 'country':
          endpoint = '/locations/countries';
          data = { name: formData.name, code: formData.code };
          break;
        case 'state':
          endpoint = '/locations/states';
          data = { name: formData.name, code: formData.code, countryId: formData.parentId };
          break;
        case 'city':
          endpoint = '/locations/cities';
          data = { name: formData.name, stateId: formData.parentId };
          break;
      }

      const response = await api.post(endpoint, data);
      
      if (response.data.success) {
        showAlert(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} created successfully!`, 'success');
        handleCloseModal();
        fetchLocationHierarchy();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error creating location';
      showAlert(message, 'danger');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" />
          <div className="mt-2">Loading location data...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Location Management</h4>
            <Button 
              variant="primary" 
              onClick={() => handleOpenModal('country')}
            >
              Add Country
            </Button>
          </div>
        </Col>
      </Row>

      {alert.show && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
          {alert.message}
        </Alert>
      )}

      <Row>
        <Col lg={4}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Countries</h6>
              <Badge bg="secondary">{countries.length}</Badge>
            </Card.Header>
            <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {countries.map((country) => (
                <div
                  key={country.id}
                  className={`p-2 mb-2 border rounded cursor-pointer ${
                    selectedCountry?.id === country.id ? 'bg-primary text-white' : 'bg-light'
                  }`}
                  onClick={() => {
                    setSelectedCountry(country);
                    setSelectedState(null);
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{country.name}</strong>
                      <br />
                      <small>Code: {country.code}</small>
                    </div>
                    <div>
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal('state', country);
                        }}
                      >
                        + State
                      </Button>
                    </div>
                  </div>
                  <div className="mt-1">
                    <Badge bg="info">{country.states?.length || 0} states</Badge>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                States {selectedCountry && `- ${selectedCountry.name}`}
              </h6>
              {selectedCountry && (
                <Badge bg="secondary">{selectedCountry.states?.length || 0}</Badge>
              )}
            </Card.Header>
            <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {!selectedCountry ? (
                <div className="text-center text-muted py-4">
                  Select a country to view states
                </div>
              ) : (
                selectedCountry.states?.map((state) => (
                  <div
                    key={state.id}
                    className={`p-2 mb-2 border rounded cursor-pointer ${
                      selectedState?.id === state.id ? 'bg-primary text-white' : 'bg-light'
                    }`}
                    onClick={() => setSelectedState(state)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{state.name}</strong>
                        {state.code && (
                          <>
                            <br />
                            <small>Code: {state.code}</small>
                          </>
                        )}
                      </div>
                      <div>
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal('city', state);
                          }}
                        >
                          + City
                        </Button>
                      </div>
                    </div>
                    <div className="mt-1">
                      <Badge bg="info">{state.cities?.length || 0} cities</Badge>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                Cities {selectedState && `- ${selectedState.name}`}
              </h6>
              {selectedState && (
                <Badge bg="secondary">{selectedState.cities?.length || 0}</Badge>
              )}
            </Card.Header>
            <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {!selectedState ? (
                <div className="text-center text-muted py-4">
                  Select a state to view cities
                </div>
              ) : (
                selectedState.cities?.map((city) => (
                  <div key={city.id} className="p-2 mb-2 border rounded bg-light">
                    <strong>{city.name}</strong>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Location Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add New {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            {formData.parentName && ` to ${formData.parentName}`}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
                placeholder={`Enter ${modalType} name`}
              />
            </Form.Group>

            {(modalType === 'country' || modalType === 'state') && (
              <Form.Group className="mb-3">
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={formData.code || ''}
                  onChange={handleInputChange}
                  placeholder={`Enter ${modalType} code (optional for states)`}
                  maxLength={modalType === 'country' ? 5 : 10}
                />
                <Form.Text className="text-muted">
                  {modalType === 'country' ? 'ISO country code (e.g., US, IN)' : 'State/Province code (optional)'}
                </Form.Text>
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default LocationManagement;