import { createServerClient } from '@supabase/ssr';
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies';

interface SupabaseServerCtx {
  cookies: RequestCookies | Promise<RequestCookies> | Promise<{ getAll: () => Array<{ name: string; value: string }>; set?: (name: string, value: string) => void }> | { getAll: () => Array<{ name: string; value: string }>; set?: (name: string, value: string) => void };
  canSet?: boolean;
}

export const supabaseServer = async (ctx: SupabaseServerCtx) => {
  const cookies = await ctx.cookies;
  const canSet = !!ctx.canSet && typeof cookies.set === 'function';

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          const allCookies = cookies.getAll();
          console.log('Getting cookies:', allCookies.map((c: { name: string; value: string }) => c.name));
          return allCookies;
        },
        ...(canSet && {
          setAll: (cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) => {
            console.log('Setting cookies:', cookiesToSet.map((c: { name: string; value: string; options?: Record<string, unknown> }) => c.name));
            cookiesToSet.forEach(({ name, value }) => {
              // Next.js RequestCookies.set() only accepts name and value
              console.log('Setting cookie:', name);
              if ('set' in cookies && typeof cookies.set === 'function') {
                cookies.set(name, value);
              }
            });
          },
        }),
      },
    }
  );
};
