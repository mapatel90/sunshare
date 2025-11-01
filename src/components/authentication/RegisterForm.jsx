'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import {
    Box,
    TextField,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Radio,
    RadioGroup,
    Alert
} from '@mui/material'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'

const RegisterForm = ({loginPath}) => {
    const { lang } = useLanguage()
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [userType, setUserType] = useState('3') // 3=Offtaker, 4=Investor
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    // Form fields
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [agreeTerms, setAgreeTerms] = useState(false)
    
    // Field errors
    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setFirstNameError('')
        setLastNameError('')
        setUsernameError('')
        setEmailError('')
        setPasswordError('')
        setConfirmPasswordError('')

        // Validation
        let isValid = true

        if (!firstName.trim()) {
            setFirstNameError(lang('validation.firstNameRequired'))
            isValid = false
        }

        if (!lastName.trim()) {
            setLastNameError(lang('validation.lastNameRequired'))
            isValid = false
        }

        if (!username.trim()) {
            setUsernameError(lang('validation.usernameRequired'))
            isValid = false
        }

        if (!email.trim()) {
            setEmailError(lang('validation.emailRequired'))
            isValid = false
        } else if (!validateEmail(email)) {
            setEmailError(lang('validation.emailInvalidFormat'))
            isValid = false
        }

        if (!password.trim()) {
            setPasswordError(lang('validation.passwordRequired'))
            isValid = false
        } else if (password.length < 6) {
            setPasswordError(lang('validation.passwordMinLength'))
            isValid = false
        }

        if (!confirmPassword.trim()) {
            setConfirmPasswordError(lang('validation.confirmPasswordRequired'))
            isValid = false
        } else if (password !== confirmPassword) {
            setConfirmPasswordError(lang('validation.passwordsDoNotMatch'))
            isValid = false
        }

        if (!agreeTerms) {
            setError(lang('validation.userTypeRequired'))
            isValid = false
        }

        if (!isValid) {
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    email,
                    password,
                    userRole: parseInt(userType)
                })
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.field === 'username') {
                    setUsernameError(lang('validation.usernameAlreadyExists'))
                } else if (data.field === 'email') {
                    setEmailError(lang('validation.emailAlreadyExists'))
                } else {
                    setError(data.message || 'Registration failed')
                }
            } else {
                // Success - redirect to login
                router.push(loginPath + '?registered=true')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        }

        setLoading(false)
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {/* User Type Selection */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: '#696969', fontWeight: 500 }}>
                        {lang('authentication.registerAs')} *
                    </Typography>
                    <RadioGroup
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'row',
                            gap: 3
                        }}
                    >
                        <FormControlLabel
                            value="3"
                            control={<Radio sx={{ 
                                color: '#F6A623',
                                '&.Mui-checked': { color: '#F6A623' }
                            }} />}
                            label={
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {lang('authentication.becomeOfftaker')}
                                </Typography>
                            }
                        />
                        <FormControlLabel
                            value="4"
                            control={<Radio sx={{ 
                                color: '#F6A623',
                                '&.Mui-checked': { color: '#F6A623' }
                            }} />}
                            label={
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {lang('authentication.becomeInvestor')}
                                </Typography>
                            }
                        />
                    </RadioGroup>
                </Box>

                {/* First Name */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: '#696969', fontWeight: 500 }}>
                        {lang('authentication.firstName') || 'First Name'} *
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder={lang('authentication.firstName')}
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value)
                            if (firstNameError) setFirstNameError('')
                        }}
                        error={!!firstNameError}
                        helperText={firstNameError}
                        required
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                '& fieldset': { borderColor: '#e0e0e0' },
                                '&:hover fieldset': { borderColor: '#F6A623' },
                                '&.Mui-focused fieldset': { borderColor: '#F6A623', borderWidth: '2px' },
                            },
                        }}
                    />
                </Box>

                {/* Last Name */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: '#696969', fontWeight: 500 }}>
                        {lang('authentication.lastName') || 'Last Name'} *
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder={lang('authentication.lastName')}
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value)
                            if (lastNameError) setLastNameError('')
                        }}
                        error={!!lastNameError}
                        helperText={lastNameError}
                        required
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                '& fieldset': { borderColor: '#e0e0e0' },
                                '&:hover fieldset': { borderColor: '#F6A623' },
                                '&.Mui-focused fieldset': { borderColor: '#F6A623', borderWidth: '2px' },
                            },
                        }}
                    />
                </Box>

                {/* Username */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: '#696969', fontWeight: 500 }}>
                        {lang('authentication.username') || 'Username'} *
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder={lang('authentication.username')}
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value)
                            if (usernameError) setUsernameError('')
                        }}
                        error={!!usernameError}
                        helperText={usernameError}
                        required
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                '& fieldset': { borderColor: '#e0e0e0' },
                                '&:hover fieldset': { borderColor: '#F6A623' },
                                '&.Mui-focused fieldset': { borderColor: '#F6A623', borderWidth: '2px' },
                            },
                        }}
                    />
                </Box>

                {/* Email */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: '#696969', fontWeight: 500 }}>
                        {lang('authentication.email') || 'Email'} *
                    </Typography>
                    <TextField
                        fullWidth
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            if (emailError) setEmailError('')
                        }}
                        error={!!emailError}
                        helperText={emailError}
                        required
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                '& fieldset': { borderColor: '#e0e0e0' },
                                '&:hover fieldset': { borderColor: '#F6A623' },
                                '&.Mui-focused fieldset': { borderColor: '#F6A623', borderWidth: '2px' },
                            },
                        }}
                    />
                </Box>

                {/* Password */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: '#696969', fontWeight: 500 }}>
                        {lang('authentication.password') || 'Password'} *
                    </Typography>
                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            if (passwordError) setPasswordError('')
                        }}
                        error={!!passwordError}
                        helperText={passwordError}
                        required
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                '& fieldset': { borderColor: '#e0e0e0' },
                                '&:hover fieldset': { borderColor: '#F6A623' },
                                '&.Mui-focused fieldset': { borderColor: '#F6A623', borderWidth: '2px' },
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((v) => !v)}
                                        edge="end"
                                        sx={{ color: '#696969' }}
                                    >
                                        {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Confirm Password */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: '#696969', fontWeight: 500 }}>
                        {lang('authentication.confirmPassword') || 'Confirm Password'} *
                    </Typography>
                    <TextField
                        fullWidth
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            if (confirmPasswordError) setConfirmPasswordError('')
                        }}
                        error={!!confirmPasswordError}
                        helperText={confirmPasswordError}
                        required
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                '& fieldset': { borderColor: '#e0e0e0' },
                                '&:hover fieldset': { borderColor: '#F6A623' },
                                '&.Mui-focused fieldset': { borderColor: '#F6A623', borderWidth: '2px' },
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword((v) => !v)}
                                        edge="end"
                                        sx={{ color: '#696969' }}
                                    >
                                        {showConfirmPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Checkboxes */}
                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                            />
                        }
                        label={
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                {lang('authentication.agreeToTerms')} <Link href="#" style={{ color: '#2386FF', textDecoration: 'none' }}>{lang('authentication.termsPolicy')}</Link>
                            </Typography>
                        }
                    />
                </Box>

                {/* Sign Up Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                        backgroundColor: '#F6A623',
                        color: '#fff',
                        py: 1.5,
                        fontSize: '1rem',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#e09620',
                        },
                    }}
                >
                    {loading ? lang('common.loading') : lang('authentication.signUp') || 'Sign Up'}
                </Button>
            </Box>

            {/* Already have account */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link href={loginPath} style={{ fontWeight: 600, color: '#2386FF', textDecoration: 'none' }}>
                        {lang('authentication.signIn') || 'Sign in'}
                    </Link>
                </Typography>
            </Box>
        </Box>
    )
}

export default RegisterForm