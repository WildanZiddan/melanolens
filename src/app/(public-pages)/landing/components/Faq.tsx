import Container from './LandingContainer'
import { TbCircleCheck } from 'react-icons/tb'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Mode } from '@/@types/theme'

type DemoProps = {
    mode: Mode
}

const PointList = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex items-center gap-2">
            <TbCircleCheck className="text-xl" />
            <span>{children}</span>
        </div>
    )
}

const Faq = ({ mode }: DemoProps) => {
    return (
        <div id="faq" className="relative z-20 py-10 md:py-40">
            <Container>
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, type: 'spring', bounce: 0.1 }}
                    viewport={{ once: true }}
                >
                    <motion.h2 className="my-6 text-5xl">
                        Pertanyaan yang Sering Diajukan (FAQ)
                    </motion.h2>
                    <motion.p className="mx-auto max-w-[600px]">
                        Temukan jawaban seputar teknologi penapisan, standardisasi medis, dan cara kerja platform asisten medis MelanoLens.
                    </motion.p>
                </motion.div>
                <div className="mt-20">
                    <motion.div
                        className="bg-gray-100 dark:bg-slate-800 rounded-3xl py-12 px-10 lg:py-24 lg:px-16 overflow-hidden mb-10"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.3,
                            type: 'spring',
                            bounce: 0.1,
                        }}
                        viewport={{ once: true }}
                    >
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4">
                            <div>
                                <h3 className="text-4xl">Seputar Metode Penapisan Medis</h3>
                                <p className="mt-6 max-w-[550px] text-lg">
                                    Berikut adalah penjelasan singkat mengenai landasan medis yang digunakan oleh sistem kecerdasan buatan MelanoLens dalam mendeteksi gejala melanoma.
                                </p>
                                <div className="mt-12 flex flex-col gap-4">
                                    <PointList>
                                        <strong>Q: Apa itu metode ABCDE?</strong>  Metode standardisasi klinis internasional untuk memeriksa karakteristik lesi kulit berdasarkan Asimetri, Pinggiran, Warna, Diameter, dan Perkembangannya.
                                    </PointList>
                                    <PointList>
                                        <strong>Q: Apakah aplikasi ini bisa menggantikan dokter spesialis?</strong> Tidak. MelanoLens dirancang sebagai alat penapisan awal (early screening) dan asisten medis objektif, bukan alat diagnosis mutlak pengganti dokter spesialis kulit.
                                    </PointList>
                                    <PointList>
                                        <strong>Q: Seberapa akurat analisis parameter medis ini?</strong> Sistem mengekstrak karakteristik fisik lesi jaringan secara kuantitatif berdasarkan bobot fitur citra dermoskopi yang diunggah pengguna.
                                    </PointList>
                                </div>
                            </div>
                            <div className="relative flex justify-center">
                                <motion.div
                                    className="p-2 border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-700 rounded-[32px] max-w-[300px] lg:absolute lg:top-[0px]"
                                    whileHover={{ y: -20 }}
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-20 w-full  via-gray-100 to-gray-100 dark:via-zinc-800/70 dark:to-gray-800 scale-[1.1] pointer-events-none" />
                                    <div className="bg-white dark:bg-black dark:border-gray-700 border border-gray-200 rounded-[24px] max-h-[550px]">
                                        <img
                                            src="/img/landing/faq/melanoma.png"
                                            alt="Melanoma example"
                                            className="rounded-[24px]"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </div>
    )
}

export default Faq
