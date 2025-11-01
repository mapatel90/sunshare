"use client";

import React from 'react'
import Link from 'next/link'
import { Box, Card, CardContent, Typography } from "@mui/material";
import LoginForm from '@/components/authentication/LoginForm'

const OfftakerLoginPage = () => {
    return (
        <Box
            className="loginSection"
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                p: 2,
            }}
        >
            {/* Logo + Title */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box
                    component="img"
                    src="/images/main_logo.png"
                    alt="WeShare"
                    sx={{
                        maxWidth: 200,
                        mb: 2,
                    }}
                />
                <Typography variant="h5" fontWeight={600}>
                    Login into your Account
                </Typography>
            </Box>

            {/* Card */}
            <Card
                elevation={6}
                sx={{
                    maxWidth: 620,
                    width: "100%",
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    p: { xs: 2, sm: 5 },
                }}
            >
                <CardContent>
                    <LoginForm registerPath={"/register"} resetPath={"/reset"} />
                </CardContent>
            </Card>
        </Box>
    )
}

export default OfftakerLoginPage
