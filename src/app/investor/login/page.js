import React from 'react'
import Link from 'next/link'
import LoginForm from '@/components/authentication/LoginForm'

const InvestorLoginPage = () => {
    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                backgroundImage: `url(/images/SunShare-Login-Screen.jpg)`,
                backgroundSize: '100% 100%, cover',
                backgroundPosition: 'top center, bottom center',
                backgroundRepeat: 'no-repeat, no-repeat',
                backgroundAttachment: 'fixed',
            }}>
            <div style={{ maxWidth: 620, width: '100%' }}>
                <div className="text-center mb-4">
                    <img src="/images/main_logo.png" alt="WeShare" className="img-fluid mb-3" style={{ maxWidth: 200 }} />
                    <h3 className="fw-bolder">Welcome back Log in to your investor account</h3>
                </div>
                <div className="card mx-4 mx-sm-0">
                    <div className="card-body p-sm-5">
                        <LoginForm registerPath={"/register"} resetPath={"/reset"} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default InvestorLoginPage
