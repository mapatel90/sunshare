"use client";
import React, { useState, useEffect } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiTrash2, FiEdit3, FiPlus } from "react-icons/fi";
import Table from "@/components/shared/table/Table";

const RoleTable = () => {
  const { lang } = useLanguage();
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
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
    setOpenModal(true);
  };

  /** ✅ Open Edit Modal */
  const handleEdit = (role) => {
    setModalMode("edit");
    setEditingRole(role);
    setRoleName(role.name);
    setStatus(role.status.toString());
    setError("");
    setOpenModal(true);
  };

  /** ✅ Close Modal */
  const handleClose = () => {
    setOpenModal(false);
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
    if (
      !window.confirm(
        lang("messages.confirmDelete") ||
          "Are you sure you want to delete this role?"
      )
    )
      return;

    try {
      const response = await apiDelete(`/api/roles/${roleId}`);
      if (response.success) {
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
  return (
    <>
      {/* Add Role Button */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={handleAdd}>
          <FiPlus size={16} className="me-2" />
          {lang("roles.addRole")}
        </button>
      </div>

      {/* Table */}
      <Table data={rolesData} columns={columns} />

      {/* ✅ Modal */}
      {openModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-container"
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #eee",
                background: "#f8f9fa",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                {modalMode === "add"
                  ? lang("roles.addRole")
                  : `${lang("common.edit")} ${lang("roles.role")}`}
              </h5>
              <button
                onClick={handleClose}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px" }}>
              <div className="mb-3">
                <label
                  htmlFor="roleName"
                  style={{ fontWeight: 500, marginBottom: 8 }}
                >
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
                {error && <small style={{ color: "red" }}>{error}</small>}
              </div>

              <div className="mb-3">
                <label htmlFor="roleStatus" style={{ fontWeight: 500 }}>
                  {lang("common.status")}
                </label>
                <select
                  id="roleStatus"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">{lang("roles.selectStatus")}</option>
                  <option value="1">{lang("common.active")}</option>
                  <option value="0">{lang("common.inactive")}</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #eee",
                background: "#f8f9fa",
                textAlign: "right",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn btn-secondary me-2"
                onClick={handleClose}
              >
                {lang("common.cancel")}
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {modalMode === "add"
                  ? lang("common.save")
                  : lang("common.update")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoleTable;
