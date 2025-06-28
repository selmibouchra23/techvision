import { useState } from "react";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    FiMenu,
    FiTrendingUp,
    FiShoppingBag,
    FiUserPlus,
    FiShoppingCart,
} from "react-icons/fi";

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    // CartItems
    const cartItems = useSelector((state) => state.cart.items)  || [];

    const Menus = [
        { title: "Most Requested Products", icon: <FiTrendingUp  size={24} />, path: "/request-rental-service" },
        { title: "All Products", icon: <FiShoppingBag size={24} />, path: "/allproduct" },
        { title: `Cart(${cartItems.length})`, icon: <FiShoppingCart size={24} />, path: "/cart" , gap: true},
        { title: "Be saller", icon: <FiUserPlus size={24} />, path: "/signup" }
        
    ];

    return (
        <div>
            {/* Sidebar fixé*/}
            <div
                className={`fixed top-0 left-0 h-screen bg-gray-100 p-5 pt-8 transition-all duration-300 z-50 ${
                    open ? "w-72" : "w-15"
                }`}
            >
                
                {/* Sidebar kabarto  */}
                <button
                    className="top-[15%] absolute -right-3 top-9 w-7 h-7 flex items-center justify-center border-2 border-gray-300 rounded-full bg-gray-200 text-black"
                    onClick={() => setOpen(!open)}
                >
                    <FiMenu size={20} />
                </button>

                {/* title */}
                <div className=" mt-20 flex gap-x-4 items-center">
                    <h1
                        className={` text-black font-bold text-xl duration-300 ${
                            !open && " hidden"
                        }`}
                    >
                        Computer Equipment Rental
                    </h1>
                </div>

                {/* menu */}
                <ul className="mt-[10%] pt-6">
                    {Menus.map((menu, index) => (
                        <li
                            key={index}
                            className={`flex items-center rounded-md p-2 cursor-pointer text-gray-800 text-sm transition hover:bg-gray-300 
                            ${menu.gap ? "mt-9" : "mt-2"}`}
                        >
                            <Link to={menu.path} className="flex items-center gap-x-4 w-full">
                                <span className="text-black pl-1">{menu.icon}</span>
                                <span
                                    className={`ml-3 text-black font-medium duration-300 ${
                                        !open && "hidden"
                                    }`}
                                >
                                    {menu.title}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* bah le contenu myjich motadakhil Sidebar */}
            <div className={`ml-${open ? "72" : "20"} transition-all duration-300`}>
                {/* le contenu */}
            </div>
        </div>
    );
};

export default Sidebar;
