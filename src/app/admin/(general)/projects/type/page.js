'use client'
import React, { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import DynamicTitle from '@/components/common/DynamicTitle'
import { useLanguage } from '@/contexts/LanguageContext'
import { apiGet, apiPost, apiPut, apiPatch } from '@/lib/api'
import Table from '@/components/shared/table/Table'
import { FiEdit3, FiTrash2 } from 'react-icons/fi'
import Swal from 'sweetalert2'
import { showSuccessToast, showErrorToast } from '@/utils/topTost'

const ProjectTypePage = () => {
    const { lang } = useLanguage()

    const [items, setItems] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('add') // add | edit
    const [form, setForm] = useState({ name: '', status: 1 })
    const [editId, setEditId] = useState(null)
    const [loading, setLoading] = useState(false)

    const STATUS_OPTIONS = [
        { label: lang('common.active', 'Active'), value: 1 },
        { label: lang('common.inactive', 'Inactive'), value: 0 },
    ]

    const fetchItems = async () => {
        try {
            const res = await apiGet('/api/project-types')
            if (res?.success) setItems(res.data)
        } catch (e) {
            // ignore
        }
    }

    useEffect(() => { fetchItems() }, [])

    const openAdd = () => {
        setModalType('add')
        setForm({ name: '', status: 1 })
        setEditId(null)
        setShowModal(true)
    }
    const openEdit = (row) => {
        setModalType('edit')
        setForm({ name: row.type_name, status: row.status })
        setEditId(row.id)
        setShowModal(true)
    }
    const closeModal = () => setShowModal(false)

    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.name) return
        setLoading(true)
        try {
            let res
            if (modalType === 'add') {
                res = await apiPost('/api/project-types', { name: form.name, status: form.status })
                if (res?.success) showSuccessToast(lang('projectType.createdSuccessfully', 'Type Created Successfully'))
            } else {
                res = await apiPut(`/api/project-types/${editId}`, { name: form.name, status: form.status })
                if (res?.success) showSuccessToast(lang('projectType.updatedSuccessfully', 'Type Updated Successfully'))
            }
            if (res?.success) {
                closeModal()
                fetchItems()
            } else {
                showErrorToast(res?.message || lang('projectType.errorOccurred', 'An error occurred. Please try again.'))
            }
        } catch (err) {
            showErrorToast(err?.message || lang('projectType.errorOccurred', 'An error occurred. Please try again.'))
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (row) => {
        const confirm = await Swal.fire({
            icon: 'warning',
            title: lang('common.areYouSure', 'Are you sure?'),
            text: lang('modal.deleteWarning', 'This action cannot be undone!'),
            showCancelButton: true,
            confirmButtonText: lang('common.yesDelete', 'Yes, delete it!'),
            confirmButtonColor: '#d33',
        })
        if (confirm.isConfirmed) {
            const res = await apiPatch(`/api/project-types/${row.id}/soft-delete`, {})
            if (res?.success) {
                showSuccessToast(lang('projectType.deletedSuccessfully', 'Type Deleted Successfully'))
                fetchItems()
            } else {
                showErrorToast(res?.message || lang('projectType.errorOccurred', 'An error occurred. Please try again.'))
            }
        }
    }

    const columns = [
        {
            accessorKey: 'type_name',
            header: () => lang('projectType.name', 'Name'),
            cell: info => info.getValue()
        },
        {
            accessorKey: 'status',
            header: () => lang('projectType.status', 'Status'),
            cell: info => (
                info.getValue() == 1
                    ? <span className="badge bg-soft-success text-success">{lang('common.active', 'Active')}</span>
                    : <span className="badge bg-soft-danger text-danger">{lang('common.inactive', 'Inactive')}</span>
            )
        },
        {
            accessorKey: 'actions',
            header: () => lang('common.actions', 'Actions'),
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="d-flex gap-2 justify-content-end" style={{ flexWrap: 'nowrap' }}>
                        <FiEdit3
                            size={18}
                            onClick={() => openEdit(item)}
                            title={lang('common.edit', 'Edit')}
                            style={{ color: '#007bff', cursor: 'pointer', transition: 'transform 0.2s ease' }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                        <FiTrash2
                            size={18}
                            onClick={() => handleDelete(item)}
                            title={lang('common.delete', 'Delete')}
                            style={{ color: '#dc3545', cursor: 'pointer', transition: 'transform 0.2s ease' }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                    </div>
                )
            },
            meta: { disableSort: true, headerClassName: 'text-end' }
        }
    ]

    return (
        <>
            <DynamicTitle titleKey="projects.projecttype" />
            <PageHeader>
                <div className="ms-auto">
                    <button type="button" className="btn btn-primary" onClick={openAdd}>+ {lang('projectType.addType', 'Add Type')}</button>
                </div>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <Table data={items} columns={columns} />
                </div>
            </div>

            {showModal && (
                <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <div className="modal-dialog" role="document">
                        <form className="modal-content" onSubmit={handleSave}>
                            <div className="modal-header">
                                <h5 className="modal-title">{modalType === 'edit' ? lang('projectType.editType', 'Edit Type') : lang('projectType.addType', 'Add Type')}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">{lang('projectType.name', 'Name')}</label>
                                    <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{lang('common.status', 'Status')}</label>
                                    <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: parseInt(e.target.value) })}>
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>{lang('common.cancel', 'Cancel')}</button>
                                <button type="submit" className="btn btn-primary" disabled={loading || !form.name}>{loading ? lang('common.loading', 'Loading...') : lang('common.save', 'Save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProjectTypePage


