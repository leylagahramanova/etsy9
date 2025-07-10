import React from 'react';
import { Dropdown } from 'antd';
import { FaUserCircle} from "react-icons/fa";
import { FileTextOutlined, MessageOutlined, GiftOutlined, AppstoreAddOutlined, ShopOutlined, QuestionCircleOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { RiArrowDownSFill } from "react-icons/ri";
import { Tooltip } from '@mui/material';

const UserMenuItem = ({ user, onSignOut }) => {
    const userMenuItems = [
        {
            key: 'profile-header',
            label: (
                <div className="flex items-center p-2 bg-blue-100">
                     <Tooltip title="Your Account" placement="bottom">
                    <FaUserCircle size={24} className="mr-2 text-gray-600" />
                    </Tooltip>
                    <div>
                        <p className="font-semibold text-black">{user?.displayName || user?.email || 'Guest'}</p>
                        <p className="text-sm text-gray-500">View your profile</p>
                    </div>
                </div>
            ),
            disabled: true,
        },
        { type: 'divider' },
        {
            key: 'purchases',
            label: 'Purchases and reviews',
            icon: <FileTextOutlined size={24} />,
        },
        {
            key: 'messages',
            label: 'Messages',
            icon: <MessageOutlined size={24} />,
        },
        { type: 'divider' },
        {
            key: 'special-offers',
            label: 'Special offers',
            icon: <GiftOutlined size={24} />,
        },
        {
            key: 'etsy-registry',
            label: 'Etsy Registry',
            icon: <AppstoreAddOutlined size={24} />,
        },
        {
            key: 'sell-on-etsy',
            label: 'Sell on Etsy',
            icon: <ShopOutlined size={24} />,
        },
        { type: 'divider' },
        {
            key: 'help-center',
            label: 'Help Center',
            icon: <QuestionCircleOutlined size={24} />,
        },
        {
            key: 'account-settings',
            label: 'Account settings',
            icon: <SettingOutlined size={24} />,
        },
        {
            key: 'sign-out',
            label: 'Sign out',
            icon: <LogoutOutlined size={24} />,
            onClick: onSignOut,
        },
    ];

    return (
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} arrow style={{ padding: '0' }}>
            <div className='flex py-1 px-2 rounded-full hover:bg-blue-100 group cursor-pointer group-hover:text-blue-700'>
                   <Tooltip title="Your Account" placement="bottom" className='flex'>
                                   <FaUserCircle size={24} className="text-gray-700 cursor-pointer" />
                <RiArrowDownSFill size={20} />
                   </Tooltip>

            </div>
        </Dropdown>
    );
};

export default UserMenuItem; 