import React, { useState } from "react";
import wed1 from "../../public/wed1.avif"
import wed2 from "../../public/wed2.webp"
import wed3 from "../../public/wed3.avif"
import wed4 from "../../public/wed4.webp"
import wed5 from "../../public/wed5.avif"
import wed6 from "../../public/wed6.avif"
import wed7 from "../../public/wed7.webp"
import wed8 from "../../public/wed8.avif"
import {
  FaBirthdayCake, FaCrown, FaHeart, FaEnvelope, FaHandHoldingHeart,
  FaBaby, FaUserFriends, FaGift, FaRing, FaHome, FaRibbon
} from "react-icons/fa";

const categories = [
  { id: "wedding", name: "Wedding", icon: <FaHeart /> },
  { id: "birthday", name: "Birthday", icon: <FaBirthdayCake /> },
  { id: "anniversary", name: "Anniversary", icon: <FaCrown /> },
  { id: "thankyou", name: "Thank You", icon: <FaEnvelope /> },
  { id: "sympathy", name: "Sympathy", icon: <FaHandHoldingHeart /> },
  { id: "getwell", name: "Get Well", icon: <FaGift /> },
  { id: "engagement", name: "Engagement", icon: <FaRing /> },
  { id: "newbaby", name: "New Baby", icon: <FaBaby /> },
  { id: "expectingparent", name: "Expecting Parent", icon: <FaUserFriends /> },
  { id: "justbecause", name: "Just Because", icon: <FaRibbon /> },
  { id: "housewarming", name: "Housewarming", icon: <FaHome /> },
];

const staticProducts = [
  { title: "Wedding Keepsake Displays", image: "/wed1.avif" },
  { title: "First Dance Song Gifts", image: "/wed2.webp" },
  { title: "Couples Mugs", image: "/wed3.avif" },
  { title: "Last Name Signs", image: "/wed8.avif" },
  { title: "Personalized Coasters", image: "/wed4.webp" },
  { title: "Couple Sweatshirts", image: "/wed5.avif" },
  { title: "Engraved Cutting Boards", image: "/wed6.avif" },
  { title: "Custom Map Prints", image: "/wed7.webp" },
];

const Gifts = () => {
  const [selectedCat, setSelectedCat] = useState("wedding");

  return (
    <div className="max-w-screen-xl py-4 px-4 sm:px-6 lg:px-8 mx-auto lg:py-8">
     
        <h1 className="text-4xl font-serif text-center mb-2">Extra-special gifting made extra-easy</h1>
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Discover perfect picks for the occasion!
        </h2>

        {/* Category Row */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full mb-2 text-2xl transition-all
                  ${selectedCat === cat.id
                    ? "bg-none text-black "
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}
              >
                {cat.icon}
              </div>
              <span
                className={`text-sm font-medium ${selectedCat === cat.id ? "text-black" : "text-gray-500"}`}
              >
                {cat.name}
              </span>
              {selectedCat === cat.id && (
                <div className="h-1 w-8 bg-black rounded-full mt-2" />
              )}
            </div>
          ))}
        </div>

        {/* Masonry Product Grid */}
        <div className=" columns-2 md:columns-4 gap-4 space-y-4">
          {staticProducts.map((product, idx) => (
            <div
              key={idx} 
              className="  mb-4 break-inside-avoid bg-white rounded-2xl shadow border border-gray-200 flex flex-col overflow-hidden hover:shadow-lg"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full object-cover"
                style={{  width: "100%", height:"auto"}}
              />
              <div className="w-full text-center py-4 text-lg font-medium border-t border-gray-100 bg-white">
                {product.title}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default Gifts;