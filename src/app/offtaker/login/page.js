import React from 'react'
import Link from 'next/link'
import LoginForm from '@/components/authentication/LoginForm'

const OfftakerLoginPage = () => {
    return (
        <main style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background: 'url(/images/SunShare-Login-Screen.jpg) center/cover no-repeat'}}>
            <div style={{maxWidth:620, width:'100%'}}>
                <div className="text-center mb-4">
                    <img src="/images/main_logo.png" alt="WeShare" className="img-fluid mb-3" style={{maxWidth:200}} />
                    <h3 className="fw-bolder">Login into your Account</h3>
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

export default OfftakerLoginPage
