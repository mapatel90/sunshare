/**
 * Authentication Context
 * Manages user authentication state and provides login/logout functions.
 */

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Get backend URL from environment variable
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setLoading(false)
        return
      }

      // Verify token by calling your backend server
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        
        // Transform user data to match frontend expectations
        const transformedUser = {
          id: data.data.id,
          name: `${data.data.firstName} ${data.data.lastName}`,
          email: data.data.email,
          phone: data.data.phoneNumber,
          role: data.data.userRole,
          status: data.data.status === 1 ? 'active' : 'inactive',
          avatar: data.data.avatar || null
        }
        
        setUser(transformedUser)
      } else {
        // Token invalid, remove it
        localStorage.removeItem('accessToken')
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('accessToken')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('🔄 Attempting login for:', email)
      
      // Use your backend server from environment variable
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      console.log('📡 Login API response:', data)

      if (data.success) {
        // Backend returns user with firstName, lastName structure
        const userName = `${data.data.user.firstName} ${data.data.user.lastName}`
        console.log('✅ Login successful for user:', userName)
        
        // Store token (backend returns 'token', not 'accessToken')
        localStorage.setItem('accessToken', data.data.token)
        
        // Set cookie for middleware
        document.cookie = `accessToken=${data.data.token}; path=/; max-age=86400` // 24 hours
        
        // Transform user data to match frontend expectations
        const transformedUser = {
          id: data.data.user.id,
          name: userName,
          email: data.data.user.email,
          phone: data.data.user.phoneNumber,
          role: data.data.user.userRole,
          status: data.data.user.status === 1 ? 'active' : 'inactive',
          avatar: data.data.user.avatar || null
        }
        
        // Set user
        setUser(transformedUser)
        
        // Redirect to dashboard
        router.push('/admin/dashboards/analytics')
        
        return { success: true, message: data.message }
      } else {
        console.log('❌ Login failed:', data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      return { success: false, message: `Network error. Please check your backend server is running at ${BACKEND_URL}` }
    }
  }

  const logout = () => {
    // Clear storage
    localStorage.removeItem('accessToken')
    
    // Clear cookie
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    
    // Clear user
    setUser(null)
    
    // Redirect to login
    router.push('/login')
  }

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}