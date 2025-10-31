"use client";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

const InvoiceHeader = () => {
  const { lang } = useLanguage();

  const openAddModal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("invoice:open-edit", { detail: { item: null } }));
    }
  };

  return (
    <div className="d-flex align-items-center">
      <button className="btn btn-primary" type="button" onClick={openAddModal}>
        <FiPlus className="me-2" size={17} />
        {lang("invoice.addInvoice")}
      </button>
    </div>
  );
};

export default InvoiceHeader;

