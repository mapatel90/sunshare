"use client";
import React from "react";
import RoleTable from "./RoleTable";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiPost, apiPut } from "@/lib/api";

const page = () => {
  const { lang } = useLanguage();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  const handleOpen = () => {
    setModalMode("add");
    setEditingRole(null);
    setRoleName("");
    setStatus("");
    setError("");
    setOpenModal(true);
  };

  const handleEdit = (role) => {
    setModalMode("edit");
    setEditingRole(role);
    setRoleName(role.name);
    setStatus(role.status.toString());
    setError("");
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setModalMode("add");
    setEditingRole(null);
    setRoleName("");
    setStatus("");
    setError("");
  };

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
        // Edit mode
        response = await apiPut(`/api/roles/${editingRole.id}`, {
          name: roleName,
          status: parseInt(status),
        });
      }

      if (response.success) {
        handleClose();
        setRefresh(!refresh); // ✅ Update table list
      } else {
        setError(response.message || "Something went wrong");
      }
    } catch (err) {
      console.error(modalMode === "add" ? "Role insert error:" : "Role update error:", err);
      setError("Server error");
    }
  };

  return (
    <div className="content-area" data-scrollbar-target="#psScrollbarInit">
      {/* <PageHeader>
        <ProjectsListHeader />
      </PageHeader> */}
      <div className="content-area-body">
        <div className="card mb-0">
          <div className="card-body">
            {/* ✅ Button to Open Modal */}
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-primary" onClick={handleOpen}>
                + {lang("roles.addRole")}
              </button>
            </div>

            <div className="main-content">
              <div className="row">
                <RoleTable refresh={refresh} onEdit={handleEdit} />
              </div>
            </div>

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
                  background: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(3px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1050,
                  transition: "opacity 0.3s ease-in-out",
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
                    animation: "slideIn 0.3s ease",
                    transform: "translateY(0)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="modal-header"
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <h5
                      className="modal-title"
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {modalMode === "add" ? lang("roles.addRole") : `${lang("common.edit")} ${lang("roles.role")}`}
                    </h5>
                    <button
                      className="btn-close"
                      onClick={handleClose}
                      style={{
                        border: "none",
                        background: "transparent",
                        fontSize: "20px",
                        color: "#666",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div
                    className="modal-body"
                    style={{
                      padding: "20px",
                      backgroundColor: "#fff",
                    }}
                  >
                    {/* Modal Form */}
                    <div className="mb-3">
                      <label
                        htmlFor="roleName"
                        className="form-label"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          color: "#444",
                        }}
                      >
                        {lang("roles.role")}
                      </label>
                      <input
                        id="roleName"
                        type="text"
                        placeholder={lang("roles.roleName")}
                        className="form-control"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          fontSize: "14px",
                        }}
                      />
                       {error && (
                        <small style={{ color: "red" }}>{error}</small>
                      )}
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="roleStatus"
                        className="form-label"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          color: "#444",
                        }}
                      >
                        {lang("common.status")}
                      </label>
                      <select
                        id="roleStatus"
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          fontSize: "14px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <option value="">{lang("roles.selectStatus")}</option>
                        <option value="1">{lang("common.active")}</option>
                        <option value="0">{lang("common.inactive")}</option>
                      </select>
                    </div>
                  </div>

                  <div
                    className="modal-footer"
                    style={{
                      padding: "16px 20px",
                      borderTop: "1px solid #eee",
                      backgroundColor: "#f8f9fa",
                      textAlign: "right",
                    }}
                  >
                    <button
                      className="btn btn-secondary me-2"
                      onClick={handleClose}
                      style={{
                        backgroundColor: "#6c757d",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        color: "#fff",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      {lang("common.cancel")}
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      style={{
                        backgroundColor: "#007bff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        color: "#fff",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      {modalMode === "add" ? lang("common.save") : lang("common.update")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
