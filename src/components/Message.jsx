// src/components/Message.js
import React from "react";
import {  FaRegClock } from "react-icons/fa";

const Message = ({ isLoggedIn, wishlistItems, signIn, lastAction }) => {

  if (lastAction === "added") {
    return (
      <div className="max-w-screen-xl mx-auto p-4 bg-green-700 text-white rounded-lg flex items-center justify-between mb-8">
      
        <p className="text-xl font-semibold ">Added in Favorites</p>
      </div>
    );
  }

  if (lastAction === "deleted") {
    return (
    <div className="max-w-40 mx-auto p-4 bg-green-700 text-white rounded-lg flex items-center justify-between mb-8">
      
        <p className="text-xl font-semibold ">Removed from Favorites</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-4 bg-green-700 text-white rounded-lg flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-white rounded-full p-2 mr-4">
            <FaRegClock className="text-green-700" size={24} />
          </div>
          <div>
            <p className="text-lg font-semibold">Don&apos;t lose this great collection...</p>
            <p className="text-sm">Guest favorites are only saved for 7 days.</p>
          </div>
        </div>
        <button
          onClick={signIn}
          className="px-6 py-2 border border-white text-white rounded-full font-semibold hover:bg-white hover:text-green-700 transition"
        >
          Sign in
        </button>
      </div>
    );
  }

  return null; // No message by default
};

export default Message;