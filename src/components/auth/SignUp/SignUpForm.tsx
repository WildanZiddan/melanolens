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

// 🔑 SINKRON PYTHON: Gunakan 'nama' untuk menggantikan 'userName'
type SignUpFormSchema = {
    nama: string
    email: string
    password: string
    confirmPassword: string
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
}

// 🧠 Skema validasi Zod diperketat
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
        message: 'Konfirmasi password wajib diisi',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok, Dan!",
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
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            nama: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const passwordValue = watch('password') || ''

    const getPasswordStrength = (password: string) => {
        let score = 0
        if (password.length >= 8) score++
        if (/[A-Z]/.test(password)) score++
        if (/[a-z]/.test(password)) score++
        if (/\d/.test(password)) score++
        if (/[@$!%*#?&]/.test(password)) score++

        if (score <= 2) return { label: 'Weak', color: 'text-red-500' }
        if (score <= 4) return { label: 'Medium', color: 'text-yellow-500' }
        return { label: 'Strong', color: 'text-green-500' }
    }

    const passwordStrength = getPasswordStrength(passwordValue)

    // 🚀 ACTION REGISTER REAL-TIME KE FASTAPI BACKEND
    const handleSignUp = async (values: SignUpFormSchema) => {
        setSubmitting(true)
        setMessage('')

        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama: values.nama,         // 🔑 Dikirim sebagai 'nama' ke RegisterInput python
                    email: values.email,       // 🔑 Dikirim sebagai 'email'
                    password: values.password, // 🔑 Dikirim sebagai 'password'
                }),
            })

            const data = await res.json()

            if (res.ok) {
                // Berhasil daftar! Infokan user terus lempar ke sign-in
                alert("Akun berhasil didaftarkan! Silakan login, Dan. 🔥")
                window.location.href = '/sign-in'
            } else {
                // Munculin error "Email sudah terdaftar" dari FastAPI HTTP 400
                setMessage(data.detail || 'Gagal mendaftarkan akun baru.')
                setSubmitting(false)
            }

        } catch (error) {
            console.error('Koneksi putus ke FastAPI:', error)
            setMessage('Gagal terhubung ke server backend FastAPI!')
            setSubmitting(false)
        }

        // Jalankan trigger callback template bawaan jika ada
        if (onSignUp) {
            onSignUp({ values, setSubmitting, setMessage })
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(handleSignUp)}>

                {/* 👤 FIELD BARU: Input Nama Lengkap (Sesuai Syarat Python) */}
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

                {/* 📧 Field Input Email */}
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

                {/* 🔒 Field Input Password */}
                <FormItem
                    className="mb-3"
                    label={
                        renderLabel(
                            'Password',
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
                                placeholder="Password"
                                {...field}
                            />
                        )}
                    />

                    {passwordValue && (
                        <div className="mt-1 text-xs">
                            <span className="font-semibold">Strength:</span>
                            <span className={`ml-1 ${passwordStrength.color}`}>
                                {passwordStrength.label}
                            </span>
                        </div>
                    )}

                    <div className="mt-0.5 text-[11px] text-gray-500">
                        Minimum 8 characters with letters, numbers, and special characters.
                    </div>
                </FormItem>

                {/* 🔒 Field Input Confirm Password */}
                <FormItem
                    className="mb-4"
                    label={
                        renderLabel(
                            'Confirm Password',
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
                                placeholder="Confirm Password"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm