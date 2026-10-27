import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './components/ui/button';
import HomePage from './components/HomePage';
import BookingPage from './components/BookingPage';
import MenuPage from './components/MenuPage';
import AdminDashboard from './components/AdminDashboard';

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center">
              <span className="text-white">LB</span>
            </div>
            <span className="text-gray-900">La Bella</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-amber-600 transition-colors">
              Home
            </Link>
            <Link to="/menu" className="text-gray-700 hover:text-amber-600 transition-colors">
              Menu
            </Link>
            <Link to="/booking" className="text-gray-700 hover:text-amber-600 transition-colors">
              Reservations
            </Link>
            <Button onClick={() => navigate('/booking')} className="bg-amber-600 hover:bg-amber-700">
              Book a Table
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-amber-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="block text-gray-700 hover:text-amber-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/booking"
              className="block text-gray-700 hover:text-amber-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reservations
            </Link>
            <Button 
              onClick={() => {
                navigate('/booking');
                setMobileMenuOpen(false);
              }} 
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Book a Table
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center">
                    <span className="text-white">LB</span>
                  </div>
                  <span>La Bella</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Experience fine dining at its best. Fresh ingredients, authentic flavors, unforgettable moments.
                </p>
              </div>
              
              <div>
                <h3 className="mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/" className="hover:text-amber-600 transition-colors">Home</Link></li>
                  <li><Link to="/menu" className="hover:text-amber-600 transition-colors">Menu</Link></li>
                  <li><Link to="/booking" className="hover:text-amber-600 transition-colors">Book a Table</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4">Contact</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>123 Culinary Street</li>
                  <li>New York, NY 10001</li>
                  <li>Phone: (555) 123-4567</li>
                  <li>Email: hello@labella.com</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4">Hours</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Monday - Thursday: 11AM - 10PM</li>
                  <li>Friday - Saturday: 11AM - 11PM</li>
                  <li>Sunday: 10AM - 9PM</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2025 La Bella Restaurant. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
