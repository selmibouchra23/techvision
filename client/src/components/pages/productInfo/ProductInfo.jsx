import React, { useContext, useEffect, useState } from 'react'
import SearchBar from '../../searchBar/SearchBar'
import Sidebar from '../../sideBar/SideBar'
import myContext from '../../../context/myContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Loader from '../../loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteFromCart } from '../../../redux/cartSlice';
import { toast } from 'react-toastify';

const  ProductInfo = ()=> {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const [product, setProduct] = useState('')

    const { id } = useParams()

     // console.log(product)

    // getProductData
    const getProductData = async () => {
        setLoading(true)
        try {
            const productTemp = await getDoc(doc(db, "products", id))
            setProduct({...productTemp.data(), id : productTemp.id} )
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

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
     
     



    useEffect(() => {
        getProductData()
    }, [])
  return (
    <div className="flex h-screen">
      <Sidebar />
        {/*le contenu */}
      <div className="flex flex-col flex-1 p-6">
                    
        <div className="flex items-center justify-between mb-6">
          <SearchBar />
        </div>

        <section className="mt-[-7%] py-5 lg:py-16 font-poppins bg-withe"> {/*dark:bg-gray-800 */}
        {loading ?
                    <>
                        <div className="flex justify-center items-center">
                            <Loader />
                        </div>
                    </>

                    :
                    
                    <div className="max-w-6xl px-4 mx-auto">
                    <div className="flex flex-wrap mb-24 -mx-4">
                        <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
                            <div className="">
                                <div className="">
                                    <img
                                        className=" w-full lg:h-[39em] rounded-lg"
                                        src={product?.productImageUrl}
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full px-4 md:w-1/2">
                            <div className="lg:pl-20">
                                <div className="mb-6 ">
                                    <h2 className="max-w-xl mb-6 text-xl font-semibold leading-loose tracking-wide text-gray-900 md:text-2xl "> {/*dark:text-gray-300 */}
                                    {product?.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center mb-6">
                                        <ul className="flex mb-4 mr-2 lg:mb-0">
                                           {/* <li>
                                                <a href="">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={16}
                                                        height={16}
                                                        fill="currentColor"
                                                        className="w-4 mr-1 text-blue-500  bi bi-star "//dark:text-gray-400
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                                                    </svg>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={16}
                                                        height={16}
                                                        fill="currentColor"
                                                        className="w-4 mr-1 text-blue-500  bi bi-star "//dark:text-gray-400
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                                                    </svg>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={16}
                                                        height={16}
                                                        fill="currentColor"
                                                        className="w-4 mr-1 text-blue-500  bi bi-star "//dark:text-gray-400
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                                                    </svg>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={16}
                                                        height={16}
                                                        fill="currentColor"
                                                        className="w-4 mr-1 text-blue-500  bi bi-star " 
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                                                    </svg>
                                                </a>
                                            </li>*/}
                                        </ul>
                                    </div>
                                    <p className="inline-block text-2xl font-semibold text-gray-700  "> {/*dark:text-gray-400 */}
                                        <span>{product?.price} DA</span> <span className="text-sm text-gray-700">(for one day)</span>
                                    </p>
                                </div>
                                <div className="mb-6">
                                    <h2 className="mb-2 text-lg font-bold text-blue-900 "> {/*dark:text-gray-400 */}
                                        Description :
                                    </h2>
                                    <p className=' text-gray-700'>{product?.description}</p>
                                </div>

                                <div className="mb-6 " />
                                <div className="flex flex-wrap items-center mb-6">
                                {cartItems && cartItems.some((p) => p.id === product.id)
                                                
                                                ?
                                                <button
                                                    onClick={() => deleteCart(product)}
                                                    className=" bg-red-700  w-full px-4 py-3 text-center text-white border border-red-600  
                                                     hover:bg-red-800 hover:text-white active:bg-red-600 active:text-white 
                                                     rounded-xl transition duration-300">
                                                        Delete From Cart
                                                </button>

                                                :
                                                <button onClick={()=> addCart(product)}
                                                 className="w-full px-4 py-3 text-center text-blue-900 bg-blue-100 border border-blue-600  
                                                   hover:bg-blue-200 hover:text-blue-800 active:bg-blue-600 active:text-gray-100 
                                                   rounded-xl transition duration-300">
                                                    Add To Cart
                                                </button>
                                                }
                                   
                                

                                </div>
            
                            </div>
                        </div>
                    </div>
                </div>

        }
                
            </section>
       </div>
    </div>

  )
}

export default ProductInfo