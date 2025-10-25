'use client'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const LanguageDemo = () => {
  const { t, currentLanguage, currentLanguageInfo, changeLanguage, languages } = useLanguage()

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Multi-Language System Demo</h4>
              <p className="card-subtitle">Current Language: <strong>{currentLanguageInfo.name}</strong> ({currentLanguage})</p>
            </div>
            <div className="card-body">
              
              {/* Language Switcher Buttons */}
              <div className="mb-4">
                <h5>Quick Language Switch:</h5>
                <div className="btn-group" role="group">
                  {Object.values(languages).map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`btn ${currentLanguage === lang.code ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      <img src={lang.flag} alt={lang.name} width="20" className="me-2" />
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Header Translations */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card border-primary">
                    <div className="card-header bg-primary text-white">
                      <h6 className="card-title mb-0">{t('menu.dashboards')} {t('navigation.navigation')}</h6>
                    </div>
                    <div className="card-body">
                      <h6 className="text-primary">Main Menu Items:</h6>
                      <ul className="list-unstyled mb-3">
                        <li>• {t('menu.dashboards')}</li>
                        <li>• {t('menu.payment')}</li>
                        <li>• {t('menu.customers')}</li>
                        <li>• {t('menu.projects')}</li>
                        <li>• {t('menu.settings')}</li>
                      </ul>
                      <h6 className="text-primary">Sub Menu Items:</h6>
                      <ul className="list-unstyled">
                        <li>• {t('menu.analytics')}</li>
                        <li>• {t('menu.customersview')}</li>
                        <li>• {t('menu.customerscreate')}</li>
                        <li>• {t('menu.projectsview')}</li>
                        <li>• {t('menu.general')}</li>
                        <li>• {t('menu.rolesmanagement')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card border-success">
                    <div className="card-header bg-success text-white">
                      <h6 className="card-title mb-0">{t('authentication.login')} Form</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">{t('authentication.email')}</label>
                        <input type="email" className="form-control" placeholder={t('authentication.email')} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">{t('authentication.password')}</label>
                        <input type="password" className="form-control" placeholder={t('authentication.password')} />
                      </div>
                      <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="rememberDemo" />
                        <label className="form-check-label" htmlFor="rememberDemo">
                          {t('authentication.rememberMe')}
                        </label>
                      </div>
                      <button type="button" className="btn btn-primary me-2">
                        {t('authentication.signIn')}
                      </button>
                      <button type="button" className="btn btn-outline-secondary">
                        {t('common.cancel')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Common Actions */}
              <div className="mb-4">
                <div className="card border-warning">
                  <div className="card-header bg-warning text-dark">
                    <h6 className="card-title mb-0">{t('common.actions')}</h6>
                  </div>
                  <div className="card-body">
                    <div className="btn-toolbar" role="toolbar">
                      <div className="btn-group me-2" role="group">
                        <button type="button" className="btn btn-outline-primary">{t('common.save')}</button>
                        <button type="button" className="btn btn-outline-secondary">{t('common.cancel')}</button>
                        <button type="button" className="btn btn-outline-info">{t('common.edit')}</button>
                      </div>
                      <div className="btn-group me-2" role="group">
                        <button type="button" className="btn btn-outline-success">{t('common.add')}</button>
                        <button type="button" className="btn btn-outline-warning">{t('common.update')}</button>
                        <button type="button" className="btn btn-outline-danger">{t('common.delete')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Messages */}
              <div className="row">
                <div className="col-md-6">
                  <div className="card border-info">
                    <div className="card-header bg-info text-white">
                      <h6 className="card-title mb-0">{t('common.status')} & {t('messages.info')}</h6>
                    </div>
                    <div className="card-body">
                      <div className="alert alert-success" role="alert">
                        <strong>{t('messages.success')}!</strong> {t('messages.success')}
                      </div>
                      <div className="alert alert-warning" role="alert">
                        <strong>{t('messages.warning')}!</strong> {t('messages.pleaseWait')}
                      </div>
                      <div className="alert alert-info" role="alert">
                        <strong>{t('messages.info')}:</strong> {t('common.loading')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card border-secondary">
                    <div className="card-header bg-secondary text-white">
                      <h6 className="card-title mb-0">Form {t('validation.required')}</h6>
                    </div>
                    <div className="card-body">
                      <ul className="list-unstyled">
                        <li className="text-muted">• {t('validation.required')}</li>
                        <li className="text-muted">• {t('validation.emailInvalid')}</li>
                        <li className="text-muted">• {t('validation.passwordTooShort')}</li>
                        <li className="text-muted">• {t('validation.passwordsNotMatch')}</li>
                        <li className="text-muted">• {t('validation.phoneInvalid')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to Use */}
              <div className="mt-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">How to Use Translations in Your Components</h5>
                  </div>
                  <div className="card-body">
                    <pre className="bg-light p-3 rounded">
{`// 1. Import the useLanguage hook
import { useLanguage } from '@/contexts/LanguageContext'

// 2. Use in your component
const MyComponent = () => {
  const { t, currentLanguage, changeLanguage } = useLanguage()
  
  return (
    <div>
      <h1>{t('navigation.dashboard')}</h1>
      <button onClick={() => changeLanguage('vi')}>
        {t('header.selectLanguage')}
      </button>
      <p>{t('messages.success')}</p>
    </div>
  )
}

// 3. Translation keys are nested, use dot notation:
// t('authentication.login') -> "Đăng nhập" (Vietnamese)
// t('common.save') -> "Lưu" (Vietnamese)
// t('navigation.dashboard') -> "Bảng điều khiển" (Vietnamese)`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguageDemo