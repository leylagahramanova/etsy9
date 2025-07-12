import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Heart from '../components/Heart';
import { Plus } from 'lucide-react';
import { RiArrowRightSLine } from 'react-icons/ri';
import { useNavigate } from "react-router-dom";
const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
    const navigate = useNavigate();

useEffect(() => {
  const decodedCategory = decodeURIComponent(category);
  const decodedSubcategory = subcategory ? decodeURIComponent(subcategory) : undefined;

  axios.get("https://ecommerce.ibradev.me/products/all")
    .then((response) => {
      const allProducts = response.data.data;
      const filtered = allProducts.filter((item) => {
        const categoryMatch = item.category?.slug === decodedCategory;
        if (decodedSubcategory && decodedSubcategory !== "undefined") {
          return categoryMatch && item.subcategory?.slug === decodedSubcategory;
        }
        return categoryMatch;
      });
      setProducts(filtered);
    });
}, [category, subcategory]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif mb-6 text-center capitalize">
  {decodeURIComponent(category)}
  {subcategory ? ` ${decodeURIComponent(subcategory)}` : ""}
</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 bg-white rounded-lg overflow-hidden  w-60 lg:w-full shadow hover:shadow-md transition duration-200 cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <div className="group relative w-full h-41 overflow-hidden">
              <img
                src={product.images?.[0]}
                alt={product.name || "Product"}
                className="w-full h-full object-cover" loading="eager"
              />
              <span
              >
                <Heart product={product} />
              </span>
            </div>

            <div className="p-3 flex flex-col">
              <p className="text-sm text-gray-800 font-semibold truncate mb-1">
                {product.name || product.title || 'Product Name'}
              </p>

              <div className="flex items-center mb-1">
                <span className="text-lg  mr-1">★</span>
                <span className="font-bold text-gray-800 text-sm mr-1">
                  {(product.rating || 4.9).toFixed(1)}
                </span>
                <span className="text-xs text-gray-600 mr-2">
                  ({product.reviewsCount || 18867})
                </span>
                {product.isStarSeller && (
                  <span className="flex items-center text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded ml-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
                    Star Seller
                  </span>
                )}
              </div>

              <div className="flex items-baseline mb-1">
                <span className="text-lg font-bold text-gray-900 mr-2">
                  USD {product.price?.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through mr-1">
                  USD 444
                </span>
                {product.discount && (
                  <span className="text-xs font-bold text-green-700">
                    ({product.discount}% off)
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-1">
                Ad by RiverrryStudio
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;