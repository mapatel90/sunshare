'use client'
import Link from 'next/link'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const ResetForm = ({ path }) => {
    const { t } = useLanguage()
    
    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">{t('authentication.resetPassword')}</h2>
            <h4 className="fs-13 fw-bold mb-2">{t('authentication.resetToYourPassword', 'Reset to your username/password')}</h4>
            <p className="fs-12 fw-medium text-muted">{t('authentication.enterEmailForReset', 'Enter your email and a reset link will sent to you, let\'s access our the best recommendation for you.')}</p>
            <form action="auth-resetting-cover.html" className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input className="form-control" placeholder={t('authentication.email')} required />
                </div>
                <div className="mt-5">
                    <button type="submit" className="btn btn-lg btn-primary w-100">{t('authentication.resetNow', 'Reset Now')}</button>
                </div>
            </form>
            <div className="mt-5 text-muted">
                <span>{t('authentication.dontHaveAccount')}</span>
                <Link href={path} className="fw-bold"> {t('authentication.createAccount', 'Create an Account')}</Link>
            </div>
        </>
    )
}

export default ResetForm