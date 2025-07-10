import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { AiOutlineHeart, AiFillHeart, AiOutlineClockCircle } from "react-icons/ai";
import { FaLock } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import Message from "../components/Message";
import Heart from "../components/Heart";
import { IoIosLock } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import Login from "../components/Login";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [similarItems, setSimilarItems] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (lastAction) {
      const timer = setTimeout(() => setLastAction(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  const handleRemoveFromWishlist = (itemId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== itemId);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist); // Update state to reflect removal
    console.log("Removed from wishlist:", itemId);
    setLastAction("deleted");
  };

  const handleSignIn = () => {
    setShowLoginModal(true);
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("login", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("login", checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    const timestamp = localStorage.getItem("wishlistTimestamp");
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    if (timestamp && Date.now() - parseInt(timestamp) > sevenDaysInMs) {
      localStorage.removeItem("wishlist");
      localStorage.removeItem("wishlistTimestamp");
    }

    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(stored);

    if (isLoggedIn && stored.length > 0) {
      const categories = [...new Set(stored.map(item => item.category?.slug))];
      const subcategories = [...new Set(stored.map(item => item.subcategory?.slug))];

      axios.get("https://ecommerce.ibradev.me/products/all")
        .then((response) => {
          const allProducts = response.data.data;

          const similar = allProducts.filter(product =>
            categories.includes(product.category?.slug) &&
            subcategories.includes(product.subcategory?.slug) &&
            !stored.some(w => w.id === product.id)
          );

          setSimilarItems(similar);
        })
        .catch(err => console.error("Error fetching products:", err));
    }
  }, [isLoggedIn]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-16 min-h-[60vh]">
      {!isLoggedIn ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-serif">Favorite items</h2>
              <button
                onClick={handleSignIn}
                className="px-6 py-2 rounded-full border font-semibold hover:shadow-xl transition 200"
              >
                Sign in
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <IoIosLock size={24} className="mr-1" />
              <span className="text-xl">Private</span>
              <div className="bg-gray-100 rounded-full w-10 h-10 flex justify-center items-center">
                <MdEdit size={24} className="cursor-pointer hover:text-gray-800" />
              </div>
            </div>
          </div>

          <p className="mb-6 max-w-2xl">
            <span className="font-medium flex items-center mb-2">
              <AiOutlineClockCircle className="mr-2 text-xl" />
              Don&apos;t lose your faves! Sign in or create an account.
            </span>
            Guest favorites are only saved to your device for 7 days, or until you clear your cache.
          </p>

          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center mt-8">
              <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mb-4">
                <FaUserCircle className="text-gray-400" size={64} />
              </div>
              <div className="text-lg font-semibold">Nothing here... yet.</div>
              <div className="text-center max-w-xs">
                These are a few of your favorite things... or they will be, once you favorite something.
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap lg:justify-start justify-center items-center gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white relative rounded-xl min-h-60 w-60 shadow pb-4 px-4 max-w-xs hover:shadow-2xl cursor-pointer transition duration-200"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(item.id);
                    }}
                    className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 shadow-xl rounded-full bg-white cursor-pointer z-10"
                  >
                    <AiFillHeart className="w-5 h-5 text-red-500" />
                  </span>
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="rounded-lg mb-2 w-full h-40 object-cover" loading="eager"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-800 font-semibold mb-1 line-clamp-2">
                      {item.name || item.title || 'Product Name'}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">Ad by Etsy seller</p>
                    <div className="flex items-center">
                      <p className="text-lg text-gray-800 font-bold mr-2">
                        USD {item.price?.toFixed(2) || '0.00'}
                      </p>
                      {item.previousPrice && item.price < item.previousPrice && (
                        <>
                          <p className="text-sm text-gray-500 line-through mr-2">
                            USD {item.previousPrice.toFixed(2)}
                          </p>
                          <span className="text-sm font-bold text-green-700">
                            ({Math.round(((item.previousPrice - item.price) / item.previousPrice) * 100)}% off)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-gray-700" size={32} />
              <span className="text-xl font-semibold">Your Wishlist</span>
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center mt-16">
              <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mb-4">
                <FaUserCircle className="text-gray-400" size={64} />
              </div>
              <div className="text-lg font-semibold text-gray-700">Nothing to see here yet</div>
              <div className="text-gray-500 text-center max-w-xs">
                Start favoriting items to compare, shop, and keep track of things you love.
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap lg:justify-start justify-center items-center gap-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white relative rounded-xl min-h-60 w-60 shadow pb-4 px-4 max-w-xs hover:shadow-2xl cursor-pointer transition duration-200"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(item.id);
                      }}
                      className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 shadow-xl rounded-full bg-white cursor-pointer z-10"
                    >
                      <AiFillHeart className="w-5 h-5 text-red-500" />
                    </span>
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="rounded-lg mb-2 w-full h-40 object-cover" loading="eager"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-800 font-semibold mb-1 line-clamp-2">
                        {item.name || item.title || 'Product Name'}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">Ad by Etsy seller</p>
                      <div className="flex items-center">
                        <p className="text-lg text-gray-800 font-bold mr-2">
                          USD {item.price?.toFixed(2) || '0.00'}
                        </p>
                        {item.previousPrice && item.price < item.previousPrice && (
                          <>
                            <p className="text-sm text-gray-500 line-through mr-2">
                              USD {item.previousPrice.toFixed(2)}
                            </p>
                            <span className="text-sm font-bold text-green-700">
                              ({Math.round(((item.previousPrice - item.price) / item.previousPrice) * 100)}% off)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {similarItems.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-2xl font-semibold mb-4">Similar Items</h3>
                  <div className="flex flex-wrap lg:justify-start justify-center items-center gap-6">
                    {similarItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white relative rounded-xl w-60 min-h-50 shadow pb-4 px-4 max-w-xs hover:shadow-2xl cursor-pointer hover:rounded-3xl transition duration-200"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="rounded-lg mb-2 w-full h-40 object-cover" loading="eager"
                        />
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-800 font-semibold mb-1 line-clamp-2">
                            {item.name || item.title || 'Product Name'}
                          </p>
                          <p className="text-xs text-gray-600 mb-1">Ad by Etsy seller</p>
                          <p className="text-lg text-gray-800 font-bold">
                            USD {item.price?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      {showLoginModal && (
        <Login onClose={handleLoginClose} />
      )}
    </div>
  );
}
export default Wishlist;