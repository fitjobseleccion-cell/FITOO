import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';

import ScrollToTop from './components/ScrollToTop.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { CookieConsentProvider } from './contexts/CookieConsentContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PageLoader from './components/PageLoader.jsx';
import SEO from './components/SEO.jsx';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import CookieBanner from './components/CookieBanner.jsx';
import CookiePreferencesModal from './components/CookiePreferencesModal.jsx';
import FitoChat from './components/FitoChat.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage.jsx'));
const CheckoutErrorPage = lazy(() => import('./pages/CheckoutErrorPage.jsx'));

const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage.jsx'));
const AvisoLegalPage = lazy(() => import('./pages/AvisoLegalPage.jsx'));
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'));

const OfertasPage = lazy(() => import('./pages/OfertasPage.jsx'));
const OfertaDetalle = lazy(() => import('./pages/OfertaDetalle.jsx'));
const InscripcionOferta = lazy(() => import('./pages/InscripcionOferta.jsx'));

const CrearOfertaPage = lazy(() => import('./pages/CrearOfertaPage.jsx'));
const OfertasPublicasPage = lazy(() => import('./pages/OfertasPublicasPage.jsx'));
const OfertaDetallePublica = lazy(() => import('./pages/OfertaDetallePublica.jsx'));
const InscripcionOfertaPublica = lazy(() => import('./pages/InscripcionOfertaPublica.jsx'));
const PanelEmpresa = lazy(() => import('./pages/PanelEmpresa.jsx'));
const PlanesEmpresa = lazy(() => import('./pages/PlanesEmpresa.jsx'));
const CandidatosPanel = lazy(() => import('./pages/CandidatosPanel.jsx'));

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const PanelCandidato = lazy(() => import('./pages/PanelCandidato.jsx'));
const CandidateDashboard = lazy(() => import('./components/CandidateDashboard.jsx'));

const ReviewsPage = lazy(() => import('./pages/ReviewsPage.jsx'));
const ReviewFormPage = lazy(() => import('./pages/ReviewFormPage.jsx'));

const CVGeneratorPage = lazy(() => import('./pages/CVGeneratorPage.jsx'));

const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminJobsPage = lazy(() => import('./pages/admin/AdminJobsPage.jsx'));
const JobFormPage = lazy(() => import('./pages/admin/JobFormPage.jsx'));
const JobPreviewModal = lazy(() => import('./components/admin/JobPreviewModal.jsx'));
const AdminCandidatesPage = lazy(() => import('./pages/admin/AdminCandidatesPage.jsx'));
const AdminApplicationsPage = lazy(() => import('./pages/admin/AdminApplicationsPage.jsx'));
const AdminQuestionsPage = lazy(() => import('./pages/admin/AdminQuestionsPage.jsx'));
const AdminStatsPage = lazy(() => import('./pages/admin/AdminStatsPage.jsx'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage.jsx'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage.jsx'));

const AuthRedirect = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/reviews" replace />;
  return children;
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.indexOf('/admin') === 0;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </div>
  );
};

export default function App() {
  useEffect(() => {
    console.log('App mounted, registering core routes...');
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <CookieConsentProvider>
          <AuthProvider>
            <Router>
              <ScrollToTop />
              <SEO />
              
              <Routes>
                <Route path="/admin" element={
                  <ProtectedAdminRoute>
                    <Suspense fallback={<PageLoader />}>
                      <AdminLayout />
                    </Suspense>
                  </ProtectedAdminRoute>
                }>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="ofertas" element={<AdminJobsPage />} />
                  <Route path="ofertas/nueva" element={<JobFormPage />} />
                  <Route path="ofertas/:id/editar" element={<JobFormPage />} />
                  <Route path="ofertas/:id/vista-previa" element={<JobPreviewModal />} />
                  <Route path="candidatos" element={<AdminCandidatesPage />} />
                  <Route path="candidaturas" element={<AdminApplicationsPage />} />
                  <Route path="preguntas" element={<AdminQuestionsPage />} />
                  <Route path="estadisticas" element={<AdminStatsPage />} />
                  <Route path="configuracion" element={<AdminSettingsPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                </Route>

                <Route path="*" element={
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/servicios" element={<Navigate to="/#servicios" replace />} />
                      
                      {/* Subscription & Checkout Routes */}
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
                      <Route path="/checkout-error" element={<CheckoutErrorPage />} />
                      
                      <Route path="/ofertas-de-trabajo" element={<OfertasPage />} />
                      <Route path="/ofertas-publicas" element={<OfertasPublicasPage />} />
                      
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                      <Route path="/aviso-legal" element={<AvisoLegalPage />} />
                      <Route path="/terminos" element={<TermsPage />} />

                      <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
                      <Route path="/signup" element={<AuthRedirect><SignupPage /></AuthRedirect>} />

                      <Route path="/ofertas" element={<Navigate to="/ofertas-de-trabajo" replace />} />
                      <Route path="/ofertas-de-trabajo/:id" element={<OfertaDetalle />} />
                      <Route path="/ofertas-de-trabajo/:id/inscribirse" element={<InscripcionOferta />} />
                      
                      <Route path="/crear-oferta" element={
                        <ProtectedRoute>
                          <CrearOfertaPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/ofertas-publicas/:id" element={<OfertaDetallePublica />} />
                      <Route path="/ofertas-publicas/:id/inscribirse" element={<InscripcionOfertaPublica />} />
                      
                      <Route path="/panel-empresa" element={
                        <ProtectedRoute>
                          <PanelEmpresa />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/panel-empresa/ofertas/:id/candidatos" element={
                        <ProtectedRoute>
                          <CandidatosPanel />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/planes-empresa" element={
                        <ProtectedRoute>
                          <PlanesEmpresa />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/reviews" element={<ReviewsPage />} />
                      <Route path="/reviews/new" element={
                        <ProtectedRoute>
                          <ReviewFormPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/reviews/edit/:id" element={
                        <ProtectedRoute>
                          <ReviewFormPage />
                        </ProtectedRoute>
                      } />

                      <Route path="/cv-generator" element={<CVGeneratorPage />} />
                      
                      <Route path="/candidato/mis-candidaturas" element={
                        <ProtectedRoute>
                          <PanelCandidato />
                        </ProtectedRoute>
                      } />

                      <Route path="/mi-area-profesional" element={
                        <ProtectedRoute>
                          <CandidateDashboard />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="*" element={
                        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-20">
                          <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
                          <p className="text-muted-foreground mb-8">Lo sentimos, la página que buscas no existe.</p>
                          <a href="/" className="text-primary hover:underline font-medium">Volver al inicio</a>
                        </div>
                      } />
                    </Routes>
                  </MainLayout>
                } />
              </Routes>
              
              <FitoChat />
              <CookieBanner />
              <CookiePreferencesModal />
              <Toaster position="top-right" toastOptions={{ duration: 4000, className: 'font-sans' }} />
            </Router>
          </AuthProvider>
        </CookieConsentProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}