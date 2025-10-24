/**
 * Refresh Token API
 * POST /api/auth/refresh
 * 
 * Refresh access token using refresh token
 */

import { query } from '@/lib/db';
import { verifyToken, generateToken, extractTokenFromHeader } from '@/lib/jwt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    // Validation
    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        message: 'Refresh token is required'
      }, { status: 400 });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    if (!decoded) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired refresh token'
      }, { status: 401 });
    }

    // Get user from database to ensure they're still active
    const result = await query(
      'SELECT id, name, email, role, status FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    const user = result.rows[0];

    if (user.status !== 'active') {
      return NextResponse.json({
        success: false,
        message: 'Account is not active'
      }, { status: 403 });
    }

    // Generate new access token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    const newAccessToken = generateToken(tokenPayload);

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        tokenType: 'Bearer'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to refresh token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

