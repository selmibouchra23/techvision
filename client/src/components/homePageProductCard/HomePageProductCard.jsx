import { useNavigate } from "react-router";
import myContext from "../../context/myContext";
import { useContext, useEffect } from "react";
import Loader from "../loader/Loader";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";




const HomePageProductCard = () => {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const {loading, getAllProduct} = context;
 
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
        <div className="mt-[5%] flex flex-col flex-1 p-6 pl-20">
            {/* Heading  */}
            <div className="">
                <h1 className=" text-center mb-5 text-2xl font-semibold">Most Requested Products</h1>
            </div>

            {/* main  */}
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-5 mx-auto">
                    <div className="flex justify-center">
                        {loading && <Loader/>}

                    </div>
                    <div className="flex flex-wrap -m-4">
                    {getAllProduct.slice(0,8).map((item, index) => {
                            const { id, title, price,productImageUrl } = item
                            return (
                                <div key={index} className="p-4 w-full md:w-1/4">
                                    <div className="h-full border border-gray-300 rounded-xl  shadow-md cursor-pointer">
                                            <img
                                            onClick={()=> navigate(`/productinfo/${id}`)}
                                                className="h-60 w-full object-cover mx-auto rounded-xl"
                                                src={productImageUrl}
                                                alt="img"
                                            />
                                        <div className="p-6">
                                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                                TechVision<i className="fab fa-slack text-gray-400 text-sm" />
                                            </h2>
                                            <h1 className="title-font text-base font-medium text-gray-900 mb-3">
                                                {title.substring(0, 25)}
                                            </h1>
                                            <div className="mb-3">
                                            <h1 className="title-font text-base font-medium text-gray-900 mb-3">
                                                {price} DA  <span className="text-sm text-gray-700">(for one day)</span>
                                            </h1>
                                            
                                            </div>

                                            <div 
                                             className="flex justify-center ">
                                               {/* <button onClick={()=> addCart(item)}
                                                 className=" bg-gray-500 hover:bg-gray-600 w-full text-white py-[4px] rounded-lg font-bold">
                                                    Add To Cart
                                                </button>*/}
                                                {cartItems && cartItems.some((p) => p.id === item.id)
                                                
                                                ?
                                                <button
                                                    onClick={() => deleteCart(item)}
                                                    className=" bg-red-700 hover:bg-red-800 w-full text-white py-[4px] rounded-lg font-bold">
                                                        Delete From Carte
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
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePageProductCard;