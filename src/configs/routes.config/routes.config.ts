// import authRoute from './authRoute'
// import type { Routes } from '@/@types/routes'

// export const protectedRoutes: Routes = {
//     '/home': {
//         key: 'home',
//         authority: [],
//         meta: {
//             pageBackgroundType: 'plain',
//             pageContainerType: 'contained',
//         },
//     },
// }

// export const publicRoutes: Routes = {}

// export const authRoutes = authRoute

import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    '/home': {
        key: 'home',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

// Benerin di sini: Daftarkan rute '/' agar dikenali sebagai halaman publik
export const publicRoutes: Routes = {
    '/': {
        key: 'landing',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export const authRoutes = authRoute