"use client";
import React, { useState, useEffect } from "react";
import Table from "@/components/shared/table/Table";
import { apiGet, apiDelete } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

const RoleTable = ({ refresh = false, onEdit }) => {
  const { lang } = useLanguage();
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localRefresh, setLocalRefresh] = useState(false);

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

  const handleDelete = async (roleId) => {
    if (!window.confirm(lang("messages.confirmDelete") || "Are you sure you want to delete this role?")) {
      return;
    }

    try {
      const response = await apiDelete(`/api/roles/${roleId}`);
      if (response.success) {
        setLocalRefresh(!localRefresh);
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
  }, [refresh, localRefresh]);

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
              <span className="text-truncate-1-line fw-semibold">
                {roleName}
              </span>
              <small className="fs-12 fw-normal text-muted d-block">
                {lang("roles.roleManagement")}
              </small>
            </div>
          </div>
        );
      },
      meta: {
        headerClassName: "w-40",
        className: "role-name-td",
      },
    },
    {
      accessorKey: "status",
      header: () => lang("common.status"),
      cell: (info) => {
        const status = info.getValue();
        const statusConfig = {
          1: {
            label: lang("common.active"),
            class: "badge-success",
            bgColor: "#17c666",
          },
          0: {
            label: lang("common.inactive"),
            class: "badge-danger",
            bgColor: "#ea4d4d",
          },
        };
        const config = statusConfig[status] || statusConfig[0];
        return (
          <span
            className={`badge ${config.class}`}
            style={{
              backgroundColor: config.bgColor,
              color: config.textColor,
            }}
          >
            {config.label}
          </span>
        );
      },
      meta: {
        headerClassName: "w-40"
      },
    },

    {
      accessorKey: "actions",
      header: () => lang("table.actions"),
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="d-flex gap-2" style={{ flexWrap: "nowrap" }}>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              style={{ minWidth: "70px" }}
              onClick={() => onEdit && onEdit(row)}
            >
              {lang("common.edit")}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              style={{ minWidth: "70px" }}
              onClick={() => handleDelete(row.id)}
            >
              {lang("common.delete")}
            </button>
          </div>
        );
      },
      meta: {
        headerClassName: "w-20",
        className: "actions-column",
      },
    },
  ];

  if (loading) {
    return (
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Table data={rolesData} columns={columns} />
    </>
  );
};

export default RoleTable;
