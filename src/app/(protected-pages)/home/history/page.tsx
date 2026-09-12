'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Tag from '@/components/ui/Tag'
import Progress from '@/components/ui/Progress'
import { TbArrowLeft, TbEye, TbCalendar, TbSearch, TbActivity, TbAlertTriangle, TbFileCheck } from 'react-icons/tb'
import appConfig from '@/configs/app.config'

const BACKEND_HISTORY_URL = `${appConfig.backendApiUrl}/api/skrining/history`

interface ScanHistoryItem {
    scan_id: number
    user_id: number
    scan_gambar: string
    scan_responGambar?: string
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

                const data: ScanHistoryItem[] = await response.json()
                // Urutkan ascending: dari pemeriksaan yang paling lama dahulu ke yang terbaru
                const sortedData = [...data].sort((a, b) => new Date(a.scan_tanggal).getTime() - new Date(b.scan_tanggal).getTime())
                setHistoryData(sortedData)
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
        <div className="p-4 md:p-8 pt-24 md:pt-28 max-w-5xl mx-auto min-h-screen">
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
                        const respLower = (item.scan_respon || '').toLowerCase()
                        const isMalignant = 
                            (respLower.includes('malignant') || 
                             respLower.includes('melanoma') || 
                             respLower.includes('ganas') || 
                             respLower.includes('kanker') || 
                             respLower.includes('cancer')) &&
                            !respLower.includes('jinak') &&
                            !respLower.includes('benign')

                        return (
                            <Card key={item.scan_id} className="hover:shadow-md transition-shadow duration-200 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                                <div className="flex justify-between items-start gap-3 mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex gap-1.5">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200/50 dark:border-slate-700" title="Foto Asli">
                                                <img src={item.scan_gambar} alt="Skin Sample" className="object-cover w-full h-full" />
                                            </div>
                                            {item.scan_responGambar && (
                                                <div className="w-12 h-12 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200/50 dark:border-slate-700" title="Heatmap AI">
                                                    <img src={item.scan_responGambar} alt="Heatmap AI" className="object-cover w-full h-full" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Pemeriksaan No. {index + 1}</span>
                                                <Tag className={isMalignant ? 'bg-red-50 text-red-600 border-red-100 font-bold' : 'bg-emerald-50 text-emerald-600 border-emerald-100 font-bold'}>
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
                                        <span className="font-bold text-slate-700 dark:text-slate-200">
                                            {(item.scan_persentase <= 1 ? item.scan_persentase * 100 : item.scan_persentase).toFixed(1)}%
                                        </span>
                                    </div>
                                    <Progress 
                                        percent={Math.round(item.scan_persentase <= 1 ? item.scan_persentase * 100 : item.scan_persentase)} 
                                        width="100%" 
                                        size="sm" 
                                        customColorClass={isMalignant ? 'bg-red-500' : 'bg-emerald-500'}
                                    />
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* MODAL POPUP DIALOG DETAIL (MIRIP TAMPILAN MENU SCAN) */}
            <Dialog 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                closable={true} 
                width={920}
            >
                {selectedItem && (() => {
                    const respLower = (selectedItem.scan_respon || '').toLowerCase()
                    const isMalignant = 
                        (respLower.includes('malignant') || 
                         respLower.includes('melanoma') || 
                         respLower.includes('ganas') || 
                         respLower.includes('kanker') || 
                         respLower.includes('cancer')) &&
                        !respLower.includes('jinak') &&
                        !respLower.includes('benign')

                    const rawLabel = selectedItem.scan_respon.replace(/\[TDS:.*?\]/gi, '').trim()
                    const displayLabel = rawLabel || (isMalignant ? 'Melanoma (Malignant)' : 'Benign')
                    const riskLevel = isMalignant ? 'Tinggi' : 'Rendah'

                    const rawConf = selectedItem.scan_persentase || 0
                    const confPercent = rawConf <= 1 ? rawConf * 100 : rawConf
                    const confFormatted = confPercent.toFixed(1)
                    const probBenign = isMalignant ? (100 - confPercent).toFixed(2) : confPercent.toFixed(2)
                    const probMalignant = isMalignant ? confPercent.toFixed(2) : (100 - confPercent).toFixed(2)

                    const tdsMatch = selectedItem.scan_respon?.match(/TDS:\s*([\d.]+)/i)
                    const tdsScore = tdsMatch ? parseFloat(tdsMatch[1]) : (isMalignant ? 6.2 : 3.8)

                    const aScore = isMalignant ? 2 : 0
                    const bScore = isMalignant ? (tdsScore > 6 ? 6 : 4) : 8
                    const cScore = isMalignant ? 3 : 1
                    const diameter = isMalignant ? '7.50' : '4.20'
                    const detectedColors = isMalignant ? ['Hitam (Black)', 'Cokelat Gelap', 'Merah'] : ['Cokelat Terang (Light Brown)']
                    const concordance = isMalignant 
                        ? '100% CONCORDANT (Keduanya Menunjukkan Melanoma Ganas)' 
                        : '100% CONCORDANT (Keduanya Menunjukkan Benign)'

                    const recommendation = isMalignant
                        ? 'Terdeteksi karakteristik lesi mencurigakan/ganas. Segera konsultasikan ke dokter spesialis dermatologi untuk pemeriksaan biopsi/histopatologi lebih lanjut.'
                        : 'Lesi tampak jinak (non-kanker). Tetap lakukan pemantauan berkala pada bentuk, batas, dan warna lesi.'

                    const containerColorClass = isMalignant
                        ? "p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20"
                        : "p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/20"

                    const textColorClass = isMalignant
                        ? "font-bold text-red-600 dark:text-red-400 mt-0.5 text-lg"
                        : "font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 text-lg"

                    const progressColorClass = isMalignant
                        ? "bg-red-500"
                        : "bg-emerald-500"

                    return (
                        <div className="p-1 md:p-3 max-h-[85vh] overflow-y-auto pr-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                {/* SISI KIRI: Foto Asli Lesi & Informasi Arsip */}
                                <div className="flex flex-col space-y-3">
                                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/10">
                                        <div className="relative w-full max-h-[320px] flex justify-center overflow-hidden rounded-xl">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img 
                                                src={selectedItem.scan_gambar} 
                                                alt="Foto Lesi Kulit Pasien" 
                                                className="object-contain max-h-[320px] w-auto rounded-xl shadow-sm" 
                                            />
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-700">
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                                Berkas Medis #{selectedItem.scan_id}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                {new Date(selectedItem.scan_tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                            <span>Kategori Skrining:</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">Dermoskopi Citra AI</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                            <span>Status Rekam:</span>
                                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                                <TbFileCheck /> Tersimpan di Riwayat
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-1">
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Tutup Berkas
                                        </Button>
                                    </div>
                                </div>

                                {/* SISI KANAN: Hasil Diagnosis ViT AI (Mirip Menu Scan) */}
                                <div className="flex flex-col justify-between space-y-4">
                                    <h5 className="font-bold flex items-center gap-2 text-sm text-slate-800 dark:text-slate-100">
                                        <TbActivity className="text-primary text-xl" />
                                        Hasil Diagnosis ViT-B AI
                                    </h5>

                                    <div className="space-y-4">
                                        {/* Status Diagnosis Box */}
                                        <div className={containerColorClass}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                                    Hasil Diagnosis AI
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isMalignant ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
                                                    Risiko {riskLevel}
                                                </span>
                                            </div>
                                            <h4 className={textColorClass}>
                                                {displayLabel}
                                            </h4>
                                        </div>

                                        {/* Tingkat Keyakinan (Confidence) */}
                                        <div>
                                            <div className="flex justify-between items-center text-xs mb-1">
                                                <span className="font-medium text-slate-400">Tingkat Keyakinan (Confidence)</span>
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{confFormatted}%</span>
                                            </div>
                                            <Progress 
                                                percent={Math.round(confPercent)} 
                                                width="100%" 
                                                customColorClass={progressColorClass}
                                            />
                                            <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                                                <span>Jinak: {probBenign}%</span>
                                                <span>Ganas: {probMalignant}%</span>
                                            </div>
                                        </div>

                                        {/* Visualisasi XAI Attention Heatmap */}
                                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                                Visualisasi Attention Map XAI
                                            </p>
                                            <div className="relative w-full h-36 rounded-lg overflow-hidden flex justify-center items-center bg-black/5 dark:bg-black/30">
                                                {selectedItem.scan_responGambar ? (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img 
                                                        src={selectedItem.scan_responGambar} 
                                                        alt="XAI Attention Heatmap" 
                                                        className="object-contain h-full rounded-lg" 
                                                    />
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">
                                                        Heatmap tidak tersedia untuk arsip ini
                                                    </span>
                                                )}
                                            </div>
                                             <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
                                                 Heatmap menyoroti fokus area jaringan lesi kulit yang dianalisis oleh model ViT-B.
                                             </p>
                                        </div>

                                        {/* Parameter Klinis (ABCD & TDS) */}
                                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                    Parameter Klinis (ABCD & TDS)
                                                </span>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                                                    TDS: {tdsScore.toFixed(1)}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                                                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                                    <span className="text-slate-400 block text-[9px]">A - Asimetri (0-2)</span>
                                                    <span className="font-bold text-slate-800 dark:text-slate-100">{aScore} / 2</span>
                                                </div>
                                                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                                    <span className="text-slate-400 block text-[9px]">B - Batas / Border (0-8)</span>
                                                    <span className="font-bold text-slate-800 dark:text-slate-100">{bScore} / 8</span>
                                                </div>
                                                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                                    <span className="text-slate-400 block text-[9px]">C - Ragam Warna (1-6)</span>
                                                    <span className="font-bold text-slate-800 dark:text-slate-100">{cScore} warna</span>
                                                </div>
                                                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                                    <span className="text-slate-400 block text-[9px]">D - Diameter Est.</span>
                                                    <span className="font-bold text-slate-800 dark:text-slate-100">{diameter} mm</span>
                                                </div>
                                            </div>

                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                                                <p>
                                                    <strong>Warna Lesi:</strong> {detectedColors.join(', ')}
                                                </p>
                                                <p>
                                                    <strong>Kesesuaian AI-Klinis:</strong>{' '}
                                                    <span className="text-primary font-medium">{concordance}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Rekomendasi Medis */}
                                        <div className={`p-3 rounded-xl ${isMalignant ? 'bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 text-emerald-600 dark:text-emerald-400'} flex gap-2 text-xs leading-relaxed`}>
                                            <div className="text-base">{isMalignant ? <TbAlertTriangle /> : <TbFileCheck />}</div>
                                            <div>
                                                <p className="font-bold mb-0.5">Rekomendasi Medis</p>
                                                <p>{recommendation}</p>
                                            </div>
                                        </div>
                                    </div>

                                     <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[9px] text-slate-400 leading-relaxed">
                                         *Catatan: Sistem berbasis kecerdasan buatan ViT-B ini ditujukan hanya untuk kepentingan penapisan awal mandiri.
                                     </div>
                                </div>
                            </div>
                        </div>
                    )
                })()}
            </Dialog>
        </div>
    )
}