import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PlatformProvider } from './context/PlatformContext';
import { ToastProvider } from './components/ui/overlays/Toast';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import PageTransition from './components/layout/PageTransition/PageTransition';
import CartDrawer from './components/features/cart/CartDrawer';
import AppRoutes from './routes';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <PlatformProvider>
          <CartProvider>
            <ToastProvider>
              <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col selection:bg-primary selection:text-white overflow-x-hidden">
                <Navbar />
                <CartDrawer />
                <main className="flex-grow pt-20">
                  <PageTransition>
                    <AppRoutes />
                  </PageTransition>
                </main>

                {/* Footer Principal */}
                <Footer />
              </div>
            </ToastProvider>
          </CartProvider>
        </PlatformProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;