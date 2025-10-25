import { NextResponse } from 'next/server';
import { runSeeder, runSpecificSeeder, getSeederStatus } from '../../../lib/mainSeeder.js';

export async function POST(request) {
  try {
    const { 
      clear = false, 
      users = true, 
      projects = true, 
      tasks = true, 
      customers = true,
      seeder = null 
    } = await request.json();
    
    let result;
    
    if (seeder) {
      // Run specific seeder
      const count = await runSpecificSeeder(seeder, { clear });
      result = { 
        success: true, 
        message: `${seeder} seeder completed successfully!`,
        count 
      };
    } else {
      // Run all seeders
      result = await runSeeder({ clear, users, projects, tasks, customers });
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Seeder API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const status = await getSeederStatus();
    return NextResponse.json({
      success: true,
      status,
      message: 'Seeder status retrieved successfully'
    });
  } catch (error) {
    console.error('Seeder status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
