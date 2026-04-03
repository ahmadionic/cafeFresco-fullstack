// assets
// import { IconKey } from '@tabler/icons-react';
import { IconCategory } from '@tabler/icons-react';


// constant
const icons = {
  IconCategory
};

// ==============================|| CATEGORIES MANAGEMENT MENU ITEMS ||============================== //

const categoriesManagement = {
  id: 'categories-management',
  title: 'Manage Categories',
  caption: '',
  icon: icons.IconCategory,
  type: 'group',
  children: [
    {
      id: 'categories',
      title: 'Categories',
      type: 'collapse',
      icon: icons.IconCategory,
      children: [

        {
          id: 'add-category',
          title: 'Add Category',
          type: 'item',
          url: '/admin/add-category',
        },
        {
          id: 'all-categories',
          title: 'All Categories',
          type: 'item',
          url: '/admin/all-category',
        }
      ]
    }
  ]
};

export default categoriesManagement;
