import React from 'react'
import { FiFilter, FiLayers, FiPlus, FiSend } from 'react-icons/fi'

const ProjectCreateHeader = () => {

    return (
        <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
            <div className="filter-dropdown">
                <a className="btn btn-light-brand" data-bs-toggle="dropdown" data-bs-offset="0, 10" data-bs-auto-close="outside">
                    <FiLayers size={16} className='me-2' />
                    <span>Tab-List</span>
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                    <div className="dropdown-item">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="checkType" defaultChecked="checked" />
                            <label className="custom-control-label c-pointer" htmlFor="checkType">Type</label>
                        </div>
                    </div>
                    <div className="dropdown-divider" />
                    <a href="#" className="dropdown-item">
                        <FiPlus className='me-3' />
                        <span>Create New</span>
                    </a>
                    <a href="#" className="dropdown-item">
                        <FiFilter className='me-3' />
                        <span>Manage Filter</span>
                    </a>
                </div>
            </div>
            <a href="#" className="btn btn-primary">
                <FiSend size={16} className='me-2' />
                <span>Sent Invitation</span>
            </a>
        </div>

    )
}

export default ProjectCreateHeader