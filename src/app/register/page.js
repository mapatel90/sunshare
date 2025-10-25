import Link from 'next/link'
import React from 'react'

const RegisterPage = () => {
    return (
        <main className="auth-minimal-wrapper">
            <div className="auth-minimal-inner">
                <div className="minimal-card-wrapper">
                    <div className="card mb-4 mt-5 mx-4 mx-sm-0 position-relative">
                        <div className="wd-50 bg-white p-2 rounded-circle shadow-lg position-absolute translate-middle top-0 start-50">
                            <img src="/images/logo-abbr.png" alt="img" className="img-fluid" />
                        </div>
                        <div className="card-body p-sm-5">
                            <h2 className="fs-20 fw-bolder mb-4">Register</h2>
                            <h4 className="fs-13 fw-bold mb-2">Create your account</h4>
                            <p className="fs-12 fw-medium text-muted">Registration will be available soon.</p>
                            
                            <div className="mt-5 text-muted text-center">
                                <span>Already have an account?</span>
                                <Link href="/login" className="fw-bold"> Login Here</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default RegisterPage