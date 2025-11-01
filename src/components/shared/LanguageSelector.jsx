"use client";

import { Box, Select, MenuItem, FormControl, InputAdornment } from '@mui/material'
import { FiGlobe } from 'react-icons/fi'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useLanguage()

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value)
  }

  return (
    <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select
          value={currentLanguage}
          onChange={handleLanguageChange}
          startAdornment={
            <InputAdornment position="start">
              <FiGlobe size={18} style={{ color: '#F6A623' }} />
            </InputAdornment>
          }
          sx={{
            fontSize: '0.875rem',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(246, 166, 35, 0.15)',
            border: '1px solid rgba(246, 166, 35, 0.2)',
            '& .MuiSelect-select': { 
              py: 0.75, 
              px: 2,
              fontWeight: 500
            },
            '&:hover': {
              borderColor: '#F6A623',
              boxShadow: '0 4px 12px rgba(246, 166, 35, 0.25)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 16px rgba(246, 166, 35, 0.3)',
            }
          }}
        >
          <MenuItem value="en" sx={{
            '&:hover': { backgroundColor: 'rgba(246, 166, 35, 0.1)' },
            '&.Mui-selected': { 
              backgroundColor: 'rgba(246, 166, 35, 0.15)',
              '&:hover': { backgroundColor: 'rgba(246, 166, 35, 0.2)' }
            }
          }}>
            🇺🇸 English
          </MenuItem>
          <MenuItem value="vi" sx={{
            '&:hover': { backgroundColor: 'rgba(246, 166, 35, 0.1)' },
            '&.Mui-selected': { 
              backgroundColor: 'rgba(246, 166, 35, 0.15)',
              '&:hover': { backgroundColor: 'rgba(246, 166, 35, 0.2)' }
            }
          }}>
            🇻🇳 Tiếng Việt
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
