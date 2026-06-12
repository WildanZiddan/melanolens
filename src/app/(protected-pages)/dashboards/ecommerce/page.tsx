'use client'

import React, { useState, useEffect } from 'react'
import Overview from './_components/Overview'
import PatientGenderDemographic from './_components/PatientGenderDemographic'
import RecentOrder from './_components/RecentOrder'
import SalesTarget from './_components/SalesTarget'
import TopProduct from './_components/TopProduct'
import RevenueByChannel from './_components/RevenueByChannel'

const DASHBOARD_STATS_URL = 'http://localhost:8000/api/admin/dashboard-stats'

export default function AdminDashboardPage() {
    const [realData, setRealData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(DASHBOARD_STATS_URL)
                if (!response.ok) throw new Error('Gagal memuat statistik database')
                const data = await response.json()
                setRealData(data)
            } catch (error) {
                console.error("Gagal sinkronisasi visualisasi chart dashboard:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDashboardStats()
    }, [])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                <p className="text-xs text-slate-400">Sedang mengkalkulasi visualisasi data aktual Supabase...</p>
            </div>
        )
    }

    // 📊 KONSUMSI DATA TOTAL SECARA AKURAT DAN PROPORSIONAL WAKTU:
    const adaptedStatisticData = {
        thisWeek: {
            totalScan: { 
                value: realData?.summary?.weekly_scan || 0, 
                chartData: { 
                    date: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], 
                    series: [{ name: 'Scan', data: realData?.charts?.weekly_scan || [0,0,0,0,0,0,0] }] 
                } 
            },
            kasusGanas: { 
                value: realData?.summary?.weekly_malignant || 0, 
                chartData: { 
                    date: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], 
                    series: [{ name: 'Ganas', data: realData?.charts?.weekly_malignant || [0,0,0,0,0,0,0] }] 
                } 
            },
            kasusJinak: { 
                value: realData?.summary?.weekly_benign || 0, 
                chartData: { 
                    date: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], 
                    series: [{ name: 'Jinak', data: realData?.charts?.weekly_benign || [0,0,0,0,0,0,0] }] 
                } 
            }
        },
        thisMonth: {
            totalScan: { 
                value: realData?.summary?.monthly_scan || 0, 
                chartData: { 
                    date: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'], 
                    series: [{ name: 'Scan', data: realData?.charts?.monthly_scan || [0,0,0,0] }] 
                } 
            },
            kasusGanas: { 
                value: realData?.summary?.monthly_malignant || 0, 
                chartData: { 
                    date: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'], 
                    series: [{ name: 'Ganas', data: realData?.charts?.monthly_malignant || [0,0,0,0] }] 
                } 
            },
            kasusJinak: { 
                value: realData?.summary?.monthly_benign || 0,   
                chartData: { 
                    date: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'], 
                    series: [{ name: 'Jinak', data: realData?.charts?.monthly_benign || [0,0,0,0] }] 
                } 
            }
        },
        thisYear: {
            totalScan: { 
                value: realData?.summary?.yearly_scan || 0, 
                chartData: { 
                    date: ['Kuartal 1', 'Kuartal 2', 'Kuartal 3', 'Kuartal 4'], 
                    series: [{ name: 'Scan', data: realData?.charts?.yearly_scan || [0,0,0,0] }] 
                } 
            },
            kasusGanas: { 
                value: realData?.summary?.yearly_malignant || 0, 
                chartData: { 
                    date: ['Kuartal 1', 'Kuartal 2', 'Kuartal 3', 'Kuartal 4'], 
                    series: [{ name: 'Ganas', data: realData?.charts?.yearly_malignant || [0,0,0,0] }] 
                } 
            },
            kasusJinak: { 
                value: realData?.summary?.yearly_benign || 0, 
                chartData: { 
                    date: ['Kuartal 1', 'Kuartal 2', 'Kuartal 3', 'Kuartal 4'], 
                    series: [{ name: 'Jinak', data: realData?.charts?.yearly_benign || [0,0,0,0] }] 
                } 
            }
        }
    }

    const adaptedRecentOrders = (realData?.recent_scans || [])
        .map((scan: any) => {
            const isMalignant = scan.scan_respon.toLowerCase().includes('melanoma') || scan.scan_respon.toLowerCase().includes('ganas')
            return {
                id: scan.scan_id,
                customer: scan.user_nama,
                date: scan.scan_tanggal,
                status: isMalignant ? 2 : 0, 
                totalAmount: scan.scan_persentase
            }
        })
        .sort((a: any, b: any) => a.id - b.id)
        .map((item: any) => ({
            ...item,
            id: item.id.toString()
        }))

    const adaptedRevenueByChannel = {
        thisWeek: { growShrink: 0, value: realData?.summary?.weekly_scan || 0, percentage: { onlineStore: 70, physicalStore: 20, socialMedia: 10 } },
        thisMonth: { growShrink: 0, value: realData?.summary?.monthly_scan || 0, percentage: { onlineStore: 70, physicalStore: 20, socialMedia: 10 } },
        thisYear: { growShrink: 0, value: realData?.summary?.yearly_scan || 0, percentage: { onlineStore: 70, physicalStore: 20, socialMedia: 10 } }
    }

    return (
        <div className="p-4 md:p-6 max-w-full overflow-x-hidden min-h-screen">
            <div className="mb-5">
                <h3 className="font-bold mb-1 heading-text">Dashboard Analisis Klinis MelanoLens</h3>
                <p className="text-slate-400 text-sm">Pusat monitoring rekam skrining kanker kulit dan keandalan model Deep Learning.</p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-1 xl:col-span-3">
                        {/* 📈 Grafik Filter Dinamis Waktu Aktif */}
                        <Overview data={adaptedStatisticData as any} />
                        
                        {/* 🫁 DATA GENDER SEBARAN PASIEN AKTUAL DARI DB LU MEK! */}
                        <PatientGenderDemographic data={realData?.gender_demographic} />
                    </div>
                    <div className="flex flex-col gap-4 2xl:min-w-[360px]">
                        {/* 1. Lingkaran Keandalan AI */}
                        <SalesTarget data={{ thisMonth: realData?.summary?.avg_confidence || 0 } as any} />
                        
                        {/* 2. List Klasifikasi Temuan Kasus Kulit Terbanyak */}
                        <TopProduct data={realData?.diagnosis_summary || []} />
                        
                        {/* 3. Tiga Bar Segmen Umur Pasien */}
                        <RevenueByChannel data={realData?.age_demographic} />
                    </div>
                </div>

                <RecentOrder data={adaptedRecentOrders as any} />
            </div>
        </div>
    )
}