"use client";
import React from "react";
import RoleTable from "./RoleTable"; // Adjust import path if needed

const Role = () => {
  return (
    <div className="content-area" data-scrollbar-target="#psScrollbarInit">
      <div className="content-area-body">
        <div className="card mb-0">
          <div className="card-body">
            <RoleTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;
