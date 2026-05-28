import { useState } from 'react'
import Container from './LandingContainer'
import { motion, AnimatePresence } from 'framer-motion'

import type { Mode } from '@/@types/theme'


type DemoProps = {
    mode: Mode
}

const stackList = [
    {
        id: 'react',
        title: '1. Registrasi & Login',
        description:
            'Masuk ke dalam sistem menggunakan akun Google yang sudah terintegrasi aman lewat fitur Split-Screen Authentication.',
    },
    {
        id: 'tailwind',
        title: '2. Unggah Citra Lesi',
        description:
            'Unggah citra lesi kulit yang ingin dianalisis menggunakan fitur unggah gambar yang tersedia.',
    },
    {
        id: 'typescript',
        title: '3. Ekstraksi Medis ABCDE',
        description:
            'Sistem Computer Vision akan otomatis menganalisis karakteristik fisik lesi berdasarkan parameter ketidaksimetrisan, pinggiran, warna, dan diameter.',
    },
    {
        id: 'nextjs',
        title: '4. Cek Peta Atensi AI',
        description:
            'Lihat visualisasi Attention Maps (Heatmap) untuk mengetahui area interpretasi model Deep Learning yang menjadi dasar keputusan sistem.',
    },
    {
        id: 'react-hook-form',
        title: '5. Unduh Laporan Medis',
        description:
            'Dapatkan hasil kalkulasi skor probabilitas akhir dan simpan riwayat skrining ke dashboard untuk pemantauan perkembangan lesi secara berkala.',
    }
]

const TechStack = ({ mode }: DemoProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    return (
        <div id="panduan" className="relative z-20 py-10 md:py-40">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0.1 }}
                viewport={{ once: true }}
            >
                <motion.h2 className="my-6 text-5xl">
                    Panduan Penggunaan MelanoLens
                </motion.h2>
                <motion.p className="mx-auto max-w-[600px]">
                    Ikuti langkah-langkah mudah berikut untuk mulai melakukan penapisan awal risiko melanoma secara mandiri dan objektif.
                </motion.p>
            </motion.div>
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {stackList.map((stack, index) => (
                        <motion.div
                            key={stack.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                type: 'spring',
                                bounce: 0.1,
                                delay: index * 0.1,
                            }}
                            viewport={{ once: true }}
                            className="relative p-4"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <AnimatePresence>
                                {hoveredIndex === index && (
                                    <motion.span
                                        className="absolute inset-0 h-full w-full bg-gray-100 dark:bg-zinc-800/[0.8] block  rounded-3xl"
                                        layoutId="hoverBackground"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            transition: { duration: 0.15 },
                                        }}
                                        exit={{
                                            opacity: 0,
                                            transition: {
                                                duration: 0.15,
                                                delay: 0.2,
                                            },
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                            <div className="p-4 rounded-2xl z-10 relative bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 h-full group">
                                <div className="flex flex-col">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-600 group-hover:border-primary">
                                        <img
                                            className="max-h-8"
                                            src={`/img/landing/tech/${stack.id}.png`}
                                            alt={stack.title}
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-lg mb-2">
                                            {stack.title}
                                        </h3>
                                        <p className="text-muted dark:text-muted-dark">
                                            {stack.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default TechStack
