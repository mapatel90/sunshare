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

      // Verify token by calling API
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.data.user)
      } else {
        // Token invalid, remove it
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('🔄 Attempting login for:', email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      console.log('📡 Login API response:', data)

      if (data.success) {
        console.log('✅ Login successful for user:', data.data.user.name)
        
        // Store tokens
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        
        // Set cookie for middleware
        document.cookie = `accessToken=${data.data.accessToken}; path=/; max-age=86400` // 24 hours
        
        // Set user
        setUser(data.data.user)
        
        // Redirect to dashboard
        router.push('/admin/dashboards/analytics')
        
        return { success: true, message: data.message }
      } else {
        console.log('❌ Login failed:', data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      return { success: false, message: 'Network error. Please check your connection and try again.' }
    }
  }

  const logout = () => {
    // Clear storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    
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