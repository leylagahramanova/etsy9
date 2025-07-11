import { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar'
import Main from './pages/Main'
import Footer from './components/Footer';
import CategoryPage from './pages/CategoryPage';
import Wishlist from "./pages/Wishlist";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from './components/Login';
import SearchPage from './pages/SearchPage';
import ScrollToTop from './components/ScrollToTop';
import Gifts from './pages/Gifts';
import { Fragment } from "react";
import ScrollButton from './components/ScrollButton';
function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedLoggedIn = localStorage.getItem("isLoggedIn");
      const storedUser = localStorage.getItem("user");
      setIsLoggedIn(storedLoggedIn === "true" && storedUser !== null);
    };
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('login', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('login', checkLoginStatus);
    };
  }, []);

  const handleSignIn = () => setShowLoginModal(true);
  const handleLoginClose = () => {
    setShowLoginModal(false);
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
      <Fragment>
      <ScrollToTop />
      <div className="App flex flex-col min-h-screen">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onSignIn={handleSignIn} 
          onSignOut={handleSignOut} 
        />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/gifts" element={<Gifts />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<Main />} />
          </Routes>
        </main>
        <Footer />
        {showLoginModal && <Login onClose={handleLoginClose} />}
      </div>
      <ScrollButton />
		</Fragment>
    </BrowserRouter>
  );
}

export default App;