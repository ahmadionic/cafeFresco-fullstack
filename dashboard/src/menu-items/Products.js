
// import { IconKey } from '@tabler/icons-react';
import { IconBuildingStore } from '@tabler/icons-react';

// constant
const icons = {
    IconBuildingStore
};

// ==============================|| PRODUCT MANAGEMENT MENU ITEMS ||============================== //

const productManagement = {
    id: 'product-management',
    title: 'Manage Products',
    caption: '',
    icon: icons.IconBuildingStore,
    type: 'group',
    children: [
        {
            id: 'products',
            title: 'Products',
            type: 'collapse',
            icon: icons.IconBuildingStore,
            children: [
                {
                    id: 'add-product',
                    title: 'Add Product',
                    type: 'item',
                    url: '/admin/add-product',

                },
                {
                    id: 'all-products',
                    title: 'All Products',
                    type: 'item',
                    url: '/admin/all-product',

                }
            ]
        }
    ]
};

export default productManagement;
