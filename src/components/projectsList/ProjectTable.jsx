'use client'
import React, { useState, useEffect } from 'react'
import Table from '@/components/shared/table/Table';
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import { apiGet } from '@/lib/api';

const actions = [
    { label: "Edit", icon: <FiEdit3 /> },
    { label: "Print", icon: <FiPrinter /> },
    { label: "Remind", icon: <FiClock /> },
    { type: "divider" },
    { label: "Archive", icon: <FiArchive /> },
    { label: "Report Spam", icon: <FiAlertOctagon />, },
    { type: "divider" },
    { label: "Delete", icon: <FiTrash2 />, },
];


const ProjectTable = () => {
    const [rolesData, setRolesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                const response = await apiGet('/api/roles/');
                if (response.success && response.data.roles) {
                    setRolesData(response.data.roles);
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
    }, []);

    const columns = [
        {
            accessorKey: 'id',
            header: ({ table }) => {
                return (
                    <input
                        type="checkbox"
                        className="custom-table-checkbox"
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                );
            },
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="custom-table-checkbox"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            meta: {
                headerClassName: 'width-30',
            },
        },

        {
            accessorKey: 'name',
            header: () => 'Role Name',
            cell: (info) => {
                const roleName = info.getValue();
                return (
                    <div className="hstack gap-3">
                        <div className="text-white avatar-text user-avatar-text avatar-md">{roleName?.substring(0, 1)}</div>
                        <div>
                            <span className="text-truncate-1-line fw-semibold">{roleName}</span>
                            <small className="fs-12 fw-normal text-muted d-block">Role Management</small>
                        </div>
                    </div>
                )
            },
            meta: {
                className: 'role-name-td'
            }
        },
        {
            accessorKey: 'status',
            header: () => 'Status',
            cell: (info) => {
                const status = info.getValue();
                const statusConfig = {
                    1: { label: 'Active', class: 'badge-success' },
                    0: { label: 'Inactive', class: 'badge-danger' }
                };
                const config = statusConfig[status] || statusConfig[0];
                return (
                    <span className={`badge ${config.class}`}>
                        {config.label}
                    </span>
                );
            }
        },
        {
            accessorKey: 'createdAt',
            header: () => 'Created At',
            cell: (info) => {
                const date = info.getValue();
                if (!date) return '-';
                return new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        },
        {
            accessorKey: 'updatedAt',
            header: () => 'Updated At',
            cell: (info) => {
                const date = info.getValue();
                if (!date) return '-';
                return new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        },
        {
            accessorKey: 'actions',
            header: () => "Actions",
            cell: info => (
                <div className="hstack gap-2 justify-content-end">
                    <a href="proposal-view.html" className="avatar-text avatar-md">
                        <FiEye />
                    </a>
                    <Dropdown dropdownItems={actions} triggerClassNaclassName='avatar-md' triggerPosition={"0,21"} triggerIcon={<FiMoreHorizontal />} />
                </div>
            ),
            meta: {
                headerClassName: 'text-end'
            }
        },
    ]

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
    )
}

export default ProjectTable
