import React from 'react'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import AdminGuard from './_components/AdminGuard'
import { ReactNode } from 'react'

const Layout = async ({ children }: { children: ReactNode }) => {
    return (
        <AdminGuard>
            <PostLoginLayout>{children}</PostLoginLayout>
        </AdminGuard>
    )
}

export default Layout
