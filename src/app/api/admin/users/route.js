/**
 * Admin Users API
 * Only accessible by admin role
 */

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { protectedRoute } from '@/middleware/auth';

/**
 * GET /api/admin/users
 * Get all users (Admin only)
 */
export const GET = protectedRoute('admin', async (request, { user }) => {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const offset = (page - 1) * limit;

  // Build query
  let countQuery = 'SELECT COUNT(*) FROM users';
  let dataQuery = 'SELECT id, name, email, phone, role, status, created_at FROM users';
  const params = [];

  // Add search filter if provided
  if (search) {
    const searchCondition = ' WHERE name ILIKE $1 OR email ILIKE $1';
    countQuery += searchCondition;
    dataQuery += searchCondition;
    params.push(`%${search}%`);
  }

  // Add pagination
  dataQuery += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  // Execute queries
  const [countResult, dataResult] = await Promise.all([
    query(countQuery, search ? [`%${search}%`] : []),
    query(dataQuery, params)
  ]);

  const total = parseInt(countResult.rows[0].count);

  return NextResponse.json({
    success: true,
    data: dataResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    requestedBy: user.name // Show who made the request
  });
});

/**
 * POST /api/admin/users
 * Create new user (Admin only)
 */
export const POST = protectedRoute('admin', async (request, { user }) => {
  const body = await request.json();
  const { name, email, password, phone, role = 'user' } = body;

  // Validation
  if (!name || !email || !password) {
    return NextResponse.json({
      success: false,
      message: 'Name, email, and password are required'
    }, { status: 400 });
  }

  // Check if email already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    return NextResponse.json({
      success: false,
      message: 'Email already exists'
    }, { status: 409 });
  }

  // Insert new user
  // Note: In production, hash the password before storing!
  const result = await query(
    `INSERT INTO users (name, email, password, phone, role, status, created_at) 
     VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
     RETURNING id, name, email, phone, role, status, created_at`,
    [name, email, password, phone, role, 'active']
  );

  return NextResponse.json({
    success: true,
    message: 'User created successfully',
    data: result.rows[0],
    createdBy: user.name
  }, { status: 201 });
});

