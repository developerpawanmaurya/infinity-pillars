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
// Experiment pages (HomeExperiment/2/3) are drafted, not live — routes below
// are commented out rather than deleted so the work isn't lost, just not
// reachable from navigation. Un-comment to bring one back.
// import HomeExperiment from './pages/HomeExperiment.jsx';
// import HomeExperiment2 from './pages/HomeExperiment2.jsx';
// import HomeExperiment3 from './pages/HomeExperiment3.jsx';
import PlaybookExperiment4 from './pages/PlaybookExperiment4.jsx';
import PlaybookExperiment5 from './pages/PlaybookExperiment5.jsx';
import PlaybookExperiment6 from './pages/PlaybookExperiment6.jsx';
import PlaybookExperiment7 from './pages/PlaybookExperiment7.jsx';
import HomeExperiment4 from './pages/HomeExperiment4.jsx';
import HalvorsenPage from './pages/HalvorsenPage.jsx';
import MeridianPage from './pages/MeridianPage.jsx';
import RadiantPage from './pages/RadiantPage.jsx';
// Throwaway test pages for the image-blur investigation — no static tilt on
// the case-study images, to confirm that's the fix before touching the
// real pages. Delete these imports + routes once confirmed either way.
import HomePageTest from './pages/HomePageTest.jsx';
import PortfolioPageTest from './pages/PortfolioPageTest.jsx';

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
                <Route path="/sample-14" element={<Sample14Page />} />
                <Route path="/sample-15" element={<Sample15Page />} />
                <Route path="/sample-16" element={<Sample16Page />} />
                <Route path="/sample-17" element={<Sample17Page />} />
                <Route path="/archive" element={<ArchivePage />} />
                    {/* /:category handles headless WP category URLs */}
                    <Route path="/:category" element={<BlogPage />} />
                    {/* /:category/:slug handles headless WP post URLs */}
                    <Route path="/:category/:slug" element={<BlogPostPage />} />
                    {/* Drafted, not live — see the commented imports above */}
                    {/* <Route path="/experiment" element={<HomeExperiment />} /> */}
                    {/* <Route path="/experiment-2" element={<HomeExperiment2 />} /> */}
                    {/* <Route path="/experiment-3" element={<HomeExperiment3 />} /> */}
                    <Route path="/experiment-4" element={<PlaybookExperiment4 />} />
                    <Route path="/experiment-5" element={<PlaybookExperiment5 />} />
                    <Route path="/experiment-6" element={<PlaybookExperiment6 />} />
                    <Route path="/experiment-7" element={<PlaybookExperiment7 />} />
                    <Route path="/experiment-8" element={<HomeExperiment4 />} />
                    <Route path="/halvorsen" element={<HalvorsenPage />} />
                    <Route path="/meridian" element={<MeridianPage />} />
                    <Route path="/radiant" element={<RadiantPage />} />
                    {/* Throwaway blur-fix test routes — see the imports above */}
                    <Route path="/home-test" element={<HomePageTest />} />
                    <Route path="/portfolio-test" element={<PortfolioPageTest />} />
                    <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ErrorBoundary>
    );
}

function App() {
    const [preloaderDone, setPreloaderDone] = useState(false);

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