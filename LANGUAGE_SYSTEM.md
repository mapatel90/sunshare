# Multi-Language System (English & Vietnamese)

This application now supports two languages: **English** and **Tiếng Việt (Vietnamese)**.

## Features Implemented

### 1. Language Context Provider
- Located at: `src/contexts/LanguageContext.js`
- Manages current language state
- Provides translation function `t()`
- Persists language selection in localStorage

### 2. Translation Files
- English: `src/translations/en.json`
- Vietnamese: `src/translations/vi.json`
- Organized in nested structures for easy management

### 3. Language Selector in Header
- Updated `LanguagesModal.jsx` component
- Shows current language flag
- Dropdown with both language options
- Visual indication of active language

### 4. Updated Components
- `LoginForm.jsx` - Login form with translations
- `RegisterForm.jsx` - Registration form with translations
- Header navigation labels

## How to Use

### In Your Components

```jsx
'use client'
import { useLanguage } from '@/contexts/LanguageContext'

const MyComponent = () => {
  const { t, currentLanguage, changeLanguage } = useLanguage()
  
  return (
    <div>
      <h1>{t('navigation.dashboard')}</h1>
      <button onClick={() => changeLanguage('vi')}>
        Switch to Vietnamese
      </button>
      <p>{t('messages.success')}</p>
    </div>
  )
}
```

### Translation Key Structure

```
header.* - Header-related translations
navigation.* - Navigation menu items
authentication.* - Login/Register forms
common.* - Common actions (save, cancel, edit, etc.)
messages.* - Success/error messages
validation.* - Form validation messages
```

### Examples

**English:**
- `t('authentication.login')` → "Login"
- `t('common.save')` → "Save"
- `t('navigation.dashboard')` → "Dashboard"

**Vietnamese:**
- `t('authentication.login')` → "Đăng nhập"
- `t('common.save')` → "Lưu"
- `t('navigation.dashboard')` → "Bảng điều khiển"

## Language Switching

Users can switch languages by:
1. Clicking the flag icon in the header
2. Selecting their preferred language from the dropdown
3. The selection is automatically saved and persists across sessions

## Adding New Languages

1. Create a new translation file in `src/translations/` (e.g., `fr.json`)
2. Add the language to `LANGUAGES` object in `LanguageContext.js`
3. Add the appropriate flag image in `public/images/flags/4x3/`

## Adding New Translations

1. Add the key-value pair to both `en.json` and `vi.json`
2. Use nested objects to organize related translations
3. Use the `t()` function in your components

Example:
```json
// en.json
{
  "products": {
    "title": "Products",
    "add": "Add Product",
    "edit": "Edit Product"
  }
}

// vi.json  
{
  "products": {
    "title": "Sản phẩm",
    "add": "Thêm sản phẩm", 
    "edit": "Sửa sản phẩm"
  }
}
```

Then use: `t('products.title')`, `t('products.add')`, etc.

## Demo Page

Visit `/admin/language-demo` to see a comprehensive demonstration of the language system in action.

## Technical Details

- Uses React Context for state management
- Automatic fallback to English if translation missing
- Updates HTML `lang` attribute automatically
- Responsive design for language selector
- No page refresh required for language switching