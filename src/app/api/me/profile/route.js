/**
 * User Profile API
 * Accessible by any authenticated user (not just admin)
 */

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { withAuth, withErrorHandler } from '@/middleware/auth';

/**
 * GET /api/me/profile
 * Get current user's profile
 */
export const GET = withErrorHandler(
  withAuth(async (request, { user }) => {
    // Get full user details
    const result = await query(
      'SELECT id, name, email, phone, role, status, avatar, created_at, updated_at FROM users WHERE id = $1',
      [user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  })
);

/**
 * PUT /api/me/profile
 * Update current user's profile
 */
export const PUT = withErrorHandler(
  withAuth(async (request, { user }) => {
    const body = await request.json();
    const { name, phone, avatar } = body;

    // Users can only update their own name, phone, and avatar
    // They cannot change email, role, or status
    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           phone = COALESCE($2, phone), 
           avatar = COALESCE($3, avatar),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, phone, role, status, avatar, updated_at`,
      [name, phone, avatar, user.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  })
);

