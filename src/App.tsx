import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import BotoxPage from "./pages/services/BotoxPage";
import DentalImplantsPage from "./pages/services/DentalImplantsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

const locationSlugs = [
  "dentist-langley",
  "dentist-willowbrook-langley",
  "dentist-walnut-grove-langley",
  "dentist-brookswood-langley",
  "dentist-murrayville-langley",
  "dentist-cloverdale-surrey",
  "dentist-white-rock",
  "dentist-north-delta",
  "dentist-aldergrove-langley",
  "dentist-fort-langley",
  "dentist-abbotsford",
  "dentist-maple-ridge",
  "dentist-surrey",
  "dentist-burnaby",
  "dentist-clayton-heights-surrey",
  "dentist-fleetwood-surrey",
  "dentist-guildford-surrey",
  "dentist-south-surrey",
  "dentist-panorama-ridge-surrey",
  "dentist-newton-surrey",
  "dentist-ocean-park-surrey",
  "dentist-ladner",
  "dentist-tsawwassen",
  "dentist-pitt-meadows",
];

const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/blog",
    element: <AdminBlogPage />,
  },
  {
    path: "/admin/blog/new",
    element: <AdminBlogEditorPage />,
  },
  {
    path: "/admin/blog/edit/:id",
    element: <AdminBlogEditorPage />,
  },
  {
    path: "/admin/ai-settings",
    element: <AdminAISettingsPage />,
  },
  {
    path: "/admin/locations",
    element: <AdminLocationsPage />,
  },
  {
    path: "/admin/service-images",
    element: <AdminServiceImagesPage />,
  },
  {
    path: "/admin/patient-forms",
    element: <AdminPatientFormsPage />,
  },
  {
    path: "/admin/download-images",
    element: <AdminDownloadImagesPage />,
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
      { path: "langley-dental-services/", element: <ServicesHubPage /> },
      { path: "langley-dental-services/botox/", element: <BotoxPage /> },
      { path: "langley-dental-services/dental-implants-langley/", element: <DentalImplantsPage /> },
      {
        path: "langley-dental-services/:categorySlug/",
        element: <ServiceCategoryPage />,
      },
      {
        path: ":categorySlug/:serviceSlug/",
        element: <ServiceDetailPage />,
      },
      ...locationSlugs.map((slug) => ({
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
