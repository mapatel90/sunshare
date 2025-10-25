'use client'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const OtpVerifyForm = () => {
    const { t } = useLanguage()
    
    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">{t('authentication.verify')} <a href="#" className="float-end fs-12 text-primary">{t('authentication.changeMethod', 'Change Method')}</a></h2>
            <h4 className="fs-13 fw-bold mb-2">{t('authentication.enterOtpCode', 'Please enter the code generated one time password to verify your account.')}</h4>
            <p className="fs-12 fw-medium text-muted"><span>{t('authentication.codeSentTo', 'A code has been sent to')}</span> <strong>*******9897</strong></p>
            <form action="" className="w-100 mt-4 pt-2">
                <div id="otp" className="inputs d-flex flex-row justify-content-center mt-2">
                    <input className="m-2 text-center form-control rounded" type="text" id="first" maxLength={1} required />
                    <input className="m-2 text-center form-control rounded" type="text" id="second" maxLength={1} required />
                    <input className="m-2 text-center form-control rounded" type="text" id="third" maxLength={1} required />
                    <input className="m-2 text-center form-control rounded" type="text" id="fourth" maxLength={1} required />
                    <input className="m-2 text-center form-control rounded" type="text" id="fifth" maxLength={1} required />
                    <input className="m-2 text-center form-control rounded" type="text" id="sixth" maxLength={1} required />
                </div>
                <div className="mt-5">
                    <button type="submit" className="btn btn-lg btn-primary w-100">{t('authentication.validate', 'Validate')}</button>
                </div>
                <div className="mt-5 text-muted">
                    <span>{t('authentication.didntGetCode', 'Didn\'t get the code')}</span>
                    <a href="#">{t('authentication.resend', 'Resend')}(1/3)</a>
                </div>
            </form>
        </>
    )
}

export default OtpVerifyForm