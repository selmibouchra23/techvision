import { Trash } from 'lucide-react'
import Sidebar from "../../sideBar/SideBar";
import SearchBar from "../../searchBar/SearchBar";
import { useDispatch, useSelector } from 'react-redux';
import { decrementQuantity, deleteFromCart, incrementQuantity } from '../../../redux/cartSlice';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import BuyNowModal from '../../buyNowModal/BuyNowModal';
import { Navigate } from 'react-router-dom';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
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

   {/* const [days, setDays] = useState({});
    const handleDayChange = (id, value) => {
        const clampedValue = Math.max(1, Math.min(value, 360));
        setDays(prev => ({
            ...prev,
            [id]: clampedValue
        }));
    };*/}

    // States for rental dates
    const [rentalDates, setRentalDates] = useState({});

    const handleDateChange = (id, type, value) => {
        setRentalDates(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [type]: value
            }
        }));
    };

    const calculateDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = endDate - startDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays > 0 ? diffDays : 1;
    };



    // const cartQuantity = cartItems.length;
    
    // cartItem total













    

    const cartItemTotal = cartItems.map(item => item.quantity).reduce((prevValue, currValue) => prevValue + currValue, 0);
    console.log("carte item total:", cartItemTotal )

    const cartTotal = cartItems.reduce((total, item) => {
        const dates = rentalDates[item.id] || {};
        const days = (dates.start && dates.end) ? calculateDays(dates.start, dates.end) : 1;
        return total + item.price * item.quantity * days;
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
      //Buy Now Function 
  
      const buyNowFunction = () => {
         const today = new Date();
    today.setHours(0, 0, 0, 0); // ingorer le time

    // virifications des date
    for (let item of cartItems) {
        const dates = rentalDates[item.id];

        if (!dates || !dates.start || !dates.end) {
            return toast.error(`Please select both start and end date for "${item.title}"`);
        }

        const startDate = new Date(dates.start);
        const endDate = new Date(dates.end);

        // d2 ares d1
        if (startDate < today) {
            return toast.error(`Start date for "${item.title}" cannot be in the past`);
        }

        // vorofication des dates si D2 > = D1
        if (endDate < startDate) {
            return toast.error(`End date for "${item.title}" cannot be before the start date`);
        }
    }

          // validation 
          if (addressInfo.name === "" || addressInfo.address === ""|| addressInfo.identification_number === ""  || addressInfo.mobileNumber === "") {
              return toast.error("All Fields are required")

          }

          const confirmationDeadline = new Date(Date.now() + 72 * 60 * 60 * 1000); // apres 72h man dek
   

      
       const cartItemsWithDays = cartItems.map(item => ({
        ...item,
        rentalStart: rentalDates[item.id]?.start || null,
        rentalEnd: rentalDates[item.id]?.end || null,
        rentalDays: (rentalDates[item.id]?.start && rentalDates[item.id]?.end)
        ? calculateDays(rentalDates[item.id].start, rentalDates[item.id].end)
                : 1
    }));

     // Order Info 
     
    const orderInfo = {
        cartItems: cartItemsWithDays,
        addressInfo,
        email: userData.email,
        userid: userData.uid,
       // status: "confirmed",
        status: "Not confirmed", // nabdaw b "not confirmed"
        confirmationDeadline: Timestamp.fromDate(confirmationDeadline),
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
        const orderRef = collection(db, 'order');
        addDoc(orderRef, orderInfo);
        setAddressInfo({
            name: "",
            address: "",
            identification_number: "",
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
                    <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl ml-[70px]">
                        <h1 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl pl-10">Rent Cart</h1>
                        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                            <section aria-labelledby="cart-heading" className="rounded-lg bg-white lg:col-span-8">
                                <ul role="list" className="divide-y divide-gray-200">
                                    {cartItems.length > 0 ? cartItems.map((item, index) => {
                                        const { id, title, price, productImageUrl, quantity, category } = item;
                                        const dates = rentalDates[id] || {};
                                        const days = (dates.start && dates.end) ? calculateDays(dates.start, dates.end) : 1;
                                        return (
                                            <div key={index}>
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
                                                                    <h1 className="font-semibold text-black">{title}</h1>
                                                                </div>
                                                                <p className="text-sm text-gray-500">{category}</p>
                                                                <p className="text-xs font-medium text-gray-800 mt-1">{price} DA per day</p>
                                                                <p className="text-xs font-medium text-blue-500 mt-1">
                                                                    Total for {days} {days > 1 ? "days" : "day"}: {price * days} DA
                                                                </p>
                                                                <div className="flex space-x-4 mt-2">
                                                                    <div>
                                                                        <label className="text-sm text-gray-600">Start Date:</label>
                                                                        <input
                                                                            type="date"
                                                                            className="block border border-gray-300 rounded px-2 py-1 text-sm"
                                                                            value={dates.start || ""}
                                                                            onChange={(e) => handleDateChange(id, "start", e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-sm text-gray-600">End Date:</label>
                                                                        <input
                                                                            type="date"
                                                                            className="block border border-gray-300 rounded px-2 py-1 text-sm"
                                                                            value={dates.end || ""}
                                                                            onChange={(e) => handleDateChange(id, "end", e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2">
                                                                <label className="text-sm text-gray-700 mb-1 block">Quantity</label>
                                                                <div className="min-w-24 flex items-center">
                                                                    <button onClick={() => handleDecrement(id)} type="button" className="h-7 w-7">-</button>
                                                                    <input
                                                                        type="text"
                                                                        className="mx-1 h-7 w-9 rounded-md border text-center"
                                                                        value={quantity}
                                                                        readOnly
                                                                    />
                                                                    <button onClick={() => handleIncrement(id)} type="button" className="h-7 w-7">+</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <div className="ml-6 flex text-sm mb-4">
                                                    <button onClick={() => deleteCart(item)} type="button" className="flex items-center space-x-1 text-red-500">
                                                        <Trash size={12} />
                                                        <span className="text-xs font-medium">Remove</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }) : <h1>Not Found</h1>}
                                </ul>
                            </section>

                            <section className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0">
                                <h2 className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4">Price Details</h2>
                                <div>
                                    <dl className="space-y-1 px-2 py-4">
                                        <div className="flex items-center justify-between">
                                            <dt className="text-sm text-gray-800">Price ({cartItemTotal} items)</dt>
                                            <dd className="text-sm font-medium text-gray-900">{cartTotal} DA</dd>
                                        </div>
                                        <div className="flex items-center justify-between py-4">
                                            <dt className="text-sm text-gray-800">Delivery Charges</dt>
                                            <dd className="text-sm font-medium text-blue-700">400</dd>
                                        </div>
                                        <div className="flex items-center justify-between border-y border-dashed py-4">
                                            <dt className="text-base font-medium text-gray-900">Total Amount</dt>
                                            <dd className="text-base font-medium text-gray-900">{cartTotal} DA</dd>
                                        </div>
                                    </dl>
                                    <div className="px-2 pb-4 font-medium text-blue-700">
                                        {userData
                                            ? <BuyNowModal
                                                addressInfo={addressInfo}
                                                setAddressInfo={setAddressInfo}
                                                buyNowFunction={buyNowFunction}
                                            />
                                            : <Navigate to={'/Log-in'} />}
                                    </div>
                                </div>
                            </section>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;


















// fiha payment
// import { Trash } from 'lucide-react'
// import Sidebar from "../../sideBar/SideBar";
// import SearchBar from "../../searchBar/SearchBar";
// import { useDispatch, useSelector } from 'react-redux';
// import { decrementQuantity, deleteFromCart, incrementQuantity } from '../../../redux/cartSlice';
// import { toast } from 'react-toastify';
// import { useEffect, useState } from 'react';
// import BuyNowModal from '../../buyNowModal/BuyNowModal';
// import { Navigate } from 'react-router-dom';
// import { addDoc, collection, Timestamp, getDocs } from 'firebase/firestore';
// import { db } from '../../firebase';
// import { useNavigate } from 'react-router-dom';



// const CartPage = () => {
//      const navigate = useNavigate();

//     const cartItems = useSelector((state) => state.cart.items)  || [];
//     const dispatch = useDispatch();

//     const deleteCart = (item) => {
//         dispatch(deleteFromCart(item));
//         toast.success("Delete cart")
//     }

//     const handleIncrement = (id) => {
//         dispatch(incrementQuantity(id));
//     };

//     const handleDecrement = (id) => {
//         dispatch(decrementQuantity(id));
//     };

//     const [days, setDays] = useState({});
//     const handleDayChange = (id, value) => {
//         const clampedValue = Math.max(1, Math.min(value, 360));
//         setDays(prev => ({
//             ...prev,
//             [id]: clampedValue
//         }));
//     };



//     // const cartQuantity = cartItems.length;
//     // cartItem total
    

//     const cartItemTotal = cartItems.map(item => item.quantity).reduce((prevValue, currValue) => prevValue + currValue, 0);
//     console.log("carte item total:", cartItemTotal )

//     const cartTotal = cartItems.reduce((total, item) => {
//         const dayCount = days[item.id] || 1;
//         return total + item.price * item.quantity * dayCount;
//     }, 0);
//    /* const cartTotal = cartItems.map(item => item.price * item.quantity).reduce((prevValue, currValue) => prevValue + currValue, 0);
//     console.log("carte  total:", cartTotal )
// */
//     useEffect(() => {
//         localStorage.setItem('cart', JSON.stringify(cartItems));
//     }, [cartItems])



//       // user
//      // const user = JSON.parse(localStorage.getItem("users"));
//       const userData = JSON.parse(localStorage.getItem("user"));
      
//       console.log("userData",userData);
    


//       console.log("BuyNowModal",BuyNowModal)

      
//       //  adress info stat
//       const [addressInfo, setAddressInfo] = useState({
//           name: "",
//           address: "",
//           pincode: "",
//           mobileNumber: "",
//           time: Timestamp.now(),
//           date: new Date().toLocaleString(
//               "en-US",
//               {
//                   month: "short",
//                   day: "2-digit",
//                   year: "numeric",
//               }
//           )
//       });
//       console.log("Cart Total:", cartTotal); // This should print a valid number

// //Notif

// const sendNotificationToAdmins = async (userId, userFullName, orderId) => {
//   try {
//     const adminsRef = collection(db, 'Admins');
//     const adminsSnapshot = await getDocs(adminsRef);

//     if (!adminsSnapshot.empty) {
//       adminsSnapshot.forEach(async (adminDoc) => {
//         const adminId = adminDoc.id;

//         const adminNotificationsRef = collection(
//           db,
//           'Admins',
//           adminId,
//           'Notifications'
//         );

//         await addDoc(adminNotificationsRef, {
//           message: `New rental order from user ${userFullName}`,
//           type: 'new_rental_order',
//           userId: userId,
//           requestId: orderId, // you can call it orderId here
//           requestType: 'rental',
//           read: false,
//           timestamp: new Date().toISOString(),
//         });
//       });

//       console.log('Notification sent to all admins in Firestore.');
//     } else {
//       console.log('No admins found in Firestore.');
//     }
//   } catch (error) {
//     console.error('Error sending notifications to admins:', error);
//   }
// };

//       //Buy Now Function 
  
//       const buyNowFunction = async () => {
//           // validation 
//           if (addressInfo.name === "" || 
//             addressInfo.address === "" ||
//              addressInfo.pincode === "" ||
//               addressInfo.mobileNumber === "") {
//               return toast.error("All Fields are required")
//           }


      
//        const cartItemsWithDays = cartItems.map(item => ({
//         ...item,
//         rentalDays: days[item.id] || 1
//     }));

//     if (!userData || !userData.uid || !userData.email) {
//   return toast.error("User not authenticated. Please log in again.");
// }

//      // Order Info 
     
//     const orderInfo = {
//         cartItems: cartItemsWithDays,
//         addressInfo,
//         email: userData.email,
//         userid: userData.uid,
//         fullName: addressInfo.name,
//         status: "confirmed",
//         time: Timestamp.now(),
//         date: new Date().toLocaleString(
//             "en-US",
//             {
//                 month: "short",
//                 day: "2-digit",
//                 year: "numeric",
//             }
//         )
//     }
//     try {
//        /* const orderRef = collection(db, 'order');
//         addDoc(orderRef, orderInfo);*/

//         const orderRef = await addDoc(collection(db, 'order'), orderInfo);

//         // Send notification to admins
//     await sendNotificationToAdmins(userData.uid, addressInfo.name, orderRef.id);


//         setAddressInfo({
//             name: "",
//             address: "",
//             pincode: "",
//             mobileNumber: "",
//         })
//         toast.success("Order Placed Successfull")
//     } catch (error) {
//         console.log(error.message)
//     }

// }
  




//   return (
//     <div className="flex h-screen">
//     <Sidebar />
//     <div className="flex flex-col flex-1 p-6">
//         <div className="flex items-center justify-between mb-6">
//             <SearchBar />
//         </div>
        
                
//         <div className="mt-[-50px] container mx-auto px-4 max-w-7xl px-2 lg:px-0">
//     <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl ml-[70px]"> {/* Ajout de ml-[20px] */}
//         <h1 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl pl-10">Rent Cart</h1>
//         <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
//             <section aria-labelledby="cart-heading" className="rounded-lg bg-white lg:col-span-8">
//                 <h2 id="cart-heading" className="sr-only"></h2>
//                 <ul role="list" className="divide-y divide-gray-200">

//                     {cartItems.length > 0 ?
//                     <>
//                     {cartItems.map((item, index) => {
//                         const { id, title, price, productImageUrl, quantity, category } = item
//                         return(
//                             <div key={index} className="">
//                             <li className="flex py-6 sm:py-6">
//                                 <div className="flex-shrink-0">
//                                     <img
//                                         src={productImageUrl}
//                                         alt="img"
//                                         className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center"
//                                     />
//                                 </div>
//                                 <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
//                                     <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
//                                         <div>
//                                             <div className="flex justify-between">
//                                                 <h3 className="text-sm font-semibold text-black">
                                        
//                                                         {title}
                                                   
//                                                 </h3>
//                                             </div>
//                                             <div className="mt-1 flex text-sm">
//                                                 <p className="text-sm text-gray-500">{category}</p>
                                                
//                                             </div>
//                                             <div className="mt-1 flex items-end">
//                                                 <p className="text-xs font-medium text-gray-800 ">
//                                                     {price} DA for one day
//                                                 </p>
                                                
//                                                 {/*<p className="text-sm font-medium text-gray-900">
//                                                     &nbsp;&nbsp;{product.price}
//                                                 </p>*/}
                                                
//                                             </div>
//                                             <div className="text-xs font-medium text-blue-500">
//                                                 Total for {days[item.id] || 1} {days[item.id] > 1 ? "days" : "day"}: {price * (days[item.id] || 1)} DA
                                                
//                                             </div>
//                                         </div>
//                                         <div className="mt-2">
//                                          <label htmlFor="numberInput" className="text-sm text-gray-700 mb-1 block">Rental day(s)</label>
//                                             <div className="flex items-center space-x-2">
                                            
//                                               <input
//                                                  type="number"
//                                                  id="numberInput"
//                                                  className="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                 
//                                                  value={days[id] || 1}
//                                                  min={1}
//                                                  max={360}
//                                                  onChange={(e) => handleDayChange(id, Number(e.target.value))}
//                                                  /*value={day}
//                                                  min={1}
//                                                  max={360}
//                                                  onChange={(e) => handleDecrementAmount(Number(e.target.value))}*/
//                                                />
//                                           </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </li>
//                             <div className="mb-2 flex">
//                                 <div className="min-w-24 flex">
//                                     <button onClick={() => handleDecrement(id)}
//                                      type="button" className="h-7 w-7">-</button>
//                                     <input
//                                         type="text"
//                                         className="mx-1 h-7 w-9 rounded-md border text-center"
//                                         value={quantity}
//                                     />
//                                     <button onClick={() => handleIncrement(id)}
//                                     type="button" className="flex h-7 w-7 items-center justify-center">+</button>
//                                 </div>
//                                 <div className="ml-6 flex text-sm">
//                                     <button onClick={() => deleteCart(item)} 
//                                     type="button" className="flex items-center space-x-1 px-2 py-1 pl-0">
//                                         <Trash size={12} className="text-red-500" />
//                                         <span className="text-xs font-medium text-red-500">Remove</span>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                         )


//                     }
                        
//                     )}
//                     </>
//                     : 
//                     <h1>Not Found</h1>
                    
//                 }




                    
//                 </ul>
//             </section>
//             {/* Order summary */}
//             <section
//                 aria-labelledby="summary-heading"
//                 className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
//             >
//                 <h2 id="summary-heading" className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4">
//                     Price Details
//                 </h2>
//                 <div>
//                     <dl className="space-y-1 px-2 py-4">
//                         <div className="flex items-center justify-between">
//                             <dt className="text-sm text-gray-800">Price ({cartItemTotal} item)</dt>
//                             <dd className="text-sm font-medium text-gray-900"> {cartTotal} DA</dd>
//                         </div>
//                         {/*<div className="flex items-center justify-between pt-4">
//                             <dt className="flex items-center text-sm text-gray-800">
//                                 <span>Discount</span>
//                             </dt>
//                             <dd className="text-sm font-medium text-green-700">- 3,431 DA</dd>
//                         </div>**/}
//                         <div className="flex items-center justify-between py-4">
//                             <dt className="flex text-sm text-gray-800">
//                                 <span>Delivery Charges</span>
//                             </dt>
//                             <dd className="text-sm font-medium text-green-700">Free</dd>
//                         </div>
//                         <div className="flex items-center justify-between border-y border-dashed py-4">
//                             <dt className="text-base font-medium text-gray-900">Total Amount</dt>
//                             <dd className="text-base font-medium text-gray-900"> {cartTotal} DA</dd>
//                         </div>
//                     </dl>
//                     <div className="px-2 pb-4 font-medium text-green-700">
//                         <div className="flex gap-4 mb-6">
//                        {/* {userData
//                                             ? <BuyNowModal
//                                                 addressInfo={addressInfo}
//                                                 setAddressInfo={setAddressInfo}
//                                                 buyNowFunction={buyNowFunction}
//                                             /> : <Navigate to={'/Log-in'}/>
//                                         }*/}
//                                         {userData ? (
                                            
//   <button
  
//     onClick={() => {
//         console.log("Cart Total:", cartTotal); // This should print a valid number
//         localStorage.setItem('cartTotal', cartTotal);
//         navigate('/PaymentPage2', {
//         state : {
//             price: cartTotal
//         }}
//     )
// }
// }
//     className="w-full px-4 py-3 text-center text-blue-900 bg-blue-100 border border-blue-600  
//         hover:bg-blue-200 hover:text-blue-800 active:bg-blue-600 active:text-gray-100 
//         rounded-xl transition duration-300"
//   >
//     Rent now
//   </button>
// ) : (
//   <Navigate to="/Log-in" />
// )}

//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </form>
//     </div>
// </div>
// </div>
// </div>

    
//   )
// }
// export default CartPage


// {/*if (result.user) {
//   const user = result.user;
//   const userDocRef = doc(db, "Users", user.uid);
//   const userDocSnap = await getDoc(userDocRef);

//   if (userDocSnap.exists()) {
//     const userData = userDocSnap.data();
//     localStorage.setItem("user", JSON.stringify(userData));
//   }

//   toast.success("User logged in Successfully!", { position: "top-center" });
//   window.location.href = "/";
// } */}

// {/** */}