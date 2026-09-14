'use client'

import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useTheme from '@/utils/hooks/useTheme'
import { MODE_DARK, MODE_LIGHT } from '@/constants/theme.constant'
import classNames from '@/utils/classNames'
import type { CommonProps } from '@/@types/common'

const _ThemeModeToggle = ({ className }: CommonProps) => {
    const mode = useTheme((state) => state.mode)
    const setMode = useTheme((state) => state.setMode)

    const toggleMode = () => {
        setMode(mode === MODE_LIGHT ? MODE_DARK : MODE_LIGHT)
    }

    return (
        <div
            role="button"
            className={classNames(
                'relative flex items-center justify-center text-neutral-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white',
                className,
            )}
            onClick={toggleMode}
            title={mode === MODE_DARK ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
            <svg
                className="lucide lucide-sun rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0"
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
            </svg>
            <svg
                className="lucide lucide-moon absolute rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100"
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z" />
            </svg>
            <span className="sr-only">Toggle theme</span>
        </div>
    )
}

const ThemeModeToggle = withHeaderItem(_ThemeModeToggle)

export default ThemeModeToggle
