import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '',
        title: 'Dashboard',
        translateKey: 'nav.dashboard',
        icon: 'home',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'home',
                path: '/dashboards/ecommerce',
                title: 'Beranda',
                translateKey: 'nav.home',
                icon: 'home',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'scan',
        path: '/dashboards/scan',
        title: 'Scan',
        translateKey: 'nav.scan',
        icon: 'scan',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'history',
        path: '/dashboards/history',
        title: 'Riwayat Scan',
        translateKey: 'nav.history',
        icon: 'history',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default navigationConfig
