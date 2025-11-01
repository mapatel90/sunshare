"use client";
import React, { useEffect, useState } from "react";
import Table from "@/components/shared/table/Table";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { createPortal } from "react-dom";
import { showSuccessToast } from "@/utils/topTost";
import SelectDropdown from "@/components/shared/SelectDropdown";
import Swal from "sweetalert2";

const InvoiceTable = () => {
  const { lang } = useLanguage();
  const [invoicesData, setInvoicesData] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const [offtakerOptions, setOfftakerOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedOfftaker, setSelectedOfftaker] = useState(null);
  const [amount, setAmount] = useState("");
  const [totalUnit, setTotalUnit] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [statusError, setStatusError] = useState("");
  const [submitting, setSubmitting] = useState(false);

//   const formatTime = (val) => {
//     if (!val) return "";
//     const d = new Date(val);
//     if (isNaN(d.getTime())) return "";
//     return d.toLocaleTimeString("en-GB", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//   };

  const fetchInvoices = async () => {
    try {
      const response = await apiGet("/api/invoice/");
      if (response?.success && response?.data?.invoices) {
        setInvoicesData(response.data.invoices);
      } else {
        setInvoicesData([]);
      }
    } catch (e) {
      setInvoicesData([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await apiGet("/api/projects?status=1&limit=1000");
      const items = Array.isArray(res?.data?.projects) ? res.data.projects : [];
      const active = items.filter((p) => String(p?.status) === "1");
      const mapped = active.map((p) => ({ label: p.project_name, value: String(p.id) }));
      setProjectOptions([{ label: lang("invoice.selectProject"), value: "" }, ...mapped]);
    } catch (_) {
      setProjectOptions([]);
    }
  };

  const fetchProjectOfftaker = async (projectId) => {
    try {
      const res = await apiGet(`/api/projects/${projectId}`);
      const proj = res?.data;
      const ot = proj?.offtaker;
      if (ot?.id) {
        const option = { label: (ot.fullName || ot.email || ""), value: String(ot.id) };
        setOfftakerOptions([option]);
        setSelectedOfftaker(option);
        if (errors.offtaker) setErrors((prev) => ({ ...prev, offtaker: "" }));
      } else {
        setOfftakerOptions([]);
        setSelectedOfftaker(null);
      }
    } catch (_) {
      setOfftakerOptions([]);
      setSelectedOfftaker(null);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchProjects();
    const onSaved = () => fetchInvoices();
    window.addEventListener("invoice:saved", onSaved);
    return () => window.removeEventListener("invoice:saved", onSaved);
  }, []);

  const resetForm = () => {
    setSelectedProject(null);
    setSelectedOfftaker(null);
    setAmount("");
    setTotalUnit("");
    setStatus("");
    setErrors({});
    setStatusError("");
    setEditingId(null);
  };

  useEffect(() => {
    const openEdit = (e) => {
      const item = e?.detail?.item;
      if (!item) {
        setModalMode("add");
        resetForm();
        // projects are preloaded on mount
        // offtaker will be loaded based on project selection
        return;
      }
      setModalMode("edit");
      setEditingId(item.id || null);
      // projects are preloaded on mount
      // Ensure offtaker options align with selected project's offtaker
      setSelectedProject(item.project ? { label: item.project.project_name, value: String(item.project.id) } : null);
      const ofLabel = item.offtaker ? ([item.offtaker.fullName].filter(Boolean).join(" ") || item.offtaker.email) : "";
      const editOfftaker = item.offtaker ? { label: ofLabel, value: String(item.offtaker.id) } : null;
      setSelectedOfftaker(editOfftaker);
      setOfftakerOptions(editOfftaker ? [editOfftaker] : []);
      setAmount(String(item.amount ?? ""));
      setTotalUnit(String(item.total_unit ?? ""));
      setStatus(item.status !== undefined && item.status !== null ? String(item.status) : "");
      setErrors({});
    };
    window.addEventListener("invoice:open-edit", openEdit);
    return () => window.removeEventListener("invoice:open-edit", openEdit);
  }, []);

  const handleSave = async () => {
    const newErrors = {
      project: !selectedProject?.value ? "Project is required" : "",
      offtaker: !selectedOfftaker?.value ? "Offtaker is required" : "",
      amount: !amount ? "Amount is required" : isNaN(Number(amount)) ? "Amount must be a number" : "",
      totalUnit: !totalUnit ? "Total unit is required" : isNaN(Number(totalUnit)) ? "Total unit must be a number" : "",
    };
    const newStatusError = !status && status !== 0 ? "Status is required" : "";
    setErrors(newErrors);
    setStatusError(newStatusError);
    if (Object.values(newErrors).some(Boolean) || newStatusError) return;

    try {
      setSubmitting(true);
      const payload = {
        project_id: parseInt(selectedProject.value),
        offtaker_id: parseInt(selectedOfftaker.value),
        amount: parseFloat(amount),
        total_unit: parseFloat(totalUnit),
        status: parseInt(status),
      };
      const res = editingId
        ? await apiPut(`/api/invoice/${editingId}`, payload)
        : await apiPost("/api/invoice/", payload);

      if (res.success) {
        if (editingId) {
          showSuccessToast(lang("invoice.invoiceUpdatedSuccessfully"));
        } else {
          showSuccessToast(lang("invoice.invoiceCreatedSuccessfully"));
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("invoice:saved"));
        }
        handleCloseModal();
      }
    } catch (_) {
      // noop
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: lang("messages.confirmDelete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: lang("common.yesDelete"),
      cancelButtonText: lang("common.cancel"),
    });
    if (!result.isConfirmed) return;
    try {
      const res = await apiDelete(`/api/invoice/${id}`);
      if (res.success) {
        showSuccessToast(lang("invoice.invoiceDeletedSuccessfully"));
        fetchInvoices();
      }
    } catch (_) {
      // noop
    }
  };

  const columns = [
    {
      accessorKey: "project.project_name",
      header: () => lang("invoice.project"),
      cell: ({ row }) => row?.original?.project?.project_name || "-",
    },
    {
      accessorKey: "offtaker",
      header: () => lang("invoice.offtaker"),
      cell: ({ row }) => {
        const u = row?.original?.offtaker;
        if (!u) return "-";
        return u.fullName || u.email || "-";
      },
    },
    { accessorKey: "amount", header: () => lang("invoice.amount") },
    { accessorKey: "total_unit", header: () => lang("invoice.totalUnit") },
    // {
    //   accessorKey: "start_time",
    //   header: () => "Start Time",
    //   cell: ({ row }) => formatTime(row.original.start_time),
    // },
    // {
    //   accessorKey: "end_time",
    //   header: () => "End Time",
    //   cell: ({ row }) => formatTime(row.original.end_time),
    // },
    {
      accessorKey: "status",
      header: () => lang("invoice.status"),
      cell: ({ row }) => {
        const status = row.original.status;
        const config = {
          1: { label: lang("invoice.paid"), color: "#17c666" },
          0: { label: lang("invoice.unpaid"), color: "#ea4d4d" },
        }[status] || { label: String(status ?? "-"), color: "#999" };
        return (
          <span
            className="badge"
            style={{
              backgroundColor: config.color,
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => lang("invoice.actions"),
      cell: ({ row }) => (
        <div className="d-flex gap-2" style={{ flexWrap: "nowrap" }}>
          <FiEdit3
            size={18}
            onClick={() => {
              const item = row.original;
              window.dispatchEvent(new CustomEvent("invoice:open-edit", { detail: { item } }));
            }}
            style={{ color: "#007bff", cursor: "pointer", transition: "transform 0.2s ease" }}
          />
          <FiTrash2
            onClick={() => handleDelete(row.original.id)}
            size={18}
            style={{ color: "#dc3545", cursor: "pointer", transition: "transform 0.2s ease" }}
          />
        </div>
      ),
      meta: {
        disableSort: true,
      },
    },
  ];

  const handleCloseModal = () => {
    setModalMode(null);
    resetForm();
  };

  const backdropNode = (
    <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={handleCloseModal} data-testid="modal-backdrop" />
  );

  const modalNode = (
    <div className="modal fade show" id="addInvoice" tabIndex="-1" style={{ display: "block", zIndex: 1055 }} aria-modal="true" role="dialog" onClick={handleCloseModal}>
      <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalMode === "edit" ? lang("invoice.updateInvoice") : lang("invoice.addInvoice")}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
            <div className="form-group mb-4">
              <label className="form-label">{lang("invoice.project")}</label>
              <SelectDropdown
                options={projectOptions}
                defaultSelect={lang("invoice.selectProject")}
                selectedOption={selectedProject}
                onSelectOption={(option) => {
                  setSelectedProject(option);
                  if (errors.project) setErrors((prev) => ({ ...prev, project: "" }));
                  if (option?.value) {
                    fetchProjectOfftaker(option.value);
                  } else {
                    setOfftakerOptions([]);
                    setSelectedOfftaker(null);
                  }
                }}
              />
              {errors.project ? <div className="invalid-feedback d-block">{errors.project}</div> : null}
            </div>

            <div className="form-group mb-4">
              <label className="form-label">{lang("invoice.offtaker")}</label>
              <SelectDropdown
                options={offtakerOptions}
                defaultSelect={lang("invoice.selectOfftaker")}
                selectedOption={selectedOfftaker}
                searchable={false}
                onSelectOption={(option) => {
                  setSelectedOfftaker(option);
                  if (errors.offtaker) setErrors((prev) => ({ ...prev, offtaker: "" }));
                }}
              />
              {errors.offtaker ? <div className="invalid-feedback d-block">{errors.offtaker}</div> : null}
            </div>

            <div className="mb-4">
              <label className="form-label">{lang("invoice.amount")}</label>
              <input
                type="number"
                inputMode="decimal"
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                placeholder="Amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
                }}
              />
              {errors.amount ? <div className="invalid-feedback d-block">{errors.amount}</div> : null}
            </div>

            <div className="mb-4">
              <label className="form-label">{lang("invoice.totalUnit")}</label>
              <input
                type="number"
                inputMode="decimal"
                className={`form-control ${errors.totalUnit ? "is-invalid" : ""}`}
                placeholder="Total Unit"
                value={totalUnit}
                onChange={(e) => {
                  setTotalUnit(e.target.value);
                  if (errors.totalUnit) setErrors((prev) => ({ ...prev, totalUnit: "" }));
                }}
              />
              {errors.totalUnit ? <div className="invalid-feedback d-block">{errors.totalUnit}</div> : null}
            </div>

            <div className="form-group mb-4">
              <label className="form-label">{lang("invoice.status")}</label>
              <select
                className={`form-select ${statusError ? "is-invalid" : ""}`}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  if (statusError) setStatusError("");
                }}
              >
                <option value="">{lang("invoice.selectStatus")}</option>
                <option value="1">{lang("invoice.paid")}</option>
                <option value="0">{lang("invoice.unpaid")}</option>
              </select>
              {statusError ? <div className="invalid-feedback d-block">{statusError}</div> : null}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={handleCloseModal}>
              {lang("common.cancel")}
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={submitting}>
              {submitting ? lang("common.loading") : lang("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Table data={invoicesData} columns={columns} />
      {modalMode && typeof document !== "undefined" && (
        <>
          {createPortal(backdropNode, document.body)}
          {createPortal(modalNode, document.body)}
        </>
      )}
    </>
  );
};

export default InvoiceTable;


