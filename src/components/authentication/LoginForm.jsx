"use client";

import Link from 'next/link'
import React, { useState } from 'react'
import { FiFacebook, FiGithub, FiTwitter } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

const LoginForm = ({ registerPath, resetPath }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { login } = useAuth()
    const { lang } = useLanguage()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

    const result = await login(username, password)
        
        if (!result.success) {
            setError(result.message)
        }
        
        setLoading(false)
    }

    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">{lang('authentication.login')}</h2>
            {/* <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
            <p className="fs-12 fw-medium text-muted">Thank you for get back <strong>Sunshare</strong> web applications, let's access our the best recommendation for you.</p>
             */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder={lang('authentication.username')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        className="form-control" 
                        placeholder={lang('authentication.password')} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="rememberMe" />
                            <label className="custom-control-label c-pointer" htmlFor="rememberMe">{lang('authentication.rememberMe')}</label>
                        </div>
                    </div>
                    <div>
                        <Link href={resetPath} className="fs-11 text-primary">{lang('authentication.forgotPassword')}?</Link>
                    </div>
                </div>
                <div className="mt-5">
                    <button 
                        type="submit" 
                        className="btn btn-lg btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? lang('common.loading') : lang('authentication.signIn')}
                    </button>
                </div>
            </form>
            {/* <div className="w-100 mt-5 text-center mx-auto">
                <div className="mb-4 border-bottom position-relative"><span className="small py-1 px-3 text-uppercase text-muted bg-white position-absolute translate-middle">or</span></div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                    <a href="#" className="btn btn-light-brand flex-fill" data-toggle="tooltip" data-title="Login with Facebook">
                        <FiFacebook size={16} />
                    </a>
                    <a href="#" className="btn btn-light-brand flex-fill" data-toggle="tooltip" data-title="Login with Twitter">
                        <FiTwitter size={16} />
                    </a>
                    <a href="#" className="btn btn-light-brand flex-fill" data-toggle="tooltip" data-title="Login with Github">
                        <FiGithub size={16} className='text' />
                    </a>
                </div>
            </div> */}
            {/* <div className="mt-5 text-muted">
                <span> Don't have an account?</span>
                <Link href={registerPath} className="fw-bold"> Create an Account</Link>
            </div> */}
        </>
    )
}

export default LoginForm