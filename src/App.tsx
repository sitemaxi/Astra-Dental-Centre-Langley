import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import NotFoundPage from "./pages/NotFoundPage";
import ServicesHubPage from "./pages/services/ServicesHubPage";
import ServiceCategoryPage from "./pages/services/ServiceCategoryPage";
import ServiceDetailPage from "./pages/services/ServiceDetailPage";
import LocationPage from "./pages/LocationPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminBlogPage from "./pages/AdminBlogPage";
import AdminBlogEditorPage from "./pages/AdminBlogEditorPage";
import AdminAISettingsPage from "./pages/AdminAISettingsPage";
import AdminLocationsPage from "./pages/AdminLocationsPage";
import AdminServiceImagesPage from "./pages/AdminServiceImagesPage";
import AdminPatientFormsPage from "./pages/AdminPatientFormsPage";
import AdminDownloadImagesPage from "./pages/AdminDownloadImagesPage";
import NewPatientFormPage from "./pages/NewPatientFormPage";
import DentalImplantsPage from "./pages/services/DentalImplantsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ThankYouPage from "./pages/ThankYouPage";
import AdminAccessLogPage from "./pages/AdminAccessLogPage";
import AdminGuard from "./components/admin/AdminGuard";
import { locations } from "./data/locations";


const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <AdminGuard />,
    children: [
      { index: true, element: <Navigate to="/admin/blog" replace /> },
      { path: "blog", element: <AdminBlogPage /> },
      { path: "blog/new", element: <AdminBlogEditorPage /> },
      { path: "blog/edit/:id", element: <AdminBlogEditorPage /> },
      { path: "ai-settings", element: <AdminAISettingsPage /> },
      { path: "locations", element: <AdminLocationsPage /> },
      { path: "service-images", element: <AdminServiceImagesPage /> },
      { path: "patient-forms", element: <AdminPatientFormsPage /> },
      { path: "download-images", element: <AdminDownloadImagesPage /> },
      { path: "access-log", element: <AdminAccessLogPage /> },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about-the-dentist/", element: <AboutPage /> },
      { path: "contact-us/", element: <ContactPage /> },
      { path: "blog/", element: <BlogPage /> },
      { path: "blog/:slug", element: <BlogPostPage /> },
      { path: "patient-info/new-patient-form/", element: <NewPatientFormPage /> },
      { path: "terms-and-conditions/", element: <TermsPage /> },
      { path: "privacy-policy/", element: <PrivacyPage /> },
      { path: "thankyou/", element: <ThankYouPage /> },
      { path: "langley-dental-services/", element: <ServicesHubPage /> },
      { path: "langley-dental-services/dental-implants-langley/", element: <DentalImplantsPage /> },
      {
        path: "langley-dental-services/:categorySlug/",
        element: <ServiceCategoryPage />,
      },
      {
        path: ":categorySlug/:serviceSlug/",
        element: <ServiceDetailPage />,
      },
      ...locations.map(({ slug }) => ({
        path: `${slug}/`,
        element: <LocationPage key={slug} locationSlug={slug} />,
      })),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
