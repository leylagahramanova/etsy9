import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { MdClose } from "react-icons/md";

// Kategoriya slug-larını oxunaqlı formata çevirən köməkçi funksiya
const formatCategoryDisplayName = (slug) => {
    if (!slug) return '';
    const parts = slug.split('/');
    let formattedParts = parts.map(part => {
        return part.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    });
    return formattedParts.join(' / ');
};

const SearchBar = () => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchVal, setSearchVal] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://ecommerce.ibradev.me/products/all")
            .then((res) => {
                const data = res.data?.data || [];
                setProducts(data);
                const uniqCategories = Array.from(
                    new Map(
                        data
                            .filter(product => product.category?.slug)
                            .map(product => [product.category.slug, {
                                name: formatCategoryDisplayName(product.category.slug),
                                slug: product.category.slug
                            }])
                    ).values()
                );
                setCategories(uniqCategories);
            })
            .catch(err => {
                console.error("Failed to fetch products/categories:", err);
            });
    }, []);

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchVal(value);

        if (!value) {
            setSearchResults([]);
            return;
        }

        const searchLower = value.toLowerCase();

        const categoryMatches = categories
            .filter(category => category.name.toLowerCase().includes(searchLower))
            .map(cat => ({ label: cat.name, type: 'category', value: cat.slug }));

        const productMatches = products
            .filter(product => product.name.toLowerCase().includes(searchLower))
            .map(product => ({ label: product.name, type: 'product', value: product.id }));

        setSearchResults([...categoryMatches, ...productMatches]);
        setShowSuggestions(true);
    };

    const handleSearchInputFocus = () => {
        setIsSearchActive(true);
        setShowSuggestions(true);
    };

    const handleSearchInputBlur = () => {
        setTimeout(() => {
            setIsSearchActive(false);
            setShowSuggestions(false);
        }, 100);
    };

    const handleClearSearch = () => {
        setSearchVal("");
        setSearchResults([]);
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (value, type, label) => {
        setSearchVal(label);
        setShowSuggestions(false);
        setIsSearchActive(false);

        if (type === 'category') {
            navigate(`/category/${value}`);
        } else if (type === 'product') {
            navigate(`/product/${value}`);
        } else {
            navigate(`/search?q=${encodeURIComponent(value)}`);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchVal) {
            navigate(`/search?q=${encodeURIComponent(searchVal)}`);
        }
        setShowSuggestions(false);
        setIsSearchActive(false);
    };

    return (
        <form onSubmit={handleSearchSubmit} className="flex justify-between flex-1 max-w-4xl border-black border-4 rounded-full relative z-30">
            <input
                type="text"
                placeholder="Search for anything"
                className="flex-1 py-2 pl-4 pr-2 rounded-l-full focus:outline-none focus:ring-2 text-sm"
                value={searchVal}
                onChange={handleSearchInputChange}
                onFocus={handleSearchInputFocus}
                onBlur={handleSearchInputBlur}
            />
            {searchVal && isSearchActive && (
                <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 pr-1"
                >
                    <MdClose />
                </button>
            )}
            <button
                type="submit"
                className={`bg-orange-500 text-white w-11 h-11 flex items-center justify-center border transition-all duration-200 ${isSearchActive ? 'rounded-r-full m-0' : 'rounded-full m-1'}`}
                aria-label="Search"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    className="h-5 w-5" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd"
                        d="M10.5 19a8.46 8.46 0 0 0 5.262-1.824l4.865 4.864 1.414-1.414-4.865-4.865A8.5 8.5 0 1 0 10.5 19m0-2a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13" />
                </svg>
            </button>

            {showSuggestions && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-10 max-h-80 overflow-y-auto">
                    {searchVal && searchVal.length > 0 ? (
                        searchResults.length > 0 ? (
                            <ul>
                                {searchResults.map((result, idx) => (
                                    <li
                                        key={idx}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleSuggestionClick(result.value, result.type, result.label)}
                                    >
                                        {result.label}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="px-4 py-2 text-gray-500">No results found.</p>
                        )
                    ) : (
                        <div className='mt-2'>
                            <p className="px-4 py-2 text-gray-800 font-semibold ">More foolproof favorites</p>
                            <ul>
                                {products.slice(0, 7).map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleSuggestionClick(item.name, 'text', item.name)}
                                    >
                                        {item.images?.[0] && <img src={item.images[0]} alt={item.name} className="w-8 h-8 rounded-md mr-2 object-cover" />}
                                        <span className="text-gray-800">{item.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </form>
    );
};

export default SearchBar;
