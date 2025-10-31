"use client";
import React, { useEffect, useState } from "react";
import Table from "@/components/shared/table/Table";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { showSuccessToast } from "@/utils/topTost";

const InverterTypeTable = () => {
  const { lang } = useLanguage();

  const [types, setTypes] = useState([]);
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingId, setEditingId] = useState(null);
  const [typeName, setTypeName] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [statusError, setStatusError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTypeName("");
    setStatus("");
    setErrors({});
    setStatusError("");
    setEditingId(null);
  };

  const fetchTypes = async () => {
    try {
      const res = await apiGet("/api/inverterTypes/data");
      const items = Array.isArray(res?.data?.inverterTypes) ? res.data.inverterTypes : [];
      setTypes(items);
    } catch (_) {
      // noop
    }
  };

  useEffect(() => {
    fetchTypes();
    const onSaved = () => fetchTypes();
    window.addEventListener("inverterType:saved", onSaved);
    return () => window.removeEventListener("inverterType:saved", onSaved);
  }, []);

  const handleCloseModal = () => {
    setModalMode(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: lang("messages.confirmDelete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: lang("common.yesDelete") || "Yes, delete it!",
      cancelButtonText: lang("common.cancel") || "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await apiDelete(`/api/inverterTypes/${id}`);
      if (res.success) {
        showSuccessToast(lang("inverterType.deletedSuccessfully"));
        fetchTypes();
      }
    } catch (_) {
      // noop
    }
  };

  // open edit/add via window event from header or actions
  useEffect(() => {
    const openEdit = (e) => {
      const item = e?.detail?.item;
      if (!item) {
        setModalMode("add");
        resetForm();
        return;
      }
      setModalMode("edit");
      setEditingId(item.id || null);
      setTypeName(item.type || "");
      setStatus(item.status !== undefined && item.status !== null ? String(item.status) : "");
      setErrors({});
    };
    window.addEventListener("inverterType:open-edit", openEdit);
    return () => window.removeEventListener("inverterType:open-edit", openEdit);
  }, []);

  const handleSave = async () => {
    const newErrors = {
      typeName: !typeName ? lang("inverterType.typeNameRequired") : "",
    };
    const newStatusError = !status && status !== 0 ? lang("inverterType.statusRequired") : "";
    setErrors(newErrors);
    setStatusError(newStatusError);
    if (Object.values(newErrors).some(Boolean) || newStatusError) return;

    try {
      setSubmitting(true);
      const payload = { type: typeName, status: parseInt(status) };
      const res = editingId
        ? await apiPut(`/api/inverterTypes/${editingId}`, payload)
        : await apiPost("/api/inverterTypes", payload);

      if (res.success) {
        if (editingId) {
          showSuccessToast(lang("inverterType.updatedSuccessfully"));
        } else {
          showSuccessToast(lang("inverterType.createdSuccessfully"));
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("inverterType:saved"));
        }
        handleCloseModal();
      }
    } catch (_) {
      // noop
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { accessorKey: "type", header: () => lang("inverterType.typeName") },
    {
      accessorKey: "status",
      header: () => lang("inverterType.status"),
      cell: ({ row }) => {
        const s = row.original.status;
        const config = {
          1: { label: lang("inverterType.active") || "Active", color: "#17c666" },
          0: { label: lang("inverterType.inactive") || "Inactive", color: "#ea4d4d" },
        }[s] || { label: s, color: "#999" };
        return (
          <span
            className="badge"
            style={{ backgroundColor: config.color, color: "#fff", padding: "5px 10px", borderRadius: "8px", fontSize: "12px" }}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => lang("common.actions"),
      cell: ({ row }) => (
        <div className="d-flex gap-2" style={{ flexWrap: "nowrap" }}>
          <FiEdit3
            size={18}
            onClick={() => {
              const item = row.original;
              window.dispatchEvent(new CustomEvent("inverterType:open-edit", { detail: { item } }));
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
      meta: { disableSort: true },
    },
  ];

  const backdropNode = (
    <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={handleCloseModal} data-testid="modal-backdrop" />
  );

  const modalNode = (
    <div className="modal fade show" id="addInverterType" tabIndex="-1" style={{ display: "block", zIndex: 1055 }} aria-modal="true" role="dialog" onClick={handleCloseModal}>
      <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {modalMode === "edit" ? lang("inverterType.editType") : lang("inverterType.addType")}
            </h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <label htmlFor="typeName" className="form-label">{lang("inverterType.typeName")}</label>
              <input
                type="text"
                id="typeName"
                className={`form-control ${errors.typeName ? "is-invalid" : ""}`}
                placeholder={lang("inverterType.typeNamePlaceholder")}
                value={typeName}
                onChange={(e) => {
                  setTypeName(e.target.value);
                  if (errors.typeName) setErrors((prev) => ({ ...prev, typeName: "" }));
                }}
              />
              {errors.typeName ? <div className="invalid-feedback d-block">{errors.typeName}</div> : null}
            </div>

            <div className="form-group mb-4">
              <label className="form-label">{lang("inverterType.status")}</label>
              <select
                className={`form-select ${statusError ? "is-invalid" : ""}`}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  if (statusError) setStatusError("");
                }}
              >
                <option value="">{lang("inverterType.selectStatus") || "Select Status"}</option>
                <option value="1">{lang("inverterType.active") || "Active"}</option>
                <option value="0">{lang("inverterType.inactive") || "Inactive"}</option>
              </select>
              {statusError ? <div className="invalid-feedback d-block">{statusError}</div> : null}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={handleCloseModal}>{lang("common.cancel")}</button>
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
      <Table data={types} columns={columns} />
      {modalMode && typeof document !== "undefined" && (
        <>
          {createPortal(backdropNode, document.body)}
          {createPortal(modalNode, document.body)}
        </>
      )}
    </>
  );
};

export default InverterTypeTable;


