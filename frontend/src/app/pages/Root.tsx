import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { CartProvider } from '../contexts/CartContext';
import { Toaster } from '../components/ui/sonner';

export function Root() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg mb-4">ShopHub</h3>
                <p className="text-gray-400 text-sm">
                  Your trusted online shopping destination for quality products.
                </p>
              </div>
              <div>
                <h4 className="mb-4">Shop</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>All Products</li>
                  <li>Electronics</li>
                  <li>Fashion</li>
                  <li>Home & Living</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Help Center</li>
                  <li>Shipping Info</li>
                  <li>Returns</li>
                  <li>Contact Us</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              © 2026 ShopHub. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
      <Toaster />
    </CartProvider>
  );
}
