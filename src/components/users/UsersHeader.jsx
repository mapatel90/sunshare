import React from 'react'
import Link from 'next/link'
import { FiPlus, FiDownload, FiUpload } from 'react-icons/fi'

const UsersHeader = () => {
  return (
    <div className="page-header">
      {/* <div className="page-header-left d-flex align-items-center">
        <div className="page-header-title">
          <h5 className="m-b-10">Users Management</h5>
        </div>
        <ul className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
          <li className="breadcrumb-item">Users</li>
        </ul>
      </div> */}
      <div className="page-header-right ms-auto">
        <div className="page-header-right-items">
          <div className="d-flex d-md-none">
            <a href="javascript:void(0)" className="page-header-right-close-toggle">
              <i className="feather-arrow-left me-2"></i>
              <span>Back</span>
            </a>
          </div>
          <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
            <Link href="/admin/users/create" className="btn btn-primary">
              <FiPlus size={16} className="me-2" />
              Create User
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersHeader