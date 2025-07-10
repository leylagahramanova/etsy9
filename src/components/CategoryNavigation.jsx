import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Drawer, Menu } from 'antd';
import { Space } from 'antd';
import { FaBars } from 'react-icons/fa';
import { RiArrowDownSFill, RiArrowRightSFill } from "react-icons/ri";
import { CloseOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import DesktopCategoryDropdown from './DesktopCategoryDropdown';
import MobileCategoryDrawer from './MobileCategoryDrawer';

// Helper function to format category slugs for display
const formatCategoryDisplayName = (slug) => {
    if (!slug) return '';

    const parts = slug.split('/'); // Split by '/' to handle category/subcategory
    let formattedParts = parts.map(part => {
        // Replace hyphens with spaces, then capitalize each word in the part
        return part.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    });

    return formattedParts.join(' / '); // Join back with ' / ' for combined display
};

const CategoryNavigation = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [drawerVisible, setDrawerVisible] = useState(false); // State for drawer visibility
    const [currentDrawerCategories, setCurrentDrawerCategories] = useState([]);
    const [drawerHistory, setDrawerHistory] = useState([]); // To manage back navigation in drawer
    const [drawerTitle, setDrawerTitle] = useState("Browse Categories");

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://ecommerce.ibradev.me/products/all")
            .then((res) => {
                console.log("API response (CategoryNavigation):", res.data);

                const fetchedProducts = res.data.data;

                if (Array.isArray(fetchedProducts)) {
                    const categoryMap = new Map();

                    fetchedProducts.forEach(product => {
                        const mainCategorySlug = product.category?.slug;
                        const subcategorySlug = product.subcategory?.slug;

                        if (mainCategorySlug) {
                            if (!categoryMap.has(mainCategorySlug)) {
                                categoryMap.set(mainCategorySlug, {
                                    name: formatCategoryDisplayName(mainCategorySlug),
                                    slug: mainCategorySlug,
                                    subcategories: new Map()
                                });
                            }

                            if (subcategorySlug) {
                                const currentMainCategory = categoryMap.get(mainCategorySlug);
                                if (!currentMainCategory.subcategories.has(subcategorySlug)) {
                                    currentMainCategory.subcategories.set(subcategorySlug, {
                                        name: formatCategoryDisplayName(`${subcategorySlug}`), // Changed to just subcategory name
                                        slug: `${mainCategorySlug}/${subcategorySlug}`,
                                        image: product.images?.[0]  // Use first product image as subcategory image
                                    });
                                }
                            }
                        }
                    });

                    // Convert maps back to arrays for state
                    const processedCategories = Array.from(categoryMap.values()).map(mainCat => ({
                        ...mainCat,
                        subcategories: Array.from(mainCat.subcategories.values())
                    }));

                    setCategories(processedCategories);
                    setCurrentDrawerCategories(processedCategories); // Initialize drawer with main categories
                } else {
                    console.error("Expected an array in res.data.data, got:", fetchedProducts);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch categories:", err);
            });
    }, []);

    const handleMainCategoryClick = (mainCat) => {
        setDrawerHistory(prev => [...prev, { categories: currentDrawerCategories, title: drawerTitle }]); // Save current view
        setCurrentDrawerCategories(mainCat.subcategories);
        setDrawerTitle(mainCat.name);
    };

    const handleBackInDrawer = () => {
        const lastHistoryItem = drawerHistory.pop();
        if (lastHistoryItem) {
            setCurrentDrawerCategories(lastHistoryItem.categories);
            setDrawerTitle(lastHistoryItem.title);
        } else {
            // Should not happen if history is managed correctly, but as a fallback
            setCurrentDrawerCategories(categories);
            setDrawerTitle("Browse Categories");
        }
        setDrawerHistory([...drawerHistory]); // Ensure state update triggers re-render
    };

    const handleCategorySelect = ({ key }) => {
        setSelectedCategory(key);
        navigate(`/category/${key}`); // Navigate using the full slug
        setDrawerVisible(false); // Close drawer after selection
        // Reset drawer state for next open
        setCurrentDrawerCategories(categories);
        setDrawerHistory([]);
        setDrawerTitle("Browse Categories");
    };

    // Prepare Ant Design Menu items for mobile drawer dynamically
    const mobileMenuItems = currentDrawerCategories.map((item) => {
        if (item.subcategories && item.subcategories.length > 0) { // It's a main category with subcategories
            return {
                key: item.slug,
                label: (
                    <div className="flex justify-between items-center w-full  hover:bg-gray-100 cursor-pointer">
                        <span className='text-xl'>{item.name}</span>
                        <RightOutlined />
                    </div>
                ),
                onClick: () => handleMainCategoryClick(item),
            };
        } else { 
            return {
                key: item.slug,
                label: (
                    <div className="flex items-center gap-2 text-xl">
                        <span>{item.name}</span>
                    </div>
                ),
                onClick: () => handleCategorySelect({ key: item.slug }),
            };
        }
    });

    return (
        <>
            {/* Categories Dropdown Button (Desktop) */}
            <div className="hidden lg:flex">  <Dropdown
                popupRender={() => <DesktopCategoryDropdown categories={categories} onCategorySelect={handleCategorySelect} />}
                trigger={['click']}
                overlayStyle={{ zIndex: 1050 }} // Ensure it's above other elements if needed
            > 
                <Button
                    className="flex items-center text-gray-700 text-base px-3 hover:bg-gray-100 rounded-xl"
                    type="text"
                >
                    <Space>
                        <FaBars className="mr-2" />
                        Categories
                    </Space>
                </Button>
            </Dropdown>
</div>
          
            {/* Second Row - Mobile Categories Button and Search */}
            <div className='lg:hidden'>
                     <button
                className="flex items-center text-gray-700 text-base px-1 py-2 hover:bg-gray-100 rounded-xl"
                onClick={() => {
                    setDrawerVisible(true);
                    setCurrentDrawerCategories(categories); // Always start from main categories when opening drawer
                    setDrawerHistory([]); // Clear history
                    setDrawerTitle("Browse Categories"); // Reset title
                }}
            >
                <FaBars className="mr-2" />
            </button>

            </div>
       
            {/* Ant Design Drawer for Mobile Categories */}
            <MobileCategoryDrawer
                drawerVisible={drawerVisible}
                setDrawerVisible={setDrawerVisible}
                currentDrawerCategories={currentDrawerCategories}
                setCurrentDrawerCategories={setCurrentDrawerCategories}
                drawerHistory={drawerHistory}
                setDrawerHistory={setDrawerHistory}
                drawerTitle={drawerTitle}
                setDrawerTitle={setDrawerTitle}
                categories={categories}
                handleMainCategoryClick={handleMainCategoryClick}
                handleCategorySelect={handleCategorySelect}
                handleBackInDrawer={handleBackInDrawer}
            />
        </>
    );
};

export default CategoryNavigation; 