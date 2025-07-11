import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiArrowRightSFill } from "react-icons/ri";

const DesktopCategoryDropdown = ({ categories, onCategorySelect }) => {
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (categories.length > 0 && !selectedMainCategory) {
            setSelectedMainCategory(categories[0]);
        }
    }, [categories, selectedMainCategory]);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg flex min-w-[700px] max-h-[300px]  overflow-hidden">
            <div className="w-1/3 border-r border-gray-200 py-4">
                <ul className="mt-2">
                    {categories.map((mainCat) => (
                        <li
                            key={mainCat.slug}
                            className={`px-4 py-2 font-medium cursor-pointer hover:bg-gray-100 flex items-center justify-between ${selectedMainCategory?.slug === mainCat.slug ? 'bg-gray-100 font-semibold' : ''}`}
                            onMouseEnter={() => setSelectedMainCategory(mainCat)}
                            onClick={() => navigate(`/category/${mainCat.slug}`)}
                        >
                            <span className='font-medium'>{mainCat.name}</span>
                            <RiArrowRightSFill />
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {selectedMainCategory ? (
                    <>
{selectedMainCategory && (
  <Link
    to={`/category/${selectedMainCategory.slug}`}
    className="text-lg font-bold text-black mb-4 flex items-center hover:underline"
  >
    All {selectedMainCategory.name} <RiArrowRightSFill className="ml-2" />
  </Link>
)}
                        <div className="flex justify-start gap-2 mt-4">
                            {selectedMainCategory.subcategories.map((subCat) => (
                                <div
                                    key={subCat.slug}
                                    className="flex flex-col items-center cursor-pointer hover:bg-gray-50 rounded-lg p-2"
                                    onClick={() => onCategorySelect({ key: subCat.slug })}
                                >
                                    <img src={subCat.image} alt={subCat.name} loading="eager" className="w-16 h-16 rounded-lg object-cover mb-2" />
                                    <p className="font-medium  text-center">{subCat.name}</p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500 py-10">Select a category on the left to see subcategories.</div>
                )}
            </div>
        </div>
    );
};

export default DesktopCategoryDropdown; 