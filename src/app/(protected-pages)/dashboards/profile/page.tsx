'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { FormItem, Form } from '@/components/ui/Form'
import { TbArrowLeft, TbUser, TbDeviceFloppy, TbLock, TbCalendar, TbGenderTransgender, TbBriefcase } from 'react-icons/tb'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import appConfig from '@/configs/app.config'

const profileValidationSchema = z.object({
    nama: z.string().min(3, { message: 'Nama lengkap minimal harus 3 karakter, Mek!' }),
    email: z.string().email({ message: 'Gunakan format email yang valid!' }),
    tanggal_lahir: z.string().min(1, { message: 'Tanggal lahir wajib diisi!' }),
    jenis_kelamin: z.string().min(1, { message: 'Pilih jenis kelamin lu, Dan!' }),
    pekerjaan: z.string().min(1, { message: 'Pekerjaan wajib diisi!' }),
})

type ProfileFormSchema = z.infer<typeof profileValidationSchema>

export default function AdminProfilePage() {
    const router = useRouter()
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

    useEffect(() => {
        const savedName = localStorage.getItem('name')
        const savedEmail = localStorage.getItem('email') || 'admin@melanolens.com'
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

        const currentEmail = localStorage.getItem('email') || values.email

        try {
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
                    user_email: currentEmail
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.detail || 'Gagal mengupdate profil di database')
            }

            localStorage.setItem('name', values.nama)
            localStorage.setItem('tanggal_lahir', values.tanggal_lahir)
            localStorage.setItem('jenis_kelamin', values.jenis_kelamin)
            localStorage.setItem('pekerjaan', values.pekerjaan)
            
            toast.push(
                <Notification title="Sukses Update" type="success">
                    Profil admin berhasil diperbarui!
                </Notification>
            )

            setSuccessMessage('Profil Anda berhasil diperbarui! 🔥')
            
            setTimeout(() => {
                window.location.href = '/dashboards/ecommerce'
            }, 1500)

        } catch (error: any) {
            console.error('Gagal update profile:', error)
            toast.push(
                <Notification title="Gagal Update" type="danger">
                    {error.message || 'Gagal terhubung ke backend!'}
                </Notification>
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="p-4 md:p-6 max-w-xl mx-auto min-h-screen">
            {/* Tombol Back */}
            <div className="mb-5">
                <Button 
                    size="sm" 
                    icon={<TbArrowLeft />} 
                    onClick={() => router.push('/dashboards/ecommerce')}
                    className="hover:text-primary transition-colors duration-200"
                >
                    Kembali ke Dashboard
                </Button>
            </div>

            {/* Kotak Form Utama */}
            <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/60 overflow-hidden p-0">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                        <TbUser size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-white">Profil Medis Admin</h1>
                        <p className="text-xs text-indigo-100">Kelola informasi akun administrator MelanoLens</p>
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

                    {/* Input Tanggal Lahir */}
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

                    {/* Input Jenis Kelamin */}
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
                                    className="w-full h-11 border border-gray-300 dark:border-slate-600 rounded-xl px-3 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer text-slate-700 dark:text-slate-200"
                                    {...field}
                                >
                                    <option value="">-- Pilih Jenis Kelamin --</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            )}
                        />
                    </FormItem>

                    {/* Input Pekerjaan */}
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
                                    placeholder="Contoh: Dokter, Dosen, PNS"
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
            </Card>
        </div>
    )
}
