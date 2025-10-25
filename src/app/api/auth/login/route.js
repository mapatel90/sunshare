/**
 * Login API
 * POST /api/auth/login
 * 
 * User login કરીને JWT token મેળવે છે
 */

import { query } from '@/lib/db';
import { generateToken, generateRefreshToken } from '@/lib/jwt';
import { verifyPassword } from '@/lib/password';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required'
      }, { status: 400 });
    }

    // Get user from database
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    const user = result.rows[0];

    // Check if user is active
    if (user.status !== 1) {
      return NextResponse.json({
        success: false,
        message: 'Account is not active. Please contact administrator.'
      }, { status: 403 });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    // Generate JWT tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Update last login time (optional)
    await query(
      'UPDATE users SET updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Return success response with tokens
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          avatar: user.avatar
        },
        accessToken,
        refreshToken,
        tokenType: 'Bearer'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Login failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

