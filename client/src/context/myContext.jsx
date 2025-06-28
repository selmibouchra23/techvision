

import { createContext,useEffect, useState } from "react";

import { arrayRemove, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { toast } from "react-toastify";

const myContext = createContext();


export const MyProvider = ({ children }) => {

     // Loading State 
     const [loading, setLoading] = useState(false);

     // User State
     const [getAllProduct, setGetAllProduct] = useState([]);
 
     /**========================================================================
      *                         Get All product function
      *========================================================================**/
 
     const getAllProductFunction = async () => {
         setLoading(true);
         try {
             const q = query(
                 collection(db, "products"),
                 orderBy('time')
             );
             const data = onSnapshot(q, (QuerySnapshot) => {
                 let productArray = [];
                 QuerySnapshot.forEach((doc) => {
                     productArray.push({ ...doc.data(), id: doc.id });
                 });
                 setGetAllProduct(productArray);
                 setLoading(false);
             });
             return () => data;
         } catch (error) {
             console.log(error);
             setLoading(false);
         }
     }


     // Order State 
    const [getAllOrder, setGetAllOrder] = useState([]);

    
    /**========================================================================
     *                           get AllOrder Function
     *========================================================================**/

    const getAllOrderFunction = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "order"),
                orderBy('time')
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let orderArray = [];
                QuerySnapshot.forEach((doc) => {
                    orderArray.push({ ...doc.data(), id: doc.id });
                });
                setGetAllOrder(orderArray);
                setLoading(false);
            });
            return () => data;
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    //console.log(getAllOrder)

    // Delete oder Function
    const orderDelete = async (id) => {
        setLoading(true)
        try {
            await deleteDoc(doc(db, 'order', id))
            toast.success('Order Deleted successfully')
            getAllOrderFunction();
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
const toggleOrderStatus = async (orderId, currentStatus) => {
    const orderRef = doc(db, "order", orderId); 
    const newStatus = currentStatus === "confirmed" ? "not confirmed" : "confirmed";
    await updateDoc(orderRef, { status: newStatus });
    toast.success("Order status updated");
    getAllOrderFunction(); 
};

/*const orderDelete = async (orderId, item) => {
    setLoading(true);
    try {
        const orderRef = doc(db, 'order', orderId);
        await updateDoc(orderRef, {
            cartItems: arrayRemove(item)
        });

        toast.success('Item removed successfully');
        getAllOrderFunction();
    } catch (error) {
        console.log(error);
    }
    setLoading(false);
};*/



// Cancelled Orders State
const [getCancelledOrders, setGetCancelledOrders] = useState([]);
/**========================================================================
 *                     Get All Cancelled Orders Function
 *========================================================================**/
const getCancelledOrdersFunction = async () => {
    setLoading(true);
    try {
        const q = query(
            collection(db, "Cancelled orders"),
           // orderBy('time') 
        );
        const data = onSnapshot(q, (QuerySnapshot) => {
            let cancelledArray = [];
            QuerySnapshot.forEach((doc) => {
                cancelledArray.push({ ...doc.data(), id: doc.id });
            });
            setGetCancelledOrders(cancelledArray);
            setLoading(false);
        });
        return () => data;
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}





// user State 
const [getAllUser, setGetAllUser] = useState([]);


/**========================================================================
 *                          getAllUserFunction
 *========================================================================**/

const getAllUserFunction = async () => {
    setLoading(true);
    try {
        const q = query(
            collection(db, "Users"),
           // orderBy('time')
        );
        const data = onSnapshot(q, (QuerySnapshot) => {
            let userArray = [];
            QuerySnapshot.forEach((doc) => {
                userArray.push({ ...doc.data(), id: doc.id });
            });
            setGetAllUser(userArray);
            setLoading(false);
        });
        return () => data;
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}


    useEffect(() => {
        getAllProductFunction();
        getAllOrderFunction();      
        getAllUserFunction();
        getCancelledOrdersFunction(); 
    }, []);

    return (
        <myContext.Provider value={{ loading, setLoading, getAllProduct, getAllProductFunction, getAllOrder, getAllOrderFunction, orderDelete, toggleOrderStatus,  getAllUser, getCancelledOrders, getCancelledOrdersFunction }}>{/*getAllProductFunction */}
            {children}
        </myContext.Provider>
    );
};

export default myContext;

