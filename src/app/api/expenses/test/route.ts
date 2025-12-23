import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// POST /api/expenses/test - Test expense creation with detailed debugging
export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer({ cookies: req.cookies, canSet: false, headers: req.headers });
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', userError },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body', parseError: parseError.message },
        { status: 400 }
      );
    }

    const { amount, category_id, note } = body;

    // First, let's check what categories this user has
    const { data: userCategories } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id);

    // Return detailed debugging info
    return NextResponse.json({
      debug: {
        user_id: user.id,
        received_data: { amount, category_id, note },
        category_id_type: typeof category_id,
        user_categories: userCategories,
        category_id_validation: {
          is_undefined: category_id === undefined,
          is_null: category_id === null,
          is_number: typeof category_id === 'number',
          is_string: typeof category_id === 'string',
          value: category_id
        }
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 