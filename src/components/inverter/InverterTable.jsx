"use client";
import React, { useState, memo, useEffect } from "react";
import ReactDOM from "react-dom";
import Table from "@/components/shared/table/Table";
import SelectDropdown from "@/components/shared/SelectDropdown";
import { apiGet, apiDelete, apiPost, apiPut } from "@/lib/api";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";
import { showSuccessToast } from "@/utils/topTost";
import { createPortal } from "react-dom";

const InverterTable = () => {
  const { lang } = useLanguage();
  const [invertersData, setInvertersData] = useState([]);
  // Modal/Form state (moved from AddInverter)
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [typesError, setTypesError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingEdit, setPendingEdit] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [inverterName, setInverterName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  // Modal logic state:
  const [modalMode, setModalMode] = useState(null);

  const resetForm = () => {
    setCompanyName("");
    setInverterName("");
    setApiKey("");
    setSecretKey("");
    setSelectedType(null);
    setEditingId(null);
    setErrors({});
    setPendingEdit(null);
  };

  const fetchInverters = async () => {
    try {
      const response = await apiGet("/api/inverters/");
      if (response.success && response.data.inverters) {
        setInvertersData(response.data.inverters);
      }
    } catch (error) {
      // noop
    }
  };

  const handleDelete = async (inverterId) => {
    if (!window.confirm(lang("messages.confirmDelete"))) {
      return;
    }
    try {
      const response = await apiDelete(`/api/inverters/${inverterId}`);
      if (response.success) {
        showSuccessToast(lang("inverter.deletedSuccessfully"));
        fetchInverters();
      } else {
        // optional: show toast
      }
    } catch (error) {
      // noop
    }
  };

  useEffect(() => {
    fetchInverters();

    const onSaved = () => fetchInverters();
    window.addEventListener("inverter:saved", onSaved);
    return () => window.removeEventListener("inverter:saved", onSaved);
  }, []);

  // Fetch inverter types
  const fetchTypes = async () => {
    try {
      setLoadingTypes(true);
      setTypesError("");
      const res = await apiGet("/api/inverterTypes");
      const items = Array.isArray(res?.data) ? res.data : [];
      const mapped = items.map((it) => ({
        label: it.type,
        value: String(it.id),
      }));
      setTypeOptions([
        { label: lang("inverter.selectType"), value: "select type" },
        ...mapped,
      ]);
    } catch (e) {
      setTypesError(e?.message || "Failed to load inverter types");
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Ensure form resets when opening for Add via Bootstrap trigger and after close
  useEffect(() => {
    const modalEl =
      typeof document !== "undefined" &&
      document.getElementById("addNewInverter");
    if (!modalEl) return;
    const onShow = () => {
      // If opening in add mode, clean slate
      if (modalMode === "add") {
        resetForm();
        setModalMode("add");
      }
    };
    const onHidden = () => {
      // Always reset after modal fully hidden
      resetForm();
      setModalMode("add");
    };
    modalEl.addEventListener("show.bs.modal", onShow);
    modalEl.addEventListener("hidden.bs.modal", onHidden);
    return () => {
      modalEl.removeEventListener("show.bs.modal", onShow);
      modalEl.removeEventListener("hidden.bs.modal", onHidden);
    };
  }, [modalMode]);

  // Handle create/update
  const handleAdd = async () => {
    const newErrors = {
      companyName: !companyName ? lang("validation.companyNameRequired") : "",
      inverterName: !inverterName
        ? lang("validation.inverterNameRequired")
        : "",
      selectedType: !selectedType?.value ? lang("validation.typeRequired") : "",
      apiKey: !apiKey ? lang("validation.apiKeyRequired") : "",
      secretKey: !secretKey ? lang("validation.secretKeyRequired") : "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    try {
      setSubmitting(true);
      const payload = {
        companyName,
        inverterName,
        inverter_type_id: parseInt(selectedType.value),
        apiKey,
        secretKey,
      };
      const res = editingId
        ? await apiPut(`/api/inverters/${editingId}`, payload)
        : await apiPost("/api/inverters/", payload);

      if (res.success) {
        // ✅ Success Toast Message
        if (editingId) {
          showSuccessToast(lang("inverter.updatedSuccessfully"));
        } else {
          showSuccessToast(lang("inverter.createdSuccessfully"));
        }
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("inverter:saved"));
      }

      handleCloseModal();
    } catch (e) {
      // noop optional error UI
    } finally {
      setSubmitting(false);
    }
  };

  // Support edit mode via window event
  useEffect(() => {
    const openEdit = (e) => {
      const item = e?.detail?.item;
      if (!item) {
        // 'Add' mode: reset form, set mode to add, clear editingId and selectedType, then show modal
        setModalMode("add");
        setEditingId(null);
        resetForm();
        setSelectedType(null);
        return;
      }
      // Edit mode - same as before
      setModalMode("edit");
      setEditingId(item.id || null);
      setCompanyName(item.companyName || "");
      setInverterName(item.inverterName || "");
      setApiKey(item.apiKey || "");
      setSecretKey(item.secretKey || "");
      setErrors({});
      setPendingEdit(item);
      if (Array.isArray(typeOptions) && typeOptions.length > 0) {
        if (item.inverter_type_id !== undefined && item.inverter_type_id !== null) {
          const valueToOption = new Map(typeOptions.map((o) => [o.value, o]));
          const labelToOption = new Map(typeOptions.map((o) => [o.label, o]));
          const key = String(item.inverter_type_id);
          const found = valueToOption.get(key) || labelToOption.get(item.inverter_type_id) || null;
          setSelectedType(found);
        } else {
          setSelectedType(null);
        }
      } else {
        setSelectedType(null);
      }
    };
    window.addEventListener("inverter:open-edit", openEdit);
    return () => window.removeEventListener("inverter:open-edit", openEdit);
  }, [typeOptions]);

  // When types finish loading, if an edit is pending, resolve the selected option
  useEffect(() => {
    if (!pendingEdit) return;
    if (!Array.isArray(typeOptions) || typeOptions.length === 0) return;
    const { inverter_type_id } = pendingEdit;
    if (inverter_type_id === undefined || inverter_type_id === null) {
      setSelectedType(null);
      return;
    }
    const valueToOption = new Map(typeOptions.map((o) => [o.value, o]));
    const labelToOption = new Map(typeOptions.map((o) => [o.label, o]));
    const key = String(inverter_type_id);
    const found =
      valueToOption.get(key) || labelToOption.get(inverter_type_id) || null;
    setSelectedType(found);
  }, [typeOptions, pendingEdit]);

  const columns = [
    // { accessorKey: "id", header: () => "ID" },
    { accessorKey: "companyName", header: () => lang("inverter.companyName") },
    {
      accessorKey: "inverterName",
      header: () => lang("inverter.inverterName"),
    },
    { accessorKey: "inverter_type_id", header: () => lang("inverter.type") },
    { accessorKey: "apiKey", header: () => lang("inverter.apiKey") },
    { accessorKey: "secretKey", header: () => lang("inverter.secretKey") },
    {
      accessorKey: "actions",
      header: () => lang("common.actions"),
      cell: ({ row }) => (
        <div className="d-flex gap-2" style={{ flexWrap: "nowrap" }}>
          <FiEdit3
            size={18}
            onClick={() => {
              // Open modal for edit with prefilled data via window event
              const item = row.original;
              window.dispatchEvent(
                new CustomEvent("inverter:open-edit", { detail: { item } })
              );
            }}
            style={{
              color: "#007bff",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
          />

          <FiTrash2
            onClick={() => handleDelete(row.original.id)}
            size={18}
            style={{
              color: "#dc3545",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
          />
        </div>
      ),
      meta: {
        disableSort: true,
      },
    },
  ];

  // Modal logic state:
  // const [modalMode, setModalMode] = useState(null);
  // Rest of existing modal state remains

  // For closing modal:
  const handleCloseModal = () => {
    setModalMode(null);
    resetForm();
    setEditingId(null);
    setSelectedType(null);
    setErrors({});
    setPendingEdit(null);
  };

  // Render modal & backdrop via React Portal only if modalMode:
  const backdropNode = (
    <div
      className="modal-backdrop fade show"
      style={{ zIndex: 1050 }}
      onClick={handleCloseModal}
      data-testid="modal-backdrop"
    />
  );
  const modalNode = (
    <div
      className="modal fade show"
      id="addNewInverter"
      tabIndex="-1"
      style={{ display: "block", zIndex: 1055 }}
      aria-modal="true"
      role="dialog"
      onClick={handleCloseModal}
    >
      <div
        className="modal-dialog modal-lg"
        role="document"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content">
          {/* Modal header/body/footer as before, only update close/cancel to call handleCloseModal */}
          <div className="modal-header">
            <h5 className="modal-title">
              {modalMode === 'edit'
                ? lang("inverter.editInverter")
                : lang("inverter.addInverter")}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleCloseModal}
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-4">
              <label htmlFor="companyName" className="form-label">
                {lang("inverter.companyName")}
              </label>
              <input
                type="text"
                id="companyName"
                className={`form-control ${
                  errors.companyName ? "is-invalid" : ""
                }`}
                placeholder={lang("inverter.companyNamePlaceholder")}
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (errors.companyName)
                    setErrors((prev) => ({ ...prev, companyName: "" }));
                }}
              />
              {errors.companyName ? (
                <div className="invalid-feedback d-block">
                  {errors.companyName}
                </div>
              ) : null}
            </div>

            <div className="mb-4">
              <label htmlFor="inverterName" className="form-label">
                {lang("inverter.inverterName")}
              </label>
              <input
                type="text"
                id="inverterName"
                className={`form-control ${
                  errors.inverterName ? "is-invalid" : ""
                }`}
                placeholder={lang("inverter.inverterNamePlaceholder")}
                value={inverterName}
                onChange={(e) => {
                  setInverterName(e.target.value);
                  if (errors.inverterName)
                    setErrors((prev) => ({ ...prev, inverterName: "" }));
                }}
              />
              {errors.inverterName ? (
                <div className="invalid-feedback d-block">
                  {errors.inverterName}
                </div>
              ) : null}
            </div>

            <div className="form-group mb-4">
              <label className="form-label">{lang("inverter.type")}</label>
              {typesError ? (
                <div className="text-danger small">{typesError}</div>
              ) : (
                <SelectDropdown
                  options={typeOptions}
                  defaultSelect={lang("inverter.selectType")}
                  selectedOption={selectedType}
                  onSelectOption={(option) => {
                    setSelectedType(option);
                    if (errors.selectedType)
                      setErrors((prev) => ({ ...prev, selectedType: "" }));
                  }}
                />
              )}
              {errors.selectedType ? (
                <div className="invalid-feedback d-block">
                  {errors.selectedType}
                </div>
              ) : null}
              {loadingTypes && (
                <div className="text-muted small mt-1">Loading types...</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="apiKey" className="form-label">
                {lang("inverter.apiKey")}
              </label>
              <input
                type="text"
                id="apiKey"
                className={`form-control ${errors.apiKey ? "is-invalid" : ""}`}
                placeholder={lang("inverter.apiKeyPlaceholder")}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (errors.apiKey)
                    setErrors((prev) => ({ ...prev, apiKey: "" }));
                }}
              />
              {errors.apiKey ? (
                <div className="invalid-feedback d-block">{errors.apiKey}</div>
              ) : null}
            </div>

            <div className="mb-4">
              <label htmlFor="secretKey" className="form-label">
                {lang("inverter.secretKey")}
              </label>
              <input
                type="text"
                id="secretKey"
                className={`form-control ${
                  errors.secretKey ? "is-invalid" : ""
                }`}
                placeholder={lang("inverter.secretKeyPlaceholder")}
                value={secretKey}
                onChange={(e) => {
                  setSecretKey(e.target.value);
                  if (errors.secretKey)
                    setErrors((prev) => ({ ...prev, secretKey: "" }));
                }}
              />
              {errors.secretKey ? (
                <div className="invalid-feedback d-block">
                  {errors.secretKey}
                </div>
              ) : null}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleCloseModal}
            >
              {lang("common.cancel")}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={submitting}
            >
              {submitting ? lang("common.loading") : lang("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Table data={invertersData} columns={columns} />
      {modalMode && typeof document !== "undefined" && (
        <>
          {createPortal(backdropNode, document.body)}
          {createPortal(modalNode, document.body)}
        </>
      )}
    </>
  );
  
};

export default InverterTable;
