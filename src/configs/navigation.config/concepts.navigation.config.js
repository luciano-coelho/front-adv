import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'

import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'

import { ADMIN, USER } from '@/constants/roles.constant'

const conceptsNavigationConfig = [
    {
        key: 'concepts.projects',
        path: '',
        title: 'Processos',
        translateKey: 'nav.conceptsProjects.projects',
        icon: 'analytic',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        meta: {
            description: {
                translateKey: 'nav.conceptsProjects.projectsDesc',
                label: 'Gerenciar projetos jurídicos',
            },
        },
        subMenu: [
            {
                key: 'concepts.projects.scrumBoard',
                path: `${CONCEPTS_PREFIX_PATH}/projects/scrum-board`,
                title: 'Scrum Board',
                translateKey: 'nav.conceptsProjects.scrumBoard',
                icon: 'projectScrumBoard',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsProjects.scrumBoardDesc',
                        label: 'Manage your scrum workflow',
                    },
                },
                subMenu: [],
            },
            {
                key: 'concepts.projects.projectList',
                path: `${CONCEPTS_PREFIX_PATH}/projects/project-list`,
                title: 'Lista de Processos',
                translateKey: 'nav.conceptsProjects.projectList',
                icon: 'projectList',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsProjects.projectListDesc',
                        label: 'Organize all projects',
                    },
                },
                subMenu: [],
            },
        ],
    },
    {
        key: 'concepts.calendar',
        path: `${CONCEPTS_PREFIX_PATH}/calendar`,
        title: 'Calendário',
        translateKey: 'nav.calendar',
        icon: 'calendar',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        meta: {
            description: {
                translateKey: 'nav.calendarDesc',
                label: 'Schedule and events',
            },
        },
        subMenu: [],
    },
    {
        key: 'concepts.customers',
        path: '',
        title: 'Clientes',
        translateKey: 'nav.conceptsCustomers.customers',
        icon: 'customers',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        meta: {
            description: {
                translateKey: 'nav.conceptsCustomers.customersDesc',
                label: 'Customer management',
            },
        },
        subMenu: [
            {
                key: 'concepts.customers.customerList',
                path: `${CONCEPTS_PREFIX_PATH}/customers/customer-list`,
                title: 'Lista de Clientes',
                translateKey: 'nav.conceptsCustomers.customerList',
                icon: 'customerList',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsCustomers.customerListDesc',
                        label: 'List of all customers',
                    },
                },
                subMenu: [],
            },
            {
                key: 'concepts.customers.customerCreate',
                path: `${CONCEPTS_PREFIX_PATH}/customers/customer-create`,
                title: 'Novo Cliente',
                translateKey: 'nav.conceptsCustomers.customerCreate',
                icon: 'customerCreate',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsCustomers.customerCreateDesc',
                        label: 'Add a new customer',
                    },
                },
                subMenu: [],
            },
        ],
    },
    {
        key: 'concepts.account',
        path: '',
        title: 'Conta',
        translateKey: 'nav.conceptsAccount.account',
        icon: 'account',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        meta: {
            description: {
                translateKey: 'nav.conceptsAccount.accountDesc',
                label: 'Account settings and info',
            },
        },
        subMenu: [
            {
                key: 'concepts.account.settings',
                path: `${CONCEPTS_PREFIX_PATH}/account/settings`,
                title: 'Configurações',
                translateKey: 'nav.conceptsAccount.settings',
                icon: 'accountSettings',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsAccount.settingsDesc',
                        label: 'Configure your settings',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default conceptsNavigationConfig
