export const menuList = [
    {
        id: 0,
        name: "dashboards",
        path: "/admin/dashboards/analytics",
        icon: 'feather-airplay',
        dropdownMenu: false
    },
    {
        id: 5,
        name: "payments",
        path: "/admin/payments",
        icon: 'feather-credit-card',
        dropdownMenu: false
    },
    {
        id: 1,
        name: "projects",
        path: "#",
        icon: 'feather-briefcase',
        dropdownMenu: [
            {
                id: 1,
                name: "List",
                path: "/admin/projects/list",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Type",
                path: "/admin/projects/type",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 2,
        name: "users",
        path: "/admin/users/list",
        icon: 'feather-users',
        dropdownMenu: false
    },
    {
        id: 3,
        name: "inverter",
        path: "/admin/inverter",
        icon: 'feather-archive',
        dropdownMenu: false
    },
    {
        id: 4,
        name: "settings",
        path: "#",
        icon: 'feather-settings',
        dropdownMenu: [
            {
                id: 1,
                name: "general",
                path: "/admin/settings/ganeral",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "seo",
                path: "/admin/settings/seo",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Roles Management",
                path: "/admin/settings/role",
                subdropdownMenu: false
            },
            // {
            //     id: 4,
            //     name: "Tags",
            //     path: "/admin/settings/tags",
            //     subdropdownMenu: false
            // },
            {
                id: 5,
                name: "SMTP",
                path: "/admin/settings/smtp",
                subdropdownMenu: false
            },
            // {
            //     id: 6,
            //     name: "Tasks",
            //     path: "/admin/settings/tasks",
            //     subdropdownMenu: false
            // },
            // {
            //     id: 7,
            //     name: "Leads",
            //     path: "/admin/settings/leads",
            //     subdropdownMenu: false
            // },
            // {
            //     id: 8,
            //     name: "Support",
            //     path: "/admin/settings/support",
            //     subdropdownMenu: false
            // },
            {
                id: 9,
                name: "Finance",
                path: "/admin/settings/finance",
                subdropdownMenu: false
            },
            {
                id: 10,
                name: "Gateways",
                path: "/admin/settings/gateways",
                subdropdownMenu: false
            },
            {
                id: 11,
                name: "Customers",
                path: "/admin/settings/customers",
                subdropdownMenu: false
            },
            {
                id: 12,
                name: "Localization",
                path: "/admin/settings/localization",
                subdropdownMenu: false
            },
            {
                id: 13,
                name: "reCAPTCHA",
                path: "/admin/settings/recaptcha",
                subdropdownMenu: false
            },
            {
                id: 14,
                name: "Miscellaneous",
                path: "/admin/settings/miscellaneous",
                subdropdownMenu: false
            },
        ]
    },
]
