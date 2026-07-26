import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import TestimonialsPage from './pages/TestimonialsPage.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import CareersPage from './pages/CareersPage.jsx';
import ReferralPage from './pages/ReferralPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CaseStudyPage from './pages/CaseStudyPage.jsx';
import DeQollabCaseStudy from './pages/case-studies/DeQollabCaseStudy.jsx';
import KissCaseStudy from './pages/case-studies/KissCaseStudy.jsx';
import XpertPatientCaseStudy from './pages/case-studies/XpertPatientCaseStudy.jsx';
import DriftCaseStudy from './pages/case-studies/DriftCaseStudy.jsx';
import PolyAgentCaseStudy from './pages/case-studies/PolyAgentCaseStudy.jsx';
import NexusCaseStudy from './pages/case-studies/NexusCaseStudy.jsx';
import MarisolFerreiraCaseStudy from './pages/case-studies/MarisolFerreiraCaseStudy.jsx';
import MeridianCaseStudy from './pages/case-studies/MeridianCaseStudy.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from './pages/TermsOfServicePage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import CatalogSamplePage from './pages/CatalogSamplePage.jsx';
import Sample2Page from './pages/Sample2Page.jsx';
import Sample3Page from './pages/Sample3Page.jsx';
import Sample4Page from './pages/Sample4Page.jsx';
import Sample5Page from './pages/Sample5Page.jsx';
import Sample6Page from './pages/Sample6Page.jsx';
import Sample7Page from './pages/Sample7Page.jsx';
import Sample8Page from './pages/Sample8Page.jsx';
import Sample9Page from './pages/Sample9Page.jsx';
import Sample10Page from './pages/Sample10Page.jsx';
import Sample11Page from './pages/Sample11Page.jsx';
import Sample12Page from './pages/Sample12Page.jsx';
import Sample13Page from './pages/Sample13Page.jsx';
import Sample14Page from './pages/Sample14Page.jsx';
import Sample15Page from './pages/Sample15Page.jsx';
import Sample16Page from './pages/Sample16Page.jsx';
import Sample17Page from './pages/Sample17Page.jsx';
import ArchivePage from './pages/ArchivePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import BookingModal from './components/BookingModal.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Preloader from './components/Preloader.jsx';
import PlaybookExperiment8 from './pages/PlaybookExperiment8.jsx';
import HalvorsenPage from './pages/HalvorsenPage.jsx';
import RadiantPage from './pages/RadiantPage.jsx';
import CyborgPage from './pages/CyborgPage.jsx';
import ApartmentPage from './pages/ApartmentPage.jsx';
import MeridianCopyPage from './pages/MeridianCopyPage.jsx';
// Throwaway test pages for the image-blur investigation — no static tilt on
// the case-study images, to confirm that's the fix before touching the
// real pages. Delete these imports + routes once confirmed either way.
import HomePageTest from './pages/HomePageTest.jsx';
import PortfolioPageTest from './pages/PortfolioPageTest.jsx';
// Portfolio-section redesign comparison builds — GSAP/Framer Motion/Lenis
// variants to compare side by side before picking one for the real
// /portfolio page. Delete these imports + routes once a variant ships.
import PortfolioPreviewIndexPage from './pages/PortfolioPreviewIndexPage.jsx';
import PortfolioPreviewGridPage from './pages/PortfolioPreviewGridPage.jsx';
import PortfolioPreviewSlideshowPage from './pages/PortfolioPreviewSlideshowPage.jsx';
import PortfolioPreviewCardsPage from './pages/PortfolioPreviewCardsPage.jsx';
import PortfolioPreviewSidebarPage from './pages/PortfolioPreviewSidebarPage.jsx';

// Resets the error boundary on every navigation — otherwise once a route
// crashes, the fallback stays stuck even after the user clicks elsewhere.
function RoutedContent() {
    const location = useLocation();
    return (
        <ErrorBoundary key={location.pathname}>
            <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/testimonials" element={<TestimonialsPage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/portfolio/deqollab" element={<DeQollabCaseStudy />} />
                    <Route path="/portfolio/kiss-professional-solutions" element={<KissCaseStudy />} />
                    <Route path="/portfolio/xpertpatient" element={<XpertPatientCaseStudy />} />
                    <Route path="/portfolio/drift-app" element={<DriftCaseStudy />} />
                    <Route path="/portfolio/polyagent" element={<PolyAgentCaseStudy />} />
                    <Route path="/portfolio/nexus" element={<NexusCaseStudy />} />
                    <Route path="/portfolio/marisol-ferreira" element={<MarisolFerreiraCaseStudy />} />
                    <Route path="/portfolio/meridian" element={<MeridianCaseStudy />} />
                    <Route path="/portfolio/:slug" element={<CaseStudyPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/referral" element={<ReferralPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/sample" element={<CatalogSamplePage />} />
                    <Route path="/sample-2" element={<Sample2Page />} />
                    <Route path="/sample-3" element={<Sample3Page />} />
                    <Route path="/sample-4" element={<Sample4Page />} />
                    <Route path="/sample-5" element={<Sample5Page />} />
                    <Route path="/sample-6" element={<Sample6Page />} />
                    <Route path="/sample-7" element={<Sample7Page />} />
                    <Route path="/sample-8" element={<Sample8Page />} />
                    <Route path="/sample-9" element={<Sample9Page />} />
                    <Route path="/sample-10" element={<Sample10Page />} />
                    <Route path="/sample-11" element={<Sample11Page />} />
                <Route path="/sample-12" element={<Sample12Page />} />
                <Route path="/sample-13" element={<Sample13Page />} />
                <Route path="/marisol-ferreira" element={<Sample14Page />} />
                <Route path="/sample-15" element={<Sample15Page />} />
                <Route path="/sample-16" element={<Sample16Page />} />
                <Route path="/sample-17" element={<Sample17Page />} />
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/experiment-8" element={<PlaybookExperiment8 />} />
                    {/* /:category handles headless WP category URLs */}
                    <Route path="/:category" element={<BlogPage />} />
                    {/* /:category/:slug handles headless WP post URLs */}
                    <Route path="/:category/:slug" element={<BlogPostPage />} />
                    <Route path="/halvorsen" element={<HalvorsenPage />} />
                    <Route path="/meridian" element={<MeridianCopyPage />} />
                    <Route path="/radiant" element={<RadiantPage />} />
                    <Route path="/cyborg" element={<CyborgPage />} />
                    <Route path="/apartment" element={<ApartmentPage />} />
                    {/* Throwaway blur-fix test routes — see the imports above */}
                    <Route path="/home-test" element={<HomePageTest />} />
                    <Route path="/portfolio-test" element={<PortfolioPageTest />} />
                    <Route path="/portfolio-preview-index" element={<PortfolioPreviewIndexPage />} />
                    <Route path="/portfolio-preview-grid" element={<PortfolioPreviewGridPage />} />
                    <Route path="/portfolio-preview-slideshow" element={<PortfolioPreviewSlideshowPage />} />
                    <Route path="/portfolio-preview-cards" element={<PortfolioPreviewCardsPage />} />
                    <Route path="/portfolio-preview-sidebar" element={<PortfolioPreviewSidebarPage />} />
                    <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ErrorBoundary>
    );
}

// Marisol Ferreira and Meridian are their own fictional-site experiences,
// each with its own intro/entrance treatment — the Infinity Pillars boot
// preloader doesn't belong in front of them. Checked once at mount via
// window.location (App renders outside <Router>, so useLocation isn't
// available here) so a fresh load/refresh on either route skips straight
// past it; internal navigation there doesn't re-trigger it anyway since
// preloaderDone only matters once, on initial load.
const PRELOADER_SKIP_PATHS = ['/marisol-ferreira', '/meridian'];

function App() {
    const [preloaderDone, setPreloaderDone] = useState(() => PRELOADER_SKIP_PATHS.includes(window.location.pathname));

    return (
        <>
            {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
            <Router>
                <CustomCursor />
                <ScrollToTop />
                <BookingModal />
                <RoutedContent />
            </Router>
        </>
    );
}

export default App;