import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { ApplicationErrorPage } from '../components/feedback/ApplicationErrorPage';
import { NotFoundPage } from '../components/feedback/NotFoundPage';
import { PageLoader } from '../components/ui/Loader';
import { ProtectedRoute } from '../features/admin/components/ProtectedRoute';

// Lazy-loaded Public Pages
const HomePage = lazy(() => import('../features/home/pages/HomePage'));
const AboutPage = lazy(() => import('../features/school/pages/AboutPage'));
const SchoolPage = lazy(() => import('../features/school/pages/SchoolPage'));
const TimesDigitalPage = lazy(() => import('../features/school/pages/TimesDigitalPage'));
const ContactPage = lazy(() => import('../features/school/pages/ContactPage'));
const CoursesPage = lazy(() => import('../features/courses/pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('../features/courses/pages/CourseDetailPage'));
const BatchesPage = lazy(() => import('../features/batches/pages/BatchesPage'));
const BatchDetailPage = lazy(() => import('../features/batches/pages/BatchDetailPage'));
const FacultyPage = lazy(() => import('../features/faculty/pages/FacultyPage'));
const FacultyDetailPage = lazy(() => import('../features/faculty/pages/FacultyDetailPage'));
const ResultsPage = lazy(() => import('../features/results/pages/ResultsPage'));
const GalleryPage = lazy(() => import('../features/gallery/pages/GalleryPage'));
const GalleryDetailPage = lazy(() => import('../features/gallery/pages/GalleryDetailPage'));
const VideosPage = lazy(() => import('../features/videos/pages/VideosPage'));
const EventsPage = lazy(() => import('../features/events/pages/EventsPage'));
const EventDetailPage = lazy(() => import('../features/events/pages/EventDetailPage'));
const FacilitiesPage = lazy(() => import('../features/facilities/pages/FacilitiesPage'));
const FacilityDetailPage = lazy(() => import('../features/facilities/pages/FacilityDetailPage'));
const TestimonialsPage = lazy(() => import('../features/testimonials/pages/TestimonialsPage'));
const AnnouncementsPage = lazy(() => import('../features/announcements/pages/AnnouncementsPage'));
const AdmissionsPage = lazy(() => import('../features/admissions/pages/AdmissionsPage'));

// Lazy-loaded Admin CMS & Auth Pages
const AdminLoginPage = lazy(() => import('../features/admin/pages/AdminLoginPage'));
const AdminChangePasswordPage = lazy(() => import('../features/admin/pages/AdminChangePasswordPage'));
const AdminLayout = lazy(() => import('../features/admin/components/AdminLayout'));
const AdminDashboardPage = lazy(() => import('../features/admin/pages/AdminDashboardPage'));
const WebsiteSettingsAdminPage = lazy(() => import('../features/admin/pages/WebsiteSettingsAdminPage'));
const HomepageAdminPage = lazy(() => import('../features/admin/pages/HomepageAdminPage'));
const CoursesAdminPage = lazy(() => import('../features/admin/pages/CoursesAdminPage'));
const BatchesAdminPage = lazy(() => import('../features/admin/pages/BatchesAdminPage'));
const FacultyAdminPage = lazy(() => import('../features/admin/pages/FacultyAdminPage'));
const ResultsAdminPage = lazy(() => import('../features/admin/pages/ResultsAdminPage'));
const GalleryAdminPage = lazy(() => import('../features/admin/pages/GalleryAdminPage'));
const VideosAdminPage = lazy(() => import('../features/admin/pages/VideosAdminPage'));
const AnnouncementsAdminPage = lazy(() => import('../features/admin/pages/AnnouncementsAdminPage'));
const EventsAdminPage = lazy(() => import('../features/admin/pages/EventsAdminPage'));
const FacilitiesAdminPage = lazy(() => import('../features/admin/pages/FacilitiesAdminPage'));
const TestimonialsAdminPage = lazy(() => import('../features/admin/pages/TestimonialsAdminPage'));
const AdmissionsAdminPage = lazy(() => import('../features/admin/pages/AdmissionsAdminPage'));
const EnquiriesAdminPage = lazy(() => import('../features/admin/pages/EnquiriesAdminPage'));
const AdminUsersPage = lazy(() => import('../features/admin/pages/AdminUsersPage'));

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Public Website Routes
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ApplicationErrorPage />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'about', element: withSuspense(AboutPage) },
      { path: 'school', element: withSuspense(SchoolPage) },
      { path: 'times-digital', element: withSuspense(TimesDigitalPage) },
      { path: 'courses', element: withSuspense(CoursesPage) },
      { path: 'courses/:slug', element: withSuspense(CourseDetailPage) },
      { path: 'batches', element: withSuspense(BatchesPage) },
      { path: 'batches/:slug', element: withSuspense(BatchDetailPage) },
      { path: 'faculty', element: withSuspense(FacultyPage) },
      { path: 'faculty/:slug', element: withSuspense(FacultyDetailPage) },
      { path: 'results', element: withSuspense(ResultsPage) },
      { path: 'gallery', element: withSuspense(GalleryPage) },
      { path: 'gallery/:slug', element: withSuspense(GalleryDetailPage) },
      { path: 'videos', element: withSuspense(VideosPage) },
      { path: 'events', element: withSuspense(EventsPage) },
      { path: 'events/:slug', element: withSuspense(EventDetailPage) },
      { path: 'facilities', element: withSuspense(FacilitiesPage) },
      { path: 'facilities/:slug', element: withSuspense(FacilityDetailPage) },
      { path: 'testimonials', element: withSuspense(TestimonialsPage) },
      { path: 'announcements', element: withSuspense(AnnouncementsPage) },
      { path: 'admissions', element: withSuspense(AdmissionsPage) },
      { path: 'contact', element: withSuspense(ContactPage) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Admin Auth Free Pages
  {
    path: '/admin/login',
    element: withSuspense(AdminLoginPage),
    errorElement: <ApplicationErrorPage />,
  },

  // Protected Admin CMS Console
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        {withSuspense(AdminLayout)}
      </ProtectedRoute>
    ),
    errorElement: <ApplicationErrorPage />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(AdminDashboardPage) },
      { path: 'website-settings', element: withSuspense(WebsiteSettingsAdminPage) },
      { path: 'homepage', element: withSuspense(HomepageAdminPage) },
      { path: 'courses', element: withSuspense(CoursesAdminPage) },
      { path: 'batches', element: withSuspense(BatchesAdminPage) },
      { path: 'faculty', element: withSuspense(FacultyAdminPage) },
      { path: 'results', element: withSuspense(ResultsAdminPage) },
      { path: 'gallery', element: withSuspense(GalleryAdminPage) },
      { path: 'videos', element: withSuspense(VideosAdminPage) },
      { path: 'announcements', element: withSuspense(AnnouncementsAdminPage) },
      { path: 'events', element: withSuspense(EventsAdminPage) },
      { path: 'facilities', element: withSuspense(FacilitiesAdminPage) },
      { path: 'testimonials', element: withSuspense(TestimonialsAdminPage) },
      { path: 'admissions', element: withSuspense(AdmissionsAdminPage) },
      { path: 'enquiries', element: withSuspense(EnquiriesAdminPage) },
      {
        path: 'users',
        element: (
          <ProtectedRoute requireSuperAdmin>
            {withSuspense(AdminUsersPage)}
          </ProtectedRoute>
        ),
      },
      { path: 'change-password', element: withSuspense(AdminChangePasswordPage) },
    ],
  },
]);

export default router;
