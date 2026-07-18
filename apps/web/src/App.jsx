import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import TestimonialsPage from './pages/TestimonialsPage.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import CaseStudyPage from './pages/CaseStudyPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from './pages/TermsOfServicePage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
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

function App() {
    const [preloaderDone, setPreloaderDone] = useState(false);

    return (
        <>
            {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
            <Router>
                <CustomCursor />
                <ScrollToTop />
                <BookingModal />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/testimonials" element={<TestimonialsPage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/portfolio/:slug" element={<CaseStudyPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    {/* /:category/:slug handles headless WP post URLs */}
                    <Route path="/:category/:slug" element={<BlogPostPage />} />
                    {/* Drafted, not live — see the commented imports above */}
                    {/* <Route path="/experiment" element={<HomeExperiment />} /> */}
                    {/* <Route path="/experiment-2" element={<HomeExperiment2 />} /> */}
                    {/* <Route path="/experiment-3" element={<HomeExperiment3 />} /> */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;