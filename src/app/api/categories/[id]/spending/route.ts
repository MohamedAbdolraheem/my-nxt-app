import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // REQUIRED
    const categoryId = Number(id);

    const supabase = await supabaseServer({
      cookies: req.cookies,
      canSet: false,
      headers: req.headers,
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') ?? 'month';

    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', user.id)
      .eq('category_id', categoryId)
      .gte('created_at', getPeriodStartDate(period));

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch spending' },
        { status: 500 }
      );
    }

    const totalSpending =
      expenses?.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      ) ?? 0;

    return NextResponse.json({ totalSpending });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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