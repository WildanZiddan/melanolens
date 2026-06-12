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
import { TbEye, TbCalendar, TbSearch, TbActivity, TbUser, TbCertificate } from 'react-icons/tb'

const ADMIN_HISTORY_URL = 'http://localhost:8000/api/admin/history'

interface AdminHistoryItem {
    scan_id: number
    user_id: number
    user_nama: string
    scan_gambar: string 
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
                    <p className="text-xs text-slate-400 mt-1">Tidak ada riwayat rekam medis pasien yang cocok dengan kata kunci pencarian lu, Dan.</p>
                </Card>
            ) : (
                <Card className="p-2 overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                    <Table compact className="min-w-full text-xs">
                        <THead className="bg-slate-50 dark:bg-slate-800/40">
                            <Tr>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">No.</Th> {/* ⬅️ Nama Header Kolom Lebih Simpel */}
                                <Th className="font-bold text-slate-600 dark:text-slate-300">Nama Pasien</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">Sampel Foto</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">Tanggal Periksa</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">Hasil Analisis</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300">Confidence Rate</Th>
                                <Th className="font-bold text-slate-600 dark:text-slate-300 text-center">Aksi</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {/* 🔑 KUNCI SAKTI: Tambahkan parameter 'index' di sebelah item loops */}
                            {filteredHistory.map((item, index) => {
                                const isMalignant = item.scan_respon.toLowerCase().includes('melanoma') || item.scan_respon.toLowerCase().includes('ganas')
                                
                                // Karena data dari backend Python udah lu ubah jadi ASCENDING murni,
                                // Maka urutan baris ke-1 otomatis dimulai dari index 0 + 1 = Nomor 1!
                                const nomorUrutAsc = index + 1

                                return (
                                    <Tr key={item.scan_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/60">
                                        {/* 🚀 MERENDER NOMOR URUT URUTAN 1 SAMPAI SELESAI SECARA MENYELARASKAN DATA ASC FASTAPI */}
                                        <Td className="font-bold text-slate-700 dark:text-slate-200">{nomorUrutAsc}</Td>
                                        <Td className="font-semibold text-slate-600 dark:text-slate-300 capitalize">{item.user_nama}</Td>
                                        <Td>
                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200/40 flex items-center justify-center">
                                                <img src={item.scan_gambar} alt="Pasien Lesi" className="object-cover w-full h-full" />
                                            </div>
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
                                                    <Progress percent={Math.round(item.scan_persentase * 100)} width="100%" size="sm" />
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

            {/* 🛠️ DIALOG MODAL POPUP AUDIT MEDIS KHUSUS ADMIN */}
            <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} closable={true} width={450}>
                {selectedItem && (
                    <div className="p-2">
                        <h5 className="font-bold mb-4 flex items-center gap-2">
                            <TbActivity className="text-primary text-xl" />
                            Audit Hasil Laboratorium AI Pasien
                        </h5>
                        
                        <div className="w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden mb-4 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center">
                            <img src={selectedItem.scan_gambar} alt="Audit Lesi" className="object-contain w-full h-full" />
                        </div>

                        <div className="space-y-2.5 text-xs leading-relaxed">
                            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-400 font-medium flex items-center gap-1"><TbUser /> Nama Pasien</span>
                                <span className="col-span-2 font-bold text-slate-700 dark:text-slate-200 capitalize">{selectedItem.user_nama}</span>
                            </div>
                            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-400 font-medium flex items-center gap-1"><TbCertificate /> ID Pengguna</span>
                                <span className="col-span-2 font-semibold text-slate-600 dark:text-slate-300">UID-{selectedItem.user_id}</span>
                            </div>
                            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-400 font-medium flex items-center gap-1"><TbCalendar /> Tanggal Scan</span>
                                <span className="col-span-2 font-semibold text-slate-600 dark:text-slate-300">{new Date(selectedItem.scan_tanggal).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-400 font-medium flex items-center gap-1"><TbActivity /> Deteksi AI</span>
                                <span className="col-span-2 font-bold text-red-600">{selectedItem.scan_respon}</span>
                            </div>
                            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-400 font-medium flex items-center gap-1"><TbActivity /> Confidence</span>
                                <span className="col-span-2 font-bold text-slate-700 dark:text-slate-200">{(selectedItem.scan_persentase * 100).toFixed(2)}% Akurasi</span>
                            </div>
                        </div>

                        <div className="mt-5 text-right">
                            <Button size="sm" variant="solid" onClick={() => setIsModalOpen(false)}>
                                Selesai Verifikasi
                            </Button>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    )
}