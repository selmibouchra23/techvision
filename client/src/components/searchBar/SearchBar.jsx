import { useContext, useState } from "react";
import myContext from "../../context/myContext";
import { useNavigate } from "react-router-dom";



const SearchBar = () => {

  const context = useContext(myContext );
  const { getAllProduct } = context
  //search state
  const [search, setSearch] = useState("");

  // filter search data  
  const filterSearchData = getAllProduct.filter((obj) => obj.title.toLowerCase().includes(search)).slice(0, 8);
  const navigate = useNavigate();

  return (
    <div className=" flex flex-col flex-1 p-6 pl-20 ">
      {/* title + search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <h1 className="text-2xl font-semibold">Rental Services</h1>

        {/* شريط البحث */}
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-200 placeholder-gray-400 rounded-lg px-4 py-2 w-full sm:w-80 outline-none text-black"
          />

          {/*  search drop down  */}
          {search && (
            <div className="absolute bg-gray-200 w-full sm:w-80 z-50 mt-2 rounded-lg px-2 py-2 shadow-lg">
              {filterSearchData.length > 0 ? (
                filterSearchData.map((item, index) => (
                  <div key={index} className="py-2 px-2 flex items-center  cursor-pointer gap-2"
                    onClick={() => navigate(`/productinfo/${item.id}`)}>
                    <img className="w-10" src={item.productImageUrl} alt=""/>
                    {item.title}
                  </div>
                ))
              ) : (
                <div className="flex justify-center">
                  <img
                    className="w-20"
                    src="https://cdn-icons-png.flaticon.com/128/10437/10437090.png"
                    alt="No results"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
