'use client'

import { useState, useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Link from 'next/link'
import signOut from '@/server/actions/auth/handleSignOut'
// Impor icon Pack seragam versi Lucide/Tabler Icons biar sejenis sama landing page lu!
import { TbUser, TbLogout, TbLayoutDashboard, TbId, TbClock } from 'react-icons/tb'

const _UserDropdown = () => {
    // 🔑 SETUP STATE DATA AKUN MANDIRI BIAR REPLIKA PERSIS SAMA NAVBAR LANDING PAGE LU MEK!
    const [userData, setUserData] = useState({ name: 'User', role: 'user' })

    useEffect(() => {
        // Ambil data login murni milik lu dari localStorage laptop
        const savedName = localStorage.getItem('name')
        const savedRole = localStorage.getItem('role')
        if (savedName) {
            setUserData({
                name: savedName,
                role: savedRole || 'user'
            })
        }
    }, [])

    const handleSignOut = async () => {
        // Hapus session cookie dan bersihkan localStorage persis cara landing page
        document.cookie = "melanolens-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
        localStorage.clear()
        await signOut()
        window.location.href = '/sign-in'
    }

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <Avatar 
                        size={32} 
                        className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-neutral-600 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition" 
                        icon={<TbUser />} 
                    />
                </div>
            }
            placement="bottom-end"
        >
            {/* 🚀 SEGMENTASI HEADER: SUDAH KEMBAR IDENTIK & MINIMALIS SAMA LANDING PAGE NYA */}
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 w-48">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Akun Anda</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate capitalize">{userData.name}</p>
                <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 rounded">
                    {userData.role}
                </span>
            </div>

            {/* Menu Navigasi Cek Profil */}
            <Dropdown.Item eventKey="Cek Profil" className="p-0">
                <Link 
                    href={userData.role === 'admin' ? '/dashboards/profile' : '/home/profile/edit'}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition"
                >
                    <TbId size={16} className="text-slate-400" />
                    <span>Cek Profil</span>
                </Link>
            </Dropdown.Item>

            <Dropdown.Item variant="divider" className="my-1" />

            {/* Tombol Keluar Akun warna merah menyala klinis */}
            <Dropdown.Item
                eventKey="Sign Out"
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-left transition duration-150"
                onClick={handleSignOut}
            >
                <TbLogout size={16} />
                <span>Keluar Akun</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown 