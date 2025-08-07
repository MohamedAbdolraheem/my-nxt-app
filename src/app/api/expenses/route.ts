import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// GET /api/expenses - Get all expenses for the authenticated user with filtering
export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServer({ cookies: req.cookies, canSet: false });
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryId = searchParams.get('category_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Validate sort parameters
    const allowedSortFields = ['created_at', 'amount', 'note'];
    if (!allowedSortFields.includes(sortBy)) {
      return NextResponse.json(
        { error: 'Invalid sort field' },
        { status: 400 }
      );
    }

    if (!['asc', 'desc'].includes(sortOrder)) {
      return NextResponse.json(
        { error: 'Invalid sort order' },
        { status: 400 }
      );
    }

    // Build the query
    let query = supabase
      .from('expenses')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('user_id', user.id);

    // Apply filters
    if (categoryId) {
      const categoryIdNum = parseInt(categoryId);
      if (isNaN(categoryIdNum)) {
        return NextResponse.json(
          { error: 'Invalid category ID' },
          { status: 400 }
        );
      }
      query = query.eq('category_id', categoryIdNum);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Execute the query
    const { data: expenses, error, count } = await query;

    if (error) {
      console.error('Error fetching expenses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch expenses' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let totalCount = count;
    if (totalCount === null) {
      const { count: total } = await supabase
        .from('expenses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      totalCount = total || 0;
    }

    return NextResponse.json({
      expenses: expenses || [],
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Expenses API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/expenses - Create a new expense
export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer({ cookies: req.cookies, canSet: false });
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { amount, category_id, note } = body;

    // Validate required fields
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Amount is required and must be a number' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (amount > 999999.99) {
      return NextResponse.json(
        { error: 'Amount cannot exceed 999,999.99' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (note !== undefined && typeof note !== 'string') {
      return NextResponse.json(
        { error: 'Note must be a string' },
        { status: 400 }
      );
    }

    if (note && note.length > 500) {
      return NextResponse.json(
        { error: 'Note must be 500 characters or less' },
        { status: 400 }
      );
    }

    if (category_id !== undefined) {
      if (typeof category_id !== 'number') {
        return NextResponse.json(
          { error: 'Category ID must be a number' },
          { status: 400 }
        );
      }

      // Verify category exists and belongs to user
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', category_id)
        .eq('user_id', user.id)
        .single();

      if (categoryError || !category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
    }

    // Create the expense
    const expenseData: {
      amount: number;
      user_id: string;
      note: string | null;
      category_id?: number;
    } = {
      amount,
      user_id: user.id,
      note: note?.trim() || null
    };

    if (category_id) {
      expenseData.category_id = category_id;
    }

    const { data: expense, error } = await supabase
      .from('expenses')
      .insert(expenseData)
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .single();

    if (error) {
      console.error('Error creating expense:', error);
      return NextResponse.json(
        { error: 'Failed to create expense' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Expense created successfully',
      expense
    }, { status: 201 });

  } catch (error) {
    console.error('Create expense API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
