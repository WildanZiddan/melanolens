'use client'

import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'
import classNames from '@/utils/classNames'

// 📊 Buat tipe data dummy mandiri biar gak bentrok
type CustomerDemographicData = {
    id: string
    name: string
    value: number
}

type CustomerDemographicProps = {
    data: any // Kita set any biar fleksibel nerima object dummy apa aja
}

const mapMeta: Record<string, { img: string }> = {
    us: { img: '/img/countries/US.png' },
    br: { img: '/img/countries/BR.png' },
    in: { img: '/img/countries/IN.png' },
    uk: { img: '/img/countries/UK.png' },
    tr: { img: '/img/countries/TR.png' },
    id: { img: '/img/countries/ID.png' },
}

// 🗺️ DATA NEGARA DUMMY INTERNAL YANG DIJAMIN KLOP SAMA AVATAR BENDERA TEMPLATE LU
const defaultCountriesData: CustomerDemographicData[] = [
    { id: 'id', name: 'Indonesia', value: 65 },
    { id: 'us', name: 'United States', value: 20 },
    { id: 'in', name: 'India', value: 15 }
]

const getMapMeta = (data: CustomerDemographicData[] = []) => {
    // Pastikan data yang di-map selalu berbentuk array biar gak error '.map is not a function'
    const safeData = Array.isArray(data) ? data : defaultCountriesData
    return safeData.map((item) => ({
        ...item,
        ...(mapMeta[item.id as string] || {}),
    }))
}

const CustomerDemographic = ({ data }: CustomerDemographicProps) => {
    const [hovering, setHovering] = useState('')

    // Ambil data aman hasil olahan array
    const countriesList = getMapMeta(Array.isArray(data) ? data : defaultCountriesData)

    return (
        <Card>
            <h4>Top countries (Demografi User)</h4>
            <div className="flex flex-col xl:flex-row items-center gap-4 mt-4">
                
                {/* 🗺️ TIPS SAKTI: Bagian RegionMap yang bikin crash 'undefined (reading 0)' koordinat 
                    kita ganti sementara pake visualisasi list yang kebal error runtime browser! */}
                <div className="px-4 flex flex-col justify-center flex-1 w-full py-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                    🌍 Modul Peta Geografis Standby untuk Data MelanoLens
                </div>

                {/* 📋 LIST NEGARA BESERTA PROGRESS BAR & BENDERA BAWAAN TEMPLATE */}
                <div className="flex flex-col justify-center px-4 md:w-full">
                    {countriesList.map((item) => (
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
                                <Avatar src={item.img} size={30} />
                            </div>
                            <div className="flex-1">
                                <div className="heading-text font-semibold text-xs flex justify-between">
                                    <span>{item.name}</span>
                                    <span className="text-slate-400">{item.value}%</span>
                                </div>
                                <Progress
                                    percent={item.value}
                                    trailClass={classNames(
                                        'transition-colors duration-150',
                                        hovering === item.id && 'bg-gray-200 dark:bg-gray-600',
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default CustomerDemographic