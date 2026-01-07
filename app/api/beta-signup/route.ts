import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, useCase, twitter } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // If Supabase is configured, store in database
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase
        .from('beta_signups')
        .insert({
          name,
          email,
          company: company || null,
          use_case: useCase || null,
          twitter_handle: twitter || null,
          created_at: new Date().toISOString(),
        });

      if (error) {
        // Check for duplicate email
        if (error.code === '23505') {
          return NextResponse.json(
            { error: 'This email is already on the waitlist!' },
            { status: 409 }
          );
        }
        console.error('Supabase error:', error);
        throw error;
      }
    } else {
      // Fallback: Log to console in development
      console.log('Beta signup (no DB configured):', { name, email, company, useCase, twitter });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully added to the waitlist',
    });
  } catch (error) {
    console.error('Beta signup error:', error);
    return NextResponse.json(
      { error: 'Failed to process signup. Please try again.' },
      { status: 500 }
    );
  }
}
