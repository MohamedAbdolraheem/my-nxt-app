import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// GET /api/expenses/[id] - Get a specific expense
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const expenseId = id;

    // Fetch the expense
    const { data: expense, error } = await supabase
      .from('expenses')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('id', expenseId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Expense not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching expense:', error);
      return NextResponse.json(
        { error: 'Failed to fetch expense' },
        { status: 500 }
      );
    }

    return NextResponse.json({ expense });

  } catch (error) {
    console.error('Get expense API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/expenses/[id] - Update an expense
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const expenseId = id;

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { amount, category_id, note } = body;

    // Check if expense exists and belongs to user
    const { data: existingExpense, error: fetchError } = await supabase
      .from('expenses')
      .select('id')
      .eq('id', expenseId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingExpense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Validate amount if provided
    if (amount !== undefined) {
      if (typeof amount !== 'number') {
        return NextResponse.json(
          { error: 'Amount must be a number' },
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
    }

    // Validate note if provided
    if (note !== undefined) {
      if (typeof note !== 'string') {
        return NextResponse.json(
          { error: 'Note must be a string' },
          { status: 400 }
        );
      }

      if (note.length > 500) {
        return NextResponse.json(
          { error: 'Note must be 500 characters or less' },
          { status: 400 }
        );
      }
    }

    // Validate category_id if provided
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

    // Build update data
    const updateData: {
      amount?: number;
      note?: string | null;
      category_id?: number;
    } = {};
    if (amount !== undefined) updateData.amount = amount;
    if (note !== undefined) updateData.note = note?.trim() || null;
    if (category_id !== undefined) updateData.category_id = category_id;

    // Update the expense
    const { data: expense, error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', expenseId)
      .eq('user_id', user.id)
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .single();

    if (error) {
      console.error('Error updating expense:', error);
      return NextResponse.json(
        { error: 'Failed to update expense' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Expense updated successfully',
      expense
    });

  } catch (error) {
    console.error('Update expense API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id] - Delete an expense
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const expenseId = id;

    // Check if expense exists and belongs to user
    const { data: existingExpense, error: fetchError } = await supabase
      .from('expenses')
      .select('id')
      .eq('id', expenseId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingExpense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Delete the expense
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting expense:', error);
      return NextResponse.json(
        { error: 'Failed to delete expense' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Delete expense API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 