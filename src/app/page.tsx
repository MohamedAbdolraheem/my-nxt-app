import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function Home() {
  const supabase = await supabaseServer({ cookies: cookies() });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // If user is authenticated, redirect to dashboard
  redirect('/dashboard');
}
