'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import Select from '@/components/ui/Select' // Pastiin template lu ada component ini, kalo ga ada nanti pake select bawaan HTML
import { TbArrowLeft, TbUser, TbDeviceFloppy, TbLock, TbCalendar, TbGenderTransgender, TbBriefcase } from 'react-icons/tb'
import Link from 'next/link'
import appConfig from '@/configs/app.config'

// 🧠 Validasi schema diperketat sesuai ERD mel_msuser
const profileValidationSchema = z.object({
    nama: z.string().min(3, { message: 'Nama lengkap minimal harus 3 karakter.' }),
    email: z.string().email({ message: 'Gunakan format email yang valid!' }),
    tanggal_lahir: z.string().min(1, { message: 'Tanggal lahir wajib diisi!' }),
    jenis_kelamin: z.string().min(1, { message: 'Pilih jenis kelamin Anda.' }),
    pekerjaan: z.string().min(1, { message: 'Pekerjaan wajib diisi!' }),
})

type ProfileFormSchema = z.infer<typeof profileValidationSchema>

const genderOptions = [
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' },
]

export default function EditProfilePage() {
    const [isSubmitting, setSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<ProfileFormSchema>({
        defaultValues: {
            nama: '',
            email: '',
            tanggal_lahir: '',
            jenis_kelamin: '',
            pekerjaan: '',
        },
        resolver: zodResolver(profileValidationSchema),
    })

    // 🔄 Tarik data akun komplit dari storage pas page di-load
    useEffect(() => {
        const savedName = localStorage.getItem('name')
        const savedEmail = localStorage.getItem('email') || 'user@melanolens.com'
        const savedTanggalLahir = localStorage.getItem('tanggal_lahir') || ''
        const savedJenisKelamin = localStorage.getItem('jenis_kelamin') || ''
        const savedPekerjaan = localStorage.getItem('pekerjaan') || ''

        if (savedName) setValue('nama', savedName)
        if (savedEmail) setValue('email', savedEmail)
        if (savedTanggalLahir) setValue('tanggal_lahir', savedTanggalLahir)
        if (savedJenisKelamin) setValue('jenis_kelamin', savedJenisKelamin)
        if (savedPekerjaan) setValue('pekerjaan', savedPekerjaan)
    }, [setValue])

    const onProfileSubmit = async (values: ProfileFormSchema) => {
        setSubmitting(true)
        setSuccessMessage('')

        // 🔑 Ambil email backup langsung dari storage karena inputnya disabled di form
        const currentEmail = localStorage.getItem('email') || values.email

        try {
            // 🚀 NEMBAK KE FASTAPI LU DENGAN PAYLOAD VALID
            const res = await fetch(`${appConfig.backendApiUrl}/api/auth/update-profile`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    user_nama: values.nama,
                    user_tanggalLahir: values.tanggal_lahir,
                    user_jenisKelamin: values.jenis_kelamin,
                    user_pekerjaan: values.pekerjaan,
                    user_email: currentEmail // 👈 Dijamin terisi aman, gak bakal undefined lagi!
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.detail || 'Gagal mengupdate profil di database')
            }

            // 🔑 Update semua data lokal browser
            localStorage.setItem('name', values.nama)
            localStorage.setItem('tanggal_lahir', values.tanggal_lahir)
            localStorage.setItem('jenis_kelamin', values.jenis_kelamin)
            localStorage.setItem('pekerjaan', values.pekerjaan)
            
            setSuccessMessage('Profil Anda berhasil diperbarui di cloud Supabase! 🔥')
            
            setTimeout(() => {
                window.location.href = '/home'
            }, 1500)

        } catch (error: any) {
            console.error('Gagal update profile:', error)
            alert(error.message || 'Gagal terhubung ke backend!')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-200">
            <div className="max-w-xl mx-auto">
                
                {/* Tombol Back */}
                <Link 
                    href="/home" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white mb-6 group transition"
                >
                    <TbArrowLeft className="group-hover:-translate-x-1 transition" size={16} />
                    <span>Kembali ke Beranda</span>
                </Link>

                {/* Kotak Form Utama */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/60 overflow-hidden">
                    
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                            <TbUser size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold">Data Profil Medis</h1>
                            <p className="text-xs text-indigo-100">Lengkapi data akun sesuai standar rekam medis</p>
                        </div>
                    </div>

                    {/* Form Isian */}
                    <Form onSubmit={handleSubmit(onProfileSubmit)} className="p-6 space-y-5">
                        
                        {/* Alert Notifikasi Sukses */}
                        {successMessage && (
                            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-xl p-4 text-sm font-semibold animate-in fade-in duration-300">
                                {successMessage}
                            </div>
                        )}

                        {/* Input Nama Lengkap */}
                        <FormItem
                            label="Nama Lengkap"
                            invalid={Boolean(errors.nama)}
                            errorMessage={errors.nama?.message}
                        >
                            <Controller
                                name="nama"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Masukkan Nama Lengkap"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Input Email (Kunci) */}
                        <FormItem
                            label={
                                (
                                    <div className="flex items-center gap-1">
                                        <span>Alamat Email</span>
                                        <TbLock className="text-slate-400" size={12} />
                                        <span className="text-[10px] text-slate-400 font-normal">(Tidak dapat diubah)</span>
                                    </div>
                                ) as unknown as string
                            }
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        disabled
                                        className="bg-slate-50 dark:bg-slate-700/30 text-slate-400 cursor-not-allowed"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* 📅 Input Tanggal Lahir (user_tanggalLahir) */}
                        <FormItem
                            label={
                                (
                                    <div className="flex items-center gap-1">
                                        <TbCalendar size={14} className="text-slate-400" />
                                        <span>Tanggal Lahir</span>
                                    </div>
                                ) as unknown as string
                            }
                            invalid={Boolean(errors.tanggal_lahir)}
                            errorMessage={errors.tanggal_lahir?.message}
                        >
                            <Controller
                                name="tanggal_lahir"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="date"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* ⚧️ Input Jenis Kelamin (user_jenisKelamin) */}
                        <FormItem
                            label={
                                (
                                    <div className="flex items-center gap-1">
                                        <TbGenderTransgender size={14} className="text-slate-400" />
                                        <span>Jenis Kelamin</span>
                                    </div>
                                ) as unknown as string
                            }
                            invalid={Boolean(errors.jenis_kelamin)}
                            errorMessage={errors.jenis_kelamin?.message}
                        >
                            <Controller
                                name="jenis_kelamin"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        className="w-full h-11 border border-gray-300 dark:border-slate-600 rounded-xl px-3 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        {...field}
                                    >
                                        <option value="">-- Pilih Jenis Kelamin --</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                )}
                            />
                        </FormItem>

                        {/* 💼 Input Pekerjaan (user_pekerjaan) */}
                        <FormItem
                            label={
                                (
                                    <div className="flex items-center gap-1">
                                        <TbBriefcase size={14} className="text-slate-400" />
                                        <span>Pekerjaan</span>
                                    </div>
                                ) as unknown as string
                            }
                            invalid={Boolean(errors.pekerjaan)}
                            errorMessage={errors.pekerjaan?.message}
                        >
                            <Controller
                                name="pekerjaan"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Contoh: PNS, Mahasiswa, Buruh"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <div className="border-t border-slate-100 dark:border-slate-700/60 pt-4 flex justify-end">
                            <Button
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                                className="flex items-center gap-2"
                            >
                                <TbDeviceFloppy size={16} />
                                <span>Simpan Perubahan</span>
                            </Button>
                        </div>

                    </Form>
                </div>

            </div>
        </div>
    )
}