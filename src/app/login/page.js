import React from 'react'
import Link from 'next/link'

const LoginPage = () => {
    return (
        <main
            className="d-flex flex-column align-items-center justify-content-center min-vh-100 login-bg"
        >
            <div className="text-center mb-4">
                <img
                    src="/images/main_logo.png"
                    alt="WeShare"
                    className="img-fluid mb-3"
                    style={{ maxWidth: '200px' }}
                />
                <h4 className="mb-2 fw-semibold">Login into your Account</h4>
            </div>

            <div
                className="card shadow-lg border-0 text-center p-4"
                style={{
                    maxWidth: '560px',
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '1rem',
                }}
            >
                <div className="card-body">                  
                    <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
                        <Link
                            href="/offtaker/login"
                            className="btn btn-warning text-dark fw-semibold px-5 py-3 shadow-sm"
                        >
                            Login as Offtaker
                        </Link>

                        <Link
                            href="/investor/login"
                            className="btn fw-semibold px-5 py-3 shadow-sm"
                            style={{ backgroundColor: '#102C41', color: '#fff' }}
                        >
                            Login as Investor
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LoginPage
