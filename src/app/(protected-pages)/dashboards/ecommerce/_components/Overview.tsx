'use client'

import { useState, useEffect, useRef } from 'react'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import GrowShrinkValue from '@/components/shared/GrowShrinkValue'
import Loading from '@/components/shared/Loading'
import useTheme from '@/utils/hooks/useTheme'
import classNames from '@/utils/classNames'
import { COLOR_1, COLOR_2, COLOR_3 } from '@/constants/chart.constant'
import { options } from '../constants'
import { NumericFormat } from 'react-number-format'
import { TbActivity, TbShieldLockFilled, TbHeartRateMonitor } from 'react-icons/tb'
import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

const Chart = dynamic(() => import('@/components/shared/Chart'), {
    ssr: false,
    loading: () => (
        <div className="h-[425px] flex items-center justify-center">
            <Loading loading />
        </div>
    ),
})

type StatisticCategory = 'totalScan' | 'kasusGanas' | 'kasusJinak'
type Period = 'thisWeek' | 'thisMonth' | 'thisYear'

type StatisticCardProps = {
    title: string
    value: number | ReactNode
    icon: ReactNode
    growShrink: number
    iconClass: string
    label: StatisticCategory
    compareFrom: string
    active: boolean
    onClick: (label: StatisticCategory) => void
}

const chartColors: Record<StatisticCategory, string> = {
    totalScan: COLOR_1,   
    kasusGanas: COLOR_3,   
    kasusJinak: COLOR_2,   
}

const StatisticCard = (props: StatisticCardProps) => {
    const { title, value, label, icon, growShrink, iconClass, active, compareFrom, onClick } = props
    return (
        <button
            className={classNames(
                'p-4 rounded-2xl cursor-pointer ltr:text-left rtl:text-right transition duration-150 outline-hidden w-full',
                active && 'bg-white dark:bg-gray-900 shadow-md border border-slate-100 dark:border-slate-800',
            )}
            onClick={() => onClick(label)}
        >
            <div className="flex justify-between items-center gap-2 w-full">
                <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</div>
                    <h3 className="font-extrabold heading-text">{value}</h3>
                    <div className="text-[11px] text-slate-400 mt-1">
                        <span>{compareFrom}</span>
                    </div>
                </div>
                <div className={classNames('flex items-center justify-center h-12 w-12 rounded-2xl text-2xl', iconClass)}>
                    {icon}
                </div>
            </div>
        </button>
    )
}

export default function Overview({ data }: { data: any }) {
    const [selectedCategory, setSelectedCategory] = useState<StatisticCategory>('totalScan')
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('thisWeek')
    const sideNavCollapse = useTheme((state) => state.layout.sideNavCollapse)
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (!sideNavCollapse && isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        if (!isFirstRender.current && typeof window !== 'undefined') {
            window.dispatchEvent(new Event('resize'))
        }
    }, [sideNavCollapse])

    // Periode bacaan manusia
    const labelPeriode = { thisWeek: 'Minggu Ini', thisMonth: 'Bulan Ini', thisYear: 'Tahun Ini' }[selectedPeriod]

    return (
        <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h4>Grafik Tren Aktivitas Skrining</h4>
                    <p className="text-xs text-slate-400">Monitoring lonjakan upload sampel foto kulit jaringan melanoma secara berkala.</p>
                </div>
                <Select
                    instanceId="overview-period"
                    className="w-[140px] text-xs font-bold shrink-0"
                    size="sm"
                    value={options.filter((opt) => opt.value === selectedPeriod)}
                    options={options}
                    isSearchable={false}
                    onChange={(opt) => opt?.value && setSelectedPeriod(opt.value as Period)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 mt-4">
                <StatisticCard
                    title="Volume Scan"
                    value={<NumericFormat displayType="text" value={data[selectedPeriod].totalScan.value} thousandSeparator={true} suffix=" Berkas" />}
                    growShrink={0}
                    iconClass="bg-sky-50 text-sky-600 dark:bg-sky-950/40"
                    icon={<TbActivity />}
                    label="totalScan"
                    active={selectedCategory === 'totalScan'}
                    compareFrom={`Total upload ${labelPeriode}`}
                    onClick={setSelectedCategory}
                />
                <StatisticCard
                    title="Temuan Ganas"
                    value={<NumericFormat displayType="text" value={data[selectedPeriod].kasusGanas.value} thousandSeparator={true} suffix=" Kasus" />}
                    growShrink={0}
                    iconClass="bg-red-50 text-red-600 dark:bg-red-950/40"
                    icon={<TbShieldLockFilled />}
                    label="kasusGanas"
                    active={selectedCategory === 'kasusGanas'}
                    compareFrom={`Indikasi Melanoma ${labelPeriode}`}
                    onClick={setSelectedCategory}
                />
                <StatisticCard
                    title="Kondisi Jinak"
                    value={<NumericFormat displayType="text" value={data[selectedPeriod].kasusJinak.value} thousandSeparator={true} suffix=" Kasus" />}
                    growShrink={0}
                    iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
                    icon={<TbHeartRateMonitor />}
                    label="kasusJinak"
                    active={selectedCategory === 'kasusJinak'}
                    compareFrom={`Jaringan aman ${labelPeriode}`}
                    onClick={setSelectedCategory}
                />
            </div>

            <div className="min-h-[380px] mt-4">
                <Chart
                    type="line"
                    series={data[selectedPeriod][selectedCategory].chartData.series}
                    xAxis={data[selectedPeriod][selectedCategory].chartData.date}
                    height="360px"
                    customOptions={{
                        legend: { show: false },
                        colors: [chartColors[selectedCategory]],
                        stroke: { curve: 'smooth', width: 3.5 }
                    }}
                />
            </div>
        </Card>
    )
}