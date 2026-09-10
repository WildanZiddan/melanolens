'use client'

import ActionLink from '@/components/shared/ActionLink'
import ForgotPasswordForm from './ForgotPasswordForm'
import Logo from '@/components/template/Logo'

export const ForgotPassword = () => {
    return (
        <div>
            <div className="mb-6">
                <Logo
                    type="streamline"
                    className="mb-4"
                    logoWidth={60}
                    logoHeight={60}
                />
                <h3 className="mb-1 font-bold">Lupa / Reset Password</h3>
                <p className="text-slate-400 text-sm">
                    Masukkan email terdaftar dan password baru Anda untuk melakukan pembaruan kata sandi secara langsung.
                </p>
            </div>

            <ForgotPasswordForm />

            <div className="mt-4 text-center text-sm">
                <span className="text-slate-400">Sudah ingat password? </span>
                <ActionLink
                    href="/sign-in"
                    className="heading-text font-bold"
                    themeColor={false}
                >
                    Masuk Sekarang
                </ActionLink>
            </div>
        </div>
    )
}

export default ForgotPassword
