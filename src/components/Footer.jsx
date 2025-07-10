import React, { useState } from 'react';
import { FaGlobe, FaInstagram, FaFacebookF, FaPinterestP, FaYoutube, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Footer = () => {
    // State for managing collapsible sections on mobile
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const isSectionOpen = (section) => openSection === section;

    // Define footer links data (keeping this from the previous refactoring for better code)
    const footerLinks = {
        shop: [
            { name: 'Gift cards', href: '#' },
            { name: 'Etsy Registry', href: '#' },
            { name: 'Sitemap', href: '#' },
            { name: 'Etsy blog', href: '#' },
            { name: 'Etsy United Kingdom', href: '#' },
            { name: 'Etsy Germany', href: '#' },
            { name: 'Etsy Canada', href: '#' },
        ],
        sell: [
            { name: 'Sell on Etsy', href: '#' },
            { name: 'Teams', href: '#' },
            { name: 'Forums', href: '#' },
            { name: 'Affiliates & Creators', href: '#' },
        ],
        about: [
            { name: 'Etsy, Inc.', href: '#' },
            { name: 'Policies', href: '#' },
            { name: 'Investors', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Press', href: '#' },
            { name: 'Impact', href: '#' },
            { name: 'Legal Imprint', href: '#' },
        ],
        help: [
            { name: 'Help Center', href: '#' },
            { name: 'Privacy settings', href: '#' },
        ],
    };

    // Helper function to render link lists
    const renderLinks = (links) => (
        <ul>
            {links.map(link => (
                <li key={link.name} className="mb-2">
                    <a href={link.href} className="hover:underline">{link.name}</a>
                </li>
            ))}
        </ul>
    );


    return (
        <footer>
             <div className="bg-blue-200 py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <p className="mb-4 text-center">
          <b> Yes! Send me exclusive offers, unique gift ideas, and personalized tips for shopping and selling on Etsy.</b>
        </p>
        <form className="flex justify-between max-w-md w-full mx-auto rounded-full border bg-white border-gray-300 overflow-hidden group focus-within:border-blue-500 focus-within:border-b-2  transition duration-200 "> {/* Added group and focus-within:border-blue-500 */}
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 py-3 px-4 focus:outline-none text-sm text-gray-700"
          />
          <button
            type="submit"
            className="bg-white text-gray-700 font-semibold py-3 px-4 group-focus-within:bg-black group-focus-within:text-white text-sm hover:bg-black hover:text-white transition duration-200"
          >
            Subscribe
          </button>
        </form>
      </div>
            <div className="bg-blue-600 text-white text-center py-8 text-xl flex flex-col lg:flex-row items-center justify-center">
                <FaGlobe className="mr-2" />
                <p className='border-b border-dashed '>Etsy is powered by 100% renewable electricity.</p>
            </div>
            <div className="bg-blue-800 text-gray-300  ">
                <div className="max-w-screen-xs mx-auto  ">
                    <div className="hidden md:flex px-4 sm:px-6 lg:px-8">
                        <div className="w-1/3 bg-blue-900 flex flex-col items-center justify-center p-8"> {/* Adjust width as needed, added padding */}
                            <div className="bg-orange-500 p-2 rounded-xl w-16 h-16 flex items-center justify-center font-serif text-2xl mb-4">Etsy</div> {/* Etsy Logo */}
                            <button className="bg-blue-700 text-white py-2 px-4 rounded-full text-sm hover:shadow-2xl transition duration-200">
                                Download the Etsy App
                            </button>
                        </div>
                        <div className="w-2/3 grid grid-cols-4 gap-8 p-8">
                            <div className='py-12'>
                                <h3 className="text-lg font-semibold text-white mb-4">Shop</h3>
                                {renderLinks(footerLinks.shop)}
                            </div>

                            {/* Sell Column */}
                            <div className='py-12'>
                                <h3 className="text-lg font-semibold text-white mb-4">Sell</h3>
                                {renderLinks(footerLinks.sell)}
                            </div>

                            {/* About Column */}
                            <div className='py-12'>
                                <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                                {renderLinks(footerLinks.about)}
                            </div>

                            {/* Help & Social Icons Column */}
                            <div className='py-12'>
                                <h3 className="text-lg font-semibold text-white mb-4">Help</h3>
                                {renderLinks(footerLinks.help)}
                                {/* Social Icons */}
                                {/* Desktop Layout Icons */}
                                <div className="hidden md:flex space-x-4 text-xl mt-4"> {/* Desktop icons */}
                                    <a href="#" aria-label="Instagram" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-700 transition duration-200">
                                        <FaInstagram className="text-white w-4 h-4" /> {/* Icon color is white */}
                                    </a>
                                    <a href="#" aria-label="Facebook" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-700 transition duration-200">
                                        <FaFacebookF className="text-white w-4 h-4" /> {/* Icon color is white */}
                                    </a>
                                    <a href="#" aria-label="Pinterest" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-700 transition duration-200">
                                        <FaPinterestP className="text-white w-4 h-4" /> {/* Icon color is white */}
                                    </a>
                                    <a href="#" aria-label="Youtube" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-700 transition duration-200" >
                                        <FaYoutube className="text-white w-4 h-4" /> {/* Icon color is white */}
                                    </a>
                                </div>

                                {/* Mobile Layout Icons */}
                                <div className="flex md:hidden justify-center space-x-6 text-2xl mt-8 text-gray-300"> {/* Mobile icons, ensure they are hidden on desktop */}
                                    <a href="#" aria-label="Instagram" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-700 transition duration-200">
                                        <FaInstagram className="text-white" /> {/* Icon color is white */}
                                    </a>
                                    <a href="#" aria-label="Facebook" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-700 transition duration-200">
                                        <FaFacebookF className="text-white" /> {/* Icon color is white */}
                                    </a>
                                    <a href="#" aria-label="Pinterest" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-700 transition duration-200">
                                        <FaPinterestP className="text-white" /> {/* Icon color is white */}
                                    </a>
                                    <a href="#" aria-label="Youtube" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-700 transition duration-200">
                                        <FaYoutube className="text-white" /> {/* Icon color is white */}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout - Collapsible Sections */}
                    {/* Hidden on medium screens and up, shown on mobile */}
                    <div className="md:hidden ">
                        {/* Etsy Logo and App Button - Mobile */}


                        {/* Collapsible Sections */}
                        {Object.keys(footerLinks).map(sectionKey => (
                            <div key={sectionKey} className="transition-transform duration-1000 px-4 sm:px-6 lg:px-8">
                                <button
                                    className="flex justify-between items-center w-full py-4 text-lg font-semibold text-white"
                                    onClick={() => toggleSection(sectionKey)}
                                    aria-expanded={isSectionOpen(sectionKey)}
                                    aria-controls={`footer-section-${sectionKey}`}
                                >
                                    {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
                                    <FaChevronDown
                                        className={`transition-transform duration-300 ${isSectionOpen(sectionKey) ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {isSectionOpen(sectionKey) && (
                                    <div
                                        id={`footer-section-${sectionKey}`}
                                        className={`transition-all duration-1000 text-white text-base pb-4`}
                                        style={{
                                            overflow: 'hidden !important',
                                            maxHeight: isSectionOpen(sectionKey) ? '1000px !important' : '0 !important',
                                            transitionDuration: '1000ms !important'
                                        }}
                                    >
                                        {renderLinks(footerLinks[sectionKey])}
                                    </div>
                                )}
                            </div>
                        ))}


                        {/* Social Icons - Mobile */}
                        <div className="flex justify-center space-x-6 text-2xl mt-4 text-gray-300 mb-2">
                            <a href="#" className=" flex items-center justify-center w-12 h-12 rounded-full hover:bg-blue-200 bg-opacity-80 transition duration-200" ><FaInstagram className='w-8 h-8 text-white' /></a>
                            <a href="#"  className=" flex items-center justify-center w-12 h-12 rounded-full hover:bg-blue-200 bg-opacity-80 transition duration-200"><FaFacebookF className='w-8 h-8 text-white' /></a>
                            <a href="#"  className=" flex items-center justify-center w-12 h-12 rounded-full hover:bg-blue-200 bg-opacity-80 transition duration-200"><FaPinterestP className='w-8 h-8 text-white' /></a>
                            <a href="#" className=" flex items-center justify-center w-12 h-12 rounded-full hover:bg-blue-200 bg-opacity-80 transition duration-200"><FaYoutube className='w-8 h-8 text-white' /></a>
                        </div>
                              <div className=" bg-blue-950  flex flex-row justify-center items-center py-4 px-9">
                            <div className="bg-orange-500 p-2 rounded-xl w-16 h-16 flex items-center justify-center font-serif text-2xl mb-4 mt-4">Etsy</div>
                            <button className="bg-blue-700 text-white py-2 px-4 rounded-full  text-sm hover:shadow-2xl transition duration-200 ml-2.5">
                                Download the Etsy App
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Legal, Language, Copyright */}
            <div className="bg-gray-800 text-white text-sm py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    {/* Language, Currency, Country */}
                    <div className="flex items-center mb-4 md:mb-0">
                        <FaGlobe className="mr-2" />
                        <span>Azerbaijan | English (US) | $ (USD)</span>
                    </div>

                    {/* Copyright */}
                

                    {/* Legal Links */}
                    <div className="flex flex-wrap justify-center md:justify-start space-x-4">
                          <span>© {new Date().getFullYear()} Etsy, Inc.</span>
                        <a href="#" className="underline">Terms of Use</a>
                        <a href="#" className="underline">Privacy</a>
                        <a href="#" className="underline">Interest-based ads</a>
                        <a href="#" className="underline">Local Shops</a>
                        <a href="#" className="underline">Regions</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;