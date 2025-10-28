"use client";
import React, { useState, memo, useEffect } from "react";
import Table from "@/components/shared/table/Table";
import { apiGet, apiDelete } from "@/lib/api";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

const InverterTable = () => {
  const { lang } = useLanguage();
  const [invertersData, setInvertersData] = useState([]);

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
    if (!window.confirm(lang('messages.confirmDelete'))) {
      return;
    }
    try {
      const response = await apiDelete(`/api/inverters/${inverterId}`);
      if (response.success) {
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
    window.addEventListener('inverter:saved', onSaved);
    return () => window.removeEventListener('inverter:saved', onSaved);
  }, []);

  const columns = [
    { accessorKey: "id", header: () => "ID" },
    { accessorKey: "companyName", header: () => lang('inverter.companyName') },
    { accessorKey: "inverterName", header: () => lang('inverter.inverterName') },
    { accessorKey: "inverter_type_id", header: () => lang('inverter.type') },
    { accessorKey: "apiKey", header: () => lang('inverter.apiKey') },
    { accessorKey: "secretKey", header: () => lang('inverter.secretKey') },
    {
      accessorKey: "actions",
      header: () => lang('common.actions'),
      cell: ({ row }) => (
        <div className="d-flex gap-2" style={{ flexWrap: "nowrap" }}>
          <FiEdit3
            size={18}
            onClick={() => {
              // Open modal for edit with prefilled data via window event
              const item = row.original;
              window.dispatchEvent(new CustomEvent('inverter:open-edit', { detail: { item } }));
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

  return (
    <>
      <Table data={invertersData} columns={columns} />
    </>
  );
};

export default InverterTable;
