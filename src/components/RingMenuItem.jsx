import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'antd';
import { RiArrowDownSFill } from "react-icons/ri";

import { Tooltip } from '@mui/material';
import { PiBellSimpleRinging } from 'react-icons/pi';
const RingMenuItem = () => {
    const RingMenuItems = [
        {
            key: 'help-support-header',
            label: (
                <div className="p-2 bg-blue-100 rounded-t-lg">
                    <h3 className="font-semibold text-lg text-gray-800">Alarm</h3>
                </div>
            ),
            disabled: true,
        },
        {
            key: 'seller-help-text',
            label: (
                <div className="px-4 py-2 text-black text-sm">
                    There will be news about our features
                </div>
            ),
            disabled: true,
        },

    ];
    return (
        <>
            <Dropdown trigger={['click']} arrow style={{ padding: '0' }}>

                <div className='flex py-1 pr-1 rounded-full hover:bg-blue-100 group cursor-pointer group-hover:text-blue-700'>
                    <Tooltip title="Deals" placement="bottom" className='flex'>
                        <span className="flex items-center">
                            <PiBellSimpleRinging size={24} className="text-gray-700 cursor-pointer" />
                            <RiArrowDownSFill size={20} />
                        </span>
                    </Tooltip>

                </div>
            </Dropdown>
        </>
    )
}

export default RingMenuItem
