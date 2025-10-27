'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { apiGet } from '@/lib/api'
import { FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit3, FiUser, FiShield, FiActivity } from 'react-icons/fi'
import Link from 'next/link'
import Swal from 'sweetalert2'

// Role mapping
const roleMapping = {
  1: { label: 'Super Admin', color: 'danger', icon: <FiShield /> },
  2: { label: 'Admin', color: 'warning', icon: <FiUser /> },
  3: { label: 'User', color: 'primary', icon: <FiUser /> },
  4: { label: 'Moderator', color: 'info', icon: <FiUser /> }
}

// Status mapping
const statusMapping = {
  0: { label: 'Inactive', color: 'danger' },
  1: { label: 'Active', color: 'success' },
  2: { label: 'Suspended', color: 'warning' },
  3: { label: 'Banned', color: 'dark' }
}

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

const UsersViewDetails = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const userId = searchParams.get('id')
  
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchUser()
    } else {
      router.push('/admin/users')
    }
  }, [userId])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await apiGet(`/api/users/${userId}`)
      
      if (response.success) {
        setUser(response.data)
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
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <div className="text-center py-5">
        <h4>User not found</h4>
        <Link href="/admin/users/list" className="btn btn-primary mt-3">
          Back to Users
        </Link>
      </div>
    )
  }

  const role = roleMapping[user.userRole] || { label: 'Unknown', color: 'secondary', icon: <FiUser /> }
  const status = statusMapping[user.status] || { label: 'Unknown', color: 'secondary' }
  const fullName = `${user.firstName} ${user.lastName}`
  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`

  return (
    <div className="row">
      {/* User Profile Card */}
      <div className="col-xxl-4 col-xl-5">
        <div className="card stretch stretch-full">
          <div className="card-body">
            <div className="text-center">
              <div className="text-white avatar-text user-avatar-text avatar-xl mx-auto mb-3">
                {initials}
              </div>
              <div>
                <h5 className="mb-1">{fullName}</h5>
                <p className="fs-12 fw-normal text-muted mb-3">{user.email}</p>
                <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
                  <div className="d-flex align-items-center gap-1">
                    {role.icon}
                    <span className={`badge bg-soft-${role.color} text-${role.color}`}>
                      {role.label}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <FiActivity size={14} />
                    <span className={`badge bg-soft-${status.color} text-${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2 justify-content-center">
                  <Link
                    href={`/admin/users/edit?id=${user.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <FiEdit3 size={14} className="me-1" />
                    Edit User
                  </Link>
                  <a
                    href={`mailto:${user.email}`}
                    className="btn btn-light btn-sm"
                  >
                    <FiMail size={14} className="me-1" />
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card stretch stretch-full">
          <div className="card-header">
            <h6 className="card-title">Quick Stats</h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-6">
                <div className="p-3 border rounded text-center">
                  <h4 className="fs-18 fw-bold text-dark mb-1">0</h4>
                  <p className="fs-12 text-muted mb-0">Projects</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 border rounded text-center">
                  <h4 className="fs-18 fw-bold text-dark mb-1">0</h4>
                  <p className="fs-12 text-muted mb-0">Tasks</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 border rounded text-center">
                  <h4 className="fs-18 fw-bold text-dark mb-1">0</h4>
                  <p className="fs-12 text-muted mb-0">Comments</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 border rounded text-center">
                  <h4 className="fs-18 fw-bold text-dark mb-1">0</h4>
                  <p className="fs-12 text-muted mb-0">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="col-xxl-8 col-xl-7">
        <div className="card stretch stretch-full">
          <div className="card-header">
            <h6 className="card-title">User Information</h6>
          </div>
          <div className="card-body">
            <div className="row g-4">
              {/* Personal Information */}
              <div className="col-lg-6">
                <div className="border rounded p-3">
                  <h6 className="fw-bold mb-3">Personal Information</h6>
                  <div className="vstack gap-2">
                    <div className="hstack justify-content-between">
                      <span className="text-muted">First Name:</span>
                      <span className="fw-semibold">{user.firstName}</span>
                    </div>
                    <div className="hstack justify-content-between">
                      <span className="text-muted">Last Name:</span>
                      <span className="fw-semibold">{user.lastName}</span>
                    </div>
                    <div className="hstack justify-content-between">
                      <span className="text-muted">Email:</span>
                      <span className="fw-semibold">
                        <a href={`mailto:${user.email}`} className="text-decoration-none">
                          {user.email}
                        </a>
                      </span>
                    </div>
                    <div className="hstack justify-content-between">
                      <span className="text-muted">Phone:</span>
                      <span className="fw-semibold">
                        {user.phoneNumber ? (
                          <a href={`tel:${user.phoneNumber}`} className="text-decoration-none">
                            {user.phoneNumber}
                          </a>
                        ) : (
                          <span className="text-muted">Not provided</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="col-lg-6">
                <div className="border rounded p-3">
                  <h6 className="fw-bold mb-3">Account Information</h6>
                  <div className="vstack gap-2">
                    <div className="hstack justify-content-between">
                      <span className="text-muted">User ID:</span>
                      <span className="fw-semibold">#{user.id}</span>
                    </div>
                    <div className="hstack justify-content-between">
                      <span className="text-muted">Role:</span>
                      <span className={`badge bg-soft-${role.color} text-${role.color}`}>
                        {role.label}
                      </span>
                    </div>
                    <div className="hstack justify-content-between">
                      <span className="text-muted">Status:</span>
                      <span className={`badge bg-soft-${status.color} text-${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="hstack justify-content-between">
                      <span className="text-muted">Created:</span>
                      <span className="fw-semibold">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {(user.address1 || user.city || user.state || user.country) && (
                <div className="col-lg-12">
                  <div className="border rounded p-3">
                    <h6 className="fw-bold mb-3">
                      <FiMapPin className="me-2" />
                      Address Information
                    </h6>
                    <div className="row g-3">
                      {user.address1 && (
                        <div className="col-md-6">
                          <div className="hstack justify-content-between">
                            <span className="text-muted">Address 1:</span>
                            <span className="fw-semibold">{user.address1}</span>
                          </div>
                        </div>
                      )}
                      {user.address2 && (
                        <div className="col-md-6">
                          <div className="hstack justify-content-between">
                            <span className="text-muted">Address 2:</span>
                            <span className="fw-semibold">{user.address2}</span>
                          </div>
                        </div>
                      )}
                      {user.city && (
                        <div className="col-md-3">
                          <div className="hstack justify-content-between">
                            <span className="text-muted">City:</span>
                            <span className="fw-semibold">{user.city.name}</span>
                          </div>
                        </div>
                      )}
                      {user.state && (
                        <div className="col-md-3">
                          <div className="hstack justify-content-between">
                            <span className="text-muted">State:</span>
                            <span className="fw-semibold">{user.state.name}</span>
                          </div>
                        </div>
                      )}
                      {user.country && (
                        <div className="col-md-3">
                          <div className="hstack justify-content-between">
                            <span className="text-muted">Country:</span>
                            <span className="fw-semibold">{user.country.name}</span>
                          </div>
                        </div>
                      )}
                      {user.zipcode && (
                        <div className="col-md-3">
                          <div className="hstack justify-content-between">
                            <span className="text-muted">Zip Code:</span>
                            <span className="fw-semibold">{user.zipcode}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="col-lg-12">
                <div className="border rounded p-3">
                  <h6 className="fw-bold mb-3">
                    <FiCalendar className="me-2" />
                    Timeline
                  </h6>
                  <div className="vstack gap-2">
                    <div className="hstack justify-content-between">
                      <span className="text-muted">Account Created:</span>
                      <span className="fw-semibold">
                        {new Date(user.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="hstack justify-content-between">
                      <span className="text-muted">Last Updated:</span>
                      <span className="fw-semibold">
                        {new Date(user.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersViewDetails