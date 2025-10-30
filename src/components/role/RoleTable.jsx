"use client";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiTrash2, FiEdit3, FiPlus } from "react-icons/fi";
import Table from "@/components/shared/table/Table";
import RoleHeaderSetting from "./RoleHeader";
import { showSuccessToast } from "@/utils/topTost";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";

const RoleTable = () => {
  const { lang } = useLanguage();
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [modalMode, setModalMode] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [error, setError] = useState("");

  /** ✅ Fetch all roles */
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await apiGet("/api/roles/");
      if (response.success && response.data.roles) {
        setRolesData(response.data.roles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  /** ✅ Open Add Modal */
  const handleAdd = () => {
    setModalMode("add");
    setRoleName("");
    setStatus("");
    setEditingRole(null);
    setError("");
  };

  /** ✅ Open Edit Modal */
  const handleEdit = (role) => {
    setModalMode("edit");
    setEditingRole(role);
    setRoleName(role.name);
    setStatus(role.status.toString());
    setError("");
  };

  /** ✅ Close Modal */
  const handleClose = () => {
    setModalMode(null);
    setRoleName("");
    setStatus("");
    setEditingRole(null);
    setError("");
  };

  /** ✅ Add / Update Role */
  const handleSubmit = async () => {
    if (!roleName.trim()) {
      setError(lang("roles.roleNameRequired") || "Role name is required");
      return;
    }

    try {
      let response;
      if (modalMode === "add") {
        response = await apiPost("/api/roles/", {
          name: roleName,
          status: status === "" ? 1 : parseInt(status),
        });
      } else {
        response = await apiPut(`/api/roles/${editingRole.id}`, {
          name: roleName,
          status: parseInt(status),
        });
      }

      if (response.success) {
        showSuccessToast(
          modalMode === "add"
            ? lang("roles.createdSuccessfully") || "Role created successfully"
            : lang("roles.updatedSuccessfully") || "Role updated successfully"
        );
        handleClose();
        fetchRoles(); // refresh table
      } else {
        setError(response.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Role save error:", err);
      setError("Server error");
    }
  };

  /** ✅ Delete Role */
  const handleDelete = async (roleId) => {
    const result = await Swal.fire({
      title: lang("messages.confirmDelete") || "Are you sure you want to delete this role?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: lang("common.yesDelete") || "Yes, delete it!",
      cancelButtonText: lang("common.cancel") || "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      const response = await apiDelete(`/api/roles/${roleId}`);
      if (response.success) {
        showSuccessToast(lang("roles.deletedSuccessfully") || "Role deleted successfully");
        fetchRoles();
      } else {
        alert(response.message || "Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Failed to delete role");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  /** ✅ Table Columns */
  const columns = [
    {
      accessorKey: "name",
      header: () => lang("roles.roleName"),
      cell: (info) => {
        const roleName = info.getValue();
        return (
          <div className="hstack gap-3">
            <div className="text-white avatar-text user-avatar-text avatar-md">
              {roleName?.substring(0, 1)}
            </div>
            <div>
              <span className="fw-semibold">{roleName}</span>
              <small className="fs-12 text-muted d-block">
                {lang("roles.roleManagement")}
              </small>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => lang("common.status"),
      cell: (info) => {
        const status = info.getValue();
        const config = {
          1: { label: lang("common.active"), color: "#17c666" },
          0: { label: lang("common.inactive"), color: "#ea4d4d" },
        }[status] || { label: "Unknown", color: "#999" };

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
      header: () => lang("table.actions"),
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="d-flex gap-3">
            <FiEdit3
              size={18}
              onClick={() => handleEdit(row)}
              style={{
                color: "#007bff",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
            />
            <FiTrash2
              size={18}
              onClick={() => handleDelete(row.id)}
              style={{
                color: "#dc3545",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
            />
          </div>
        );
      },
    },
  ];

  /** ✅ Loader */
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  /** ✅ Render */
  const backdropNode = (
    <div
      className="modal-backdrop fade show"
      style={{ zIndex: 1050 }}
      onClick={handleClose}
      data-testid="modal-backdrop"
    />
  );
  const modalNode = (
    <div
      className="modal fade show"
      id="roleCrudModal"
      tabIndex="-1"
      style={{ display: "block", zIndex: 1055 }}
      aria-modal="true"
      role="dialog"
      onClick={handleClose}
    >
      <div
        className="modal-dialog"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {modalMode === "add"
                ? lang("roles.addRole")
                : `${lang("common.edit")} ${lang("roles.role")}`}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="roleName" className="form-label">
                {lang("roles.role")}
              </label>
              <input
                id="roleName"
                type="text"
                placeholder={lang("roles.roleName")}
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="form-control"
              />
              {error ? (
                <div className="invalid-feedback d-block">{error}</div>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="roleStatus" className="form-label">
                {lang("common.status")}
              </label>
              <select
                id="roleStatus"
                className="form-label form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">{lang("roles.selectStatus")}</option>
                <option value="1">{lang("common.active")}</option>
                <option value="0">{lang("common.inactive")}</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleClose}
            >
              {lang("common.cancel")}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {modalMode === "add"
                ? lang("common.save")
                : lang("common.update")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>

      {/* Table */}
      <div className="content-area" data-scrollbar-target="#psScrollbarInit">

      {/* Header with Add Role button triggers modal */}
      <RoleHeaderSetting onAddRole={handleAdd} isSubmitting={false} />

        <div className="content-area-body">
            <div className="card-body">
              <Table data={rolesData} columns={columns} />
              {/* Render modal and backdrop into body only when modal open */}
              {(modalMode === "add" || modalMode === "edit") && typeof document !== "undefined" && (
                <>
                  {createPortal(backdropNode, document.body)}
                  {createPortal(modalNode, document.body)}
                </>
              )}
            </div>
        </div>
      </div>
    </>
  );
};

export default RoleTable;
