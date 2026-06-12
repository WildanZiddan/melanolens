import type { Period } from './types'

export const options: { value: Period; label: string }[] = [
    { value: 'thisWeek', label: 'Weekly' },
    { value: 'thisMonth', label: 'Monthly' },
    { value: 'thisYear', label: 'Annually' },
]
