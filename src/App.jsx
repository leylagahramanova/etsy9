import { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar'
import Main from './pages/Main'
import Footer from './components/Footer';
import CategoryPage from './pages/CategoryPage';
import Wishlist from "./pages/Wishlist";
import ProductDetail from "./components/ProductDetail";
import Cart from "./pages/Cart";
import Login from './components/Login';
import SearchPage from './pages/SearchPage';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on app load and when storage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedLoggedIn = localStorage.getItem("isLoggedIn");
      const storedUser = localStorage.getItem("user");
      setIsLoggedIn(storedLoggedIn === "true" && storedUser !== null);
    };

    // Initial check
    checkLoginStatus();

    // Listen for storage changes
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('login', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('login', checkLoginStatus);
    };
  }, []);

  const handleSignIn = () => {
    setShowLoginModal(true);
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
    // Re-check login status after closing the modal
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(storedLoggedIn === "true" && storedUser !== null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="App">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onSignIn={handleSignIn} 
          onSignOut={handleSignOut} 
        />
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<Main />} />
          </Routes>
        </div>
        <Footer />
        {showLoginModal && <Login onClose={handleLoginClose} />}
      </div>
    </BrowserRouter>
  );
}

export default App;