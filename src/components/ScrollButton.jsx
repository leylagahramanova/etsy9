import React, { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
const ScrollButton = () => {
	const [visible, setVisible] = useState(false);

	const toggleVisible = () => {
		const scrolled = document.documentElement.scrollTop;
		if (scrolled > 300) {
			setVisible(true);
		} else if (scrolled <= 300) {
			setVisible(false);
		}
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};

	window.addEventListener("scroll", toggleVisible);

	return (
		<button onClick={scrollToTop} 
>
			<FaArrowUp
				onClick={scrollToTop} className="fixed bottom-8 right-4 z-20 p-3 h-15 w-15 rounded-full bg-orange-500 text-white shadow-lg transition-opacity duration-300"
				style={{ display: visible ? "inline" : "none" }} size={40}
			/>
		</button>
	);
};

export default ScrollButton;