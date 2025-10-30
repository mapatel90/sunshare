import React, { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiPatch } from '@/lib/api';
import SelectDropdown from '@/components/shared/SelectDropdown';
import Table from '@/components/shared/table/Table';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { showSuccessToast, showErrorToast } from '@/utils/topTost';
import { useLanguage } from '@/contexts/LanguageContext';

const InverterTab = ({ projectId }) => {
  const { lang } = useLanguage();
  
  // Modal & Form state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [loading, setLoading] = useState(false);
  const [inverterList, setInverterList] = useState([]);
  const [selectedInverter, setSelectedInverter] = useState(null);
  const [kilowatt, setKilowatt] = useState('');
  const [status, setStatus] = useState(1);
  const [editId, setEditId] = useState(null);
  
  // Table state
  const [projectInverters, setProjectInverters] = useState([]);

  useEffect(() => {
    apiGet('/api/inverters?status=1&limit=100').then(res => {
      if (res?.success) setInverterList(res.data.inverters);
    });
  }, []);

  const getProjectInverters = () => {
    apiGet(`/api/project-inverters?project_id=${projectId}`).then(res => {
      if (res?.success) setProjectInverters(res.data);
    });
  };
  useEffect(() => { getProjectInverters(); }, [projectId]);

  const openAddModal = () => {
    setModalType('add');
    setSelectedInverter(null);
    setKilowatt('');
    setStatus(1);
    setEditId(null);
    setShowModal(true);
  };
  const openEditModal = (row) => {
    setModalType('edit');
    setSelectedInverter(inverterList.find(i => i.id === row.inverter_id) || null);
    setKilowatt(row.kilowott);
    setStatus(row.status);
    setEditId(row.id);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const STATUS_OPTIONS = [
    { label: lang('common.active', 'Active'), value: 1 },
    { label: lang('common.inactive', 'Inactive'), value: 0 },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedInverter || !kilowatt) return;
    setLoading(true);
    let res = {};
    try {
      if (modalType === 'add') {
        res = await apiPost('/api/project-inverters', {
          project_id: projectId,
          inverter_id: selectedInverter.id,
          kilowott: kilowatt,
          status,
        });
        if (res.success) {
          showSuccessToast(lang('modal.successSaved', 'Data saved successfully!'));
        } else {
          showErrorToast(res.message || lang('modal.errorOccurred', 'An error occurred. Please try again.'));
        }
      } else {
        res = await apiPut(`/api/project-inverters/${editId}`, {
          inverter_id: selectedInverter.id,
          kilowott: kilowatt,
          status,
        });
        if (res.success) {
          showSuccessToast(lang('modal.successUpdated', 'Data updated successfully!'));
        } else {
          showErrorToast(res.message || lang('modal.errorOccurred', 'An error occurred. Please try again.'));
        }
      }
      if (res.success) closeModal();
      getProjectInverters();
    } finally {
      setLoading(false);
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
    });
    if (confirm.isConfirmed) {
      const res = await apiPatch(`/api/project-inverters/${row.id}/soft-delete`, {});
      if (res && res.success) {
        showSuccessToast(lang('modal.successDeleted', 'Item deleted successfully!'));
        getProjectInverters();
      } else {
        showErrorToast(lang('modal.errorOccurred', 'An error occurred. Please try again.'));
      }
    }
  };

  // Datatable columns (translated)
  const columns = [
    {
      accessorKey: 'inverter.inverterName',
      header: () => lang('inverter.inverterName', 'Inverter Name'),
      cell: info => info.row.original.inverter?.inverterName || '-',
    },
    {
      accessorKey: 'kilowott',
      header: () => lang('projects.investorProfit', 'Kilowatt'), // Reusing available translation, else fallback
      cell: info => info.getValue() || '-',
    },
    {
      accessorKey: 'status',
      header: () => lang('common.status', 'Status'),
      cell: info =>
        info.getValue() == 1
          ? <span className="badge bg-soft-success text-success">{lang('common.active','Active')}</span>
          : <span className="badge bg-soft-danger text-danger">{lang('common.inactive','Inactive')}</span>,
    },
    {
      accessorKey: 'actions',
      header: lang('common.actions','Actions'),
      meta: { headerClassName: 'text-end' },
      cell: info => {
        const row = info.row.original;
        return (
          <div className="hstack gap-2 justify-content-end">
            <button className="btn btn-link btn-sm px-1" title={lang('common.edit','Edit')} onClick={() => openEditModal(row)}><FiEdit2 /></button>
            <button className="btn btn-link text-danger btn-sm px-1" title={lang('common.delete','Delete')} onClick={() => handleDelete(row)}><FiTrash2 /></button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="inverter-management">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">{lang('inverter.inverter', 'Inverters')} {lang('projects.projectlist','Project List')}</h6>
        <button type="button" className="btn btn-primary" onClick={openAddModal}>
          + {lang('inverter.addInverter', 'Add Inverter')}
        </button>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="modal-dialog" role="document">
            <form className="modal-content" onSubmit={handleSave}>
              <div className="modal-header">
                <h5 className="modal-title">{modalType === 'edit' ? lang('inverter.editInverter','Edit Inverter') : lang('inverter.addInverter','Add Inverter')}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {/* Dropdown for inverter */}
                <div className="mb-3">
                  <label className="form-label">{lang('inverter.inverterName', 'Inverter Name')}</label>
                  <SelectDropdown options={inverterList.map(inv => ({ value: inv.id, label: inv.inverterName }))}
                    selectedOption={selectedInverter?.id}
                    onSelectOption={opt => setSelectedInverter(inverterList.find(i => i.id === opt.value))}
                    defaultSelect={lang('inverter.selectType', 'Select Inverter')}
                  />
                </div>
                {/* Show after select */}
                {selectedInverter && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">{lang('projects.investorProfit', 'Kilowatt')}</label>
                      <input type="number" className="form-control" value={kilowatt} onChange={e => setKilowatt(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">{lang('common.status', 'Status')}</label>
                      <SelectDropdown options={STATUS_OPTIONS} selectedOption={status} onSelectOption={opt => setStatus(opt.value)} defaultSelect={lang('projects.selectStatus', 'Select Status')} searchable={false} />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>{lang('common.cancel','Cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={loading || !selectedInverter || !kilowatt}>
                  {loading ? lang('common.loading','Loading...') : lang('common.save','Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Enhanced Table */}
      <Table data={projectInverters} columns={columns} />
    </div>
  );
};

export default InverterTab;
