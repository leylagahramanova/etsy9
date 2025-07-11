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
    const [filter, setFilter] = useState("priceLowHigh");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
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

    // Extract unique subcategories from searchResults
    const subcategories = Array.from(
  new Set(
    searchResults.map(p => p.subcategory?.slug)
  )
);

    // Filtering logic
    let filteredResults = [...searchResults];
    if (selectedSubcategory !== "all") {
      filteredResults = filteredResults.filter(
        p => p.subcategory?.slug === selectedSubcategory
      );
    }
    if (filter === "priceLowHigh") {
      filteredResults.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (filter === "priceHighLow") {
      filteredResults.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
const handleAddToCart = (product) => {
    if (!product) {
        return;
    }

    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const isItemInCart = currentCart.some(item => item.id === product.id);

    if (!isItemInCart) {
        currentCart.push(product);
        localStorage.setItem('cart', JSON.stringify(currentCart));
        console.log('Product added to cart:', product);
    } else {
        console.log('Product already in cart:', product);
    }

    navigate('/cart');
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
            {/* Filter  */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <label className="font-semibold">Filter by:</label>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
              </select>

              <label className="font-semibold ml-4">Subcategory:</label>
              <select
                value={selectedSubcategory}
                onChange={e => setSelectedSubcategory(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="all">All</option>
                {subcategories.map(subcat => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
            </div>
            {filteredResults.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                    {filteredResults.map(product => (
                        <div
                            key={product.id}
                           className="flex-shrink-0 bg-white rounded-lg overflow-hidden  w-60 lg:w-full shadow hover:shadow-md transition duration-200 cursor-pointer"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <div className="group relative w-full h-49 overflow-hidden">
                                <img
                    className="object-cover rounded-3xl sm:w-[60rem] w-[20rem] lg:h-[20rem] h-[15rem] " loading="eager"
                                    src={product.images?.[0]}
                                    alt={product.name || "Product"} 
                                />
                                 <span>
                    <Heart product={product} />
                  </span>
                            </div>
                            <div className="p-3 flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm text-gray-800 font-semibold truncate pr-2 flex-grow">{product.name || product.title || 'Product Name'}</p>
                                        <div className="flex items-center text-xs text-gray-600 flex-shrink-0">
                                            <span className="font-bold mr-0.5">4.9</span>
                                            <span >★</span>
                                            <span className="ml-0.5">(10)</span>
                                 </div>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">Ad by Etsy seller</p>
                                <div className="flex items-baseline mb-1">
                                  <p className="text-base text-gray-800 font-bold mr-2">USD {product.price?.toFixed(2) || '0.00'}</p>
                                  {product.discount && (
                                    <>
                                      <p className="text-sm text-gray-500 line-through mr-1">USD 444.00</p>
                                      <span className="text-xs font-bold text-green-700">({product.discount}% off)</span>
                                    </>
                                  )}
                                </div>
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