import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { IoIosArrowBack } from "react-icons/io";
import Timer from "../components/Timer";
import Heart from "../components/Heart";
const ProductDetail = () => {
    const { productId } = useParams();   // URL-dən məhsulun id-sini alır
    const [productDetailItem, setProductDetailItem] = useState(null);  // Məhsulun detallarını saxlamaq üçün state
   const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [openSections, setOpenSections] = useState({
        details: true,
        delivery: false,
        instantDownload: true,
    });  // Açıq/bağlı olan bölmələrin vəziyyətini saxlamaq üçün state
    const [similarProducts, setSimilarProducts] = useState([]);

   useEffect(() => {
    const fetchProduct = async () => {
        setLoading(true);  // start loading
        try {
            const response = await fetch(`https://ecommerce.ibradev.me/products/get/${productId}`);
            if (!response.ok) {
                console.error(`Product with ID ${productId} not found or API error: ${response.status}`);
                setProductDetailItem(null);
            } else {
                const data = await response.json();
                setProductDetailItem(data);
            }
        } catch (err) {
            console.error("Error fetching product:", err);
            setProductDetailItem(null);
        } finally {
            setLoading(false);  // done loading
        }
    };

    if (productId) {
        fetchProduct();
    } else {
        setProductDetailItem(null);
        setLoading(false);
    }
}, [productId]);


    useEffect(() => {
        const fetchSimilarProducts = async () => {
            if (!productDetailItem?.category?.slug) return;
            try {
                const response = await fetch("https://ecommerce.ibradev.me/products/all");
                const data = await response.json();
                const filtered = data.data.filter(
                    item =>
                        item.category?.slug === productDetailItem.category.slug &&
                        item.id !== productDetailItem.id
                );
                setSimilarProducts(filtered.slice(0, 8));
            } catch (err) {
                console.error("Error fetching similar products:", err);
            }
        };
        if (productDetailItem) {
            fetchSimilarProducts();
        }
    }, [productDetailItem]);


    const images = Array.isArray(productDetailItem?.images) && productDetailItem.images.length > 0
        ? productDetailItem.images.map(imgUrl => ({
            original: imgUrl,
            thumbnail: imgUrl,
        }))
        : [];


    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleAddToCart = () => {
        if (!productDetailItem) {
            console.log("Product data not loaded, cannot add to cart.");
            return;
        }

        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

        const isItemInCart = currentCart.some(item => item.id === productDetailItem.id);

        if (!isItemInCart) {
            currentCart.push(productDetailItem);
            localStorage.setItem('cart', JSON.stringify(currentCart));
        } else {
            console.log('Product already in cart:', productDetailItem);
        }

        navigate('/cart');
    };


   if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading product details...</div>;
}

if (!loading && !productDetailItem) {
    return <div className="text-center py-10 text-gray-600">Product information not available.</div>;
}

    const inCarts = 16;



    const isNewMarkdown = true;
    const sellerName = "LittleBirdieCanada";
    const sellerRating = 5;
    const sellerReviewCount = 1234;
    const sellerMessage = "Star Seller. This seller consistently earned 5-star reviews, shipped on time, and replied quickly to any messages they received.";
    const isInstantDownload = true;
    const isLargeScreen = window.innerWidth >= 765;
    const thumbnailPosition = isLargeScreen ? "left" : "bottom";

    return (
        <section className="container flex-grow mx-auto max-w-[1200px] py-5 lg:gap-10 lg:py-10">
            <div className=" lg:grid lg:grid-cols-2">
       <div className="container mx-auto px-4 lg:px-0 relative ">
                <div className="relative">
                    <ReactImageGallery
                        showBullets={false}
                        showFullscreenButton={false}
                        showPlayButton={false}
                        items={images}
                        showThumbnails={true}
                        showNav={true}
                        thumbnailPosition={thumbnailPosition}
                        renderLeftNav={(onClick, disabled) => (
                            <button
                                type="button"
                                className="absolute left-0 top-1/2  flex items-center justify-center w-10 h-10 shadow-xl rounded-full bg-white cursor-pointer  hover:bg-gray-300 transition"
                                onClick={onClick}
                                disabled={disabled}
                                aria-label="Previous Slide"
                                style={{ zIndex: 50 }}
                            >
                                <IoIosArrowBack className="w-8 h-8 text-black" />
                            </button>
                        )}
                        renderRightNav={(onClick, disabled) => (
                            <button
                                type="button"
                                className="absolute right-0 top-1/2   flex items-center justify-center w-10 h-10 shadow-xl rounded-full bg-white cursor-pointer hover:bg-gray-300 transition"
                                onClick={onClick}
                                disabled={disabled}
                                aria-label="Next Slide"
                                style={{ zIndex: 50 }}
                            >
                                <IoIosArrowForward className="w-8 h-8 text-black" />
                            </button>
                        )}
                    />

                    <span

                    >
                        <Heart product={productDetailItem} />
                    </span>
                </div>
                <div className="text-center mt-4 text-sm">
                    <a href="#" className="text-gray-500 hover:underline">
                    </a>
                </div>
            </div>

            <div className="mx-auto px-5 lg:px-0">
                {inCarts > 0 && (
                    <div className="text-sm text-gray-600 mb-2">{`In ${inCarts} carts`}</div>
                )}

                <div className="flex items-center gap-2 mb-2">
                    <p className="text-4xl font-bold text-gray-800">
                        ${productDetailItem.price?.toFixed(2) || 'N/A'}
                    </p>

                    <span className="text-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        {productDetailItem.discount}% off
                    </span>

                </div>


                <div className="text-sm text-red-600 mb-4 flex ">
                    <span className="mr-2">Sale ends in </span>    <Timer className="ml-2" />
                </div>


                {isNewMarkdown && (
                    <div className="flex items-center bg-yellow-100 text-yellow-800 text-sm px-3 py-2 rounded mb-4">
                        <Star className="w-4 h-4 mr-2 fill-yellow-800 text-yellow-800" />
                        New markdown! Biggest sale in 5 days
                    </div>
                )}

                <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                    {productDetailItem.title || productDetailItem.name || 'Product Title'}
                </h1>

                <div className="flex items-center mb-6">
                    <a href="#" className="text-sm text-gray-700 hover:underline mr-2">
                        {sellerName}
                    </a>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < sellerRating ? 'fill-black text-black' : 'text-gray-300'}`}
                                fill={i < sellerRating ? 'currentColor' : 'none'}
                            />
                        ))}
                        {sellerReviewCount > 0 && (
                            <span className="ml-2 text-sm text-gray-500">({sellerReviewCount})</span>
                        )}
                    </div>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <button
                        className="flex items-center justify-center bg-black text-white text-lg px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition w-full "
                        onClick={handleAddToCart}
                    >

                        Add to cart
                    </button>

                </div>

                <div className="flex items-start text-sm text-gray-700 bg-gray-50 p-4 rounded-lg mb-6">
                    <Star className="w-5 h-5 fill-purple-600 text-purple-600 mr-3 mt-1" />
                    <p>{sellerMessage}</p>
                </div>


                <div className="border-t border-gray-200 py-4 cursor-pointer" onClick={() => toggleSection('details')}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Item details</h3>
                        {openSections.details ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                    {openSections.details && (
                        <div className="mt-3 text-gray-700">
                            <p className="font-bold mb-1">
                                Availability:
                                {productDetailItem.availability ? (
                                    <span className="font-normal text-green-600"> In Stock </span>
                                ) : (
                                    <span className="font-normal text-red-600"> Out of Stock</span>
                                )}
                            </p>
                            {productDetailItem.brand && (
                                <p className="font-bold mb-1">
                                    Brand: <span className="font-normal"> {productDetailItem.brand}</span>
                                </p>
                            )}
                            {productDetailItem.category && (
                                <p className="font-bold mb-1">
                                    Cathegory:
                                    <span className="font-normal"> {productDetailItem.category.name}</span>
                                </p>
                            )}
                            {productDetailItem.sku && (
                                <p className="font-bold mb-1">
                                    SKU: <span className="font-normal"> {productDetailItem.sku}</span>
                                </p>
                            )}
                            <p className="mt-3 text-sm leading-5 text-gray-500">
                                {productDetailItem.description || 'No description available.'}
                            </p>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 py-4 cursor-pointer" onClick={() => toggleSection('delivery')}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Delivery</h3>
                        {openSections.delivery ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                    {openSections.delivery && (
                        <div className="mt-3 text-gray-700">
                            <p>Shipping details...</p>
                        </div>
                    )}
                </div>

                {isInstantDownload && (
                    <div className="border-t border-gray-200 py-4 cursor-pointer" onClick={() => toggleSection('instantDownload')}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Instant Download</h3>
                            {openSections.instantDownload ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                        </div>
                        {openSections.instantDownload && (
                            <div className="mt-3 text-gray-700">
                                <p>Your files will be available to download once payment is confirmed.</p>
                                <a href="#" className="text-blue-600 hover:underline">Here's how.</a>
                            </div>
                        )}
                    </div>
                )}



                <div className="border-b border-gray-200"></div>

            </div>
            </div>
     
            {similarProducts.length > 0 && (
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">You may also like <span className="text-base text-gray-400 font-normal">Including ads</span></h2>
                        <button
                            className="border border-gray-400 rounded-full px-4 py-1 text-gray-700 hover:bg-gray-100 transition"
                    
                        >
                            See more
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4 pb-2">
                        {similarProducts.map((item) => (
                            <div
                                key={item.id}
                                className="w-[220px] border  bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition duration-200 cursor-pointer flex-shrink-0"
                                onClick={() => navigate(`/product/${item.id}`)}
                            >
                                         <div className="group relative w-50 h-48 overflow-hidden">
                                <img
                                    src={item.images?.[0]}
                                    alt={item.name}
                                    className="w-full h-40 object-cover"
                                />
                                     <span
                                                       >
                                                        <Heart product={item} className="w-4 h-4 text-black" />
                                                      </span>
                                </div>
                                <div className="p-2">
                                    <p className="text-sm  truncate mb-1">{item.name}</p>
                                    <p className="text-xs text-gray-500 truncate mb-1"> Etsy Seller</p>
                                    <div className="flex flex-col items-baseline mb-1">
                                        <span className="text-green-700 font-bold text-base mr-2">USD {item.price?.toFixed(2)}</span>
                                     
                                     <div >
                                            <span className="text-xs text-gray-500 line-through mr-1">USD 444.00</span>
                                    
                                        {item.discount && (
                                            <span className="text-xs text-gray-500">({item.discount}% off)</span>
                                        )}
                                     </div>
                                        
                                    </div>
                              
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProductDetail;