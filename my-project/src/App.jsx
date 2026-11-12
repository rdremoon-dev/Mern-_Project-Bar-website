import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import MenuCard from './component/Menu_card';
import Home from './page/Home';

const About = lazy(() => import('./page/About'));
const Contact = lazy(() => import('./page/Contact'));
const Menus = lazy(() => import('./page/Menus'));
const EventDetails = lazy(() => import('./component/EventDetails'));
const AllEvents = lazy(() => import('./page/All_Events'));
const BookingForm = lazy(() => import('./model/BookingForm'));
const AdminDashboard = lazy(() => import('./component/AdminDashboard'));
const AdminLogin = lazy(() => import('./component/AdminLogin'));

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
useEffect(() => {
  window.scrollTo(0, 0);
  const preservedKeys = new Set(['pub_admin_token', 'pub_admin_profile']);
  Array.from({ length: localStorage.length }, (_, index) =>
    localStorage.key(index),
  )
    .filter(key => key && !preservedKeys.has(key))
    .forEach(key => localStorage.removeItem(key));
}, []);
  return (
    <MotionConfig reducedMotion="user">
      <div>
        {!isAdminPage && <Navbar />}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Suspense
              fallback={<div className="min-h-40" aria-label="Loading page" />}
            >
              <Routes location={location}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="menu" element={<Menus />} />
                <Route path="menu-card/:id" element={<MenuCard />} />
                <Route path="/events" element={<AllEvents />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/booking-form" element={<BookingForm />} />

                {/* Admin Routes with Token Protection */}
                <Route
                  path="/admin"
                  element={
                    localStorage.getItem('pub_admin_token') ? (
                      <AdminDashboard
                        onLogout={() => {
                          localStorage.removeItem('pub_admin_token');
                          localStorage.removeItem('pub_admin_profile');
                          window.location.href = '/admin/login';
                        }}
                      />
                    ) : (
                      <AdminLogin
                        onLoginSuccess={() => (window.location.href = '/admin')}
                      />
                    )
                  }
                />
                <Route
                  path="/admin/login"
                  element={
                    <AdminLogin
                      onLoginSuccess={() => (window.location.href = '/admin')}
                    />
                  }
                />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
        {!isAdminPage && <Footer />}
      </div>
    </MotionConfig>
  );
};

export default App;
