import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoutes';
import PageLoader from './components/ui/PageLoader';

// Layouts (eager — small and always present)
import StoreLayout from './layout/StoreLayout';
import AdminLayout from './layout/AdminLayout';

// Pages are code-split so each route loads on demand.
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ServerError = lazy(() => import('./pages/ServerError'));
const Offline = lazy(() => import('./pages/Offline'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Categories = lazy(() => import('./pages/Categories'));
const Subcategories = lazy(() => import('./pages/Subcategories'));
const Products = lazy(() => import('./pages/Products'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const HeroSlides = lazy(() => import('./pages/HeroSlides'));
const PromoBanners = lazy(() => import('./pages/PromoBanners'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <Toast />
              <Suspense fallback={<PageLoader fullScreen />}>
                <Routes>
                  {/* ---------- Storefront (shared header + footer) ---------- */}
                  <Route element={<StoreLayout />}>
                    <Route index element={<Home />} />
                    <Route path="shop" element={<Shop />} />
                    <Route path="product/:id" element={<ProductDetails />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* ---------- Standalone (full-screen) ---------- */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/500" element={<ServerError />} />
                  <Route path="/offline" element={<Offline />} />

                  {/* ---------- Admin (unchanged, protected) ---------- */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="subcategories" element={<Subcategories />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="hero-slides" element={<HeroSlides />} />
                    <Route path="promo-banners" element={<PromoBanners />} />
                  </Route>
                </Routes>
              </Suspense>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
