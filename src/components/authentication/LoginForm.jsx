"use client";

import Link from 'next/link'
import React, { useState } from 'react'
import { FiFacebook, FiGithub, FiTwitter, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

const LoginForm = ({ registerPath, resetPath }) => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
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
            <div className="mb-2 d-flex align-items-center justify-content-end">
                <Link href="/login" className="text-decoration-none fs-15 text-muted">
                    <span className="me-1">&#8592;</span> Back
                </Link>
            </div>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <label className="form-label mb-2">{lang('authentication.username') || 'Username'}</label>
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
                    <label className="form-label mb-2">{lang('authentication.password') || 'Password'}</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'password' : 'text'}
                            className="form-control"
                            placeholder={lang('authentication.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>
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
                        className="btn btn-lg w-100"
                        style={{ backgroundColor: '#F6A623', color: '#fff' }}
                        disabled={loading}
                    >
                        {loading ? lang('common.loading') : lang('authentication.login')}
                    </button>
                </div>
            </form>
            <div className="mt-4 text-muted text-center">
                <span>Don't have an account? </span>
                <Link href={registerPath} className="fw-bold text-primary">{lang('authentication.signUp') || 'Sign up'}</Link>
            </div>
        </>
    )
}

export default LoginForm