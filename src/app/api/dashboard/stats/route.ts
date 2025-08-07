import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// GET /api/dashboard/stats - Get dashboard statistics
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

    // Get query parameters for date range
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'month'; // month, week, year, all

    // Calculate date range
    const now = new Date();
    let startDate: string | null = null;
    
    switch (period) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = weekAgo.toISOString();
        break;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        startDate = monthAgo.toISOString();
        break;
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        startDate = yearAgo.toISOString();
        break;
      case 'all':
      default:
        startDate = null;
        break;
    }

    // Build base query
    let query = supabase
      .from('expenses')
      .select('amount, created_at')
      .eq('user_id', user.id);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    // Get total expenses for the period
    const { data: expenses, error: expensesError } = await query;

    if (expensesError) {
      console.error('Error fetching expenses for stats:', expensesError);
      return NextResponse.json(
        { error: 'Failed to fetch expense statistics' },
        { status: 500 }
      );
    }

    // Calculate statistics
    const totalAmount = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
    const expenseCount = expenses?.length || 0;
    const averageAmount = expenseCount > 0 ? totalAmount / expenseCount : 0;

    // Get category breakdown
    const { data: categoryStats, error: categoryError } = await supabase
      .from('expenses')
      .select(`
        amount,
        categories (
          id,
          name
        )
      `)
      .eq('user_id', user.id)
      .not('category_id', 'is', null);

    if (categoryError) {
      console.error('Error fetching category stats:', categoryError);
    }

    // Calculate category breakdown
    const categoryBreakdown: { [key: string]: number } = {};
    if (categoryStats) {
      categoryStats.forEach(expense => {
        const categoryName = expense.categories?.[0]?.name || 'Uncategorized';
        categoryBreakdown[categoryName] = (categoryBreakdown[categoryName] || 0) + Number(expense.amount);
      });
    }

    // Get recent expenses (last 5)
    const { data: recentExpenses, error: recentError } = await supabase
      .from('expenses')
      .select(`
        id,
        amount,
        note,
        created_at,
        categories (
          id,
          name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('Error fetching recent expenses:', recentError);
    }

    // Get total categories count
    const { count: categoryCount, error: categoryCountError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (categoryCountError) {
      console.error('Error fetching category count:', categoryCountError);
    }

    return NextResponse.json({
      stats: {
        totalAmount: Number(totalAmount.toFixed(2)),
        expenseCount,
        averageAmount: Number(averageAmount.toFixed(2)),
        categoryCount: categoryCount || 0,
        period
      },
      categoryBreakdown,
      recentExpenses: recentExpenses || []
    });

  } catch (error) {
    console.error('Dashboard stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 