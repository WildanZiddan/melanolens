import React from 'react'

const DemoBoxContent = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 text-center font-medium text-sm text-indigo-600 dark:text-indigo-400">
            {children || 'Grid Box Content'}
        </div>
    )
}

export default DemoBoxContent