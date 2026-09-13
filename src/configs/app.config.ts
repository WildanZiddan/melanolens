export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    activeNavTranslation: boolean
    backendApiUrl: string
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/dashboards/ecommerce',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'en',
    activeNavTranslation: false,
    backendApiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://melanolens-be-b9hwazeycfayg9ee.indonesiacentral-01.azurewebsites.net',
}

export default appConfig
