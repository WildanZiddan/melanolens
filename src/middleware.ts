// import NextAuth from 'next-auth'

// import authConfig from '@/configs/auth.config'
// import {
//     authRoutes as _authRoutes,
//     publicRoutes as _publicRoutes,
//     protectedRoutes
// } from '@/configs/routes.config'
// import { REDIRECT_URL_KEY } from '@/constants/app.constant'
// import appConfig from '@/configs/app.config'

// const { auth } = NextAuth(authConfig)

// const publicRoutes = Object.entries(_publicRoutes).map(([key]) => key)
// const authRoutes = Object.entries(_authRoutes).map(([key]) => key)

// const apiAuthPrefix = `${appConfig.apiPrefix}/auth`

// export default auth((req) => {
//     const { nextUrl } = req
//     const isSignedIn = !!req.auth

//     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
//     const isPublicRoute = publicRoutes.some((route) => {
//         if (route === '/') return nextUrl.pathname === '/' // Kalau root wajib exact match
//         return nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
//     })

//     const isAuthRoute = authRoutes.some((route) => {
//         if (route === '/') return nextUrl.pathname === '/'
//         return nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
//     })

//     /** Skip auth middleware for api routes */
//     if (isApiAuthRoute) return

//     if (isAuthRoute) {
//         if (isSignedIn) {
//             /** Redirect to authenticated entry path if signed in & path is auth route */
//             return Response.redirect(
//                 new URL(appConfig.authenticatedEntryPath, nextUrl),
//             )
//         }
//         return
//     }

//     /** Redirect to authenticated entry path if signed in & path is public route */
//     if (!isSignedIn && !isPublicRoute) {
//         let callbackUrl = nextUrl.pathname
//         if (nextUrl.search) {
//             callbackUrl += nextUrl.search
//         }

//         return Response.redirect(
//             new URL(
//                 `${appConfig.unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${callbackUrl}`,
//                 nextUrl,
//             ),
//         )
//     }

//     /** Uncomment this and `import { protectedRoutes } from '@/configs/routes.config'` if you want to enable role based access */
//     if (isSignedIn && nextUrl.pathname !== '/access-denied' && !nextUrl.pathname.startsWith(appConfig.apiPrefix)) {
//         const routeMeta = protectedRoutes[nextUrl.pathname]
//         const existingRoute = routeMeta
//         const includedRole = routeMeta?.authority.some((role) => req.auth?.user?.authority.includes(role))
//         if (existingRoute && !includedRole) {
//             return Response.redirect(
//                 new URL('/access-denied', nextUrl),
//             )
//         }
//     }
// })

// export const config = {
//     matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
// }

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
    authRoutes as _authRoutes,
    publicRoutes as _publicRoutes,
    protectedRoutes
} from '@/configs/routes.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import appConfig from '@/configs/app.config'

const publicRoutes = Object.entries(_publicRoutes).map(([key]) => key)
const authRoutes = Object.entries(_authRoutes).map(([key]) => key)
const apiAuthPrefix = `${appConfig.apiPrefix}/auth`

export default function middleware(req: NextRequest) {
    const { nextUrl } = req
    
    // 🔑 SINKRON: Sekarang satpam beneran nyari cookie 'melanolens-session' bawaan form kita!
    const allCookies = req.cookies.getAll()
    const hasAuthCookie = allCookies.some(cookie => 
        cookie.name === 'melanolens-session'
    )

    // Jika ada cookie mandiri di atas, berarti user dinyatakan SUDAH LOGIN
    const isSignedIn = hasAuthCookie
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)

    const isPublicRoute = publicRoutes.some((route) => {
        if (route === '/') return nextUrl.pathname === '/'
        return nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
    })

    const isAuthRoute = authRoutes.some((route) => {
        if (route === '/') return nextUrl.pathname === '/'
        return nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
    })

    /** Skip auth middleware for api routes */
    if (isApiAuthRoute) return NextResponse.next()

    if (isAuthRoute) {
        if (isSignedIn) {
            /** Kalau sudah login tapi maksa buka halaman /sign-in, lempar ke dashboard/home utama! */
            return NextResponse.redirect(new URL(appConfig.authenticatedEntryPath, nextUrl))
        }
        return NextResponse.next()
    }

    /** Kalau BELUM login dan maksa buka halaman rahasia/dashboard, tendang ke sign-in */
    if (!isSignedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }

        return NextResponse.redirect(
            new URL(
                `${appConfig.unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${encodeURIComponent(callbackUrl)}`,
                nextUrl,
            )
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
}