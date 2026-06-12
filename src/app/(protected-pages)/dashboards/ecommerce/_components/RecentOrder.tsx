'use client'

import { useCallback, useMemo } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'

type OrderProps = {
    id: string
    customer: string
    date: string
    status: number
    totalAmount: number
}

type RecentOrderProps = {
    data: OrderProps[]
}

const { Tr, Td, TBody, THead, Th } = Table

// 🔑 RACIKAN WARNA MEDIS: 0 = Jinak (Emerald Hijau), 2 = Indikasi Ganas (Red Merah)
const medicalStatusColor: Record<number, { label: string; dotClass: string; textClass: string }> = {
    0: {
        label: 'Jinak',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full',
    },
    2: { 
        label: 'Indikasi Ganas', 
        dotClass: 'bg-red-500', 
        textClass: 'text-red-500 bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded-full' 
    },
}

const ScanIdColumn = ({ row }: { row: OrderProps }) => {
    const router = useRouter()

    const handleView = useCallback(() => {
        // Arahkan ke berkas detil rekam medis admin
        router.push(`/dashboards/history`)
    }, [row, router])

    return (
        <span
            className="cursor-pointer select-none font-bold text-primary hover:underline"
            onClick={handleView}
        >
            #{row.id}
        </span>
    )
}

const RecentOrder = ({ data = [] }: RecentOrderProps) => {
    const router = useRouter()

    const columns: ColumnDef<OrderProps>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID Scan', // ⬅️ Ganti dari 'Order'
                cell: (props) => <ScanIdColumn row={props.row.original} />,
            },
            {
                header: 'Nama Pasien', // ⬅️ Ganti dari 'Customer'
                accessorKey: 'customer' 
            },
            {
                accessorKey: 'date',
                header: 'Waktu Periksa', // ⬅️ Ganti dari 'Date'
                cell: (props) => <span>{props.row.original.date}</span>,
            },
            {
                accessorKey: 'status',
                header: 'Hasil Klasifikasi AI', // ⬅️ Ganti dari 'Status'
                cell: (props) => {
                    const { status } = props.row.original
                    const currentStatus = medicalStatusColor[status] || medicalStatusColor[0]
                    return (
                        <div className="flex items-center">
                            <Badge className={currentStatus.dotClass} />
                            <span className={`ml-2 rtl:mr-2 capitalize font-bold text-xs ${currentStatus.textClass}`}>
                                {currentStatus.label}
                            </span>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'totalAmount',
                header: 'Akurasi AI', // ⬅️ Ganti dari 'Amount Spent' untuk membuang lambang Dollar ($)
                cell: (props) => {
                    const { totalAmount } = props.row.original
                    // Angka persentase dikali 100 jika formatnya desimal murni (0.89 -> 89.0%)
                    const displayPercent = totalAmount <= 1 ? (totalAmount * 100).toFixed(1) : totalAmount.toFixed(1)
                    return (
                        <span className="heading-text font-extrabold text-slate-700 dark:text-slate-200">
                            {displayPercent}%
                        </span>
                    )
                },
            },
        ],
        [],
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4>Antrean Log Skrining Terbaru</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Daftar berkas rekam medis pasien MelanoLens masuk secara real-time.</p>
                </div>
                <Button
                    size="sm"
                    variant="twoTone"
                    onClick={() => router.push('/dashboards/history')}
                >
                    Lihat Semua Berkas
                </Button>
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </Card>
    )
}

export default RecentOrder