import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { StyleProvider } from './contexts/StyleContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import TutorialsPage from './pages/TutorialsPage';
import TutorialDetailPage from './pages/TutorialDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import TestLogin from './pages/TestLogin';
import DebugAuth from './pages/DebugAuth';
import NotFoundPage from './pages/NotFoundPage';
import FloatingBoatAI from './components/FloatingBoatAI/FloatingBoatAI';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ThemeProvider>
      <StyleProvider>
        <AuthProvider>
          <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 transition-all duration-500">
            <Navbar />
            <main className="flex-1">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tutorials" element={<TutorialsPage />} />
                  <Route path="/tutorial/:slug" element={<TutorialDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  <Route path="/test-login" element={<TestLogin />} />
                  <Route path="/debug-auth" element={<DebugAuth />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <Footer />

            {/* Floating Boat AI - Available on all pages */}
            <FloatingBoatAI />
          </div>
          </Router>
        </AuthProvider>
      </StyleProvider>
    </ThemeProvider>
  );
}

export default App;
