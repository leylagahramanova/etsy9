import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

// `product` və `setLastAction` prop-ları komponentə parent-dən gəlir
const Heart = ({ product, setLastAction }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false); // Məhsulun istəklər siyahısında olub olmadığını saxlayır

  // Komponent yüklənəndə və ya `product` dəyişəndə localStorage-dən "wishlist" oxunur
  useEffect(() => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const productInWishlist = existingWishlist.some((p) => p.id === product.id);
    setIsFavorite(productInWishlist); // Əgər varsa, ürək dolu olur
  }, [product]);
  // Ürəyə kliklənəndə bu funksiya işə düşür
  const handleToggleWishlist = () => {
    let currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (isFavorite) {
        // Əgər məhsul artıq siyahıdadırsa — silinir
      currentWishlist = currentWishlist.filter((p) => p.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(currentWishlist)); // Yenilənmiş siyahı localStorage-ə yazılır
      setIsFavorite(false); // State yenilənir
      if (setLastAction) setLastAction("deleted");  // Əgər `setLastAction` varsa, son əməliyyatı bildirir
    } else {
         // Əgər məhsul siyahıda deyilsə — əlavə olunur
      currentWishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(currentWishlist)); // Yeni siyahı saxlanılır
      setIsFavorite(true); // State yenilənir
      if (setLastAction) setLastAction("added"); // Əməliyyat qeyd olunur
    }
  };

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();  // Valideyn komponentin klik hadisəsinin qarşısını alır
        handleToggleWishlist();// Favorites siyahısına əlavə et və ya sil
      }}
      className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 shadow-xl rounded-full bg-white cursor-pointer z-10 "
    >
      {isFavorite ? (
        <AiFillHeart className="w-8 h-8 text-red-500" />
      ) : (
      <AiOutlineHeart className="w-8 h-8 text-black" />
      )}
    </span>
  );
};

export default Heart;
