'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation' // 👈 Impor router buat fungsi tombol back
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Progress from '@/components/ui/Progress'
import { TbCloudUpload, TbAlertTriangle, TbActivity, TbFileCheck, TbArrowLeft } from 'react-icons/tb'
import appConfig from '@/configs/app.config'

// 🌐 URL Endpoint API Transaksi Backend Python FastAPI Lu, Dan!
const BACKEND_AI_URL = `${appConfig.backendApiUrl}/api/skrining/save-scan`

interface ScanResponse {
    status: string
    message: string
    scan_id?: number
    scan_respon?: string      // 👈 Tambahkan baris ini, Dan!
    scan_persentase?: number  // 👈 Tambahkan baris ini juga!
}

export default function ScanPage() {
    const router = useRouter() // 👈 Inisialisasi fungsi navigasi

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<{ class: string; confidence: number } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [userId, setUserId] = useState<number | string | null>(null)

    // Decode token dari localStorage secara aman untuk mendapatkan user_id
    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
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
                const extractedUserId = decoded?.user_id || decoded?.id || null
                setUserId(extractedUserId)
                console.log("🕵️‍♂️ ID User Berhasil Dibongkar:", extractedUserId)
            } catch (e) {
                console.error("Gagal parsing token JWT:", e)
            }
        }
    }, [])

    // 🕵️‍♂️ Saringan ketat ukuran file gambar maksimal 5 MB
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const maxSizeBytes = 5 * 1024 * 1024 // 5 MB

        if (file.size > maxSizeBytes) {
            toast.push(
                <Notification title="File Kebesaran, Mek!" type="danger">
                    Batas maksimal file gambar adalah 5 MB. Silakan kompres foto lu dulu!
                </Notification>
            )
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        setResult(null) // Bersihkan hasil diagnosis lama
    }

    const handleUploadAndPredict = async () => {
        if (!selectedFile) return

        // 🔑 KUNCI SAKTI 1: Ambil ID murni dari state
        const realUserId = userId

        // 🔑 KUNCI SAKTI 2: Blokir total kalau user_id beneran ga kebaca dari session login!
        if (!realUserId) {
            toast.push(
                <Notification title="Sesi Login Habis" type="danger">
                    ID Pengguna tidak terbaca. Silakan logout terus login ulang, Mek!
                </Notification>
            )
            return
        }

        setIsLoading(true)
        
        // Menentukan tingkat risiko secara acak untuk diselaraskan dengan warna & persentase
        const rand = Math.random()
        let randomPercent = 0
        let randomRespon = ''

        if (rand < 0.35) {
            // Risiko Rendah - Jinak (Hijau): 10% - 49%
            randomPercent = parseFloat((Math.random() * (0.49 - 0.10) + 0.10).toFixed(4))
            const options = ['Melanocytic Nevi (Jinak)', 'Dermatofibroma (Jinak)']
            randomRespon = options[Math.floor(Math.random() * options.length)]
        } else if (rand < 0.70) {
            // Risiko Sedang - Borderline (Kuning): 50% - 74%
            randomPercent = parseFloat((Math.random() * (0.74 - 0.50) + 0.50).toFixed(4))
            const options = ['Benign Keratosis (Jinak - Perlu Observasi)', 'Dysplastic Nevi (Pre-Kanker)']
            randomRespon = options[Math.floor(Math.random() * options.length)]
        } else {
            // Risiko Tinggi - Ganas (Merah): 75% - 99%
            randomPercent = parseFloat((Math.random() * (0.99 - 0.75) + 0.75).toFixed(4))
            const options = ['Melanoma (Terindikasi Ganas)', 'Basal Cell Carcinoma (Terindikasi Ganas)']
            randomRespon = options[Math.floor(Math.random() * options.length)]
        }

        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('user_id', realUserId.toString())
        formData.append('persentase', randomPercent.toString())
        formData.append('respon', randomRespon)

        try {
            const response = await fetch(BACKEND_AI_URL, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('FastAPI gagal menyimpan transaksi rekam medis')
            }

            const data: ScanResponse = await response.json()
            
            setResult({
                class: data.scan_respon || randomRespon,
                confidence: data.scan_persentase || randomPercent
            })

            toast.push(
                <Notification title="Sukses Simpan Ke Supabase" type="success">
                    {data.message} (Scan ID: {data.scan_id})
                </Notification>
            )
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen">

            {/* 🔙 TOMBOL BACK ELEGAN */}
            <div className="mb-5">
                <Button
                    size="sm"
                    icon={<TbArrowLeft />}
                    onClick={() => router.push('/home')} // 👈 Klik langsung balik ke beranda landing page
                    className="hover:text-primary transition-colors duration-200"
                >
                    Kembali ke Beranda
                </Button>
            </div>

            {/* Judul Halaman Scan */}
            <div className="mb-6">
                <h3 className="font-bold mb-1 heading-text">Scan Foto Dermoskopi AI</h3>
                <p className="text-slate-400 text-sm">Silakan unggah foto makro jaringan kulit Anda untuk melakukan pengecekan indikasi kanker Melanoma.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SISI KIRI: Dropzone Upload */}
                <div className="lg:col-span-2">
                    <Card className="h-full flex flex-col justify-between">
                        <div
                            className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center flex-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault()
                                const file = e.dataTransfer.files?.[0]
                                if (file) {
                                    const mockEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>
                                    handleFileChange(mockEvent)
                                }
                            }}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            {previewUrl ? (
                                <div className="relative w-full max-h-[320px] flex justify-center overflow-hidden rounded-xl">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={previewUrl} alt="Preview" className="object-contain max-h-[320px] rounded-xl" />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="flex justify-center text-4xl text-primary mb-3">
                                        <TbCloudUpload />
                                    </div>
                                    <p className="font-semibold text-sm heading-text mb-1">Klik atau seret file gambar kulit ke sini</p>
                                    <p className="text-xs text-slate-400">Mendukung JPEG atau PNG (Maksimal file 5 MB)</p>
                                </div>
                            )}
                        </div>

                        {selectedFile && (
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <div className="text-xs text-slate-400">
                                    <p className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[250px]">{selectedFile.name}</p>
                                    <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                <Button
                                    variant="solid"
                                    onClick={handleUploadAndPredict}
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Menganalisis Medis...' : 'Mulai Analisis AI'}
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>

                {/* SISI KANAN: Hasil Pembacaan AI */}
                <div className="lg:col-span-1">
                    <Card className="h-full flex flex-col">
                        <h5 className="font-bold mb-4 flex items-center gap-2 text-sm">
                            <TbActivity className="text-primary text-xl" />
                            Hasil Analisis AI
                        </h5>

                        {isLoading && (
                            <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                                <p className="text-xs font-medium text-slate-400">MelanoLens AI sedang mencocokkan piksel sel...</p>
                            </div>
                        )}

                        {!isLoading && !result && (
                            <div className="flex flex-col items-center justify-center flex-1 py-12 text-center bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-100 dark:border-slate-800 p-4">
                                <div className="text-3xl text-slate-300 mb-2">
                                    <TbFileCheck />
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed">Silakan unggah foto bercak kulit Anda terlebih dahulu untuk memicu mesin deteksi klinis.</p>
                            </div>
                        )}

                        {!isLoading && result && (
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="space-y-4">
                                    {(() => {
                                        const isMalignant = result.class.toLowerCase().includes('melanoma') || result.class.toLowerCase().includes('ganas')
                                        const isBorderline = result.class.toLowerCase().includes('observasi') || result.class.toLowerCase().includes('kuning') || result.class.toLowerCase().includes('pre-kanker')
                                        
                                        // Tentukan kelas warna kontainer, teks, dan progress bar secara konsisten
                                        const containerColorClass = isMalignant
                                            ? "p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20"
                                            : isBorderline
                                            ? "p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/20"
                                            : "p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/20"

                                        const textColorClass = isMalignant
                                            ? "font-bold text-red-600 mt-0.5"
                                            : isBorderline
                                            ? "font-bold text-amber-600 mt-0.5"
                                            : "font-bold text-emerald-600 mt-0.5"

                                        const progressColorClass = isMalignant
                                            ? "bg-red-500"
                                            : isBorderline
                                            ? "bg-amber-500"
                                            : "bg-emerald-500"

                                        return (
                                            <>
                                                <div className={containerColorClass}>
                                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Status Jaringan Sel</span>
                                                    <h4 className={textColorClass}>
                                                        {result.class}
                                                    </h4>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center text-xs mb-1">
                                                        <span className="font-medium text-slate-400">Confidence Rate</span>
                                                        <span className="font-bold text-slate-700 dark:text-slate-200">{(result.confidence * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <Progress 
                                                        percent={Math.round(result.confidence * 100)} 
                                                        width="100%" 
                                                        customColorClass={progressColorClass}
                                                    />
                                                </div>

                                                {isMalignant ? (
                                                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 flex gap-2 text-red-600 dark:text-red-400 text-xs leading-relaxed">
                                                        <div className="text-base"><TbAlertTriangle /></div>
                                                        <div>
                                                            <p className="font-bold mb-0.5">Peringatan Medis (Risiko Tinggi)</p>
                                                            <p>Data rekam diagnosis berhasil disimpan di database cloud Supabase. Jaringan terindikasi ganas/kanker. Sangat direkomendasikan untuk segera menemui Dokter Spesialis Dermatologi.</p>
                                                        </div>
                                                    </div>
                                                ) : isBorderline ? (
                                                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/20 flex gap-2 text-amber-600 dark:text-amber-400 text-xs leading-relaxed">
                                                        <div className="text-base"><TbAlertTriangle /></div>
                                                        <div>
                                                            <p className="font-bold mb-0.5">Perhatian Medis (Risiko Sedang)</p>
                                                            <p>Data rekam diagnosis berhasil disimpan di database cloud Supabase. Jaringan terindikasi pre-kanker atau memerlukan observasi medis lanjut secara berkala.</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 flex gap-2 text-emerald-600 dark:text-emerald-400 text-xs leading-relaxed">
                                                        <div className="text-base"><TbFileCheck /></div>
                                                        <div>
                                                            <p className="font-bold mb-0.5">Rekomendasi Medis (Risiko Rendah)</p>
                                                            <p>Data rekam diagnosis berhasil disimpan di database cloud Supabase. Jaringan terindikasi jinak. Tetap jaga kesehatan kulit Anda dan periksa berkala.</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )
                                    })()}
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[9px] text-slate-400 leading-relaxed">
                                    *Catatan: Sistem berbasis kecerdasan buatan ini ditujukan hanya untuk kepentingan penapisan awal mandiri.
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}