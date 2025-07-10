import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'antd';
import { FaHandsHelping } from "react-icons/fa";
import { MdHandshake } from "react-icons/md";
import { MessageOutlined, QuestionCircleOutlined, } from '@ant-design/icons';
import { RiArrowDownSFill } from "react-icons/ri";
import { GoQuestion } from "react-icons/go";
import { RightOutlined, } from '@ant-design/icons';
import { Tooltip } from '@mui/material';
const QuestionMenuItem = () => {
    const questionMenuItems = [
        {
            key: 'help-support-header',
            label: (
                <div className="p-2 bg-blue-100 rounded-t-lg">
                    <h3 className="font-semibold text-lg text-gray-800">Help & Support</h3>
                </div>
            ),
            disabled: true,
        },
        {
            key: 'seller-help-text',
            label: (
                <div className="px-4 py-2 text-black text-sm">
                    Reach out to the seller first for help<br />  with an existing order.If you ever need<br /> us, Etsy has your back.
                </div>
            ),
            disabled: true,
        },
        {
            key: 'go-to-purchases',
            label: (
                <Link to="/purchases" className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800">
                    <span>Go to Purchases</span>
                    <RightOutlined />
                </Link>
            ),
        },
        { type: 'divider' },
        {
            key: 'etsy-purchase-protection',
            label: 'Etsy Purchase Protection',
            icon:      <MdHandshake className="w-7 h-7 mr-3 flex-shrink-0 blue-600" />,
            className: 'px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer',
        },
        {
            key: 'help-center',
            label: 'Help Center',
            icon: <QuestionCircleOutlined size={20} />,
            className: 'px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer',
        },
        {
            key: 'contact-etsy-support',
            label: 'Contact Etsy Support',
            icon: <MessageOutlined size={20} />,
            className: 'px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer',
        },
    ];
    return (
        <>
            <Dropdown menu={{ items: questionMenuItems }} trigger={['click']} arrow style={{ padding: '0' }}>
                <div className='flex py-1 px-2 rounded-full hover:bg-blue-100 group cursor-pointer group-hover:text-blue-700'>
                    <Tooltip title="Help & Support" placement="bottom" className='flex'>                                          <GoQuestion size={24} className="text-gray-700 cursor-pointer" />
                        <RiArrowDownSFill size={20} /></Tooltip>

                </div>
            </Dropdown>
        </>
    )
}

export default QuestionMenuItem
