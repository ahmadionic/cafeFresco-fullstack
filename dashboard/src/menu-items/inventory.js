import { IconBoxSeam, IconPlus, IconListCheck } from '@tabler/icons-react';

const icons = {
    IconBoxSeam,
    IconPlus,
    IconListCheck
};

// ==============================|| INVENTORY MANAGEMENT MENU ITEMS ||============================== //

const inventory = {
    id: 'inventory-management',
    title: 'Inventory Management',
    caption: '',
    icon: icons.IconBoxSeam,
    type: 'group',
    children: [
        {
            id: 'inventory-section',
            title: 'Inventory',
            type: 'collapse',
            icon: icons.IconBoxSeam,
            children: [

                {
                    id: 'all-inventory',
                    title: 'All Inventory',
                    type: 'item',
                    icon: icons.IconListCheck,
                    url: '/admin/all-inventory'
                }
            ]
        }
    ]
};

export default inventory;
