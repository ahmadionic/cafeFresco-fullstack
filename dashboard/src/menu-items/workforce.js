import { IconBuildingStore, IconUsers, IconTruck, IconHierarchy, IconBuildingWarehouse } from '@tabler/icons-react';

const icons = {
    IconBuildingStore,
    IconUsers,
    IconTruck,
    IconHierarchy,
    IconBuildingWarehouse
};


// ==============================|| ORGANIZATION MANAGEMENT MENU ITEMS ||============================== //

const workforce = {
    id: 'organization-management',
    title: 'Organization Management',
    caption: '',
    icon: icons.IconBuildingStore,
    type: 'group',
    children: [
        {
            id: 'employee-management',
            title: 'Employee',
            type: 'collapse',
            icon: icons.IconUsers,
            children: [
                {
                    id: 'employee-add',
                    title: 'Add Employee',
                    type: 'item',
                    url: '/admin/employee/add',
                },
                {
                    id: 'employee-list',
                    title: 'Employee List',
                    type: 'item',
                    url: '/admin/employees/list',
                }
            ]
        },
        {
            id: 'supplier-management',
            title: 'Supplier',
            type: 'collapse',
            icon: icons.IconTruck,
            children: [
                {
                    id: 'supplier-add',
                    title: 'Add Supplier',
                    type: 'item',
                    url: '/admin/supplier/add',
                },
                {
                    id: 'supplier-list',
                    title: 'Supplier List',
                    type: 'item',
                    url: '/admin/suppliers',
                }
            ]
        },
        {
            id: 'department-management',
            title: 'Department',
            type: 'collapse',
            icon: icons.IconHierarchy,
            children: [
                {
                    id: 'department-list',
                    title: 'Department',
                    type: 'item',
                    url: '/admin/departments',
                }
            ]
        },
        {
            id: 'distributor-management',
            title: 'Distributor',
            type: 'collapse',
            icon: icons.IconBuildingWarehouse,
            children: [
                {
                    id: 'distributor-list',
                    title: 'Distributor List',
                    type: 'item',
                    url: '/admin/distributors',
                }
            ]
        }
    ]
};

export default workforce;
