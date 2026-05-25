// import appConfig from '@/configs/app.config'
// import { redirect } from 'next/navigation'

// const Page = () => {
//     redirect(appConfig.authenticatedEntryPath)
// }

// export default Page

import appConfig from '@/configs/app.config'
import Landing from './(public-pages)/landing/page' // Pastiin path import ini udah bener ya, Dan

const Page = () => {
    // Hapus redirect lama, langsung render komponen landing page lu di sini
    return <Landing />
}

export default Page