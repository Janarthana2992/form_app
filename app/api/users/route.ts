import { Pool } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function GET() {
  try {
    // Select all fields that exist in the database
    const query = `
      SELECT name, age, email, phone_number, date_of_birth 
      FROM users 
      ORDER BY name
    `;
    
    const result = await pool.query(query);
    
    if (result.rows.length === 0) {
      console.log('No users found in database');
    } else {
      console.log('Retrieved users:', result.rows);
    }

    return NextResponse.json({ 
      users: result.rows 
    }, { status: 200 });

  } catch (error: any) {
    // Detailed error logging
    console.error('Database error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    // Check for specific database errors
    if (error.code === '28P01') {
      return NextResponse.json(
        { error: 'Database authentication failed' },
        { status: 500 }
      );
    }

    if (error.code === '3D000') {
      return NextResponse.json(
        { error: 'Database does not exist' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch users from database' },
      { status: 500 }
    );
  }
} 