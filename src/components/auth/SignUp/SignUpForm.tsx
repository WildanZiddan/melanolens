'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'
import appConfig from '@/configs/app.config'

type SignUpFormSchema = {
    nama: string
    email: string
    password: string
    confirmPassword: string
    tanggal_lahir: string
    jenis_kelamin: string
    pekerjaan: string
}

export type OnSignUpPayload = {
    values: SignUpFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
}

export type OnSignUp = (payload: OnSignUpPayload) => void

interface SignUpFormProps extends CommonProps {
    setMessage: (message: string) => void
    onSignUp?: OnSignUp
    className?: string
}

const validationSchema = z.object({
    nama: z.string().min(1, {
        message: 'Silakan masukkan nama lengkap Anda',
    }),
    email: z
        .string()
        .min(1, {
            message: 'Email wajib diisi',
        })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message: 'Format email tidak valid',
        }),
    password: z
        .string()
        .min(8, {
            message: 'Minimal 8 karakter',
        })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/, {
            message: 'Harus mengandung huruf, angka, dan karakter spesial',
        }),
    confirmPassword: z.string().min(1, {
        message: 'Konfirmasi kata sandi wajib diisi',
    }),
    tanggal_lahir: z.string().min(1, {
        message: 'Tanggal lahir wajib diisi',
    }),
    jenis_kelamin: z.string().min(1, {
        message: 'Jenis kelamin wajib diisi',
    }),
    pekerjaan: z.string().min(1, {
        message: 'Pekerjaan wajib diisi',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok!",
    path: ["confirmPassword"],
})

const renderLabel = (title: string, error?: string): ReactNode => {
    return (
        <div className="flex items-center gap-2">
            <span className="flex items-center">
                <span>{title}</span>
                <span className="text-red-500 ml-1">*</span>
            </span>
            {error && <span className="text-[11px] text-red-500">{error}</span>}
        </div>
    )
}

const SignUpForm = (props: SignUpFormProps) => {
    const { onSignUp, className, setMessage } = props
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
        trigger,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            nama: '',
            email: '',
            password: '',
            confirmPassword: '',
            tanggal_lahir: '',
            jenis_kelamin: '',
            pekerjaan: '',
        },
    })

    const [currentStep, setCurrentStep] = useState<number>(1)
    const totalSteps = 2

    const passwordValue = watch('password') || ''

    const goNextStep = async () => {
        const currentFields =
            currentStep === 1
                ? ['nama', 'pekerjaan', 'tanggal_lahir', 'jenis_kelamin']
                : ['email', 'password', 'confirmPassword']

        const isValid = await trigger(currentFields as any)
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
        }
    }

    const goBackStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const getPasswordStrength = (password: string) => {
        let score = 0
        if (password.length >= 8) score++
        if (/[A-Z]/.test(password)) score++
        if (/[a-z]/.test(password)) score++
        if (/\d/.test(password)) score++
        if (/[@$!%*#?&]/.test(password)) score++

        if (score <= 2) return { label: 'Lemah', color: 'text-red-500' }
        if (score <= 4) return { label: 'Menengah', color: 'text-yellow-500' }
        return { label: 'Kuat', color: 'text-green-500' }
    }

    const passwordStrength = getPasswordStrength(passwordValue)

    const handleSignUp = async (values: SignUpFormSchema) => {
        setSubmitting(true)
        setMessage('')

        try {
            const res = await fetch(`${appConfig.backendApiUrl}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama: values.nama,
                    email: values.email,
                    password: values.password,
                    tanggal_lahir: values.tanggal_lahir,
                    jenis_kelamin: values.jenis_kelamin,
                    pekerjaan: values.pekerjaan,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                alert("Akun berhasil didaftarkan! Silakan masuk dengan akun Anda.")
                globalThis.location.href = '/sign-in'
            } else {
                setMessage(data.detail || 'Gagal mendaftarkan akun baru.')
                setSubmitting(false)
            }

        } catch (error) {
            console.error('Koneksi putus ke FastAPI:', error)
            setMessage('Gagal terhubung ke server')
            setSubmitting(false)
        }

        if (onSignUp) {
            onSignUp({ values, setSubmitting, setMessage })
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(handleSignUp)}>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${currentStep === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            1. Informasi Dasar
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${currentStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            2. Akun
                        </div>
                    </div>
                    <div className="text-sm text-slate-500">Langkah {currentStep} dari {totalSteps}</div>
                </div>

                {currentStep === 1 && (
                    <div className="flex flex-col gap-3">
                        <FormItem
                            className="mb-3"
                            label={
                                renderLabel(
                                    'Nama Lengkap',
                                    errors.nama?.message,
                                ) as unknown as string
                            }
                            invalid={Boolean(errors.nama)}
                        >
                            <Controller
                                name="nama"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Nama Lengkap Anda"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            className="mb-3"
                            label={
                                renderLabel(
                                    'Tanggal Lahir',
                                    errors.tanggal_lahir?.message,
                                ) as unknown as string
                            }
                            invalid={Boolean(errors.tanggal_lahir)}
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

                        <FormItem
                            className="mb-3"
                            label={
                                renderLabel(
                                    'Jenis Kelamin',
                                    errors.jenis_kelamin?.message,
                                ) as unknown as string
                            }
                            invalid={Boolean(errors.jenis_kelamin)}
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

                        <FormItem
                            className="mb-3"
                            label={
                                renderLabel(
                                    'Pekerjaan',
                                    errors.pekerjaan?.message,
                                ) as unknown as string
                            }
                            invalid={Boolean(errors.pekerjaan)}
                        >
                            <Controller
                                name="pekerjaan"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Pekerjaan Anda (Contoh: Karyawan, Dokter, Mahasiswa)"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="flex flex-col gap-3">
                        <FormItem
                            className="mb-3"
                            label={
                                renderLabel(
                                    'Email',
                                    errors.email?.message,
                                ) as unknown as string
                            }
                            invalid={Boolean(errors.email)}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            className="mb-3"
                            label={
                                renderLabel(
                                    'Kata sandi',
                                    errors.password?.message,
                                ) as unknown as string
                            }
                            invalid={Boolean(errors.password)}
                        >
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="password"
                                        autoComplete="off"
                                        placeholder="Kata sandi"
                                        {...field}
                                    />
                                )}
                            />

                            {passwordValue && (
                                <div className="mt-1 text-xs">
                                    <span className="font-semibold">Kekuatan:</span>
                                    <span className={`ml-1 ${passwordStrength.color}`}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            )}

                            <div className="mt-0.5 text-[11px] text-gray-500">
                                Minimal 8 karakter dengan kombinasi huruf, angka, dan karakter spesial.
                            </div>
                        </FormItem>

                        <FormItem
                            className="mb-4 md:col-span-2"
                            label={
                                renderLabel(
                                    'Konfirmasi Kata Sandi',
                                    errors.confirmPassword?.message,
                                ) as unknown as string
                            }
                            invalid={Boolean(errors.confirmPassword)}
                        >
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="password"
                                        autoComplete="off"
                                        placeholder="Konfirmasi Kata Sandi"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {currentStep > 1 ? (
                        <Button
                            variant="plain"
                            type="button"
                            onClick={goBackStep}
                        >
                            Sebelumnya
                        </Button>
                    ) : <div />}

                    {currentStep < totalSteps ? (
                        <Button
                            variant="solid"
                            type="button"
                            onClick={goNextStep}
                        >
                            Selanjutnya
                        </Button>
                    ) : (
                        <Button
                            block
                            loading={isSubmitting}
                            variant="solid"
                            type="submit"
                        >
                            {isSubmitting ? 'Membuat Akun...' : 'Daftar'}
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    )
}

export default SignUpForm