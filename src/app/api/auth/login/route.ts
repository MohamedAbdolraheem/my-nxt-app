import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    // Create server client using existing function
    const supabase = await supabaseServer({ cookies: req.cookies, canSet: true });

    // Parse request body with error handling
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email format validation
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Password validation
    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error('Login error:', error);
      
      // Handle specific Supabase auth errors
      let errorMessage = 'Login failed';
      let statusCode = 400;

      switch (error.message) {
        case 'Invalid login credentials':
          errorMessage = 'Invalid email or password';
          break;
        case 'Email not confirmed':
          errorMessage = 'Please verify your email address before logging in';
          statusCode = 403;
          break;
        case 'Too many requests':
          errorMessage = 'Too many login attempts. Please try again later';
          statusCode = 429;
          break;
        case 'User not found':
          errorMessage = 'No account found with this email address';
          break;
        default:
          errorMessage = 'Authentication failed. Please try again';
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      );
    }

    // Verify user data exists
    if (!data.user) {
      console.error('No user data returned from Supabase');
      return NextResponse.json(
        { error: 'Authentication failed - no user data received' },
        { status: 500 }
      );
    }

    // Verify session exists
    if (!data.session) {
      console.error('No session data returned from Supabase');
      return NextResponse.json(
        { error: 'Authentication failed - no session created' },
        { status: 500 }
      );
    }

    console.log('Login successful - User:', data.user.email, 'Session:', !!data.session);

    // Return success response with user info (excluding sensitive data)
    return NextResponse.json({
      message: 'Logged in successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
        created_at: data.user.created_at
      }
    });

  } catch (error) {
    console.error('Login API error:', error);
    
    // Handle network/connection errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Unable to connect to authentication service' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 