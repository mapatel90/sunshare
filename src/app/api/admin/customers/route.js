/**
 * Admin Customers API
 * Accessible by admin and manager roles
 */

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { protectedRoute } from '@/middleware/auth';

/**
 * GET /api/admin/customers
 * Get all customers (Admin/Manager only)
 */
export const GET = protectedRoute(['admin', 'manager'], async (request, { user }) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status') || null;
  const offset = (page - 1) * limit;

  // Build query
  let countQuery = 'SELECT COUNT(*) FROM customers';
  let dataQuery = `
    SELECT c.*, u.name as user_name 
    FROM customers c
    LEFT JOIN users u ON c.user_id = u.id
  `;
  const params = [];

  // Add status filter if provided
  if (status) {
    const condition = ' WHERE c.status = $1';
    countQuery += condition;
    dataQuery += condition;
    params.push(status);
  }

  // Add pagination
  dataQuery += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  // Execute queries
  const [countResult, dataResult] = await Promise.all([
    query(countQuery, status ? [status] : []),
    query(dataQuery, params)
  ]);

  return NextResponse.json({
    success: true,
    data: dataResult.rows,
    pagination: {
      page,
      limit,
      total: parseInt(countResult.rows[0].count),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    },
    requestedBy: user.name
  });
});

/**
 * POST /api/admin/customers
 * Create new customer
 */
export const POST = protectedRoute(['admin', 'manager'], async (request, { user }) => {
  const body = await request.json();
  const { 
    company_name, 
    contact_person, 
    email, 
    phone, 
    address, 
    city, 
    state, 
    zip_code, 
    country 
  } = body;

  // Validation
  if (!email || !contact_person) {
    return NextResponse.json({
      success: false,
      message: 'Email and contact person are required'
    }, { status: 400 });
  }

  // Check if email already exists
  const existingCustomer = await query(
    'SELECT id FROM customers WHERE email = $1',
    [email]
  );

  if (existingCustomer.rows.length > 0) {
    return NextResponse.json({
      success: false,
      message: 'Customer with this email already exists'
    }, { status: 409 });
  }

  // Insert new customer
  const result = await query(
    `INSERT INTO customers 
     (company_name, contact_person, email, phone, address, city, state, zip_code, country, status, created_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) 
     RETURNING *`,
    [company_name, contact_person, email, phone, address, city, state, zip_code, country, 'active']
  );

  return NextResponse.json({
    success: true,
    message: 'Customer created successfully',
    data: result.rows[0],
    createdBy: user.name
  }, { status: 201 });
});

