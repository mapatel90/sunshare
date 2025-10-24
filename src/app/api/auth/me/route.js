/**
 * Get Current User API
 * GET /api/auth/me
 * 
 * Get currently logged-in user's information
 */

import { withAuth, withErrorHandler } from '@/middleware/auth';
import { NextResponse } from 'next/server';

export const GET = withErrorHandler(
  withAuth(async (request, { user }) => {
    return NextResponse.json({
      success: true,
      data: user
    });
  })
);

