import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export type MiddlewareOptions = {
    publicRoutes?: string[]
    defaultAuthenticatedRoute?: string
}

export async function updateSession(request: NextRequest, options: MiddlewareOptions = {}) {
    const { publicRoutes = ['/login'], defaultAuthenticatedRoute = '/routines' } = options

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refreshing the auth token
    const { data: { user } } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    console.log('Middleware - User:', user?.email ?? 'not logged in', '| Path:', pathname)

    // Redirect unauthenticated users to login (unless on public route)
    if (!user && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect authenticated users away from login page and root
    if (user && (pathname === '/login' || pathname === '/')) {
        const redirectUrl = new URL(defaultAuthenticatedRoute, request.url)
        return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
}
