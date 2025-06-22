import React, { useContext } from "react";
import Sidebar from "../../components/sideBar/SideBar"; 
import SearchBar from "../searchBar/SearchBar";
import Category from "../category/Category";

import HomePageProductCard from "../homePageProductCard/HomePageProductCard";
import myContext from "../../context/myContext";

function RentalServiceRequest() {
    const context = useContext(myContext);
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                    <SearchBar />
                </div>
                <div className="w-full">
                    <Category />
                 </div>
                <HomePageProductCard /> 
                
                

            </div>
        </div>
    );
}

export default RentalServiceRequest;
