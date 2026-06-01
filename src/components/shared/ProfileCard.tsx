'use client'

import React, { useEffect, useState } from 'react'
import { TbX, TbEdit, TbShield, TbMail, TbCalendar, TbGenderTransgender, TbBriefcase } from 'react-icons/tb'

interface ProfileCardProps {
    isOpen: boolean
    onClose: () => void
    userData: { name: string; role: string }
}

const ProfileCard = ({ isOpen, onClose, userData }: ProfileCardProps) => {
    const [fullData, setFullData] = useState({
        email: '',
        tanggalLahir: '',
        jenisKelamin: '',
        pekerjaan: ''
    })

    // 🔄 Tarik sisa data ERD pelengkap dari localStorage pas modal dibuka
    useEffect(() => {
        if (isOpen) {
            setFullData({
                email: localStorage.getItem('email') || 'user@melanolens.com',
                tanggalLahir: localStorage.getItem('tanggal_lahir') || '-',
                jenisKelamin: localStorage.getItem('jenis_kelamin') || '-',
                pekerjaan: localStorage.getItem('pekerjaan') || '-'
            })
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleGoToEdit = () => {
        onClose() // Tutup popup dulu
        window.location.href = '/home/profile/edit' // Lempar ke page edit
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop Gelap Belakang Popup */}
            <div 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Kotak Modal Popup */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-sm relative z-10 overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header Popup & Tombol Close */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Profil Pengguna</h3>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                        <TbX size={18} />
                    </button>
                </div>

                {/* Body Konten Profil */}
                <div className="p-6 flex flex-col items-center">
                    {/* Placeholder Avatar Huruf */}
                    <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl border-2 border-indigo-200 dark:border-indigo-800 mb-3 shadow-sm">
                        {userData.name.charAt(0).toUpperCase()}
                    </div>

                    <h4 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1 text-center">
                        {userData.name}
                    </h4>

                    {/* Badge Role / Hak Akses */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-5">
                        <TbShield className="text-indigo-500" size={14} />
                        <span className="capitalize bg-slate-50 dark:bg-slate-700/50 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-600">
                            {userData.role}
                        </span>
                    </div>

                    {/* 📋 INFORMASI DETAIL SESUAI ERD LU, MEK! */}
                    <div className="w-full bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 text-left text-xs space-y-3 border border-slate-100 dark:border-slate-700/60 mb-6">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-400 flex items-center gap-1">
                                <TbMail size={14} /> Email
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
                                {fullData.email}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1">
                                <TbCalendar size={14} /> Tgl Lahir
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                {fullData.tanggalLahir}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1">
                                <TbGenderTransgender size={14} /> Gender
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                {fullData.jenisKelamin}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1">
                                <TbBriefcase size={14} /> Pekerjaan
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
                                {fullData.pekerjaan}
                            </span>
                        </div>
                    </div>

                    {/* Tombol Aksi Menuju Halaman Edit Profil */}
                    <button
                        onClick={handleGoToEdit}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition shadow-md hover:shadow-indigo-500/20 text-sm"
                    >
                        <TbEdit size={16} />
                        <span>Ubah / Edit Profil</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard