'use client'

import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ForgotPasswordForm from './ForgotPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useRouter } from 'next/navigation'
import Logo from '@/components/template/Logo'
import type { OnForgotPasswordSubmit } from './ForgotPasswordForm'

type ForgotPasswordProps = {
    signInUrl?: string
    onForgotPasswordSubmit?: OnForgotPasswordSubmit
}

export const ForgotPassword = ({
    signInUrl = '/sign-in',
    onForgotPasswordSubmit,
}: ForgotPasswordProps) => {
    const [emailSent, setEmailSent] = useState(false)
    const [message, setMessage] = useTimeOutMessage()

    const router = useRouter()

    const handleContinue = () => {
        router.push(signInUrl)
    }

    return (
        <div>
            <div className="mb-4">
                <Logo
                    type="streamline"
                    className="mb-4"
                    logoWidth={60}
                    logoHeight={60}
                />

                {emailSent ? (
                    <>
                        <h2 className="mb-2">Check your email</h2>

                        <p className="font-semibold heading-text">
                            We have sent a password recovery to your email
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="mb-2">Forgot Password</h2>

                        <p className="font-semibold heading-text">
                            Please enter your email to receive a verification
                            code
                        </p>
                    </>
                )}
            </div>

            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}

            <ForgotPasswordForm
                emailSent={emailSent}
                setMessage={setMessage}
                setEmailSent={setEmailSent}
                onForgotPasswordSubmit={onForgotPasswordSubmit}
            >
                <Button
                    block
                    variant="solid"
                    type="button"
                    onClick={handleContinue}
                >
                    Continue
                </Button>
            </ForgotPasswordForm>

            <div className="mt-4 text-center">
                <span>Back to </span>

                <ActionLink
                    href={signInUrl}
                    className="heading-text font-bold"
                    themeColor={false}
                >
                    Sign in
                </ActionLink>
            </div>
        </div>
    )
}

export default ForgotPassword
