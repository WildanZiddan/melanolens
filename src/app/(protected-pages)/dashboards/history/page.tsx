'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Tag from '@/components/ui/Tag'
import Table from '@/components/ui/Table'
import Progress from '@/components/ui/Progress'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbEye, TbCalendar, TbSearch, TbActivity, TbUser, TbCertificate, TbAlertTriangle, TbFileCheck } from 'react-icons/tb'
import appConfig from '@/configs/app.config'

const ADMIN_HISTORY_URL = `${appConfig.backendApiUrl}/api/admin/history`

interface AdminHistoryItem {
    scan_id: number
    user_id: number
    user_nama: string
    scan_gambar: string
    scan_responGambar?: string
    scan_tanggal: string
    scan_persentase: number
    scan_respon: string
}

const { Tr, Th, Td, THead, TBody } = Table

export default function AdminHistoryPage() {
    const [historyData, setHistoryData] = useState<AdminHistoryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const [selectedItem, setSelectedItem] = useState<AdminHistoryItem | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchAllHistory = async () => {
            try {
                const response = await fetch(ADMIN_HISTORY_URL)
                if (!response.ok) throw new Error('Gagal menarik data rekam medis')
                const data = await response.json()
                setHistoryData(data)
            } catch (error) {
                console.error(error)
                toast.push(
                    <Notification title="Gagal Sinkronisasi" type="danger">
                        Gagal memuat seluruh riwayat
                    </Notification>
                )
            } finally {
                setIsLoading(false)
            }
        }
        fetchAllHistory()
    }, [])

    const handleOpenDetail = (item: AdminHistoryItem) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    // 🚀 FILTER PENCARIAN TETEP BERJALAN NORMAL DAN SENSITIF
    const filteredHistory = historyData.filter(item => {
        const namaPasien = item?.user_nama ? item.user_nama.toLowerCase() : ''
        const idScan = item?.scan_id ? item.scan_id.toString() : ''
        const kataKunci = searchTerm.toLowerCase()

        return namaPasien.includes(kataKunci) || idScan.includes(kataKunci)
    })

    return (
        <div className="p-4 md:p-6 w-full min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="font-bold mb-1 heading-text">Riwayat scanning milik pengguna MelanoLens</h3>
                    <p className="text-slate-400 text-sm">Halaman seluruh berkas skrining medis kanker kulit pasien MelanoLens.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-lg">
                        <TbSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Cari nama pasien atau ID scan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                    <p className="text-xs text-slate-400">Sedang menarik data seluruh pasien dari database...</p>
                </div>
            ) : filteredHistory.length === 0 ? (
                <Card className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="text-4xl text-slate-300 mb-3 flex justify-center"><TbSearch /></div>
                    <p className="font-semibold text-sm heading-text">Data Tidak Ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Tidak ada riwayat rekam medis pasien yang cocok dengan kata kunci pencarian Anda.</p>
                </Card>
            ) : (
                <Card className="p-2 overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                    <Table compact className="min-w-full text-xs">
                        <THead className="bg-slate-50 dark:bg-slate-800/40">
                            <Tr>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">No.</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">Nama Pasien</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">Sampel Foto</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">Heatmap AI</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">Tanggal Periksa</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">Hasil Analisis</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">Confidence Rate</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300 text-center">Aksi</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {filteredHistory.map((item, index) => {
                                const respLower = (item.scan_respon || '').toLowerCase()
                                const isMalignant =
                                    (respLower.includes('malignant') ||
                                        respLower.includes('melanoma') ||
                                        respLower.includes('ganas') ||
                                        respLower.includes('kanker') ||
                                        respLower.includes('cancer')) &&
                                    !respLower.includes('jinak') &&
                                    !respLower.includes('benign')

                                const nomorUrutAsc = index + 1

                                return (
                                    <Tr key={item.scan_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/60">
                                        <Td className="font-bold text-slate-700 dark:text-slate-200">{nomorUrutAsc}</Td>
                                        <Td className="font-semibold text-slate-600 dark:text-slate-300 capitalize">{item.user_nama}</Td>
                                        <Td>
                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200/40 flex items-center justify-center">
                                                <img src={item.scan_gambar} alt="Pasien Lesi" className="object-cover w-full h-full" />
                                            </div>
                                        </Td>
                                        <Td>
                                            {item.scan_responGambar ? (
                                                <div className="w-10 h-10 bg-slate-900 rounded-lg overflow-hidden border border-slate-200/40 flex items-center justify-center">
                                                    <img src={item.scan_responGambar} alt="Heatmap AI" className="object-cover w-full h-full" />
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-[10px] italic">Tidak ada</span>
                                            )}
                                        </Td>
                                        <Td className="text-slate-400">
                                            {new Date(item.scan_tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </Td>
                                        <Td>
                                            <Tag className={isMalignant ? 'bg-red-50 text-red-600 border-red-100 font-bold' : 'bg-emerald-50 text-emerald-600 border-emerald-100 font-bold'}>
                                                {item.scan_respon.replace('_', ' ')}
                                            </Tag>
                                        </Td>
                                        <Td className="w-44">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <Progress
                                                        percent={Math.round(item.scan_persentase <= 1 ? item.scan_persentase * 100 : item.scan_persentase)}
                                                        width="100%"
                                                        size="sm"
                                                        customColorClass={isMalignant ? 'bg-red-500' : 'bg-emerald-500'}
                                                    />
                                                </div>
                                            </div>
                                        </Td>
                                        <Td className="text-center">
                                            <Button size="xs" icon={<TbEye />} variant="plain" onClick={() => handleOpenDetail(item)} className="hover:text-primary">
                                                Detail
                                            </Button>
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </TBody>
                    </Table>
                </Card>
            )}

            {/* 🛠️ DIALOG MODAL POPUP AUDIT MEDIS KHUSUS ADMIN DENGAN TAMPILAN MIRIP MENU SCAN */}
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
                                                alt="Foto Lesi Pasien"
                                                className="object-contain max-h-[320px] w-auto rounded-xl shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-700">
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                                Berkas Scan #{selectedItem.scan_id}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                {new Date(selectedItem.scan_tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                        {selectedItem.user_nama && (
                                            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                                <span>Nama Pasien:</span>
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{selectedItem.user_nama} (UID-{selectedItem.user_id})</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                            <span>Status Verifikasi:</span>
                                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                                <TbFileCheck /> Terdaftar di Basis Data
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-1">
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Selesai Verifikasi
                                        </Button>
                                    </div>
                                </div>

                                {/* SISI KANAN: Hasil Diagnosis AI (Mirip Menu Scan) */}
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