'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'
import appConfig from '@/configs/app.config'

export type OnSignInPayload = {
    values: SignInFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
}

export type OnSignIn = (payload: OnSignInPayload) => void

interface SignInFormProps extends CommonProps {
    passwordHint?: string | ReactNode
    setMessage: (message: string) => void
    onSignIn?: OnSignIn
}

type SignInFormSchema = {
    email: string
    password: string
}

const validationSchema = z.object({
    email: z
        .string()
        .min(1, {
            message: 'Masukkan email anda',
        })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message: 'Masukkan email yang valid',
        }),

    password: z.string().min(1, {
        message: 'Masukkan kata sandi anda',
    }),
})

const SignInForm = (props: SignInFormProps) => {
    const [isSubmitting, setSubmitting] = useState(false)

    const { className, setMessage, onSignIn, passwordHint } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignInFormSchema>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const handleSignIn = async (values: SignInFormSchema) => {
        setSubmitting(true)
        setMessage('')

        try {
            // 🚀 1. TEMBAK REAL-TIME KE FASTAPI BACKEND
            const res = await fetch(`${appConfig.backendApiUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            })

            const data = await res.json()

            // 2. Jika FastAPI menyatakan login sukses
            // 2. Jika FastAPI menyatakan login sukses
            if (res.ok && data && data.user) {
                
                // 🔑 3. TANCEP COOKIE MANDIRI RESMI
                document.cookie = "melanolens-session=success_authenticated; path=/; max-age=86400; SameSite=Lax;"

                // 🧠 4. BACA ROLE & NAME BERDASARKAN STRUKTUR JSON FASTAPI LU!
                const userRole = data.user.authority[0] // 👈 Ngambil isi array ['user'] atau ['admin']
                const name = data.user.name             // 👈 Ngambil data.user.name sesuai isi return python lu
                const email = data.user.email           // 👈 Ngambil data.user.email sesuai isi return python lu
                const tanggalLahir = data.user.tanggal_lahir || '' // 👈 Ngambil data.user.tanggal_lahir sesuai isi return python lu, default '' kalau kosong
                const jenisKelamin = data.user.jenis_kelamin || '' // 👈 Ngambil data.user.jenis_kelamin sesuai isi return python lu, default '' kalau kosong
                const pekerjaan = data.user.pekerjaan || '' // 👈 Ngambil data.user.pekerjaan sesuai isi return python lu, default '' kalau kosong

                // Simpan token bearer dari FastAPI juga biar nanti kalau mau fetch data citra aman
                if (data.token) {
                    localStorage.setItem('token', data.token)
                }

                localStorage.setItem('name', name)
                localStorage.setItem('role', userRole)
                localStorage.setItem('email', values.email)
                localStorage.setItem('tanggal_lahir', data.user.tanggal_lahir || '')
                localStorage.setItem('jenis_kelamin', data.user.jenis_kelamin || '')
                localStorage.setItem('pekerjaan', data.user.pekerjaan || '')

                console.log(`Halo ${name}, login sukses sebagai: ${userRole}`)

                // 🔀 5. KASIH JEDA TIPIS BIAR COOKIE SELESAI DITULIS BROWSER
                setTimeout(() => {
                    if (userRole === 'admin') {
                        window.location.href = '/dashboards/ecommerce' 
                    } else {
                        window.location.href = '/home' 
                    }
                }, 250)

            } else {
                setMessage(data.detail || 'Email atau password salah!')
                setSubmitting(false)
            }

        } catch (error) {
            console.error('Koneksi terputus ke FastAPI:', error)
            setMessage('Gagal terhubung ke server backend FastAPI!')
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(handleSignIn)}>
                <FormItem
                    className="mb-3"
                    label={
                        (
                            <div className="flex items-center gap-2">
                                <span className="flex items-center">
                                    <span>Email</span>
                                    <span className="text-red-500 ml-1">*</span>
                                </span>

                                {errors.email && (
                                    <span className="text-[11px] text-red-500">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>
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
                    className={classNames(passwordHint ? 'mb-1' : 'mb-3')}
                    label={
                        (
                            <div className="flex items-center gap-2">
                                <span className="flex items-center">
                                    <span>Kata sandi</span>
                                    <span className="text-red-500 ml-1">*</span>
                                </span>

                                {errors.password && (
                                    <span className="text-[11px] text-red-500">
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>
                        ) as unknown as string
                    }
                    invalid={Boolean(errors.password)}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                type="password"
                                placeholder="Kata sandi"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {passwordHint}

                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Sedang proses...' : 'Masuk'}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm