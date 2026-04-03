// assets
// import { IconKey } from '@tabler/icons-react';
import { IconShoppingCart } from '@tabler/icons-react';  // Changed to an order-related icon

// constant
const icons = {
    IconShoppingCart
};

// ==============================|| ORDER MANAGEMENT MENU ITEMS ||============================== //

const orderManagement = {
    id: 'order-management',
    title: 'Manage Orders',
    caption: '',
    icon: icons.IconShoppingCart,
    type: 'group',
    children: [
        {
            id: 'orders',
            title: 'Orders',
            type: 'collapse',
            icon: icons.IconShoppingCart,
            children: [
                {
                    id: 'all-orders',
                    title: 'All Orders',
                    type: 'item',
                    url: '/admin/all-order',
                },

            ]
        }
    ]
};

export default orderManagement;
