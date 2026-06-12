'use client'

import Card from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'

type SalesTargetProps = {
    data: { thisMonth: number }
}

export default function SalesTarget({ data }: SalesTargetProps) {
    const confidenceRate = data?.thisMonth || 0
    return (
        <Card>
            <div className="mb-2">
                <h4>Keandalan Model AI</h4>
                <p className="text-xs text-slate-400">Rata-rata tingkat akurasi konfiden klasifikasi lesi kulit.</p>
            </div>
            <div className="flex items-center justify-between mt-6">
                <div>
                    <h2 className="font-extrabold heading-text text-primary">{confidenceRate}%</h2>
                    <div className="mt-1 text-xs text-slate-400 font-semibold">
                        {confidenceRate >= 80 ? '🟢 Sistem Optimal & Stabil' : '🟡 Butuh Retraining Data'}
                    </div>
                </div>
                <div>
                    <Progress
                        percent={Math.round(confidenceRate)}
                        width={80}
                        variant="circle"
                        strokeWidth={8}
                        customColorClass="text-primary"
                    />
                </div>
            </div>
        </Card>
    )
}