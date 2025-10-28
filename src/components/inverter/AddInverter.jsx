"use client";
import { useEffect, useState } from "react";
import SelectDropdown from "@/components/shared/SelectDropdown";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

const AddInverter = () => {
  const { lang } = useLanguage();
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [typesError, setTypesError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [inverterName, setInverterName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const showModal = (id) => {
    const modalEl = typeof document !== 'undefined' && document.getElementById(id);
    if (!modalEl) return;
    try {
      if (window.bootstrap?.Modal) {
        const instance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        instance.show();
        return;
      }
    } catch {}
    // Fallback if Bootstrap JS not available
    modalEl.classList.add('show');
    modalEl.style.display = 'block';
    modalEl.removeAttribute('aria-hidden');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('role', 'dialog');
    document.body.classList.add('modal-open');
    if (!document.querySelector('.modal-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  };

  const hideModal = (id) => {
    const modalEl = typeof document !== 'undefined' && document.getElementById(id);
    if (!modalEl) return;
    try {
      if (window.bootstrap?.Modal) {
        const instance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        instance.hide();
        return;
      }
    } catch {}
    // Fallback
    modalEl.classList.remove('show');
    modalEl.style.display = 'none';
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.removeAttribute('aria-modal');
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  };

  const handleAdd = async () => {
    const requiredMsg = lang('validation.required');
    const newErrors = {
      companyName: !companyName ? requiredMsg : '',
      inverterName: !inverterName ? requiredMsg : '',
      selectedType: !selectedType?.value ? requiredMsg : '',
      apiKey: !apiKey ? requiredMsg : '',
      secretKey: !secretKey ? requiredMsg : '',
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
        : await apiPost('/api/inverters/', payload);

      // Notify listeners (e.g., table) to refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('inverter:saved'));
      }

      // Close modal
      hideModal('addNewInverter');

      // Reset form
      setCompanyName("");
      setInverterName("");
      setApiKey("");
      setSecretKey("");
      setSelectedType(null);
      setEditingId(null);
    } catch (e) {
      // Optionally show a generic error UI here if needed
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Fetch inverter types
  const fetchTypes = async () => {
    try {
      setLoadingTypes(true);
      setTypesError("");

    const res = await apiGet("/api/inverterTypes");
    const items = Array.isArray(res?.data) ? res.data : [];

      // Map API data → dropdown options
    const mapped = items.map((it) => ({
      label: it.type,
      value: String(it.id),
    }));

    // Prepend static placeholder option to support default selection label
    setTypeOptions([
      { label: lang('inverter.selectType'), value: 'select type' },
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

  // Support edit mode via window event, similar to Role CRUD
  useEffect(() => {
    const openEdit = (e) => {
      const item = e?.detail?.item;
      if (!item) return;
      setEditingId(item.id || null);
      setCompanyName(item.companyName || "");
      setInverterName(item.inverterName || "");
      setApiKey(item.apiKey || "");
      setSecretKey(item.secretKey || "");
      setErrors({});
      if (item.inverter_type_id) {
        // From table, inverter_type_id is the type name (joined on list API)
        const found = typeOptions.find(o => o.label === item.inverter_type_id) || null;
        setSelectedType(found);
      }

      // Show modal (works with or without Bootstrap JS)
      showModal('addNewInverter');
    };
    window.addEventListener('inverter:open-edit', openEdit);
    return () => window.removeEventListener('inverter:open-edit', openEdit);
  }, [typeOptions]);

  return (
    <div className="modal fade" id="addNewInverter" tabIndex="-1">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingId ? lang('inverter.editInverter') : lang('inverter.addInverter')}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {/* Company Name */}
            <div className="mb-4">
              <label htmlFor="companyName" className="form-label">
                {lang('inverter.companyName')}
              </label>
              <input
                type="text"
                id="companyName"
                className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                placeholder={lang('inverter.companyNamePlaceholder')}
                value={companyName}
                onChange={(e) => { setCompanyName(e.target.value); if (errors.companyName) setErrors(prev => ({ ...prev, companyName: '' })); }}
              />
              {errors.companyName ? <div className="invalid-feedback d-block">{errors.companyName}</div> : null}
            </div>

            {/* Inverter Name */}
            <div className="mb-4">
              <label htmlFor="inverterName" className="form-label">
                {lang('inverter.inverterName')}
              </label>
              <input
                type="text"
                id="inverterName"
                className={`form-control ${errors.inverterName ? 'is-invalid' : ''}`}
                placeholder={lang('inverter.inverterNamePlaceholder')}
                value={inverterName}
                onChange={(e) => { setInverterName(e.target.value); if (errors.inverterName) setErrors(prev => ({ ...prev, inverterName: '' })); }}
              />
              {errors.inverterName ? <div className="invalid-feedback d-block">{errors.inverterName}</div> : null}
            </div>

            {/* ✅ Type Dropdown (same behavior as TaskStatus) */}
            <div className="form-group mb-4">
              <label className="form-label">{lang('inverter.type')}</label>

              {typesError ? (
                <div className="text-danger small">{typesError}</div>
              ) : (
                <SelectDropdown
                  options={typeOptions}
                  defaultSelect={lang('inverter.selectType')}
                  selectedOption={selectedType}
                  onSelectOption={(option) => { setSelectedType(option); if (errors.selectedType) setErrors(prev => ({ ...prev, selectedType: '' })); }}
                />
              )}

              {errors.selectedType ? (
                <div className="invalid-feedback d-block">{errors.selectedType}</div>
              ) : null}

              {loadingTypes && (
                <div className="text-muted small mt-1">Loading types...</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="apiKey" className="form-label">
                {lang('inverter.apiKey')}
              </label>
              <input
                type="text"
                id="apiKey"
                className={`form-control ${errors.apiKey ? 'is-invalid' : ''}`}
                placeholder={lang('inverter.apiKeyPlaceholder')}
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); if (errors.apiKey) setErrors(prev => ({ ...prev, apiKey: '' })); }}
              />
              {errors.apiKey ? <div className="invalid-feedback d-block">{errors.apiKey}</div> : null}
            </div>

            <div className="mb-4">
              <label htmlFor="secretKey" className="form-label">
                {lang('inverter.secretKey')}
              </label>
              <input
                type="text"
                id="secretKey"
                className={`form-control ${errors.secretKey ? 'is-invalid' : ''}`}
                placeholder={lang('inverter.secretKeyPlaceholder')}
                value={secretKey}
                onChange={(e) => { setSecretKey(e.target.value); if (errors.secretKey) setErrors(prev => ({ ...prev, secretKey: '' })); }}
              />
              {errors.secretKey ? <div className="invalid-feedback d-block">{errors.secretKey}</div> : null}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={() => {
                setCompanyName("");
                setInverterName("");
                setApiKey("");
                setSecretKey("");
                setSelectedType(null);
                setEditingId(null);
                setErrors({});
                hideModal('addNewInverter');
              }}
            >
              {lang('common.cancel')}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={submitting}
            >
              {submitting
                ? (editingId ? lang('common.loading') : lang('common.loading'))
                : (editingId ? lang('common.saveChanges') : lang('common.add'))}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInverter;
