'use client'
import React, { memo, useEffect, useState } from 'react'
import Table from '@/components/shared/table/Table'
import { FiEdit3, FiEye, FiTrash2, FiMoreHorizontal, FiMail, FiPhone } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import Link from 'next/link'
import { apiGet, apiDelete } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

// Role mapping
const roleMapping = {
  1: { label: 'Super Admin', color: 'danger' },
  2: { label: 'Admin', color: 'warning' },
  3: { label: 'User', color: 'primary' },
  4: { label: 'Moderator', color: 'info' }
}

// Status mapping
const statusMapping = {
  0: { label: 'Inactive', color: 'danger' },
  1: { label: 'Active', color: 'success' },
  2: { label: 'Suspended', color: 'warning' },
  3: { label: 'Banned', color: 'dark' }
}

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

const UsersTable = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  })
  const router = useRouter()

  // Fetch users
  const fetchUsers = async (page = 1, search = '', role = '', status = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(role && { role }),
        ...(status !== '' && { status })
      })

      const response = await apiGet(`/api/users?${params.toString()}`)
      
      if (response.success) {
        console.log("All User::", response.data.users)
        setUsers(response.data.users)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch users'
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete user "${userName}". This action cannot be undone!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      })

      if (result.isConfirmed) {
        setLoading(true)
        await apiDelete(`/api/users/${userId}`)
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'User has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        })
        
        // Refresh the table
        await fetchUsers(pagination.page, filters.search, filters.role, filters.status)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete user'
      })
    } finally {
      setLoading(false)
    }
  }

  // Load users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Search handler
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }))
    fetchUsers(1, searchTerm, filters.role, filters.status)
  }

  // Filter handlers
  const handleRoleFilter = (role) => {
    setFilters(prev => ({ ...prev, role }))
    fetchUsers(1, filters.search, role, filters.status)
  }

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }))
    fetchUsers(1, filters.search, filters.role, status)
  }

  // Pagination handler
  const handlePageChange = (page) => {
    fetchUsers(page, filters.search, filters.role, filters.status)
  }

  const columns = [
    {
      accessorKey: 'id',
      header: ({ table }) => {
        const checkboxRef = React.useRef(null)

        useEffect(() => {
          if (checkboxRef.current) {
            checkboxRef.current.indeterminate = table.getIsSomeRowsSelected()
          }
        }, [table.getIsSomeRowsSelected()])

        return (
          <input
            type="checkbox"
            className="custom-table-checkbox"
            ref={checkboxRef}
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        )
      },
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="custom-table-checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      meta: {
        headerClassName: 'width-30'
      }
    },
    {
      accessorKey: 'user',
      header: () => 'User',
      cell: ({ row }) => {
        const user = row.original
        const fullName = `${user.firstName} ${user.lastName}` || 'N/A'
        const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`
        
        return (
          <div className="hstack gap-3">
            <div className="text-white avatar-text user-avatar-text avatar-md">
              {initials}
            </div>
            <div>
              <span className="text-truncate-1-line fw-bold">{fullName}</span>
              <div className="fs-12 text-muted">{user.email}</div>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'email',
      header: () => 'Email',
      cell: ({ row }) => (
        <a href={`mailto:${row.original.email}`} className="text-decoration-none">
          <FiMail size={14} className="me-2" />
          {row.original.email}
        </a>
      )
    },
    {
      accessorKey: 'phoneNumber',
      header: () => 'Phone',
      cell: ({ row }) => (
        row.original.phoneNumber ? (
          <a href={`tel:${row.original.phoneNumber}`} className="text-decoration-none">
            <FiPhone size={14} className="me-2" />
            {row.original.phoneNumber}
          </a>
        ) : (
          <span className="text-muted">-</span>
        )
      )
    },
    {
      accessorKey: 'userRole',
      header: () => 'Role',
      cell: ({ row }) => {
        const role = roleMapping[row.original.userRole] || { label: 'Unknown', color: 'secondary' }
        return (
          <span className={`badge bg-soft-${role.color} text-${role.color}`}>
            {role.label}
          </span>
        )
      }
    },
    {
      accessorKey: 'status',
      header: () => 'Status',
      cell: ({ row }) => {
        const status = statusMapping[row.original.status] || { label: 'Unknown', color: 'secondary' }
        return (
          <span className={`badge bg-soft-${status.color} text-${status.color}`}>
            {status.label}
          </span>
        )
      }
    },
    // {
    //   accessorKey: 'createdAt',
    //   header: () => 'Created',
    //   cell: ({ row }) => {
    //     const date = new Date(row.original.createdAt)
    //     return (
    //       <div>
    //         <div>{date.toLocaleDateString()}</div>
    //         <div className="fs-12 text-muted">{date.toLocaleTimeString()}</div>
    //       </div>
    //     )
    //   }
    // },
    {
      accessorKey: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => {
        const user = row.original
        const actions = [
          {
            label: 'View',
            icon: <FiEye />,
            onClick: () => router.push(`/admin/users/view?id=${user.id}`)
          },
          {
            label: 'Edit',
            icon: <FiEdit3 />,
            onClick: () => router.push(`/admin/users/edit?id=${user.id}`)
          },
          { type: 'divider' },
          {
            label: 'Delete',
            icon: <FiTrash2 />,
            className: 'text-danger',
            onClick: () => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)
          }
        ]

        return (
          <div className="hstack gap-2 justify-content-end">
            <Link href={`/admin/users/view?id=${user.id}`} className="avatar-text avatar-md">
              <FiEye />
            </Link>
            <Dropdown 
              dropdownItems={actions} 
              triggerClass="avatar-md" 
              triggerPosition="0,21" 
              triggerIcon={<FiMoreHorizontal />} 
            />
          </div>
        )
      },
      meta: {
        headerClassName: 'text-end'
      }
    }
  ]

  if (loading && users.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div>
      {/* Filters */}
      {/* <div className="card-header border-bottom">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex gap-2 justify-content-end">
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={filters.role}
                onChange={(e) => handleRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="1">Super Admin</option>
                <option value="2">Admin</option>
                <option value="3">User</option>
                <option value="4">Moderator</option>
              </select>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={filters.status}
                onChange={(e) => handleStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="0">Inactive</option>
                <option value="1">Active</option>
                <option value="2">Suspended</option>
                <option value="3">Banned</option>
              </select>
            </div>
          </div>
        </div>
      </div> */}

      {/* Table */}
      <div className="position-relative">
        {loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 10 }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <Table data={users} columns={columns} />
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="card-footer">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="dataTables_info">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
              </div>
            </div>
            <div className="col-md-6">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-end mb-0">
                  <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(pagination.pages)].map((_, index) => (
                    <li key={index} className={`page-item ${pagination.page === index + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersTable