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

type SignUpFormSchema = {
    userName: string
    password: string
    email: string
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

const validationSchema = z.object({
    email: z
        .string()
        .min(1, {
            message: 'Email is required',
        })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message: 'Please enter a valid email',
        }),

    userName: z.string().min(1, {
        message: 'Please enter your name',
    }),

    password: z
        .string()
        .min(8, {
            message: 'Minimum 8 characters',
        })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/, {
            message: 'Must contain letters, numbers, and special characters',
        }),

    confirmPassword: z.string().min(1, {
        message: 'Confirm password required',
    }),
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
            userName: '',
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

        if (score <= 2) {
            return {
                label: 'Weak',
                color: 'text-red-500',
            }
        }

        if (score <= 4) {
            return {
                label: 'Medium',
                color: 'text-yellow-500',
            }
        }

        return {
            label: 'Strong',
            color: 'text-green-500',
        }
    }

    const passwordStrength = getPasswordStrength(passwordValue)

    const handleSignUp = async (values: SignUpFormSchema) => {
        if (onSignUp) {
            onSignUp({
                values,
                setSubmitting,
                setMessage,
            })
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(handleSignUp)}>
                <FormItem
                    className="mb-3"
                    label={
                        renderLabel(
                            'User name',
                            errors.userName?.message,
                        ) as unknown as string
                    }
                    invalid={Boolean(errors.userName)}
                >
                    <Controller
                        name="userName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="User Name"
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
                        Minimum 8 characters with letters, numbers, and special
                        characters.
                    </div>
                </FormItem>

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
