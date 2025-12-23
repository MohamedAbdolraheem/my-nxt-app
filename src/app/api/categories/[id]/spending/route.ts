// In your Next.js API: /api/categories/[id]/spending/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await supabaseServer({ 
      cookies: req.cookies, 
      canSet: false, 
      headers: req.headers 
    });
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categoryId = parseInt(params.id);
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'month';

    // Calculate spending for the category in the specified period
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', user.id)
      .eq('category_id', categoryId)
      .gte('created_at', getPeriodStartDate(period));

    if (error) {
      console.error('Error fetching category spending:', error);
      return NextResponse.json({ error: 'Failed to fetch spending' }, { status: 500 });
    }

    const totalSpending = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    return NextResponse.json({ totalSpending });
  } catch (error) {
    console.error('Error in category spending API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getPeriodStartDate(period: string): string {
  const now = new Date();
  if (period === 'year') {
    return new Date(now.getFullYear(), 0, 1).toISOString();
  } else {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }
}