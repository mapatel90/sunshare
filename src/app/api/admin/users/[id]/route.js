/**
 * Admin Single User API
 * Only accessible by admin role
 */

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { protectedRoute } from '@/middleware/auth';

/**
 * GET /api/admin/users/[id]
 * Get single user by ID
 */
export const GET = protectedRoute('admin', async (request, { params }) => {
  const userId = params.id;

  const result = await query(
    'SELECT id, name, email, phone, role, status, avatar, created_at, updated_at FROM users WHERE id = $1',
    [userId]
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
});

/**
 * PUT /api/admin/users/[id]
 * Update user by ID
 */
export const PUT = protectedRoute('admin', async (request, { params, user }) => {
  const userId = params.id;
  const body = await request.json();
  const { name, email, phone, role, status } = body;

  // Check if user exists
  const existingUser = await query(
    'SELECT id FROM users WHERE id = $1',
    [userId]
  );

  if (existingUser.rows.length === 0) {
    return NextResponse.json({
      success: false,
      message: 'User not found'
    }, { status: 404 });
  }

  // Update user
  const result = await query(
    `UPDATE users 
     SET name = COALESCE($1, name), 
         email = COALESCE($2, email), 
         phone = COALESCE($3, phone), 
         role = COALESCE($4, role), 
         status = COALESCE($5, status),
         updated_at = NOW()
     WHERE id = $6
     RETURNING id, name, email, phone, role, status, updated_at`,
    [name, email, phone, role, status, userId]
  );

  return NextResponse.json({
    success: true,
    message: 'User updated successfully',
    data: result.rows[0],
    updatedBy: user.name
  });
});

/**
 * DELETE /api/admin/users/[id]
 * Delete user by ID
 */
export const DELETE = protectedRoute('admin', async (request, { params, user }) => {
  const userId = params.id;

  // Prevent deleting yourself
  if (parseInt(userId) === user.id) {
    return NextResponse.json({
      success: false,
      message: 'You cannot delete your own account'
    }, { status: 400 });
  }

  // Delete user
  const result = await query(
    'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
    [userId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({
      success: false,
      message: 'User not found'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: 'User deleted successfully',
    data: result.rows[0],
    deletedBy: user.name
  });
});

