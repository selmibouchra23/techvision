import { Trash } from 'lucide-react'
import Sidebar from "../../sideBar/SideBar";
import SearchBar from "../../searchBar/SearchBar";
import { useDispatch, useSelector } from 'react-redux';
import { decrementQuantity, deleteFromCart, incrementQuantity } from '../../../redux/cartSlice';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import BuyNowModal from '../../buyNowModal/BuyNowModal';
import { Navigate } from 'react-router-dom';
import { addDoc, collection, Timestamp, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';




const CartPage = () => {

    const cartItems = useSelector((state) => state.cart.items)  || [];
    const dispatch = useDispatch();

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Delete cart")
    }

    const handleIncrement = (id) => {
        dispatch(incrementQuantity(id));
    };

    const handleDecrement = (id) => {
        dispatch(decrementQuantity(id));
    };

    const [days, setDays] = useState({});
    const handleDayChange = (id, value) => {
        const clampedValue = Math.max(1, Math.min(value, 360));
        setDays(prev => ({
            ...prev,
            [id]: clampedValue
        }));
    };



    // const cartQuantity = cartItems.length;
    // cartItem total
    

    const cartItemTotal = cartItems.map(item => item.quantity).reduce((prevValue, currValue) => prevValue + currValue, 0);
    console.log("carte item total:", cartItemTotal )

    const cartTotal = cartItems.reduce((total, item) => {
        const dayCount = days[item.id] || 1;
        return total + item.price * item.quantity * dayCount;
    }, 0);
   /* const cartTotal = cartItems.map(item => item.price * item.quantity).reduce((prevValue, currValue) => prevValue + currValue, 0);
    console.log("carte  total:", cartTotal )
*/
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])



      // user
     // const user = JSON.parse(localStorage.getItem("users"));
      const userData = JSON.parse(localStorage.getItem("user"));
      
      console.log("userData",userData);
    


      console.log("BuyNowModal",BuyNowModal)

      
      //  adress info stat
      const [addressInfo, setAddressInfo] = useState({
          name: "",
          address: "",
          pincode: "",
          mobileNumber: "",
          time: Timestamp.now(),
          date: new Date().toLocaleString(
              "en-US",
              {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
              }
          )
      });
//Notif

const sendNotificationToAdmins = async (userId, userFullName, orderId) => {
  try {
    const adminsRef = collection(db, 'Admins');
    const adminsSnapshot = await getDocs(adminsRef);

    if (!adminsSnapshot.empty) {
      adminsSnapshot.forEach(async (adminDoc) => {
        const adminId = adminDoc.id;

        const adminNotificationsRef = collection(
          db,
          'Admins',
          adminId,
          'Notifications'
        );

        await addDoc(adminNotificationsRef, {
          message: `New rental order from user ${userFullName}`,
          type: 'new_rental_order',
          userId: userId,
          requestId: orderId, // you can call it orderId here
          requestType: 'rental',
          read: false,
          timestamp: new Date().toISOString(),
        });
      });

      console.log('Notification sent to all admins in Firestore.');
    } else {
      console.log('No admins found in Firestore.');
    }
  } catch (error) {
    console.error('Error sending notifications to admins:', error);
  }
};

      //Buy Now Function 
  
      const buyNowFunction = async () => {
          // validation 
          if (addressInfo.name === "" || 
            addressInfo.address === "" ||
             addressInfo.pincode === "" ||
              addressInfo.mobileNumber === "") {
              return toast.error("All Fields are required")
          }


      
       const cartItemsWithDays = cartItems.map(item => ({
        ...item,
        rentalDays: days[item.id] || 1
    }));

    if (!userData || !userData.uid || !userData.email) {
  return toast.error("User not authenticated. Please log in again.");
}

     // Order Info 
     
    const orderInfo = {
        cartItems: cartItemsWithDays,
        addressInfo,
        email: userData.email,
        userid: userData.uid,
        fullName: addressInfo.name,
        status: "confirmed",
        time: Timestamp.now(),
        date: new Date().toLocaleString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        )
    }
    try {
       /* const orderRef = collection(db, 'order');
        addDoc(orderRef, orderInfo);*/

        const orderRef = await addDoc(collection(db, 'order'), orderInfo);

        // Send notification to admins
    await sendNotificationToAdmins(userData.uid, addressInfo.name, orderRef.id);


        setAddressInfo({
            name: "",
            address: "",
            pincode: "",
            mobileNumber: "",
        })
        toast.success("Order Placed Successfull")
    } catch (error) {
        console.log(error.message)
    }

}
  




  return (
    <div className="flex h-screen">
    <Sidebar />
    <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
            <SearchBar />
        </div>
        
                
        <div className="mt-[-50px] container mx-auto px-4 max-w-7xl px-2 lg:px-0">
    <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl ml-[70px]"> {/* Ajout de ml-[20px] */}
        <h1 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl pl-10">Rent Cart</h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="rounded-lg bg-white lg:col-span-8">
                <h2 id="cart-heading" className="sr-only"></h2>
                <ul role="list" className="divide-y divide-gray-200">

                    {cartItems.length > 0 ?
                    <>
                    {cartItems.map((item, index) => {
                        const { id, title, price, productImageUrl, quantity, category } = item
                        return(
                            <div key={index} className="">
                            <li className="flex py-6 sm:py-6">
                                <div className="flex-shrink-0">
                                    <img
                                        src={productImageUrl}
                                        alt="img"
                                        className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center"
                                    />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div>
                                            <div className="flex justify-between">
                                                <h3 className="text-sm font-semibold text-black">
                                        
                                                        {title}
                                                   
                                                </h3>
                                            </div>
                                            <div className="mt-1 flex text-sm">
                                                <p className="text-sm text-gray-500">{category}</p>
                                                
                                            </div>
                                            <div className="mt-1 flex items-end">
                                                <p className="text-xs font-medium text-gray-800 ">
                                                    {price} DA for one day
                                                </p>
                                                
                                                {/*<p className="text-sm font-medium text-gray-900">
                                                    &nbsp;&nbsp;{product.price}
                                                </p>*/}
                                                
                                            </div>
                                            <div className="text-xs font-medium text-blue-500">
                                                Total for {days[item.id] || 1} {days[item.id] > 1 ? "days" : "day"}: {price * (days[item.id] || 1)} DA
                                                
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                         <label htmlFor="numberInput" className="text-sm text-gray-700 mb-1 block">Rental day(s)</label>
                                            <div className="flex items-center space-x-2">
                                            
                                              <input
                                                 type="number"
                                                 id="numberInput"
                                                 className="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                 
                                                 value={days[id] || 1}
                                                 min={1}
                                                 max={360}
                                                 onChange={(e) => handleDayChange(id, Number(e.target.value))}
                                                 /*value={day}
                                                 min={1}
                                                 max={360}
                                                 onChange={(e) => handleDecrementAmount(Number(e.target.value))}*/
                                               />
                                          </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <div className="mb-2 flex">
                                <div className="min-w-24 flex">
                                    <button onClick={() => handleDecrement(id)}
                                     type="button" className="h-7 w-7">-</button>
                                    <input
                                        type="text"
                                        className="mx-1 h-7 w-9 rounded-md border text-center"
                                        value={quantity}
                                    />
                                    <button onClick={() => handleIncrement(id)}
                                    type="button" className="flex h-7 w-7 items-center justify-center">+</button>
                                </div>
                                <div className="ml-6 flex text-sm">
                                    <button onClick={() => deleteCart(item)} 
                                    type="button" className="flex items-center space-x-1 px-2 py-1 pl-0">
                                        <Trash size={12} className="text-red-500" />
                                        <span className="text-xs font-medium text-red-500">Remove</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        )


                    }
                        
                    )}
                    </>
                    : 
                    <h1>Not Found</h1>
                    
                }




                    
                </ul>
            </section>
            {/* Order summary */}
            <section
                aria-labelledby="summary-heading"
                className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
            >
                <h2 id="summary-heading" className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4">
                    Price Details
                </h2>
                <div>
                    <dl className="space-y-1 px-2 py-4">
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-800">Price ({cartItemTotal} item)</dt>
                            <dd className="text-sm font-medium text-gray-900"> {cartTotal} DA</dd>
                        </div>
                        {/*<div className="flex items-center justify-between pt-4">
                            <dt className="flex items-center text-sm text-gray-800">
                                <span>Discount</span>
                            </dt>
                            <dd className="text-sm font-medium text-green-700">- 3,431 DA</dd>
                        </div>**/}
                        <div className="flex items-center justify-between py-4">
                            <dt className="flex text-sm text-gray-800">
                                <span>Delivery Charges</span>
                            </dt>
                            <dd className="text-sm font-medium text-green-700">Free</dd>
                        </div>
                        <div className="flex items-center justify-between border-y border-dashed py-4">
                            <dt className="text-base font-medium text-gray-900">Total Amount</dt>
                            <dd className="text-base font-medium text-gray-900"> {cartTotal} DA</dd>
                        </div>
                    </dl>
                    <div className="px-2 pb-4 font-medium text-green-700">
                        <div className="flex gap-4 mb-6">
                        {userData
                                            ? <BuyNowModal
                                                addressInfo={addressInfo}
                                                setAddressInfo={setAddressInfo}
                                                buyNowFunction={buyNowFunction}
                                            /> : <Navigate to={'/Log-in'}/>
                                        }
                        </div>
                    </div>
                </div>
            </section>
        </form>
    </div>
</div>
</div>
</div>

    
  )
}
export default CartPage


{/*if (result.user) {
  const user = result.user;
  const userDocRef = doc(db, "Users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    localStorage.setItem("user", JSON.stringify(userData));
  }

  toast.success("User logged in Successfully!", { position: "top-center" });
  window.location.href = "/";
} */}

{/** */}