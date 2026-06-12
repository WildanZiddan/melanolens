'use client'

import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'
import classNames from '@/utils/classNames'
import Loading from '@/components/shared/Loading'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('@/components/shared/Chart'), {
    ssr: false,
    loading: () => (
        <div className="h-[180px] flex items-center justify-center flex-1">
            <Loading loading />
        </div>
    ),
})

type GenderDemographicData = {
    id: string
    name: string
    value: number
    count: number
}

type PatientGenderDemographicProps = {
    data: GenderDemographicData[]
}

const genderMeta: Record<string, { img: string; colorClass: string }> = {
    laki_laki: { img: 'https://api.dicebear.com/7.x/bottts/svg?seed=male', colorClass: 'text-sky-500' },
    perempuan: { img: 'https://api.dicebear.com/7.x/bottts/svg?seed=female', colorClass: 'text-pink-500' },
}

const defaultGenderData: GenderDemographicData[] = [
    { id: 'laki_laki', name: 'Laki-laki', value: 50, count: 0 },
    { id: 'perempuan', name: 'Perempuan', value: 50, count: 0 }
]

export default function PatientGenderDemographic({ data }: PatientGenderDemographicProps) {
    const [hovering, setHovering] = useState('')

    const safeData = Array.isArray(data) && data.length > 0 ? data : defaultGenderData

    const totalPatients = safeData.reduce((acc, item) => acc + item.count, 0)
    const chartSeries = totalPatients === 0 ? [1, 1] : safeData.map(item => item.count)
    const chartLabels = safeData.map(item => item.name)

    return (
        <Card>
            <div className="mb-2">
                <h4>Demografi Gender Pasien</h4>
                <p className="text-xs text-slate-400 mt-0.5">Sebaran total pemeriksaan kulit MelanoLens berdasarkan jenis kelamin.</p>
            </div>
            <div className="flex flex-col xl:flex-row items-center gap-4 mt-4">
                
                {/* Visual Donut Chart Medis */}
                <div className="flex-1 flex justify-center w-full min-h-[180px]">
                    <Chart
                        donutTitle={totalPatients.toString()}
                        donutText="Total Pasien"
                        series={chartSeries}
                        customOptions={{
                            labels: chartLabels,
                            colors: ['#0ea5e9', '#ec4899'], // Sky blue (Laki-laki) & Pink (Perempuan)
                            legend: { show: false }
                        }}
                        type="donut"
                        height={180}
                    />
                </div>

                {/* List Gender dengan Progress Bar */}
                <div className="flex flex-col justify-center px-4 w-full xl:w-auto">
                    {safeData.map((item) => {
                        const meta = genderMeta[item.id] || genderMeta['laki_laki']
                        return (
                            <div
                                key={item.name}
                                className={classNames(
                                    'flex items-center gap-4 p-3 rounded-xl transition-colors duration-150 w-full xl:w-[320px]',
                                    hovering === item.id && 'bg-gray-100 dark:bg-gray-700',
                                )}
                                onMouseEnter={() => setHovering(item.id)}
                                onMouseLeave={() => setHovering('')}
                            >
                                <div className="flex gap-2">
                                    <Avatar src={meta.img} className="bg-slate-200" size={35} shape="circle" />
                                </div>
                                <div className="flex-1">
                                    <div className="heading-text font-bold text-xs flex justify-between">
                                        <span className="capitalize">{item.name} ({item.count} Pasien)</span>
                                        <span className="font-extrabold text-primary">{item.value}%</span>
                                    </div>
                                    <Progress
                                        percent={item.value}
                                        showInfo={false}
                                        trailClass={classNames(
                                            'transition-colors duration-150',
                                            hovering === item.id && 'bg-gray-200 dark:bg-gray-600',
                                        )}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Card>
    )
}