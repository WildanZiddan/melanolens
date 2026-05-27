'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'

type ForgotPasswordFormSchema = {
    email: string
}

export type OnForgotPasswordSubmitPayload = {
    values: ForgotPasswordFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
    setEmailSent: (complete: boolean) => void
}

export type OnForgotPasswordSubmit = (
    payload: OnForgotPasswordSubmitPayload,
) => void

interface ForgotPasswordFormProps extends CommonProps {
    onForgotPasswordSubmit?: OnForgotPasswordSubmit
    emailSent: boolean
    setEmailSent: (complete: boolean) => void
    setMessage: (message: string) => void
}

const validationSchema = z.object({
    email: z.string().trim().min(1, 'Email is required'),
})

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState(false)

    const {
        className,
        onForgotPasswordSubmit,
        setMessage,
        setEmailSent,
        emailSent,
        children,
    } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ForgotPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            email: '',
        },
    })

    const onForgotPassword = async (values: ForgotPasswordFormSchema) => {
        if (onForgotPasswordSubmit) {
            onForgotPasswordSubmit({
                values,
                setSubmitting,
                setMessage,
                setEmailSent,
            })
        }
    }

    if (emailSent) {
        return <div>{children}</div>
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onForgotPassword)}>
                <div className="mb-1 flex items-center gap-1">
                    <span className="font-semibold">Email</span>

                    <span className="text-red-500">*</span>

                    {errors.email && (
                        <span className="ml-1 text-xs text-red-500">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <FormItem invalid={Boolean(errors.email)} errorMessage="">
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

                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </Form>
        </div>
    )
}

export default ForgotPasswordForm
