'use client'

import React from 'react'
import Overview from './_components/Overview'
import CustomerDemographic from './_components/CustomerDemographic'
import RecentOrder from './_components/RecentOrder'
import SalesTarget from './_components/SalesTarget'
import TopProduct from './_components/TopProduct'
import RevenueByChannel from './_components/RevenueByChannel'

// 📊 RACIKAN STRUKTUR DINAMIS UTK OVERVIEW, CUSTOMER, SALES, & TOP PRODUCT
const mockDashboardData = {
    // 1. DATA OVERVIEW (Udah Kebal)
    statisticData: {
        totalProfit: {
            thisWeek: { value: 12500000, growShrink: 4.2, comparePeriod: 'vs minggu lalu', chartData: { date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], series: [{ name: 'Profit', data: [120, 150, 180, 140, 200, 250, 210] }] } },
            thisMonth: { value: 45000000, growShrink: 12.5, comparePeriod: 'vs bulan lalu', chartData: { date: ['W1', 'W2', 'W3', 'W4'], series: [{ name: 'Profit', data: [1000, 1200, 1100, 1500] }] } },
            thisYear: { value: 540000000, growShrink: 24.8, comparePeriod: 'vs tahun lalu', chartData: { date: ['Q1', 'Q2', 'Q3', 'Q4'], series: [{ name: 'Profit', data: [12000, 15000, 14000, 18000] }] } }
        },
        totalOrder: {
            thisWeek: { value: 45, growShrink: -1.5, comparePeriod: 'vs minggu lalu', chartData: { date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], series: [{ name: 'Orders', data: [5, 8, 4, 7, 9, 6, 6] }] } },
            thisMonth: { value: 1250, growShrink: 8.2, comparePeriod: 'vs bulan lalu', chartData: { date: ['W1', 'W2', 'W3', 'W4'], series: [{ name: 'Orders', data: [300, 280, 320, 350] }] } },
            thisYear: { value: 15400, growShrink: 15.3, comparePeriod: 'vs tahun lalu', chartData: { date: ['Q1', 'Q2', 'Q3', 'Q4'], series: [{ name: 'Orders', data: [3500, 3800, 4000, 4100] }] } }
        },
        totalImpression: {
            thisWeek: { value: 2400, growShrink: 0.8, comparePeriod: 'vs minggu lalu', chartData: { date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], series: [{ name: 'Impressions', data: [300, 400, 350, 380, 420, 450, 400] }] } },
            thisMonth: { value: 48000, growShrink: -2.4, comparePeriod: 'vs bulan lalu', chartData: { date: ['W1', 'W2', 'W3', 'W4'], series: [{ name: 'Impressions', data: [12000, 11500, 12500, 12000] }] } },
            thisYear: { value: 620000, growShrink: 41.2, comparePeriod: 'vs tahun lalu', chartData: { date: ['Q1', 'Q2', 'Q3', 'Q4'], series: [{ name: 'Impressions', data: [140000, 150000, 160000, 170000] }] } }
        }
    },

    // 2. DATA CUSTOMER DEMOGRAPHIC (Kebal Versi Array Internal Peta Lu)
    customerDemographic: [
        { id: 'id', name: 'Indonesia', value: 65 },
        { id: 'us', name: 'United States', value: 20 },
        { id: 'in', name: 'India', value: 15 }
    ],

    // 3. DATA REVENUE BY CHANNEL (Aman Sesuai Rumus Persentase Template)
    revenueByChannel: {
        thisWeek: { growShrink: 5.8, value: 25000000, percentage: { onlineStore: 50, physicalStore: 30, socialMedia: 20 } },
        thisMonth: { growShrink: 14.2, value: 90000000, percentage: { onlineStore: 60, physicalStore: 25, socialMedia: 15 } },
        thisYear: { growShrink: 32.4, value: 1200000000, percentage: { onlineStore: 55, physicalStore: 30, socialMedia: 15 } }
    },

    // 4. DATA SALES TARGET & TOP PRODUCT
    salesTarget: { thisMonth: 85, thisWeek: 24, thisYear: 72 },
    topProduct: [
        { id: '1', name: 'Scanning AI Dermoskopi', sales: 450, status: 'In Stock' }
    ],

    // 5. 🔥 FIX MUTLAK RECENT ORDERS (Status Angka & Key totalAmount Sesuai Tabel Tanstack Lu)
    recentOrders: [
        { 
            id: '9527', 
            customer: 'Wildan Yazid Ziddan', 
            date: '01 Juni 2026', 
            status: 0, // 0 = Paid (Warna emerald ijo seger)
            totalAmount: 150.00 
        },
        { 
            id: '9528', 
            customer: 'Titta Zalfa', 
            date: '31 Mei 2026', 
            status: 1, // 1 = Pending (Warna amber kuning)
            totalAmount: 50.00 
        },
        { 
            id: '9529', 
            customer: 'Tester Pasien', 
            date: '28 Mei 2026', 
            status: 2, // 2 = Failed (Warna merah)
            totalAmount: 25.50 
        }
    ]
}
export default function Page() {
    const data = mockDashboardData

    return (
        <div className="p-4">
            <div className="flex flex-col gap-4 max-w-full overflow-x-hidden">
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-1 xl:col-span-3">
                        <Overview data={data.statisticData as any} />
                        
                        <CustomerDemographic data={data.customerDemographic as any} />
                    </div>
                    <div className="flex flex-col gap-4 2xl:min-w-[360px]">
                        <SalesTarget data={data.salesTarget as any} />
                        <TopProduct data={data.topProduct as any} />
                        <RevenueByChannel data={data.revenueByChannel as any} />
                    </div>
                </div>

                <RecentOrder data={data.recentOrders as any} />
            </div>
        </div>
    )
}