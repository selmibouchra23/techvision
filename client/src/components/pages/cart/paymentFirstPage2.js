// src/pages/ChoosePaymentMethod.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyNowModal from '../../buyNowModal/BuyNowModal';
import { useLocation } from 'react-router-dom';

import { db } from '../../firebase';
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

const PaymentPage2 = () => {
   const location = useLocation();
  const passedAddressInfo = location.state?.addressInfo;
 // const buyNowFunction = location.state?.buyNowFunction;
const navigate = useNavigate();
const price = location.state?.price || localStorage.getItem('cartTotal');;
console.log("Price passed:", price);
  const userData = JSON.parse(localStorage.getItem("user"));

  
    const [addressInfo, setAddressInfo] = useState(passedAddressInfo || {
    name: "",
    address: "",
    pincode: "",
    mobileNumber: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  });
  const [showModal, setShowModal] = useState(false);
   const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const days = {}; 

   const sendNotificationToAdmins = async (userId, userFullName, orderId) => {
    try {
      const adminsRef = collection(db, 'Admins');
      const adminsSnapshot = await getDocs(adminsRef);

      if (!adminsSnapshot.empty) {
        adminsSnapshot.forEach(async (adminDoc) => {
          const adminId = adminDoc.id;
          const adminNotificationsRef = collection(db, 'Admins', adminId, 'Notifications');

          await addDoc(adminNotificationsRef, {
            message: `New rental order from user ${userFullName}`,
            type: 'new_rental_order',
            userId: userId,
            requestId: orderId,
            requestType: 'rental',
            read: false,
            timestamp: new Date().toISOString(),
          });
        });

        console.log('Notification sent to all admins in Firestore.');
      }
    } catch (error) {
      console.error('Error sending notifications to admins:', error);
    }
  };

   const buyNowFunction = async () => {
    if (!userData || !userData.uid || !userData.email) {
      return toast.error("User not authenticated.");
    }

    if (
      !addressInfo.name ||
      !addressInfo.address ||
      !addressInfo.pincode ||
      !addressInfo.mobileNumber
    ) {
      return toast.error("All fields are required.");
    }

    const cartItemsWithDays = cartItems.map(item => ({
      ...item,
      rentalDays: days[item.id] || 1
    }));

    const orderInfo = {
      cartItems: cartItemsWithDays,
      addressInfo,
      email: userData.email,
      userid: userData.uid,
      fullName: addressInfo.name,
      status: "confirmed",
      time: Timestamp.now(),
      date: addressInfo.date,
    };

    try {
      const orderRef = await addDoc(collection(db, 'order'), orderInfo);
      await sendNotificationToAdmins(userData.uid, addressInfo.name, orderRef.id);
      toast.success("Order placed successfully.");
      navigate('/');
    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Failed to place order.");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-6 text-blue-900">Choisissez une méthode de paiement</h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/payment', { state: { price } })}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            💳 Payer en ligne
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            🏠 Payer sur place
          </button>
        </div>

        {showModal && (
          <div className="mt-6">
            <BuyNowModal
              addressInfo={addressInfo}
              setAddressInfo={setAddressInfo}
              buyNowFunction={buyNowFunction}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage2;





/*import { useNavigate } from "react-router-dom";

const PaymentPage2 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Paiement</h2>
        <p className="text-gray-600 mb-6">Choisissez votre méthode de paiement :</p>
        <div>
        <button
          onClick={() => navigate("/Payment")}
          className="w-full bg-gray-900 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition mb-4"
        >
          💳 Payer en ligne
        </button>

        <button
          onClick={() => alert("Merci ! Veuillez payer en cash lors de votre venue.")}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition"
        >
          payer sur place
        </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage2;*/
