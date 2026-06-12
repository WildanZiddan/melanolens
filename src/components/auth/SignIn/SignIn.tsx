'use client'

import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignInForm from './SignInForm'
import OauthSignIn from './OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTheme from '@/utils/hooks/useTheme'
import type { OnSignIn } from './SignInForm'
import type { OnOauthSignIn } from './OauthSignIn'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    onSignIn?: OnSignIn
    onOauthSignIn?: OnOauthSignIn
}

const SignIn = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    onSignIn,
    onOauthSignIn,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()

    const mode = useTheme((state) => state.mode)

    return (
        <>
            <div className="mb-4">
                <Logo
                    type="streamline"
                    mode={mode}
                    logoWidth={60}
                    logoHeight={60}
                />
            </div>
            <div className="mb-6">
                <h2 className="mb-2">Selamat datang di MelanoLens!</h2>
                <p className="font-semibold heading-text">
                    Silakan masukkan kredensial Anda untuk masuk
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-7 mt-2 justify-center items-center flex">
                        <ActionLink
                            href={forgetPasswordUrl}
                            className="font-semibold heading-text mt-2 underline"
                            themeColor={false}
                        >
                            Lupa kata sandi?
                        </ActionLink>
                    </div>
                }
                onSignIn={onSignIn}
            />
            <div>
                <div className="mt-6 text-center">
                    <span>{`Tidak memiliki akun?`} </span>
                    <ActionLink
                        href={signUpUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        Daftar
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

export default SignIn
