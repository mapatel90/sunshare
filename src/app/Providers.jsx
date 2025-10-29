'use client'
import React from 'react'
import NavigationProvider from '@/contentApi/navigationProvider'
import SettingSideBarProvider from '@/contentApi/settingSideBarProvider'
import AuthProvider from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

const Providers = ({ children }) => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SettingSideBarProvider>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </SettingSideBarProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default Providers


