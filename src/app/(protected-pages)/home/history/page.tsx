'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Tag from '@/components/ui/Tag'
import Progress from '@/components/ui/Progress'
import { TbArrowLeft, TbEye, TbCalendar, TbSearch, TbActivity } from 'react-icons/tb'
import appConfig from '@/configs/app.config'

const BACKEND_HISTORY_URL = `${appConfig.backendApiUrl}/api/skrining/history`

interface ScanHistoryItem {
    scan_id: number
    user_id: number
    scan_gambar: string
    scan_tanggal: string
    scan_persentase: number
    scan_respon: string
}

export default function HistoryPage() {
    const router = useRouter()

    const [historyData, setHistoryData] = useState<ScanHistoryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true)

                // 🔑 1. AMBIL TOKEN LOGIN LANGSUNG DARI LOCAL STORAGE / SESSION STORAGE LU, DAN!
                // (Sesuaikan key 'token' di bawah dengan nama key tempat template lu nyimpen JWT, biasanya 'token' atau 'accessToken')
                const token = localStorage.getItem('token') || sessionStorage.getItem('token')

                let extractedUserId = null

                // 🔑 2. BONGKAR JWT SECARA MANUAL TANPA PAKAI HOOK TEMPLATE JAHANAM ITU WKWK
                if (token) {
                    try {
                        const base64Url = token.split('.')[1]
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                        const jsonPayload = decodeURIComponent(
                            window.atob(base64)
                                .split('')
                                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                                .join('')
                        )
                        const decoded = JSON.parse(jsonPayload)

                        // Ambil user_id murni hasil bongkaran JWT FastAPI lu!
                        extractedUserId = decoded?.user_id || decoded?.id || null
                        console.log("🕵️‍♂️ ID User Berhasil Dibongkar Mentah-mentah:", extractedUserId)
                    } catch (e) {
                        console.error("Gagal parsing token JWT:", e)
                    }
                }

                // 🔑 3. JALUR AMAN: Kalau token ga ada atau user_id zonk, langsung matikan loading
                if (!extractedUserId) {
                    console.error("🚨 Sesi Token Expired / User ID Tidak Ditemukan!")
                    setIsLoading(false)
                    return
                }

                // 🚀 4. TEMBAK API FASTAPI SECARA LEGAL DAN SAH!
                const response = await fetch(`${BACKEND_HISTORY_URL}?user_id=${extractedUserId}`)

                if (!response.ok) throw new Error('Gagal memuat rekam medis dari FastAPI')

                const data = await response.json()
                setHistoryData(data)
            } catch (error) {
                console.error("Error fetching history:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchHistory()
    }, []) // 👈 Kosongin aja array-nya biar dia murni jalan sekali pas page kebuka!

    const handleOpenDetail = (item: ScanHistoryItem) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen">
            <div className="mb-5">
                <Button size="sm" icon={<TbArrowLeft />} onClick={() => router.push('/home')}>
                    Kembali
                </Button>
            </div>

            <div className="mb-6">
                <h3 className="font-bold mb-1 heading-text">Riwayat Rekam Medis Anda</h3>
                <p className="text-slate-400 text-sm">Arsip berkas hasil skrining mandiri foto lesi kulit berbasis Deep Learning MelanoLens.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                    <p className="text-xs text-slate-400">Sedang menarik data rekam medis dari cloud Supabase...</p>
                </div>
            ) : historyData.length === 0 ? (
                <Card className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="text-4xl text-slate-300 mb-3 flex justify-center"><TbSearch /></div>
                    <p className="font-semibold text-sm heading-text mb-1">Belum Ada Riwayat Pemeriksaan</p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">Anda belum pernah melakukan scan sampel kulit. Silakan masukkan gambar sampel di halaman scan.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {historyData.map((item, index) => {
                        const isMalignant = item.scan_respon.toLowerCase().includes('melanoma') || item.scan_respon.toLowerCase().includes('ganas')
                        return (
                            <Card key={item.scan_id} className="hover:shadow-md transition-shadow duration-200 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                                <div className="flex justify-between items-start gap-3 mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200/50 dark:border-slate-700">
                                            <img src={item.scan_gambar} alt="Skin Sample" className="object-cover w-full h-full" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Pemeriksaan No. {index + 1}</span>
                                                <Tag className={isMalignant ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}>
                                                    {isMalignant ? 'Indikasi Ganas' : 'Jinak'}
                                                </Tag>
                                            </div>
                                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                <TbCalendar /> {new Date(item.scan_tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <Button size="xs" variant="default" icon={<TbEye />} onClick={() => handleOpenDetail(item)}>
                                        Detail
                                    </Button>
                                </div>

                                <div className="pt-2 border-t border-slate-50 dark:border-slate-800/60">
                                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                                        <span>Hasil: <strong className="capitalize text-slate-600 dark:text-slate-300">{item.scan_respon.replace('_', ' ')}</strong></span>
                                        <span className="font-bold text-slate-700 dark:text-slate-200">{(item.scan_persentase * 100).toFixed(1)}%</span>
                                    </div>
                                    <Progress percent={Math.round(item.scan_persentase * 100)} width="100%" size="sm" />
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* MODAL POPUP DIALOG DETAIL */}
            <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} closable={true} width={450}>
                {selectedItem && (
                    <div className="p-2">
                        <h5 className="font-bold mb-4 flex items-center gap-2">
                            <TbActivity className="text-primary text-xl" />
                            Detail Berkas Medis #{selectedItem.scan_id}
                        </h5>

                        <div className="w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden mb-4 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center">
                            <img src={selectedItem.scan_gambar} alt="Detail Lesi" className="object-contain w-full h-full" />
                        </div>

                        <div className="space-y-3 text-xs leading-relaxed">
                            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-400 font-medium">Waktu Periksa</span>
                                <span className="col-span-2 font-semibold text-slate-700 dark:text-slate-200">
                                    {new Date(selectedItem.scan_tanggal).toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-400 font-medium">Klasifikasi AI</span>
                                <span className="col-span-2 font-bold text-primary capitalize">
                                    {selectedItem.scan_respon.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-400 font-medium">Akurasi Model</span>
                                <span className="col-span-2 font-bold text-slate-700 dark:text-slate-200">
                                    {(selectedItem.scan_persentase * 100).toFixed(2)}%
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 text-right">
                            <Button size="sm" variant="solid" onClick={() => setIsModalOpen(false)}>
                                Tutup Berkas
                            </Button>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    )
}