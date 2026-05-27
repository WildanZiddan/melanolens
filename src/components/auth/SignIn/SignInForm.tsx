'use client'

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
            message: 'Please enter your email',
        })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message: 'Please enter a valid email',
        }),

    password: z.string().min(1, {
        message: 'Please enter your password',
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
        if (onSignIn) {
            onSignIn({
                values,
                setSubmitting,
                setMessage,
            })
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
                                    <span>Password</span>

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
                                placeholder="Password"
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
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
