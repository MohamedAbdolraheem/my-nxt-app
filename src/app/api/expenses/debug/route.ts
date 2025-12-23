import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// GET /api/expenses/debug - Debug endpoint to check expense data structure
export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServer({ cookies: req.cookies, canSet: false, headers: req.headers });
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get a sample expense with category
    const { data: sampleExpense, error: expenseError } = await supabase
      .from('expenses')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('user_id', user.id)
      .not('category_id', 'is', null)
      .limit(1)
      .single();

    // Get all expenses count
    const { count: totalExpenses } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get expenses with categories count
    const { count: expensesWithCategories } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .not('category_id', 'is', null);

    // Get expenses without categories count
    const { count: expensesWithoutCategories } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('category_id', null);

    return NextResponse.json({
      debug: {
        user_id: user.id,
        total_expenses: totalExpenses || 0,
        expenses_with_categories: expensesWithCategories || 0,
        expenses_without_categories: expensesWithoutCategories || 0,
        sample_expense: sampleExpense,
        sample_expense_structure: sampleExpense ? {
          id: sampleExpense.id,
          amount: sampleExpense.amount,
          category_id: sampleExpense.category_id,
          categories_object: sampleExpense.categories,
          has_categories: !!sampleExpense.categories
        } : null
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 