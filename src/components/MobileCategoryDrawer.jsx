import React from 'react';
import { Drawer, Menu } from 'antd';
import { CloseOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';

const MobileCategoryDrawer = ({
    drawerVisible,
    setDrawerVisible,
    currentDrawerCategories,
    setCurrentDrawerCategories,
    drawerHistory,
    setDrawerHistory,
    drawerTitle,
    setDrawerTitle,
    categories,
    handleMainCategoryClick,
    handleCategorySelect,
    handleBackInDrawer
}) => {

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
        <Drawer
            title={null}
            onClose={() => setDrawerVisible(false)}
            placement="bottom"
            key="left-drawer"
            open={drawerVisible}
            closable={false}
        >
            <div className="flex justify-between items-center mb-4">
                {drawerHistory.length > 0 ? (
                    <div className="flex items-center">
                        <button onClick={handleBackInDrawer} className="mr-2 text-xl"><LeftOutlined /></button>
                        <div className='flex items-center flex-col justify-center' style={{ margin: "auto" }}>
                            <span className="font-semibold text-lg">{drawerTitle}</span>
                            
                        </div>
                    </div>
                ) : (
                    <span className="font-semibold text-lg">{drawerTitle}</span>
                )}
                <CloseOutlined
                    onClick={() => setDrawerVisible(false)}
                    className="text-xl cursor-pointer"
                />
            </div>

            <Menu
                mode="inline"
                items={mobileMenuItems}
                style={{ borderRight: 0 }}
            />
        </Drawer>
    );
};

export default MobileCategoryDrawer; 