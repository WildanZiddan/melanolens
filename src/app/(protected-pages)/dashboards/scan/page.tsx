'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Progress from '@/components/ui/Progress'
import { TbCloudUpload, TbAlertTriangle, TbActivity, TbFileCheck, TbArrowLeft } from 'react-icons/tb'
import appConfig from '@/configs/app.config'

const BACKEND_AI_URL = `${appConfig.backendApiUrl}/api/skrining/predict`

interface ABCDResult {
    a_score: number
    b_score: number
    c_score: number
    d_score: number
    diameter_mm: number
    detected_colors: string[]
    tds: number
    clinical_category: string
    clinical_risk_level: string
    concordance: string
}

interface AIResult {
    label: string
    english_label: string
    confidence: number
    prob_benign: number
    prob_malignant: number
    risk_level: string
    color: string
    recommendation: string
    heatmap_base64?: string
    scan_id?: number
    abcd?: ABCDResult
}

export default function AdminScanPage() {
    const router = useRouter()

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<AIResult | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [userId, setUserId] = useState<number | string | null>(null)

    // Decode token dari localStorage untuk mendapatkan user_id
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
            } catch (e) {
                console.error("Gagal parsing token JWT:", e)
            }
        }
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const maxSizeBytes = 5 * 1024 * 1024 // 5 MB

        if (file.size > maxSizeBytes) {
            toast.push(
                <Notification title="Ukuran Berkas Terlalu Besar" type="danger">
                    Batas maksimum ukuran gambar adalah 5 MB. Silakan kompres foto Anda terlebih dahulu.
                </Notification>
            )
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        setResult(null)
    }

    const handleUploadAndPredict = async () => {
        if (!selectedFile) return

        setIsLoading(true)
        const formData = new FormData()
        formData.append('file', selectedFile)
        if (userId) {
            formData.append('user_id', userId.toString())
        }

        try {
            const response = await fetch(BACKEND_AI_URL, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Gagal terhubung dengan server AI ViT FastAPI')
            }

            const data = await response.json()

            if (data.status === 'error') {
                throw new Error(data.message || 'Gagal memproses analisis AI')
            }

            setResult({
                label: data.label,
                english_label: data.english_label,
                confidence: data.confidence,
                prob_benign: data.prob_benign,
                prob_malignant: data.prob_malignant,
                risk_level: data.risk_level,
                color: data.color,
                recommendation: data.recommendation,
                heatmap_base64: data.heatmap_base64,
                scan_id: data.scan_id,
                abcd: data.abcd,
            })

            toast.push(
                <Notification title="Analisis ViT Selesai" type="success">
                    Hasil skrining berhasil dianalisis model Vision Transformer! {data.scan_id ? `(Scan ID: ${data.scan_id})` : ''}
                </Notification>
            )
        } catch (error: any) {
            console.error(error)
            toast.push(
                <Notification title="Gagal Analisis AI" type="danger">
                    {error?.message || 'Terjadi kesalahan saat memproses model AI.'}
                </Notification>
            )
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
                    onClick={() => router.push('/home')}
                    className="hover:text-primary transition-colors duration-200"
                >
                    Kembali ke Beranda
                </Button>
            </div>

            {/* Judul Halaman Scan */}
            <div className="mb-6">
                <h3 className="font-bold mb-1 heading-text">Scan Foto Dermoskopi</h3>
                <p className="text-slate-400 text-sm">Unggah foto lesi kulit Anda untuk analisis deteksi dini kanker Melanoma berbasis model Deep Learning Vision Transformer.</p>
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
                                    {isLoading ? 'Menganalisis dengan Model ViT...' : 'Mulai Analisis AI Real'}
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
                            Hasil Diagnosis ViT AI
                        </h5>

                        {isLoading && (
                            <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                                <p className="text-xs font-medium text-slate-400">Model Vision Transformer (ViT-B/16) sedang memproses ekstrak fitur piksel sel...</p>
                            </div>
                        )}

                        {!isLoading && !result && (
                            <div className="flex flex-col items-center justify-center flex-1 py-12 text-center bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-100 dark:border-slate-800 p-4">
                                <div className="text-3xl text-slate-300 mb-2">
                                    <TbFileCheck />
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed">Silakan unggah foto bercak kulit Anda untuk memicu analisis mesin Deep Learning ViT.</p>
                            </div>
                        )}

                        {!isLoading && result && (
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="space-y-4">
                                    {(() => {
                                        const isMalignant = result.risk_level === 'Tinggi'
                                        const containerColorClass = isMalignant
                                            ? "p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20"
                                            : "p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/20"

                                        const textColorClass = isMalignant
                                            ? "font-bold text-red-600 mt-0.5"
                                            : "font-bold text-emerald-600 mt-0.5"

                                        const progressColorClass = isMalignant
                                            ? "bg-red-500"
                                            : "bg-emerald-500"

                                        return (
                                            <>
                                                <div className={containerColorClass}>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Hasil Diagnosis AI</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isMalignant ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            Risiko {result.risk_level}
                                                        </span>
                                                    </div>
                                                    <h4 className={textColorClass}>
                                                        {result.label}
                                                    </h4>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center text-xs mb-1">
                                                        <span className="font-medium text-slate-400">Tingkat Keyakinan (Confidence)</span>
                                                        <span className="font-bold text-slate-700 dark:text-slate-200">{result.confidence.toFixed(1)}%</span>
                                                    </div>
                                                    <Progress
                                                        percent={Math.round(result.confidence)}
                                                        width="100%"
                                                        customColorClass={progressColorClass}
                                                    />
                                                    <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                                                        <span>Jinak: {result.prob_benign}%</span>
                                                        <span>Ganas: {result.prob_malignant}%</span>
                                                    </div>
                                                </div>

                                                {/* Visualisasi XAI Attention Heatmap */}
                                                {result.heatmap_base64 && (
                                                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Visualisasi Attention Map XAI</p>
                                                        <div className="relative w-full h-36 rounded-lg overflow-hidden flex justify-center bg-black/5">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={result.heatmap_base64} alt="XAI Heatmap" className="object-contain h-full rounded-lg" />
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">Heatmap menyoroti fokus area jaringan lesi kulit yang dianalisis oleh model ViT.</p>
                                                    </div>
                                                )}

                                                {/* Parameter Medis Klinis (ABCD & TDS) */}
                                                {result.abcd && (
                                                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                                Parameter Klinis (ABCD & TDS)
                                                            </span>
                                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                                                                TDS: {result.abcd.tds}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                                                            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                                                <span className="text-slate-400 block text-[9px]">A - Asimetri (0-2)</span>
                                                                <span className="font-bold text-slate-800 dark:text-slate-100">{result.abcd.a_score} / 2</span>
                                                            </div>
                                                            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                                                <span className="text-slate-400 block text-[9px]">B - Batas / Border (0-8)</span>
                                                                <span className="font-bold text-slate-800 dark:text-slate-100">{result.abcd.b_score} / 8</span>
                                                            </div>
                                                            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                                                <span className="text-slate-400 block text-[9px]">C - Ragam Warna (1-6)</span>
                                                                <span className="font-bold text-slate-800 dark:text-slate-100">{result.abcd.c_score} warna</span>
                                                            </div>
                                                            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                                                <span className="text-slate-400 block text-[9px]">D - Diameter Est.</span>
                                                                <span className="font-bold text-slate-800 dark:text-slate-100">{result.abcd.diameter_mm} mm</span>
                                                            </div>
                                                        </div>

                                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                                                            {result.abcd.detected_colors && result.abcd.detected_colors.length > 0 && (
                                                                <p>
                                                                    <strong>Warna Lesi:</strong> {result.abcd.detected_colors.join(', ')}
                                                                </p>
                                                            )}
                                                            <p>
                                                                <strong>Kesesuaian AI-Klinis:</strong>{' '}
                                                                <span className="text-primary font-medium">{result.abcd.concordance}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className={`p-3 rounded-xl ${isMalignant ? 'bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 text-emerald-600 dark:text-emerald-400'} flex gap-2 text-xs leading-relaxed`}>
                                                    <div className="text-base">{isMalignant ? <TbAlertTriangle /> : <TbFileCheck />}</div>
                                                    <div>
                                                        <p className="font-bold mb-0.5">Rekomendasi Medis</p>
                                                        <p>{result.recommendation}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })()}
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[9px] text-slate-400 leading-relaxed">
                                    *Catatan: Sistem berbasis kecerdasan buatan Vision Transformer ini ditujukan hanya untuk kepentingan penapisan awal mandiri.
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}
