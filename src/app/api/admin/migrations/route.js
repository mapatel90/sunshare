import { NextResponse } from 'next/server';
import { 
  runMigrations, 
  showStatus, 
  createMigration,
  getAppliedMigrations,
  getMigrationFiles 
} from '@/lib/migrations';
import { protectedRoute } from '@/middleware/auth';

// GET - Show migration status
export const GET = protectedRoute('admin', async (request) => {
  try {
    const appliedMigrations = await getAppliedMigrations();
    const migrationFiles = getMigrationFiles();
    
    const pendingMigrations = migrationFiles.filter(file => !appliedMigrations.includes(file));
    
    return NextResponse.json({
      success: true,
      data: {
        applied: appliedMigrations,
        pending: pendingMigrations,
        total: {
          applied: appliedMigrations.length,
          pending: pendingMigrations.length
        }
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});

// POST - Run migrations
export const POST = protectedRoute('admin', async (request) => {
  try {
    const { action, migrationName } = await request.json();
    
    switch (action) {
      case 'run':
        await runMigrations();
        return NextResponse.json({
          success: true,
          message: 'All pending migrations completed successfully'
        });
        
      case 'create':
        if (!migrationName) {
          return NextResponse.json({
            success: false,
            error: 'Migration name is required'
          }, { status: 400 });
        }
        
        const filename = await createMigration(migrationName);
        return NextResponse.json({
          success: true,
          message: 'Migration created successfully',
          data: { filename }
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use "run" or "create"'
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});
