'use client'
import Link from 'next/link'
import React from 'react'
import { FiEye, FiHash } from 'react-icons/fi'
import { useLanguage } from '@/contexts/LanguageContext'

const RegisterForm = ({path}) => {
    const { t } = useLanguage()
    
    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">{t('authentication.register')}</h2>
            <h4 className="fs-13 fw-bold mb-2">{t('authentication.manageAllYourCrm', 'Manage all your Sunshare crm')}</h4>
            <p className="fs-12 fw-medium text-muted">{t('authentication.letsSetupYourAccount', 'Let\'s get you all setup, so you can verify your personal account and begin setting up your profile.')}</p>
            <form action="index.html" className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input type="text" className="form-control" placeholder={t('authentication.fullName', 'Full Name')} required />
                </div>
                <div className="mb-4">
                    <input type="email" className="form-control" placeholder={t('authentication.email')} required />
                </div>
                <div className="mb-4">
                    <input type="tel" className="form-control" placeholder={t('authentication.username', 'Username')} required />
                </div>
                <div className="mb-4 generate-pass">
                    <div className="input-group field">
                        <input type="password" className="form-control password" id="newPassword" placeholder={t('authentication.password')} />
                        <div className="input-group-text c-pointer gen-pass" data-toggle="tooltip" data-title={t('authentication.generatePassword', 'Generate Password')}><FiHash size={16}/></div>
                        <div className="input-group-text border-start bg-gray-2 c-pointer" data-toggle="tooltip" data-title={t('authentication.showHidePassword', 'Show/Hide Password')}><FiEye size={16}/></div>
                    </div>
                    <div className="progress-bar mt-2">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
                <div className="mb-4">
                    <input type="password" className="form-control" placeholder={t('authentication.confirmPassword')} required />
                </div>
                <div className="mt-4">
                    <div className="custom-control custom-checkbox mb-2">
                        <input type="checkbox" className="custom-control-input" id="receiveMial" required />
                        <label className="custom-control-label c-pointer text-muted" htmlFor="receiveMial" style={{ fontWeight: '400 !important' }}>{t('authentication.receiveCommunityEmails', 'Yes, I want to receive Sunshare community emails')}</label>
                    </div>
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="termsCondition" required />
                        <label className="custom-control-label c-pointer text-muted" htmlFor="termsCondition" style={{ fontWeight: '400 !important' }}>{t('authentication.agreeToTerms', 'I agree to all the')} <a href="#">{t('authentication.termsConditions', 'Terms & Conditions')}</a> {t('common.and', 'and')} <a href="#">{t('authentication.fees', 'Fees')}</a>.</label>
                    </div>
                </div>
                <div className="mt-5">
                    <button type="submit" className="btn btn-lg btn-primary w-100">{t('authentication.createAccount')}</button>
                </div>
            </form>
            <div className="mt-5 text-muted">
                <span>{t('authentication.alreadyHaveAccount')}</span>
                <Link href={path} className="fw-bold"> {t('authentication.login')}</Link>
            </div>
        </>
    )
}

export default RegisterForm