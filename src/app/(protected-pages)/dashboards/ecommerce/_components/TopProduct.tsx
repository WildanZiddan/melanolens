'use client'

import Card from '@/components/ui/Card'
import GrowShrinkValue from '@/components/shared/GrowShrinkValue'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import { TbActivity } from 'react-icons/tb'

type TopProductProps = {
    data: any[]
}

export default function TopProduct({ data = [] }: TopProductProps) {
    return (
        <Card>
            <div>
                <h4>Karakteristik Temuan Kasus</h4>
                <p className="text-xs text-slate-400">Peringkat sebaran diagnosis terbanyak dari cloud Supabase.</p>
            </div>
            <div className="mt-5 space-y-3">
                {data.map((item, index) => (
                    <div
                        key={item.id}
                        className={classNames(
                            'flex items-center justify-between py-2 border-b border-slate-50 dark:border-gray-800/60',
                            isLastChild(data, index) && 'border-none'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-xl text-primary">
                                <TbActivity />
                            </div>
                            <div>
                                <div className="heading-text font-bold text-xs">{item.name}</div>
                                <div className="text-[11px] text-slate-400">Ditemukan: <strong>{item.sales} Berkas</strong></div>
                            </div>
                        </div>
                        <GrowShrinkValue
                            className="rounded-lg py-0.5 px-2 text-xs font-bold"
                            value={item.growShrink}
                            positiveClass="bg-success-subtle"
                            negativeClass="bg-error-subtle"
                            suffix="%"
                        />
                    </div>
                ))}
            </div>
        </Card>
    )
}