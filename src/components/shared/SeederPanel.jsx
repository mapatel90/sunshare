'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function SeederPanel() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [options, setOptions] = useState({
    clear: false,
    users: true,
    projects: true,
    tasks: true,
    customers: true
  });

  // Fetch seeder status on component mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/seed');
      const result = await response.json();
      if (result.success) {
        setStatus(result.status);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      const result = await response.json();
      
      if (result.success) {
        await Swal.fire({
          title: 'Success!',
          text: result.message || 'Database seeded successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        fetchStatus(); // Refresh status
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSpecificSeed = async (seederName) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seeder: seederName, clear: options.clear })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await Swal.fire({
          title: 'Success!',
          text: result.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        fetchStatus(); // Refresh status
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Database Seeder</h5>
          </div>
          <div className="card-body">
            <p className="text-muted mb-4">
              આ panel તમને database માં sample data add કરવામાં મદદ કરશે.
            </p>
            
            <div className="mb-4">
              <h6>Seeding Options:</h6>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="clearData"
                  checked={options.clear}
                  onChange={() => handleOptionChange('clear')}
                />
                <label className="form-check-label" htmlFor="clearData">
                  Clear existing data first
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="seedUsers"
                  checked={options.users}
                  onChange={() => handleOptionChange('users')}
                />
                <label className="form-check-label" htmlFor="seedUsers">
                  Seed Users (7 sample users)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="seedProjects"
                  checked={options.projects}
                  onChange={() => handleOptionChange('projects')}
                />
                <label className="form-check-label" htmlFor="seedProjects">
                  Seed Projects (6 sample projects)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="seedTasks"
                  checked={options.tasks}
                  onChange={() => handleOptionChange('tasks')}
                />
                <label className="form-check-label" htmlFor="seedTasks">
                  Seed Tasks (8 sample tasks)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="seedCustomers"
                  checked={options.customers}
                  onChange={() => handleOptionChange('customers')}
                />
                <label className="form-check-label" htmlFor="seedCustomers">
                  Seed Customers (5 sample customers)
                </label>
              </div>
            </div>

            <div className="alert alert-info">
              <h6>Sample Login Credentials:</h6>
              <ul className="mb-0">
                <li><strong>Admin:</strong> admin@sunshare.com / admin123</li>
                <li><strong>User:</strong> john@example.com / password123</li>
              </ul>
            </div>

            <button
              className="btn btn-primary me-2"
              onClick={handleSeed}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Seeding...
                </>
              ) : (
                'Run All Seeders'
              )}
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={fetchStatus}
              disabled={loading}
            >
              Refresh Status
            </button>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Individual Seeders</h5>
          </div>
          <div className="card-body">
            <p className="text-muted mb-3">Run specific seeders:</p>
            
            <div className="d-grid gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleSpecificSeed('users')}
                disabled={loading}
              >
                Seed Users Only
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleSpecificSeed('projects')}
                disabled={loading}
              >
                Seed Projects Only
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleSpecificSeed('tasks')}
                disabled={loading}
              >
                Seed Tasks Only
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleSpecificSeed('customers')}
                disabled={loading}
              >
                Seed Customers Only
              </button>
            </div>
          </div>
        </div>

        {status && (
          <div className="card mt-3">
            <div className="card-header">
              <h5 className="card-title mb-0">Current Status</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-2">
                  <div className="border rounded p-2">
                    <h6 className="mb-1">{status.users || 0}</h6>
                    <small className="text-muted">Users</small>
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <div className="border rounded p-2">
                    <h6 className="mb-1">{status.projects || 0}</h6>
                    <small className="text-muted">Projects</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-2">
                    <h6 className="mb-1">{status.tasks || 0}</h6>
                    <small className="text-muted">Tasks</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-2">
                    <h6 className="mb-1">{status.customers || 0}</h6>
                    <small className="text-muted">Customers</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
