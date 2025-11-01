'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const invoicesPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/invoice/list')
  }, [router])

  return null
}

export default invoicesPage