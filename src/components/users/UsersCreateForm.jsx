'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiPost, apiGet } from '@/lib/api'
import Swal from 'sweetalert2'
import { useLanguage } from '@/contexts/LanguageContext'
import UserForm from './UserForm'

const UsersCreateForm = () => {
  const router = useRouter()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(false)

  const params = { status: 1 };   // e.g. 1

  const queryString = new URLSearchParams(params).toString();

  // roles will be passed into UserForm via initialData.roles

  // Load active roles for the User Role dropdown
  useEffect(() => {
    let mounted = true
    const fetchRoles = async () => {
      setLoadingRoles(true)
      try {
        const res = await apiGet(`/api/roles?${queryString}`)
        if (!mounted) return
        if (res && res.success && Array.isArray(res.data.roles)) {
          setRoles(res.data.roles)
        } else if (Array.isArray(res)) {
          // fallback in case api helper returns array directly
          setRoles(res)
        }
      } catch (err) {
        console.error('Error loading roles:', err)
      } finally {
        if (mounted) setLoadingRoles(false)
      }
    }

    fetchRoles()

    return () => { mounted = false }
  }, [])

  // Load active roles for the User Role dropdown
  useEffect(() => {
    let mounted = true
    const params = { status: 1 }
    const queryString = new URLSearchParams(params).toString()

    const fetchRoles = async () => {
      setLoadingRoles(true)
      try {
        const res = await apiGet(`/api/roles?${queryString}`)
        if (!mounted) return
        if (res && res.success && Array.isArray(res.data.roles)) {
          setRoles(res.data.roles)
        } else if (Array.isArray(res)) {
          setRoles(res)
        }
      } catch (err) {
        console.error('Error loading roles:', err)
      } finally {
        if (mounted) setLoadingRoles(false)
      }
    }

    fetchRoles()

    return () => { mounted = false }
  }, [])

  // create handler passed to shared form
  const handleCreate = async (submitData) => {
    try {
      setLoading(true)
      const response = await apiPost('/api/users', submitData)
      if (response.success) {
        await Swal.fire({ icon: 'success', title: 'Success!', text: 'User created successfully', timer: 1500, showConfirmButton: false })
        router.push('/admin/users/list')
      } else {
        throw new Error((response && response.message) || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      await Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to create user' })
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserForm
      initialData={{}}
      roles={roles}
      includePassword={true}
      onSubmit={handleCreate}
    />
  )
}

export default UsersCreateForm