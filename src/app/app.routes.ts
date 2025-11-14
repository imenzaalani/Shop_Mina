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
import { Collections } from './components/collections/collections';

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
  { path: '', component: Home},
  { path: 'products', component: Products },
  { path: 'product-details/:productName', component: ProductDetails },
  { path: 'wishlist', component: Wishlist },
  { path: 'cart', component: ShoppingCart },
  { path: 'checkouts', component: Checkouts },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'collections', component: Collections },

  // Admin routes
  { path: 'admin/dashboard', component: Dashboard },
  { path: 'admin/products/add', component: AddProduct },
  { path: 'admin/products/all', component: GetAllProducts },
  { path: 'admin/orders', component: GetAllOrders },
  { path: 'admin/users', component: GetAllUsers },
  { path: 'admin/coupons', component: CouponManagement },
  
  // Redirects
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' }
];