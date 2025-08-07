import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function getAuthenticatedUser(req: NextRequest) {
  const supabase = supabaseServer({ cookies: req.cookies });
  const { data: { user }, error } = await (await supabase).auth.getUser();

  if (!user || error) {
    return { user: null, supabase, error: 'Unauthorized' };
  }

  return { user, supabase, error: null };
}
