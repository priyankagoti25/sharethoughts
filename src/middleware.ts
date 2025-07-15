import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {getToken} from "next-auth/jwt";

export async function middleware(request:NextRequest){
    const token = await getToken({req: request})
    const pathname = request.nextUrl.pathname
    if(pathname === '/'){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if(token && (
        pathname.startsWith('/sign-in') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/verify') ||
        pathname.startsWith('/')
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if(!token && pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/sign-in',
        '/signup',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}