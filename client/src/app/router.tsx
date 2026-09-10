import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SiteLayout } from '@/layouts/SiteLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { RequireAdmin } from '@/app/guards';

const HomePage = lazy(() => import('@/pages/HomePage'));
const MenuPage = lazy(() => import('@/pages/MenuPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const BurgerExperiencePage = lazy(() => import('@/pages/BurgerExperiencePage'));
const OffersPage = lazy(() => import('@/pages/OffersPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const LegalPage = lazy(() => import('@/pages/LegalPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/ProductsPage'));
const ProductFormPage = lazy(() => import('@/pages/admin/ProductFormPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/CategoriesPage'));
const AdminOffersPage = lazy(() => import('@/pages/admin/OffersPage'));
const AdminReviewsPage = lazy(() => import('@/pages/admin/ReviewsPage'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/menu', element: <MenuPage /> },
      { path: '/menu/p/:slug', element: <ProductPage /> },
      { path: '/menu/:category', element: <MenuPage /> },
      { path: '/menu/:category/:slug', element: <ProductPage /> },
      { path: '/experience', element: <BurgerExperiencePage /> },
      { path: '/offers', element: <OffersPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/legal/:doc', element: <LegalPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'products/new', element: <ProductFormPage /> },
      { path: 'products/:id', element: <ProductFormPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'offers', element: <AdminOffersPage /> },
      { path: 'reviews', element: <AdminReviewsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
]);
