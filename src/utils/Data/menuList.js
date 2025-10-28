export const menuList = [
    {
        id: 0,
        name: "dashboards",
        path: "#",
        icon: 'feather-airplay',
        dropdownMenu: [
            // {
            //     id: 1,
            //     name: "crm",
            //     path: "/",
            //     subdropdownMenu: false
            // },
            {
                id: 2,
                name: "analytics",
                path: "/admin/dashboards/analytics",
                subdropdownMenu: false
            }
        ]
    },
    // {
    //     id: 4,
    //     name: "payment",
    //     path: "#",
    //     icon: 'feather-dollar-sign',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "payment",
    //             path: "/admin/payment/list",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "invoiceview",
    //             path: "/admin/payment/view",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "invoicecreate",
    //             path: "/admin/payment/create",
    //             subdropdownMenu: false
    //         }
    //     ]
    // },
    // {
    //     id: 5,
    //     name: "customers",
    //     path: "#",
    //     icon: 'feather-users',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "customers",
    //             path: "/admin/customers/list",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "customersview",
    //             path: "/admin/customers/view",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "customerscreate",
    //             path: "/admin/customers/create",
    //             subdropdownMenu: false
    //         }
    //     ]
    // },
    // {
    //     id: 7,
    //     name: "projects",
    //     path: "#",
    //     icon: 'feather-briefcase',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "projects",
    //             path: "/admin/projects/list",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "projectsview",
    //             path: "/admin/projects/view",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "projectscreate",
    //             path: "/admin/projects/create",
    //             subdropdownMenu: false
    //         }
    //     ]
    // },
    {
        id: 8,
        name: "UserManagement",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: "users",
                path: "/admin/users/list",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 9,
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
                name: "Email",
                path: "/admin/settings/email",
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
    {
        id: 9,
        name: "inverter",
        path: "/admin/inverter",
        icon: 'feather-archive',
        dropdownMenu: false
    },
]
