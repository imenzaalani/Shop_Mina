import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetails } from './pages/product-details/product-details';
import { Wishlist } from './pages/wishlist/wishlist';
import { ShoppingCart } from './pages/shopping-cart/shopping-cart';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Checkouts } from './pages/checkouts/checkouts';

// Admin Components
import { Dashboard } from './pages/dashboard/dashboard';
import { AddProduct } from './components/add-product/add-product';
import { GetAllProducts } from './components/get-all-products/get-all-products';
import { GetAllUsers } from './components/get-all-users/get-all-users';
import { GetAllOrders } from './components/get-all-orders/get-all-orders';
import { CouponManagement } from './components/coupon-management/coupon-management';

// // Layouts
// import { MainLayout } from './layouts/main-layout/main-layout';
// import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';

// // Guards
// import { AuthGuard } from './guards/auth.guard';
// import { AdminGuard } from './guards/admin.guard';

// // Error Pages
// import { PageNotFound } from './pages/errors/page-not-found/page-not-found';
// import { Unauthorized } from './pages/errors/unauthorized/unauthorized';

export const routes: Routes = [
  {
    path: '',
    // component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'products', component: Products },
      { path: 'product-details/:productName', component: ProductDetails },
      { path: 'wishlist', component: Wishlist },
      { path: 'cart', component: ShoppingCart },
      { path: 'checkouts', component: Checkouts},
    ]
  },

  // Auth routes (no layout)
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Admin Dashboard
  {
    path: 'admin',
    // component: DashboardLayout,
    // canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'products/add', component: AddProduct },
      { path: 'products/all', component: GetAllProducts },
      { path: 'orders', component: GetAllOrders },
      { path: 'users', component: GetAllUsers },
      { path: 'coupons', component: CouponManagement },
    ]
  },

  // // Error routes
  // { path: 'unauthorized', component: Unauthorized },
  // { path: '404', component: PageNotFound },
  // { path: '**', redirectTo: '404' }
];
