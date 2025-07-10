import React, { useEffect, useState } from "react";
import { ShieldCheck, Tag, MessageSquare, Plus } from 'lucide-react';
import axios from "axios";
import { FaHandsHelping } from "react-icons/fa";
import { MdHandshake } from "react-icons/md";
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { PiLeafFill } from "react-icons/pi";
import { MdDiscount } from "react-icons/md";
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [openShopDropdown, setOpenShopDropdown] = useState(null);
    const [similarItems, setSimilarItems] = useState([]);
    const navigate = useNavigate();

    const handleAddToWishlist = (product) => {
        const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
        const alreadyInWishlist = existing.find((p) => p.id === product.id);
        if (!alreadyInWishlist) {
            existing.push(product);
            localStorage.setItem("wishlist", JSON.stringify(existing));
        }
        navigate("/wishlist");
    };
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartWithQuantities = storedCart.map(item => ({
            ...item,
            quantity: item.quantity || 1
        }));
        setCartItems(cartWithQuantities);

        // Extract categories and subcategories from storedCart for filtering
        const categories = [...new Set(storedCart.map(item => item.category?.slug).filter(Boolean))];
        const subcategories = [...new Set(storedCart.map(item => item.subcategory?.slug).filter(Boolean))];

        axios.get("https://ecommerce.ibradev.me/products/all")
            .then((response) => {
                const allProducts = response.data.data;

                // Filter similar items that share categories or subcategories, and exclude items already in cart
                const similar = allProducts.filter(product =>
                    categories.includes(product.category?.slug) &&
                    subcategories.includes(product.subcategory?.slug) &&
                    !storedCart.some(w => w.id === product.id)
                );

                setSimilarItems(similar);
            })
            .catch(err => console.error("Error fetching products:", err));
    }, []);
    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
        setSubtotal(total);

    }, [cartItems]);
    const handleAddToCart = (item) => {
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        const itemExists = existingCart.find(i => i.id === item.id);

        if (!itemExists) {
            const updatedCart = [...existingCart, { ...item, quantity: 1 }];
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setCartItems(updatedCart); // Optional if needed live update
        }
    };
    const toggleShopDropdown = itemId => {
        setOpenShopDropdown(openShopDropdown === itemId ? null : itemId);
    };
    const handleContactShop = shopName => {
        console.log("Contacting shop:", shopName);
        setOpenShopDropdown(null);
    };
    const handleAddNote = shopName => {
        console.log("Adding note for shop:", shopName);
        setOpenShopDropdown(null);
    };
    const handleSaveForLater = itemId => {
        console.log("Save for later:", itemId);
    };
    const handleRemoveItem = itemId => {
        const updatedCart = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
    };
    const handleQuantityChange = (itemId, newQuantity) => {
        const quantity = parseInt(newQuantity, 10); // Ensure quantity is a number
        if (isNaN(quantity) || quantity < 1) return; // Basic validation

        const updatedCart = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: quantity } : item
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
        setCartItems(updatedCart); // Update state, which will trigger the other useEffect
    };


    // Dummy values for order summary calculations (replace with real logic)
    const shopDiscount = 0.0; // Example discount
    const itemsTotal = subtotal; // Items total is the calculated subtotal
    const finalSubtotal = itemsTotal - shopDiscount;

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6">Your cart</h1>

            {/* Purchase Protection Banner */}
            <div className="flex items-center  p-3 rounded-lg ">
                <MdHandshake className="w-7 h-7 mr-3 flex-shrink-0 text-blue-600" />
                <p className="text-xl">
                    Buy confidently with Etsy’s Purchase Protection program.{" "}
                    <a href="#" className="underline font-medium">See eligibility</a>
                </p>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center text-gray-600 py-10">Your cart is empty.</div>
            ) : (
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map(item => (
                            <div key={item.id} className="border border-gray-200 rounded-xl p-6 bg-white  m-4">
                                <div className="flex items-center relative">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-gray-600 text-sm">
                                        Shop
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 flex-grow">{item.shop?.name || 'Unknown Shop'}</h3>
                                    <button
                                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                        onClick={() => toggleShopDropdown(item.id)}
                                        aria-expanded={openShopDropdown === (item.id || 'Unknown Shop')}
                                        aria-haspopup="true"
                                    >
                                        …
                                    </button>
                                    {openShopDropdown === (item.id) && (
                                        <div className="absolute top-full right-0 mt-2 z-10 bg-white border border-gray-200 rounded-lg shadow-lg w-48 py-2">
                                            <ul>
                                                <li
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    // Pass the shop name to the handler
                                                    onClick={() => handleContactShop(item.shop?.name || 'Unknown Shop')}
                                                >
                                                    <MessageSquare className="w-4 h-4 mr-2" />
                                                    Contact shop
                                                </li>
                                                <li
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleAddNote(item.shop?.name || 'Unknown Shop')}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add a note about this order
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-start">
                                    <div className="w-24 h-24 flex-shrink-0 mr-4 rounded-lg overflow-hidden bg-gray-100">
                                        <img 
                                            src={item.images?.[0]}
                                            alt={item.name || "Product"}
                                            className="w-full h-full object-cover" loading="eager"
                                        />
                                    </div>
                                    <div className="flex-grow flex flex-col">
                                        <h4 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">{item.name || item.title || 'Product Name'}</h4>
                                        {item.size && (
                                            <div className="text-xs text-gray-500 mb-2">Size: {item.size}</div>
                                        )}

                                        {/* Optional: Instant Download / File Info Badges */}
                                        {(item.isInstantDownload || item.fileInfo) && ( // Assuming these properties exist
                                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                {item.isInstantDownload && (
                                                    <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                        Instant Download
                                                    </span>
                                                )}
                                                {item.fileInfo && (
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">{item.fileInfo}</span>
                                                )}
                                            </div>
                                        )}


                                        {/* Price - Displays price * quantity */}
                                        <div className="text-lg font-bold text-gray-800 mt-1">
                                            USD {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                            {item.previousPrice && item.price < item.previousPrice && (
                                                <span className="ml-2 text-sm text-gray-500 line-through">
                                                    USD {item.previousPrice.toFixed(2)}
                                                </span>
                                            )}
                                            {item.previousPrice && item.price < item.previousPrice && (
                                                <span className="ml-2 text-xs font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                                                    {Math.round(((item.previousPrice - item.price) / item.previousPrice) * 100)}% off
                                                </span>
                                            )}
                                        </div>

                                        {/* Sale End Time (if applicable) */}
                                        {item.saleEnds && ( // Assuming item has a 'saleEnds' property
                                            <div className="text-sm text-green-600 mt-1">
                                                Sale ends in {item.saleEnds}
                                            </div>
                                        )}
                                        <div className="mt-3 flex flex-wrap items-center gap-4">

                                            <select
                                                value={item.quantity || 1}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className="form-select border border-gray-300 rounded-md text-sm py-1 px-2" // Styled select
                                            >
                                                {Array.from({ length: 10 }, (_, i) => i + 1).map(qty => (
                                                    <option key={qty} value={qty}>{qty}</option>
                                                ))}
                                            </select>
                                            <div className="text-sm text-gray-600 flex gap-4">
                                                <button onClick={() => handleSaveForLater(item.id)} className="hover:underline">Save for later</button>
                                                <span>·</span>
                                                <button onClick={() => handleRemoveItem(item.id)} className="hover:underline">Remove</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column - Order Summary */}
                  <div className="bg-white rounded-xl shadow-md p-6 space-y-4 w-full max-w-md">
  <h3 className="text-lg font-semibold text-gray-800 mb-2">How you'll pay</h3>
  <div className="space-y-2">
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="payment" className="accent-black" defaultChecked />
      <div className="flex gap-1">
        <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-10 w-10" />
        <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-10 w-10" />
        <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" className="h-10 w-10" />
        <img src="https://img.icons8.com/color/48/diners-club.png" alt="Diners Club" className="h-10 w-10" />
      </div>
    </label>
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="payment" className="accent-black" />
      <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" className="h-6" />
      <span>PayPal</span>
    </label>
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="payment" className="accent-black" />
      <img src="https://img.icons8.com/color/48/google-pay.png" alt="GPay" className="h-6" />
      <span>G Pay</span>
    </label>
  </div>

  <div className="flex justify-between items-center mt-4 text-base">
    <span className="font-medium">Item(s) total</span>
    <span className="font-semibold">USD {itemsTotal.toFixed(2)}</span>
  </div>

  <button className="w-full bg-black text-white py-3 rounded-full font-semibold text-base mt-2 hover:bg-gray-800 transition">
    Proceed to checkout
  </button>

  <div className="flex items-center mt-4 cursor-pointer">

    <MdDiscount className="w-5 h-5 text-green-600 mr-2" />
    <span className="text-green-700 font-medium">Apply coupon code</span>
  </div>

  <p className="text-xs text-gray-500 mt-2">
    Local taxes included (where applicable).<br />
    * Learn more about additional taxes, duties, and fees that may apply
  </p>
</div>
<p className="flex items-center"><PiLeafFill className="mr-8"/>Etsy offsets carbon emissions from every delivery</p>
                    {similarItems.length > 0 && (
                        <div className="mt-16">
                            <h3 className="text-2xl font-semibold mb-4">Related items you may like</h3>
                            <div className="flex lg:justify-start justify-center items-center gap-6">

                                {similarItems.length > 0 && (
                                    <div>
                                        {/* Horizontal scroll container */}
                                        <div className="flex flex-nowrap gap-6 overflow-x-auto">
                                            {similarItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex-shrink-0  bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition duration-200 cursor-pointer" // Fixed width for item card
                                                    onClick={() => navigate(`/product/${item.id}`)} // Navigate on card click
                                                >
                                                    {/* Image */}
                                                    <div className="group relative w-50 h-48 overflow-hidden">
                                                        <img
                                                            src={item.images?.[0] } 
                                                            alt={item.name || "Product"}
                                                            className="w-full h-full object-cover" loading="eager"
                                                        />
                                                        <span
                                                            onClick={() => handleAddToWishlist(product)}
                                                            className="absolute top-2 right-2 hidden group-hover:flex fade-slide-up items-center justify-center w-8 h-8 rounded-full bg-white cursor-pointer"
                                                        >
                                                            <FaHeart className="w-4 h-4 text-black" />
                                                        </span>
                                                    </div>

                                                    {/* Text Details */}
                                                    <div className="p-3 flex flex-col">
                                                        <p className="text-sm text-gray-800 font-semibold truncate">{item.name || item.title || 'Product Name'}</p>
                                                        <p className="text-xs text-gray-600 mb-1">Ad by Etsy seller</p> 

                                                        <div className="flex items-center mb-1">
                                                            <p className="text-base text-gray-800 font-bold mr-2">USD {item.price?.toFixed(2) || '0.00'}</p> {/* Display current price */}
                                                            {/* Display old price and discount if available */}

                                                        </div>

                                                        <span className="text-xs font-bold text-green-700">({item.discount}% off)</span>




                                                        {/* Add to Cart Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent card click event
                                                                handleAddToCart(item);
                                                            }}
                                                            className="mt-3 px-4 py-2 border border-gray-300 rounded-full font-semibold text-sm flex items-center justify-center hover:bg-gray-100 transition duration-200"
                                                        >
                                                            <Plus className="w-4 h-4 mr-1" />
                                                            Add to cart
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>

            )}

        </div>
    );
};

export default Cart;