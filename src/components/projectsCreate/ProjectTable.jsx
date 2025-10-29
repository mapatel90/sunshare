'use client'
import React, { useEffect, useState, memo } from 'react'
import Table from '@/components/shared/table/Table'
import { FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import SelectDropdown from '@/components/shared/SelectDropdown'
import Swal from 'sweetalert2'
import { apiGet, apiPut, apiDelete } from '@/lib/api'
import { useLanguage } from '@/contexts/LanguageContext'

const actions = [
  { label: "Edit", icon: <FiEdit3 /> },
  { label: "Print", icon: <FiPrinter /> },
  { type: "divider" },
  { label: "Delete", icon: <FiTrash2 />, },
]

const StatusDropdown = memo(({ value, onChange }) => {
  const { lang } = useLanguage()
  const statusOptions = [
    { label: lang('projects.active', 'Active'), value: '1' },
    { label: lang('projects.inactive', 'Inactive'), value: '0' },
  ]

  const handleChange = async (option) => {
    await onChange(option.value)
  }

  return (
    <SelectDropdown
      options={statusOptions}
      defaultSelect={String(value ?? 0)}
      onSelectOption={handleChange}
    />
  )
})

const ProjectTable = () => {
  const { lang } = useLanguage()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await apiGet('/api/projects?page=1&limit=20')
      if (res?.success) {
        setData(res.data.projects)
      }
    } catch (err) {
      console.error('Fetch projects failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleStatusChange = async (id, statusValue) => {
    try {
      const res = await apiPut(`/api/projects/${id}/status`, { status: parseInt(statusValue) })
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Status updated successfully',
          timer: 1000,
          showConfirmButton: false
        })
        fetchProjects()
      }
    } catch (err) {
      console.error('Status update error:', err)
    }
  }

  const columns = [
    {
      accessorKey: 'project_name',
      header: () => lang('projects.projectName', 'Project Name'),
      cell: info => info.getValue() || '-'
    },
    {
      accessorKey: 'project_type',
      header: () => lang('projects.projectType', 'Project Type'),
      cell: info => info.getValue() || '-'
    },
    {
      accessorKey: 'city.name',
      header: () => lang('projects.city', 'City'),
      cell: info => info.row.original.city?.name || '-'
    },
    {
      accessorKey: 'state.name',
      header: () => lang('projects.state', 'State'),
      cell: info => info.row.original.state?.name || '-'
    },
    {
      accessorKey: 'country.name',
      header: () => lang('projects.country', 'Country'),
      cell: info => info.row.original.country?.name || '-'
    },
    {
      accessorKey: 'offtaker',
      header: () => lang('projects.selectOfftaker', 'Offtaker'),
      cell: info => {
        const offtaker = info.getValue()
        if (!offtaker) return '-'
        return `${offtaker.firstName || ''} ${offtaker.lastName || ''}`.trim()
      }
    },
    {
      accessorKey: 'status',
      header: () => lang('projects.status', 'Status'),
      cell: info => (
        <StatusDropdown
          value={info.getValue()}
          onChange={(val) => handleStatusChange(info.row.original.id, val)}
        />
      )
    },
    {
      accessorKey: 'actions',
      header: () => lang('common.actions', 'Actions'),
      cell: info => {
        const id = info.row.original.id
        const rowActions = [
          { label: 'Edit', icon: <FiEdit3 />, link: `/admin/projects/edit/${id}` },
          { label: 'Print', icon: <FiPrinter /> },
          { type: 'divider' },
          { label: 'Delete', icon: <FiTrash2 />, onClick: async () => {
              try {
                const confirm = await Swal.fire({
                  icon: 'warning',
                  title: 'Are you sure?',
                  text: 'This action cannot be undone.',
                  showCancelButton: true,
                  confirmButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!'
                })
                if (confirm.isConfirmed) {
                  setLoading(true)
                  await apiDelete(`/api/projects/${id}`)
                  await Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1000, showConfirmButton: false })
                  fetchProjects()
                }
              } catch (e) {
                console.error('Delete project failed:', e)
                Swal.fire({ icon: 'error', title: 'Error', text: e.message || 'Failed to delete project' })
              } finally {
                setLoading(false)
              }
            } },
        ]
        return (
          <div className="hstack gap-2 justify-content-end">
            <a href={`/admin/projects/view/${id}`} className="avatar-text avatar-md">
              <FiEye />
            </a>
            <Dropdown dropdownItems={rowActions} triggerClass='avatar-md' triggerIcon={<FiMoreHorizontal />} />
          </div>
        )
      },
      meta: { headerClassName: 'text-end' }
    },
  ]

  return (
    <>
      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : (
        <Table data={data} columns={columns} />
      )}
    </>
  )
}

export default ProjectTable
