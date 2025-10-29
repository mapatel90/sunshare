'use client'
import React from 'react'
import { FiFilter, FiLayers, FiPlus, FiArrowLeft } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

const ProjectCreateHeader = () => {
    const router = useRouter()
    const { lang } = useLanguage()

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
            <button type="button" className="btn btn-primary" onClick={() => router.push('/admin/projects/list')}>
                <FiArrowLeft size={16} className='me-2' />
                <span>{lang('common.back', 'Back')} {lang('navigation.projects', 'Projects')}</span>
            </button>
        </div>

    )
}

export default ProjectCreateHeader