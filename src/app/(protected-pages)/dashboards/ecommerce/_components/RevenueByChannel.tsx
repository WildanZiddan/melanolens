'use client'

import Card from '@/components/ui/Card'
import classNames from '@/utils/classNames'
import { TbUserHeart, TbUsers, TbUserCheck } from 'react-icons/tb'
import type { ReactNode } from 'react'

const DisplayColumn = ({ icon, label, value, iconClass }: { icon: ReactNode; label: string; value: number; iconClass: string }) => {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={classNames('rounded-xl flex items-center justify-center h-10 w-10 text-xl', iconClass)}>
                {icon}
            </div>
            <div className="text-center">
                <h6 className="font-extrabold text-xs mb-0.5">{value} Kasus</h6>
                <div className="text-[10px] text-slate-400">{label}</div>
            </div>
        </div>
    )
}

export default function RevenueByChannel({ data }: any) {
    const pct = data?.percentage || { young: 33, product: 34, elderly: 33 }
    const cnt = data?.counts || { young: 0, product: 0, elderly: 0 }

    return (
        <Card>
            <div>
                <h4>Karakteristik Usia Pasien</h4>
                <p className="text-xs text-slate-400">Segmentasi persebaran foto sampel lesi kulit berdasarkan umur.</p>
            </div>
            
            {/* Tiga warna pembagi bar chart bawaan template */}
            <div className="flex items-center gap-1 mt-6">
                <div className="flex-1" style={{ width: `${pct.young}%` }}>
                    <div className="h-2 rounded-full bg-sky-400" />
                    <div className="font-extrabold heading-text text-xs mt-1">{pct.young}%</div>
                </div>
                <div className="flex-1" style={{ width: `${pct.product}%` }}>
                    <div className="h-2 rounded-full bg-emerald-400" />
                    <div className="font-extrabold heading-text text-xs mt-1">{pct.product}%</div>
                </div>
                <div className="flex-1" style={{ width: `${pct.elderly}%` }}>
                    <div className="h-2 rounded-full bg-orange-400" />
                    <div className="font-extrabold heading-text text-xs mt-1">{pct.elderly}%</div>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-gray-900 rounded-xl p-4 mt-6">
                <div className="grid grid-cols-3 gap-1">
                    <DisplayColumn icon={<TbUserHeart />} label="Muda (<25)" value={cnt.young} iconClass="bg-sky-50 text-sky-500 dark:bg-sky-950/40" />
                    <DisplayColumn icon={<TbUsers />} label="Produktif (25-50)" value={cnt.product} iconClass="bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40" />
                    <DisplayColumn icon={<TbUserCheck />} label="Lansia (>50)" value={cnt.elderly} iconClass="bg-orange-50 text-orange-500 dark:bg-orange-950/40" />
                </div>
            </div>
        </Card>
    )
}