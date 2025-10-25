/**
 * Authentication & Authorization Middleware with JWT
 * 
 * આ file use કરીને તમે API routes માં JWT authentication અને role-based access add કરી શકો છો
 */

import { query } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import { NextResponse } from 'next/server';

/**
 * Verify user from JWT token
 * 
 * @param {Request} request 
 * @returns {Object|null} User object or null
 */
export async function verifyUser(request) {
  try {
    // Get Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return null;
    }
    
    // Extract token from header
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return null;
    }
    
    // Verify JWT token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return null;
    }
    
    // Get fresh user data from database
    // આ ensure કરે છે કે user still active છે અને role changes reflect થાય
    const result = await query(
      'SELECT id, name, email, phone, role, status, avatar FROM users WHERE id = $1 AND status = $2',
      [decoded.id, 'active']
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

/**
 * Check if user has required role
 * 
 * @param {Object} user 
 * @param {string|Array} allowedRoles - Single role or array of roles
 * @returns {boolean}
 */
export function hasRole(user, allowedRoles) {
  if (!user || !user.role) return false;
  
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(user.role);
  }
  
  return user.role === allowedRoles;
}

/**
 * Middleware wrapper for authentication
 * 
 * Usage:
 * export const GET = withAuth(async (request, { user }) => {
 *   // user automatically available
 *   return NextResponse.json({ data: user });
 * });
 * 
 * @param {Function} handler 
 * @returns {Function}
 */
export function withAuth(handler) {
  return async (request, context) => {
    const user = await verifyUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Please login'
      }, { status: 401 });
    }
    
    // Add user to context
    return handler(request, { ...context, user });
  };
}

/**
 * Middleware wrapper for role-based access
 * 
 * Usage:
 * export const GET = withRole('admin', async (request, { user }) => {
 *   // Only admin can access
 *   return NextResponse.json({ data: 'admin data' });
 * });
 * 
 * @param {string|Array} allowedRoles 
 * @param {Function} handler 
 * @returns {Function}
 */
export function withRole(allowedRoles, handler) {
  return withAuth(async (request, context) => {
    const { user } = context;
    
    if (!hasRole(user, allowedRoles)) {
      return NextResponse.json({
        success: false,
        message: `Forbidden - Required role: ${Array.isArray(allowedRoles) ? allowedRoles.join(' or ') : allowedRoles}`
      }, { status: 403 });
    }
    
    return handler(request, context);
  });
}

/**
 * Error handler wrapper
 * 
 * @param {Function} handler 
 * @returns {Function}
 */
export function withErrorHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      
      return NextResponse.json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }
  };
}

/**
 * Combined middleware - Auth + Role + Error Handler
 * 
 * Usage:
 * export const GET = protectedRoute('admin', async (request, { user }) => {
 *   // Safe, authenticated, role-checked, error-handled route
 * });
 * 
 * @param {string|Array} allowedRoles 
 * @param {Function} handler 
 * @returns {Function}
 */
export function protectedRoute(allowedRoles, handler) {
  return withErrorHandler(
    withRole(allowedRoles, handler)
  );
}

