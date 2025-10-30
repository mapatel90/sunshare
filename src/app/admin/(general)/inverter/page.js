'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const InvertersPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/inverter/list')
  }, [router])

  return null
}

export default InvertersPage