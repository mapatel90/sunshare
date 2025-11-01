"use client";

import React from "react";
import Link from "next/link";
import { Box, Card, CardContent, Button, Typography } from "@mui/material";

const LoginPage = () => {
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
                    maxWidth: 560,
                    width: "100%",
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    textAlign: "center",
                    p: 3,
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <Button
                            component={Link}
                            href="/offtaker/login"
                            variant="contained"
                            sx={{
                                backgroundColor: "#FFC107",
                                color: "#FFFFFF",
                                fontWeight: 600,
                                px: 5,
                                py: 1.5,
                                boxShadow: 2,
                                textDecoration: 'none',
                                "&:hover": {
                                    backgroundColor: "#ffb300",
                                    color: "#FFFFFF",
                                },
                            }}
                        >
                            Login as Offtaker
                        </Button>

                        <Button
                            component={Link}
                            href="/investor/login"
                            variant="contained"
                            sx={{
                                backgroundColor: "#696969",
                                color: "#FFFFFF",
                                fontWeight: 600,
                                px: 5,
                                py: 1.5,
                                boxShadow: 2,
                                textDecoration: 'none',
                                "&:hover": {
                                    backgroundColor: "#0d2333",
                                    color: "#FFFFFF",
                                },
                            }}
                        >
                            Login as Investor
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
