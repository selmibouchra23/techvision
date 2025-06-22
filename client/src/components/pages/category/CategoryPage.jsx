import React, { useContext, useEffect } from 'react'
import SearchBar from '../../searchBar/SearchBar'
import Sidebar from '../../sideBar/SideBar'
import { useNavigate, useParams } from 'react-router-dom';
import myContext from '../../../context/myContext';
import Loader from '../../loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteFromCart } from '../../../redux/cartSlice';
import { toast } from 'react-toastify';


export default function CategoryPage() {
    const {categoryname} = useParams();

    const context = useContext(myContext);
    const { getAllProduct, loading } = context;


    const navigate = useNavigate();

    // filter product 
    const filterProduct = getAllProduct.filter((obj)=> obj.category.includes(categoryname));
     console.log(filterProduct)



     //const cartItems = useSelector((state) => state.cart);
     const cartItems = useSelector((state) => state.cart.items)  || [];
     const dispatch = useDispatch();
 
      //add to cart function
     const addCart = (item) => {
         console.log(item)
         dispatch(addToCart(item));
         console.log("Add succesflly!!")
         toast.success("Add to cart")
     }
 
 
     // eslint-disable-next-line
     const deleteCart = (item) => {
         dispatch(deleteFromCart(item));
         toast.success("Delete from cart")
     }
 
      console.log("cart item: ",  cartItems)
 
     useEffect(() => {
         localStorage.setItem('cart', JSON.stringify(cartItems));
     }, [cartItems])

  return (
    <div className="flex h-screen">
         <Sidebar />
        <div className="flex flex-col flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
                    <SearchBar />
                </div>
            <div className="mt-[-5%] flex flex-col flex-1 p-6 pl-20">
                      {/* Heading  */}
                <div className="">
                    <h1 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl pl-10">Category page : {categoryname}</h1>
                </div>
                </div>
                {loading ?

<div className="flex justify-center">
    <Loader />
</div>

:

<section className="text-gray-600 body-font">
    {/* main 2 */}
    <div className="container px-5 py-5 mx-auto">
        {/* main 3  */}
        <div className="flex flex-wrap -m-4 justify-center">
            {filterProduct.length > 0 ?
                <>
                    {filterProduct.map((item, index) => {
                        const { id, title, price, productImageUrl } = item;
                        return (
                            <div key={index} className="p-4 w-full md:w-1/4">
                                <div className="h-full border border-gray-300 rounded-xl  shadow-md cursor-pointer">
                                        <img
                                        onClick={()=> navigate(`/productinfo/${id}`)}
                                            className="h-60 w-full object-cover mx-auto rounded-xl"
                                            src={productImageUrl}
                                            alt="blog"
                                        />
                                    <div className="p-6">
                                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                            TechVision<i className="fab fa-slack text-gray-400 text-sm" />
                                        </h2>
                                        <h1 className="title-font text-base font-medium text-gray-900 mb-3">
                                            {title.substring(0, 25)}
                                        </h1>
                                        <h1 className="title-font text-base font-medium text-gray-900 mb-3">
                                            {price} DA <span className="text-sm text-gray-700">(for one day)</span>
                                            
                                        </h1>

                                        <div className="flex justify-center ">
                                        {cartItems && cartItems.some((p) => p.id === item.id)
                                                
                                                ?
                                                <button
                                                    onClick={() => deleteCart(item)}
                                                    className=" bg-red-700 hover:bg-red-800 w-full text-white py-[4px] rounded-lg font-bold">
                                                        Delete From Cart
                                                </button>

                                                :
                                                <button onClick={()=> addCart(item)}
                                                 className=" bg-blue-500 hover:bg-blue-600 w-full text-white py-[4px] rounded-lg font-bold">
                                                    Add To Cart
                                                </button>
                                                }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </>

                :

                <div>
                    <div className="flex justify-center">
                        <img className=" mb-2" src="https://cdn-icons-png.flaticon.com/128/2748/2748614.png" alt="" />
                    </div>
                    <h1 className=" text-black text-xl">No {categoryname} product found</h1>
                </div>
            }
        </div>
    </div>
</section>

}
                    



                    </div>
     </div>               

                    
  )
}
