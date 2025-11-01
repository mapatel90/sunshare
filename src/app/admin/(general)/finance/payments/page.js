'use client'
import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import DynamicTitle from '@/components/common/DynamicTitle'
import { useLanguage } from '@/contexts/LanguageContext'
import { apiGet, apiPost, apiPut, apiPatch } from '@/lib/api'
import Table from '@/components/shared/table/Table'
import { FiEdit3, FiTrash2 } from 'react-icons/fi'
import Swal from 'sweetalert2'
import { showSuccessToast, showErrorToast } from '@/utils/topTost'
import useOfftakerData from '@/hooks/useOfftakerData'

const PaymentsPage = () => {
    const { lang } = useLanguage()
    const { offtakers, loadingOfftakers } = useOfftakerData()

    const [items, setItems] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('add') // add | edit
    const [editId, setEditId] = useState(null)
    // const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        invoice_id: '',
        offtaker_id: '',
        amount: '',
        status: 1,
    })
    const [formError, setFormError] = useState({ amount: '' })

    const STATUS_OPTIONS = [
        { label: lang('common.active', 'Active'), value: 1 },
        { label: lang('common.inactive', 'Inactive'), value: 0 },
    ]

    // static invoice options
    const INVOICE_OPTIONS = useMemo(() => ([
        { label: 'INV-1001', value: 1001 },
        { label: 'INV-1002', value: 1002 },
        { label: 'INV-1003', value: 1003 },
    ]), [])

    const fetchItems = async () => {
        try {
            const res = await apiGet('/api/payments')
            if (res?.success) setItems(res.data)
        } catch (e) {
            // ignore
        }
    }

    useEffect(() => { fetchItems() }, [])

    const openAdd = () => {
        setModalType('add')
        setForm({ invoice_id: '', offtaker_id: '', amount: '', status: 1 })
        setFormError({ amount: '' })
        setEditId(null)
        setShowModal(true)
    }
    const openEdit = (row) => {
        setModalType('edit')
        setForm({
            invoice_id: row.invoice_id || '',
            offtaker_id: row.offtaker_id || '',
            amount: row.amount?.toString?.() || '',
            status: row.status
        })
        setFormError({ amount: '' })
        setEditId(row.id)
        setShowModal(true)
    }
    const closeModal = () => setShowModal(false)

    const handleSave = async (e) => {
        e.preventDefault();

        const errors = {};
        const intRegex = /^\d+$/;

        // Validate required fields
        if (!form.offtaker_id) {
            errors.offtaker_id = lang('payments.offtakerRequired', 'Offtaker is required');
        }

        if (!form.amount) {
            errors.amount = lang('payments.amountRequired', 'Amount is required');
        } else if (!intRegex.test(form.amount)) {
            errors.amount = lang('payments.onlynumbers', 'Only numbers are allowed (e.g. 123456)');
        }

        if (!form.status && form.status !== 0) {
            errors.status = lang('payments.statusRequired', 'Status is required');
        }

        // If any errors found, show them and stop submission
        if (Object.keys(errors).length > 0) {
            setFormError(errors);
            return;
        }

        // Clear previous errors and proceed
        setFormError({});
        // setLoading(true);

        try {
            const payload = {
                invoice_id: form.invoice_id ? parseInt(form.invoice_id) : 0,
                offtaker_id: parseInt(form.offtaker_id),
                amount: parseInt(form.amount),
                status: parseInt(form.status)
            };

            let res;
            if (modalType === 'add') {
                res = await apiPost('/api/payments', payload);
                if (res?.success)
                    showSuccessToast(lang('payments.createdSuccessfully', 'Payment Created Successfully'));
            } else {
                res = await apiPut(`/api/payments/${editId}`, payload);
                if (res?.success)
                    showSuccessToast(lang('payments.updatedSuccessfully', 'Payment Updated Successfully'));
            }

            if (res?.success) {
                closeModal();
                fetchItems();
            } else {
                showErrorToast(res?.message || lang('payments.errorOccurred', 'An error occurred. Please try again.'));
            }
        } catch (err) {
            showErrorToast(err?.message || lang('payments.errorOccurred', 'An error occurred. Please try again.'));
        } finally {
            // setLoading(false);
        }
    };

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
            const res = await apiPatch(`/api/payments/${row.id}/soft-delete`, {})
            if (res?.success) {
                showSuccessToast(lang('payments.deletedSuccessfully', 'Payment Deleted Successfully'))
                fetchItems()
            } else {
                showErrorToast(res?.message || lang('payments.errorOccurred', 'An error occurred. Please try again.'))
            }
        }
    }

    const columns = [
        {
            accessorKey: 'invoice_id',
            header: () => lang('payments.invoice', 'Invoice'),
            cell: info => {
                const id = info.getValue()
                const match = INVOICE_OPTIONS.find(o => o.value == id)
                return match ? match.label : id || '-'
            }
        },
        {
            accessorKey: 'offtaker',
            header: () => lang('payments.offtaker', 'Offtaker'),
            cell: ({ row }) => {
                const user = row.original?.offtaker
                return user ? `${user.firstName} ${user.lastName}` : '-'
            }
        },
        {
            accessorKey: 'amount',
            header: () => lang('payments.amount', 'Amount'),
            cell: info => info.getValue()
        },
        {
            accessorKey: 'status',
            header: () => lang('payments.status', 'Status'),
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
            <DynamicTitle titleKey="payments.title" />
            <PageHeader>
                <div className="ms-auto">
                    <button type="button" className="btn btn-primary" onClick={openAdd}>+ {lang('payments.addPayment', 'Add Payment')}</button>
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
                                <h5 className="modal-title">
                                    {modalType === 'edit'
                                        ? lang('payments.editPayment', 'Edit Payment')
                                        : lang('payments.addPayment', 'Add Payment')}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">{lang('payments.invoice', 'Invoice')}</label>
                                    <select
                                        className="form-control"
                                        value={form.invoice_id}
                                        onChange={(e) => setForm({ ...form, invoice_id: e.target.value })}
                                    >
                                        <option value="">{lang('payments.selectInvoice', 'Select Invoice')}</option>
                                        {INVOICE_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        {lang('payments.offtaker', 'Offtaker')} <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={`form-control ${formError.offtaker_id ? 'is-invalid' : ''}`}
                                        value={form.offtaker_id}
                                        onChange={(e) => setForm({ ...form, offtaker_id: e.target.value })}
                                        disabled={loadingOfftakers}
                                    >
                                        <option value="">{lang('payments.selectOfftaker', 'Select Offtaker')}</option>
                                        {offtakers.map(o => (
                                            <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
                                        ))}
                                    </select>
                                    {formError.offtaker_id && <div className="invalid-feedback">{formError.offtaker_id}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        {lang('payments.amount', 'Amount')} <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formError.amount ? 'is-invalid' : ''}`}
                                        value={form.amount}
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    />
                                    {formError.amount && <div className="invalid-feedback">{formError.amount}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{lang('common.status', 'Status')} <span className="text-danger">*</span></label>
                                    <select
                                        className={`form-control ${formError.status ? 'is-invalid' : ''}`}
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: parseInt(e.target.value) })}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    {formError.status && <div className="invalid-feedback">{formError.status}</div>}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    {lang('common.cancel', 'Cancel')}
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {lang('common.save', 'Save')}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </>
    )
}

export default PaymentsPage


