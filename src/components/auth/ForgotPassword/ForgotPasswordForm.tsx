'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import appConfig from '@/configs/app.config'

const validationSchema = z.object({
    email: z.string().trim().email('Masukkan format email yang valid'),
    newPassword: z.string().min(6, 'Password minimal 6 karakter'),
})

type ForgotPasswordFormSchema = z.infer<typeof validationSchema>

const ForgotPasswordForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ForgotPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            email: '',
            newPassword: '',
        },
    })

    const onForgotPassword = async (values: ForgotPasswordFormSchema) => {
        setIsSubmitting(true)
        try {
            const response = await fetch(`${appConfig.backendApiUrl}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: values.email,
                    new_password: values.newPassword,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || 'Gagal memperbarui password')
            }

            toast.push(
                <Notification title="Password Berhasil Diperbarui" type="success">
                    {data.message || 'Silakan masuk menggunakan password baru Anda.'}
                </Notification>
            )

            setTimeout(() => {
                router.push('/sign-in')
            }, 1500)
        } catch (err: any) {
            toast.push(
                <Notification title="Gagal Reset Password" type="danger">
                    {err.message || 'Terjadi kesalahan sistem.'}
                </Notification>
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit(onForgotPassword)}>
                <div className="mb-4">
                    <FormItem label="Email Terdaftar" invalid={Boolean(errors.email)} errorMessage={errors.email?.message}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    placeholder="Masukkan email terdaftar Anda"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem label="Password Baru" invalid={Boolean(errors.newPassword)} errorMessage={errors.newPassword?.message}>
                        <Controller
                            name="newPassword"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="password"
                                    placeholder="Masukkan password baru"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>

                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Memproses Reset...' : 'Simpan Password Baru'}
                </Button>
            </Form>
        </div>
    )
}

export default ForgotPasswordForm
