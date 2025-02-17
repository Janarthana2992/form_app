import { Pool } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, email, phone, dob } = body;

    console.log('Received data:', { name, age, email, phone, dob }); // Debug log

    // Convert age to number and validate data
    const parsedAge = parseInt(age, 10);
    
    // Insert data into the database
    const query = `
      INSERT INTO users (name, age, email, phone_number, date_of_birth) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      name,
      parsedAge,
      email,
      phone,
      dob
    ]);

    return NextResponse.json({ 
      message: 'User registered successfully',
      user: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    // Detailed error logging
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    // Check for unique constraint violation on email or phone
    if (error.code === '23505') {
      const field = error.constraint.includes('email') ? 'Email' : 'Phone number';
      return NextResponse.json(
        { error: `${field} already registered` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to register user' },
      { status: 500 }
    );
  }
} 