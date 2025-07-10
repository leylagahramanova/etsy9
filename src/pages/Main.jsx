import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from "lucide-react"; // Or any icon lib
import custom from '../../public/custom.avif';
import birth from '../../public/birth.avif';
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Heart from "../components/Heart";
import Timer from '../components/Timer';
import { AiOutlineClockCircle } from "react-icons/ai";

const Main = () => {
  const [products, setProducts] = useState([]); // Bütün məhsullar
  const [cart, setCart] = useState([]); // Səbətdəki məhsullar
  const [similarItems, setSimilarItems] = useState([]); // Səbətdə olanlara bənzər məhsullar
  const [favCartItems, setFavCartItems] = useState([]);// Sevimli və səbətdə olan məhsulların unikal qarışığı

  const scrollRef = useRef(null); // Horizontal scroll üçün referans
  const navigate = useNavigate(); // Səhifələr arasında keçid üçün

  // Məhsulları API-dən yükləyir və products state-ə yazır
  useEffect(() => {
    axios.get("https://ecommerce.ibradev.me/products/all")
      .then((response) => {
        const allProducts = response.data.data;
        setProducts(allProducts);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  //Səbətdəki məhsulları localStorage-dan yükləyir
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  // Tövsiyə sistemi: səbətdəki məhsulların kateqoriya və subkateqoriyalarına əsasən oxşar məhsulları tapır
  useEffect(() => {
    if (products.length > 0 && cart.length > 0) {
      // Unikal category və subcategory slug-ları
      const categories = [];
      const subcategories = [];

      cart.forEach(item => {
        const categorySlug = item.category?.slug;
        const subcategorySlug = item.subcategory?.slug;

        if (categorySlug && !categories.includes(categorySlug)) {
          categories.push(categorySlug);
        }

        if (subcategorySlug && !subcategories.includes(subcategorySlug)) {
          subcategories.push(subcategorySlug);
        }
      });

      // Tövsiyə: eyni kateqoriyadakı, amma səbətdə olmayan məhsullar
      const similar = products.filter(product =>
        (categories.includes(product.category?.slug) ||
          subcategories.includes(product.subcategory?.slug)) &&
        !cart.some(w => w.id === product.id)
      );

      setSimilarItems(similar.slice(0, 10));
    } else {
      setSimilarItems([]);
    }
  }, [products, cart]);

  // Sevimlilər (wishlist) və səbətdəki məhsulları yığır, unikal məhsulları favCartItems-a yazır
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const favorites = JSON.parse(localStorage.getItem("wishlist")) || [];
    const all = [...cart, ...favorites];
const unique = [];
const seenIds = new Set();
for (const item of all) {
  if (!seenIds.has(item.id)) {
    unique.push(item);
    seenIds.add(item.id);
  }
}
    setFavCartItems(unique);
  }, []);
  //Horizontal scroll funksiyası
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      // Sol və ya sağa 300px sürüşdürür
      current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="max-w-screen-xl py-4 px-4 sm:px-6 lg:px-8 mx-auto lg:py-8">
        <div className="block md:hidden relative overflow-hidden rounded-2xl h-[300px] sm:h-[500px] cursor-pointer">
          <img
            src={custom}
            alt="It's not too late"
            className="absolute inset-0 w-full h-full object-cover" loading="eager"
          />
          <div className="absolute top-0 left-0 w-full h-[20rem]  bg-pink-200  flex flex-col justify-start items-center text-center p-4 " style={{ background: "radial-gradient(circle at 50% 100%, transparent 50%,rgb(251, 207, 232) 50%)" }}>
            <h2 className="text-3xl font-serif text-primary mb-1">Made just for you</h2>
            <p className="text-base font-semibold mb-4">Custom pieces you won't find elsewhere</p>

          </div>
          <div className='absolute bottom-5 w-full flex justify-center'>
            <button className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition">
              Personalize now
            </button>
          </div>
        </div>

        {/* Desktop Layout: Dad + Gift blocks */}
        <div className="hidden sm:flex gap-4 justify-between ">
          {/* Dad Block */}
          <div className="relative rounded-2xl overflow-hidden cursor-pointer w-full lg:w-[65%] h-[400px] flex items-end justify-center hover:shadow-2xl transition duration-200 ">
            <img
              src={custom}
              alt="It's not too late"
              className="absolute inset-y-0 left-[10%] w-[120%] h-full object-cover" loading="eager"
            />
            <div
              className="absolute top-0 left-0 w-[45rem] h-full flex flex-col items-start justify-center pt-16 pl-6 pr-4 pb-8 rounded-tl-2xl rounded-bl-2xl"
              style={{
                background:
                  "radial-gradient(circle at 100% 50%, transparent 50%, rgb(251, 207, 232) 50%)",
              }}
            >
              <h2 className="text-5xl font-serif text-primary mb-2">Made just <br /> for you</h2>
              <p className="text-base font-semibold mb-4">
                Custom pieces you
                <br />
                won't find elsewhere
              </p>
              <button className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition">
                Personalize now
              </button>
            </div>
          </div>

          {/* Gift Block */}
          <div className="md:hidden lg:flex relative rounded-2xl w-full lg:w-[33%] overflow-hidden cursor-pointer h-[400px] hover:shadow-2xl transition duration-200" >
            <img
              src={birth}
              alt="Personalized Gifts for Dad"
              className="object-cover w-full h-full" loading="eager"
            />
            <div className="absolute bottom-4 left-4 text-white p-2">
              <h2 className="text-2xl font-bold">Birth Flowers</h2>
              <p className="text-sm">Shop Now</p>
            </div>
          </div>
        </div>
      </section>
      {/* Favorites & Cart Section */}
      {favCartItems.length > 0 && (
        <section className="max-w-screen-xl py-4 px-4 sm:px-6 lg:px-8 mx-auto lg:py-8 ">
          <h2 className="text-xl font-semibold mb-4">Recently viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favCartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition duration-200 cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <div className="relative group ">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-[60rem] h-[15rem] object-cover p-1" loading="eager"
                  />
                  <span
                    className="absolute top-2 right-2 hidden group-hover:flex fade-slide-up items-center justify-center w-8 h-8 rounded-full bg-white cursor-pointer"
                  >
                    <Heart product={item} />
                  </span>
                  <div className="absolute bottom-2 left-2 flex items-center gap-2 mt-auto p-1 bg-white rounded-full shadow-sm border">
                    <span >USD {item.price}</span>
                    <span className="line-through  text-sm">USD 220</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {cart.length > 0 && similarItems.length > 0 && (
        <section className="max-w-screen-xl py-4 px-4 sm:px-6 lg:px-8 mx-auto lg:py-8 ">
          <h2 className="text-3xl font-semibold mb-4">Picks inspired by your shopping</h2>
          <div className="flex flex-wrap gap-4 pb-2">
            {similarItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border group border-gray-200 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition duration-200 flex flex-col max-w-[220px] w-[220px] flex-shrink-0"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <div className="relative">
                  <img
                    className="object-cover w-[60rem] h-[15rem]  p-1" loading="eager"
                    src={item.images?.[0]}
                    alt={item.name}
                  />
                  <span
                    className="absolute top-2 right-2 hidden group-hover:flex fade-slide-up items-center justify-center w-8 h-8 rounded-full bg-white cursor-pointer"
                  >
                    <Heart product={item} />
                  </span>
                  <div className="absolute bottom-2 left-2 flex items-center gap-2 mt-auto p-1 bg-white rounded-full shadow-sm border">
                    <span >USD {item.price}</span>
                    <span className="line-through  text-sm">USD 220</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}



      <section className="max-w-screen-xl py-8 px-4 sm:px-6 lg:px-8 mx-auto lg:py-16 ">
        <h2 className="text-3xl font-semibold text-primary mb-3">
          Jump into featured interests
        </h2>
        <ul className="list-none grid grid-cols-2 md:grid-cols-4   gap-2 ">
          {products.slice(0, 4).map((item, index) => (
            <li key={item.id || index}>
              <div>
                <div
                  className="  bg-transparent mr-0 object-cover rounded-2xl cursor-pointer group flex items-center flex-col hover:shadow-lg hover:border transition duration-200"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img
                    className="object-cover w-[60rem] h-[15rem]  p-1 lg:w-[75rem] lg:h-[25rem]" loading="eager"
                    src={item.images[0]}
                    alt={item.name}
                    style={{ aspectRatio: "0.8" }}
                  />
                  {item.subcategory?.slug && (
                    <button
                      className="  bg-white p-2  flex items-center align-center"
                    >
                      <span>{item.subcategory.slug}</span>

                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>


      </section>
      <section className="max-w-screen-xl py-8 px-4 sm:px-6 lg:px-8 mx-auto lg:py-16 ">
        <div className='flex items-start lg:flex-row lg:justify-between  flex-col justify-center'>
          <div className='flex lg:flex-col lg:justify-center  flex-row justify-between  ' style={{ width: "100%" }}>
            <h2 className="text-3xl font-semibold text-primary mb-2 md:mb-2" style={{ marginBottom: "2rem" }}>
              Etsy-special births<br /> for birthdays
            </h2>
            <button className='flex items-center justify-center text-gray-700 text-base px-3 py-2 bg-gray-100 rounded-3xl  hover:shadow-xl transition duration-200' style={{ width: "130px" }}>Get inspired</button>
          </div>

          <ul className="flex flex-row justify-between gap-1 p-0 items-start list-none">
            {products.slice(5, 8).map((item, index) => (
              <li
                key={item.id || index}
                className="bg-transparent  cursor-pointer  ease-in-out  flex flex-col items-center justify-between lg:px-3 px-1"
              >

                <div onClick={() => navigate(`/product/${item.id}`)} className=' relative'>
                  <img
                    className="object-cover rounded-3xl w-[60rem] lg:h-[20rem] sm:h-[15rem] " loading="eager"
                    src={item.images?.[0]}
                    alt={item.name}
                    style={{ aspectRatio: "0.8" }}
                  />

                  <p className=" absolute bottom-2 left-12 transform -translate-x-1/2 align-left text-lg">
                    {item.name.length > 11 ? item.name.slice(0, 11) : item.name}
                  </p>

                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex flex-row justify-center'>
          <ul className="list-none grid grid-cols-2 md:grid-cols-none  md:flex md:flex-row ">
            {products.slice(2, 8).map((item, index) => (
              <li
                key={item.id || index}
                className="bg-transparent relative px-3 cursor-pointer ease-in-out flex flex-col items-center justify-center mx-auto"
              >
                <div className="py-8">
                  <div className="relative inline-block" onClick={() => navigate(`/product/${item.id}`)}>
                    <img
                      className="object-cover rounded-3xl w-[200px] sm:w-45" loading="eager"
                      src={item.images?.[0]}
                      alt={item.name}
                    />
                    <p className="text-sm text-black bg-white rounded-2xl p-1 absolute bottom-[8px] left-[16px] shadow-md">
                      USD {item.price}.99
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-screen-xl py-4 px-4 sm:px-6 lg:px-8 mx-auto lg:py-8">
          <h2 className="text-xl font-semibold text-primary mb-6">
            Find things you'll love. Support independent sellers. Only on Etsy.
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {products.slice(0, 6).map((item, index) => (
              <li
                key={item.id || index}
                className="bg-white rounded-xl shadow-md  p-2 flex items-center space-x-3 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => {
                  const categorySlug = item.category?.slug || 'default';
                  const subcategorySlug = item.subcategory?.slug || 'default';
                  const url = `/category/${categorySlug}/${subcategorySlug}`;
                  console.log('Navigating to:', url);
                  navigate(url);
                }}
              >
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-20 h-20  rounded-lg object-cover flex-shrink-0" loading="eager"
                />
                <p className="text-md font-semibold text-gray-800 truncate">
                  {item.name.length > 20 ? item.name.slice(0, 20) : item.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="max-w-screen-xl py-8 px-4 sm:px-6 lg:px-8 mx-auto lg:py-16">
        <div className="w-full overflow-x-hidden">
          <h2 className="text-3xl font-semibold text-primary mb-2" style={{ marginBottom: "2rem" }}>
            Shop our most popular categories
          </h2>

          <div className="relative w-full">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scroll-smooth 
             scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
            lg:flex-wrap lg:justify-between "

            >
              {products.slice(5, 10).map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex-shrink-0 px-1 cursor-pointer ease-in-out flex flex-col items-center"
                >

                  <div className="w-full flex flex-col items-center" onClick={() => {
                    const categorySlug = item.category?.slug || 'default';
                    const subcategorySlug = item.subcategory?.slug || 'default';
                    const url = `/category/${categorySlug}/${subcategorySlug}`;
                    console.log('Navigating to:', url);
                    navigate(url);
                  }}>
                    <img
                      className="object-cover lg:max-w-[220px]  max-w-[150px] rounded-3xl hover:shadow-xl transition duration-200 mx-auto" loading="eager"
                      src={item.images?.[0]}
                      alt={item.name}
                    />
                    <p className="text-lg text-center mt-2 truncate max-w-full">
                      {item.name.length > 15 ? item.name.slice(0, 15) + "…" : item.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-screen-xl py-8 px-4 sm:px-6 lg:px-8 mx-auto lg:py-16  relative">
        <div className="flex justify-between items-center relative mb-8">
          <div className="flex items-center">
            <h2 className="text-3xl font-bold mr-4">Today's big deals</h2>
            <span className="text-gray-600 text-sm flex items-center justify-between"> <AiOutlineClockCircle size={24} className='mr-2' />
              <span className="mr-2"> Fresh deals in</span>  <Timer className="ml-2" />
            </span>
          </div>

          {/* Buttons aligned to the right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronRight />
            </button>
          </div>
        </div>


        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
        >
          {products.slice(0, 10).map((item) =>
            item?.id ? (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="bg-white border  group border-gray-200 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition duration-200 flex flex-col max-w-[249px]  overflow-hidden flex-shrink-0"
              >
                <div className="relative">
                  <img
                    className="object-cover max-w-full rounded-t-xl"
                    src={item.images?.[0]}
                    alt={item.name} loading="eager"
                    style={{ aspectRatio: "1 / 0.8" }}
                  />
                  <span
                    className="absolute top-2 right-2 hidden group-hover:flex fade-slide-up items-center justify-center w-8 h-8 rounded-full bg-white cursor-pointer"
                  >
                    <Heart product={item} />
                  </span>
                  {item.shipsNextDay && (
                    <span className="absolute bottom-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SHIPS NEXT DAY
                    </span>
                  )}
                </div>

                <div className="p-3 flex flex-col flex-grow">


                  <div className="p-3 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-gray-800 font-semibold truncate mr-2 flex-grow">{item.name}</p>

                      <span className="font-bold mr-0.5">4.9</span>
                      <span className="">★</span>

                    </div>

                    {item.saleText && (
                      <p className="text-xs text-gray-600 mb-1 truncate">{item.saleText}</p>
                    )}

                    <div className="flex items-center mb-1">
                      {item.price && (
                        <p className="text-lg text-gray-800 font-bold mr-2">USD {item.price.toFixed(2)}</p>
                      )}
                      {item.oldPrice && item.discount && (
                        <p className="text-sm text-gray-600 line-through mr-2">USD 260</p>
                      )}
                      {item.discount && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          {item.discount}% off
                        </span>
                      )}
                    </div>
                  </div>

                  {item.saleText && <p className="text-xs text-gray-600 mt-1">{item.saleText}</p>}
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>
      <section className="max-w-screen-xl py-8 px-4 sm:px-6 lg:px-8 mx-auto lg:py-16">
        {/* Grid with 3 columns on large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {/* Text Block (acts like first image card) */}
          <div className="bg-white rounded-2xl p-6 flex flex-col justify-center col-span-2 lg:col-span-1 w-full h-[250px]">
            <span className="text-sm text-gray-500">Editors' Picks</span>
            <h2 className="text-2xl font-semibold text-primary mb-2">The Linen Shop</h2>
            <p className="mb-4">Treat yourself to these easy, breezy designs that make every day feel like a vacation.</p>
            <button className="p-2 bg-gray-100 rounded-3xl hover:shadow-xl transition font-semibold ">
              Shop these unique finds
            </button>
          </div>

          {/* Products 1–5 */}
          {products.slice(1, 6).map((product, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden group "
            >
              <img
                src={product?.images?.[0]}
                alt={product?.name || "product"}
                className="object-cover  w-[60rem]  h-[15rem] " loading="eager"
              />
              <span
                className="absolute top-2 right-2 hidden group-hover:flex fade-slide-up items-center justify-center w-8 h-8 rounded-full bg-white cursor-pointer"
              >
                <Heart product={product} className="w-4 h-4 text-black" />
              </span>
              <p className="absolute bottom-2 right-2 hidden group-hover:flex fade-slide-up text-sm text-black bg-white rounded-2xl px-2 py-1 shadow-md">
                USD {product?.price}.99
              </p>
            </div>
          ))}
        </div>
      </section>


      <section className="max-w-screen-xl py-8 px-4 sm:px-6 lg:px-8 mx-auto lg:py-16 ">
        <h2 className="text-3xl font-semibold text-primary mb-2 md:mb-2" style={{ marginBottom: "2rem" }}>
          Save now on standout styles
        </h2>

        <ul className="list-none grid grid-cols-2 md:grid-cols-none  md:flex md:flex-row ">
          {products.slice(5, 10).map((item, index) => (
            <li
              key={item.id || index}
              className="bg-transparent  px-1 rounded-2xl cursor-pointer  ease-in-out  flex gap-2 flex-col items-center hover:shadow-xl transition duration-200 lg:px-3"
            >


              <div className=" flex flex-col items-center" onClick={() => navigate(`/product/${item.id}`)}>
                <img
                  src={item?.images?.[0]}
                  alt={item?.name || "product"}
                  className="object-cover w-[60rem]  h-[15rem]   rounded-2xl mx-auto" loading="eager"
                />
                <p className="text-lg text-center mt-1 md:mt-2 truncate max-w-full">
                  {item.name.length > 15 ? item.name.slice(0, 15) + "…" : item.name}
                </p>
                <p className="text-lg text-center mt-1 md:mt-2 truncate max-w-full">up to {item.discount}% off</p>
              </div>
            </li>


          ))}
        </ul>
      </section>
      <div className="bg-yellow-50 py-8 px-4 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-black-800 mb-2">What is Etsy?</h2>
            <a href="#" className="text-black-600 text-sm underline">Read our wonderfully weird story</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-black-700 text-center md:text-left mb-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">A community doing good</h3>
              <p className="mb-4">
                Etsy is a global online marketplace, where people come together to make, sell, buy, and collect unique items. We're also a community pushing for positive change for small businesses, people, and the planet.
              </p>
              <a href="#" className="text-black-700 border-b border-dashed ">
                Here are some of the ways we're making a positive impact, together.
              </a>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Support independent creators</h3>
              <p>
                There's no Etsy warehouse – just millions of people selling the things they love. We make the whole process easy, helping you connect directly with makers to find something extraordinary.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Peace of mind</h3>
              <p>
                Your privacy is the highest priority of our dedicated team. And if you ever need assistance, we are always ready to step in for support.
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-black-700 text-lg mb-6">Have a question? Well, we've got some answers.</p>
            <button className=" text-black-700 py-3 px-6 border border-black rounded-full hover:bg-gray-100 hover:shadow-2xl transition duration-200">
              Go to Help Center
            </button>
          </div>
        </div>
      </div>

    </>

  )
}

export default Main