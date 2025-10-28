"use client";
import React from "react";
import { FiPlus } from "react-icons/fi";
import InverterTable from "@/components/inverter/InverterTable";
import { useLanguage } from "@/contexts/LanguageContext";

const Inverter = () => {
  const { lang } = useLanguage();
  return (
    <div className="main-content">
      <div className="row">
        <div className="col-12">
          <div className="card stretch stretch-full">
            <div className="card-body">
              <div className="d-flex justify-content-end mb-3">
                <a
                  href="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#addNewInverter"
                >
                  <FiPlus size={17} className="me-2" />
                  <span>{lang('inverter.addInverter')}</span>
                </a>
              </div>

              <div className="main-content">
                <InverterTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inverter;
