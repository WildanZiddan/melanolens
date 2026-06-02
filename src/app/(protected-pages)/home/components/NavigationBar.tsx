'use client'
import { useState, useEffect } from 'react'
import NavList from './NavList'
import Drawer from '@/components/ui/Drawer'
import classNames from '@/utils/classNames'
import useScrollTop from '@/utils/hooks/useScrollTop'
import Image from 'next/image'
import { TbMenu2, TbUser, TbLogout, TbLayoutDashboard, TbId } from 'react-icons/tb'
import Link from 'next/link'
import type { Mode } from '@/@types/theme'
import ProfileCard from '@/components/shared/ProfileCard'

type NavigationProps = {
    toggleMode: () => void
    mode: Mode
}

const navMenu = [
    {
        title: 'Beranda',
        value: 'features',
        to: 'features',
    },
    {
        title: 'Panduan Penggunaan',
        value: 'panduan',
        to: 'panduan',
    },
    {
        title: 'FAQ',
        value: 'faq',
        to: 'faq',
    },
    {
        title: 'Riwayat Scan',
        value: 'history',
        href: '/guide/documentation/introduction',
    },
]

const Navigation = ({ toggleMode, mode }: NavigationProps) => {
    const { isSticky } = useScrollTop()

    const [isOpen, setIsOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false) 
    const [profileOpen, setProfileOpen] = useState(false)
    const [userData, setUserData] = useState({ name: 'User', role: 'user' }) 

    useEffect(() => {
        const savedName = localStorage.getItem('name')
        const savedRole = localStorage.getItem('role')
        if (savedName) {
            setUserData({
                name: savedName,
                role: savedRole || 'user'
            })
        }
    }, [])

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const handleSignOut = () => {
        document.cookie = "melanolens-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
        localStorage.clear()
        window.location.href = '/sign-in'
    }

    return (
        <div
            style={{ transition: 'all 0.2s ease-in-out' }}
            className={classNames(
                'w-full fixed inset-x-0 z-[40]',
                isSticky ? 'top-4' : 'top-0',
            )}
        >
            <div
                className={classNames(
                    'flex flex-row self-start items-center justify-between py-3 max-w-7xl mx-auto px-4 rounded-xl relative z-[60] w-full transition duration-200',
                    isSticky
                        ? 'bg-white dark:bg-slate-800 shadow-lg'
                        : 'bg-transparent dark:bg-transparent',
                )}
            >
                <button
                    onClick={openDrawer}
                    className="flex lg:hidden items-center gap-4"
                >
                    <TbMenu2 size={24} />
                </button>
                <Drawer
                    title="Navigation"
                    isOpen={isOpen}
                    onClose={onDrawerClose}
                    onRequestClose={onDrawerClose}
                    width={250}
                    placement="left"
                >
                    <div className="flex flex-col gap-4">
                        <NavList onTabClick={onDrawerClose} tabs={navMenu} />
                    </div>
                </Drawer>
                <Link href="/">
                    {mode === 'light' && (
                        <Image
                            src="/img/logo/logo-light-full.png"
                            width={120}
                            height={40}
                            alt="logo"
                        />
                    )}
                    {mode === 'dark' && (
                        <Image
                            src="/img/logo/logo-dark-full.png"
                            width={120}
                            height={40}
                            alt="logo"
                        />
                    )}
                </Link>
                <div className="lg:flex flex-row flex-1 absolute inset-0 hidden items-center justify-center text-sm text-zinc-600 font-medium hover:text-zinc-800 transition duration-200 [perspective:1000px] overflow-auto sm:overflow-visible no-visible-scrollbar">
                    <NavList tabs={navMenu} />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="relative flex cursor-pointer items-center justify-center rounded-xl p-2 text-neutral-500 hover:shadow-input dark:text-white"
                        onClick={toggleMode}
                    >
                        <svg
                            className="lucide lucide-sun rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                            fill="none"
                            height="16"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" />
                            <path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" />
                            <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                        <svg
                            className="lucide lucide-moon absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                            fill="none"
                            height="16"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                        <span className="sr-only">Toggle theme</span>
                    </button>

                    <div className="relative ml-1">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-neutral-600 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                        >
                            <TbUser size={18} />
                        </button>

                        {dropdownOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Akun Anda</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{userData.name}</p>
                                        <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 rounded">
                                            {userData.role}
                                        </span>
                                    </div>
                                    
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false)
                                            setProfileOpen(true)
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition"
                                    >
                                        <TbId size={16} />
                                        <span>Cek Profil</span>
                                    </button>

                                    {/* Tombol Panel Admin khusus jika role di-set sebagai admin */}
                                    {userData.role === 'admin' && (
                                        <Link 
                                            href="/dashboards/ecommerce"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <TbLayoutDashboard size={16} />
                                            <span>Panel Admin</span>
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-left transition"
                                    >
                                        <TbLogout size={16} />
                                        <span>Keluar Akun</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>

            <ProfileCard 
                isOpen={profileOpen} 
                onClose={() => setProfileOpen(false)} 
                userData={userData}
            />
        </div>
    )
}

export default Navigation