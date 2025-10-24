import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * Test database connection
 * GET /api/admin
 * 
 * આ route database connection test કરવા માટે છે
 * કોઈપણ વ્યક્તિ access કરી શકે છે (authentication નથી જોઈતું)
 */
export async function GET() {
  try {
    // Test query to check connection
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    
    // Get some basic stats
    const userCount = await query('SELECT COUNT(*) as count FROM users');
    // const customerCount = await query('SELECT COUNT(*) as count FROM customers');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful! ✅',
      data: {
        currentTime: result.rows[0].current_time,
        version: result.rows[0].db_version,
        database: process.env.DB_NAME
      },
      stats: {
        totalUsers: parseInt(userCount.rows[0].count),
        // totalCustomers: parseInt(customerCount.rows[0].count)
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed ❌',
      error: error.message,
      hint: 'Check .env.local file and ensure PostgreSQL is running'
    }, { status: 500 });
  }
}

