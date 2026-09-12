'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const role = localStorage.getItem('role')
        if (role !== 'admin') {
            router.replace('/home')
        } else {
            setIsAuthorized(true)
        }
    }, [router])

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-xs text-slate-400 font-medium">Memverifikasi hak akses admin...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
