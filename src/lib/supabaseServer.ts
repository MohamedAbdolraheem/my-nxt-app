import { createServerClient } from '@supabase/ssr';

type CookieToSet = { name: string; value: string; options?: any };

type SupabaseServerCtx = {
  cookies: any;
  canSet?: boolean;
};

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
          console.log('Getting cookies:', allCookies.map((c: any) => c.name));
          return allCookies;
        },
        ...(canSet && {
          setAll: (cookiesToSet: Array<CookieToSet>) => {
            console.log('Setting cookies:', cookiesToSet.map((c: any) => c.name));
            cookiesToSet.forEach(({ name, value, options }) => {
              // Use the original options from Supabase, but ensure proper defaults
              const cookieOptions = {
                ...options,
                httpOnly: options?.httpOnly ?? true,
                secure: options?.secure ?? (process.env.NODE_ENV === 'production'),
                sameSite: options?.sameSite ?? 'lax',
                path: options?.path ?? '/',
              };
              console.log('Setting cookie with options:', name, cookieOptions);
              cookies.set(name, value, cookieOptions);
            });
          },
        }),
      },
    }
  );
};
