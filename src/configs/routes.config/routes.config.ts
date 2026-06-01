import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    '/home': {
        key: 'home',
        authority: ['user'], // 🔒 Hanya user biasa/pasien yang bisa masuk ke halaman ini
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/dashboards': {
        key: 'dashboards',
        authority: ['admin'], // 🔒 Hanya admin/dokter yang bisa masuk ke panel dashboard admin
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

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