'use client'

import React from 'react'
import NavigationBar from './components/NavigationBar'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
            <NavigationBar />
            {children}
        </div>
    )
}
