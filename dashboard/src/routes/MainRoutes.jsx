import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'ui-component/Loadable';
import AdminRoute from './AdminRoutes';
import MainLayout from 'layout/MainLayout';
import Sample from '../views/Error/Sample';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const AccessDenied = Loadable(lazy(() => import('views/Error/AccessDenied')));
const AddProduct = Loadable(lazy(() => import('views/pages/product/addProduct')));
const AllProduct = Loadable(lazy(() => import('views/pages/product/allProduct')));
const EditProduct = Loadable(lazy(() => import('views/pages/product/editProduct')));
const AllCategory = Loadable(lazy(() => import('views/pages/category/allCategory')));
const AllOrder = Loadable(lazy(() => import('views/pages/order/allOrder')));
const AllPermission = Loadable(lazy(() => import('views/pages/permission/allPermission')));
const AllUser = Loadable(lazy(() => import('views/pages/user/allUser')));
const AddCategory = Loadable(lazy(() => import('views/pages/category/addCategory')));
const EditCategory = Loadable(lazy(() => import('views/pages/category/EditCategory')));
const AllDiscount = Loadable(lazy(() => import('views/pages/discountCode/discount.jsx')));
const Departments = Loadable(lazy(() => import('views/pages/department/department.jsx')));
const Distributor = Loadable(lazy(() => import('views/pages/distributor/distributor.jsx')));
const AddEmployee = Loadable(lazy(() => import('views/pages/employee/addEmployee.jsx')));
const AllEmployee = Loadable(lazy(() => import('views/pages/employee/allEmployee.jsx')));
const EditEmployee = Loadable(lazy(() => import('views/pages/employee/editEmployee.jsx')));
const AddSupplier = Loadable(lazy(() => import('views/pages/supplier/addSupplier.jsx')));
const AllSupplier = Loadable(lazy(() => import('views/pages/supplier/allSupplier.jsx')));
const EditSupplier = Loadable(lazy(() => import('views/pages/supplier/editSupplier.jsx')));
const Inventory = Loadable(lazy(() => import('views/pages/inventory/inventory.jsx')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      index: true,
      element: <Navigate to="/admin" />
    },
    {
      index: true, // Auto-loads `Sample` when `/` is visited
      element: <Sample />
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },



    // 🔒 Admin routes with MainLayout
    {
      path: 'admin',
      element: <AdminRoute />,
      children: [
        {
          path: '',
          element: <MainLayout />,
          children: [
            {
              index: true, // Redirect `/admin` to `/admin/dashboard`
              element: <Navigate to="dashboard" />
            },
            {
              path: 'dashboard',
              element: <DashboardDefault />
            },
            {
              path: 'all-category',
              element: <AllCategory />
            },
            {
              path: 'access-denied',
              element: <AccessDenied />
            },
            {
              path: 'add-product',
              element: <AddProduct />
            },
            {
              path: 'all-product',
              element: <AllProduct />
            },
            {
              path: 'edit-product/:id',
              element: <EditProduct />
            },
            {
              path: 'all-order',
              element: <AllOrder />
            },
            {
              path: 'all-permission',
              element: <AllPermission />
            },
            {
              path: 'all-user',
              element: <AllUser />
            },
            {
              path: 'add-category',
              element: <AddCategory />
            },
            {
              path: 'edit-category/:id',
              element: <EditCategory />
            },
            {
              path: 'discount-code',
              element: <AllDiscount />
            },
            {
              path: 'departments',
              element: <Departments />
            },
            {
              path: 'distributors',
              element: <Distributor />
            },
            {
              path: 'employee/add',
              element: <AddEmployee />
            },
            {
              path: 'employees/list',
              element: <AllEmployee />
            },
            {
              path: 'supplier/add',
              element: <AddSupplier />
            },
            {
              path: 'suppliers/',
              element: <AllSupplier />
            },
            {
              path: 'edit-supplier/:id',
              element: <EditSupplier />
            },
            {
              path: 'edit-supplier/:id',
              element: <EditSupplier />
            },
            {
              path: 'edit-employee/:id',
              element: <EditEmployee />
            },
            {
              path: 'all-inventory',
              element: <Inventory />
            },

          ]
        }
      ]
    }


  ]
};

export default MainRoutes;
