import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Plus } from 'lucide-react';
import Heart from '../components/Heart';
import { RiArrowRightSLine } from "react-icons/ri";

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('q');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery) {
                setSearchResults([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get("https://ecommerce.ibradev.me/products/all");
                const allProducts = response.data.data;

                if (Array.isArray(allProducts)) {
                    const filtered = allProducts.filter(product =>
                        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.category?.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.subcategory?.slug.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setSearchResults(filtered);
                } else {
                    console.error("Expected an array in res.data.data, got:", allProducts);
                    setError("Failed to load products.");
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to fetch products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);



    const handleAddToCart = (product) => {
        const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            // If item exists, update quantity
            const updatedCart = currentCart.map((item, index) =>
                index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        } else {
            // If item doesn't exist, add it with quantity 1
            localStorage.setItem("cart", JSON.stringify([...currentCart, { ...product, quantity: 1 }]));
        }
        alert(`${product.name} added to cart!`);
    };

    if (loading) {
        return <div className="text-center py-8">Loading search results...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Search Results for "{searchQuery}"</h1>
            {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {searchResults.map(product => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition duration-200 cursor-pointer"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            {/* Image */}
                            <div className="group relative w-full h-49 overflow-hidden">
                                <img
                                    src={product.images?.[0]}
                                    alt={product.name || "Product"}
                                    className="w-full h-full object-cover" loading="eager"
                                />
                                 <span
                    className="absolute top-2 right-2 hidden group-hover:flex fade-slide-up items-center justify-center w-8 h-8 rounded-full bg-white cursor-pointer"
                  >
                    <Heart product={product} />
                  </span>
                            </div>

                            {/* Text Details */}
                            <div className="p-3 flex flex-col">
                                {/* Product Name and Rating */}
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm text-gray-800 font-semibold truncate pr-2 flex-grow">{product.name || product.title || 'Product Name'}</p>
                          
                                 
                                        <div className="flex items-center text-xs text-gray-600 flex-shrink-0">
                                            <span className="font-bold mr-0.5">4.9</span>
                                            <span >★</span>
                                            <span className="ml-0.5">(10)</span>
                                 </div>
                                </div>

                                <p className="text-xs text-gray-600 mb-1">Ad by Etsy seller</p>

                                {/* Price and Discount */}
                                <div className="flex items-baseline mb-1">
                                    {product.discount && product.originalPrice ? (
                                        <>
                                            <p className="text-base text-green-700 font-bold mr-2">USD {product.price?.toFixed(2) || '0.00'}</p>
                                            <p className="text-sm text-gray-500 line-through mr-1">USD {product.originalPrice?.toFixed(2)}</p>
                                            <span className="text-xs font-bold text-green-700">({product.discount}% off)</span>
                                        </>
                                    ) : (
                                        <p className="text-base text-gray-800 font-bold">USD {product.price?.toFixed(2) || '0.00'}</p>
                                    )}
                                </div>

                                {/* Free Shipping */}
                                {product.isFreeShipping && (
                                    <p className="text-xs text-gray-600 mb-2">Free shipping</p>
                                )}

                                {/* Add to Cart Button and More like this */}
                                <div className="flex items-center justify-between mt-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-full font-semibold text-sm flex items-center justify-center hover:bg-gray-100 transition duration-200"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add to cart
                                    </button>
                                    <Link to={`/search?q=${encodeURIComponent(product.name || product.title || '')}`} className="text-sm text-gray-700 flex items-center hover:underline">
                                        More like this <RiArrowRightSLine className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No products found matching "{searchQuery}".</p>
            )}
        </div>
    );
};

export default SearchPage; 