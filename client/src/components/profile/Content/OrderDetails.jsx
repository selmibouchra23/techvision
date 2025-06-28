import { FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import myContext from '../../../context/myContext';
import { EllipsisVertical } from 'lucide-react';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';



function OrderDetails() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const context = useContext(myContext);
  const { loading, getAllOrder, setGetAllOrder } = context;

  const [showDropdownIndex, setShowDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    setShowDropdownIndex(showDropdownIndex === index ? null : index);
  };

  const handleCancelOrder = async (order, index) => {
    try {
      // Enregistrer dans 'Cancelled orders'
      const cancelledRef = collection(db, 'Cancelled orders');
      await addDoc(cancelledRef, order);

      // Supprimer "order" man fire base
      // Delete oder Function
          const orderDelete = async (id) => {
              
              try {
                  await deleteDoc(doc(db, 'order', id))
                  toast.success('your order is cancelled. we will contact you soon')
              } catch (error) {
                  console.log(error)
                  
              }
          }
          if (order.id) {
        await orderDelete(order.id);
      }

      // refresh
      const updatedOrders = getAllOrder.filter((_, i) => i !== index);
      setGetAllOrder(updatedOrders);
      setShowDropdownIndex(null);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div className="bottom">
      <div className="mx-auto my-4 max-w-6xl px-2 md:my-6 md:px-0">
        <h2 className="text-2xl lg:text-3xl font-bold">Order Details</h2>

        {getAllOrder.filter((obj) => obj.userid === userData?.uid).map((order, index) => {
          return (
            <div key={index} className='relative'>
              <div className="absolute top-2 right-2 cursor-pointer" onClick={() => toggleDropdown(index)}>
                <EllipsisVertical />
              </div>
              {showDropdownIndex === index && (
                <div className="absolute top-8 right-2 w-64 bg-white border border-gray-200 shadow-lg rounded-md p-4 z-50">
                  <p className="text-sm text-gray-700 mb-3">
                    Message: Cancellation of the order within the first 72 hours is free.<br />
                    Cancelling the order after this period will result in a discount according to the period.
                  </p>
                  <button
                    className="w-full bg-red-500 text-white text-sm py-1.5 rounded hover:bg-red-600"
                    onClick={() => handleCancelOrder(order, index)}
                  >
                    Cancel my order
                  </button>
                </div>
              )}

              {order.cartItems.map((item, itemIndex) => {
                const { id, date, quantity, price, title, productImageUrl, category, rentalDays } = item;
                const { status } = order;
                return (
                  <div key={itemIndex} className="mt-5 flex flex-col overflow-hidden rounded-xl border border-blue-100 md:flex-row">
                    <div className="w-full border-r border-blue-100 bg-blue-50 md:max-w-xs">
                      <div className="p-8">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1">
                          <div className="mb-4">
                            <div className="text-sm font-semibold text-black">Order Id</div>
                            <div className="text-sm font-medium text-gray-900">#{id}</div>
                          </div>
                          <div className="mb-4">
                            <div className="text-sm font-semibold">Date</div>
                            <div className="text-sm font-medium text-gray-900">{date}</div>
                          </div>
                          <div className="mb-4">
                            <div className="text-sm font-semibold">Order Status</div>
                            <div className="text-sm font-medium text-green-800">"{order.status}"</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="p-8">
                        <ul className="-my-7 divide-y divide-gray-200">
                          <li className="flex flex-col justify-between space-x-5 py-7 md:flex-row">
                            <div className="flex flex-1 items-stretch">
                              <div className="flex-shrink-0">
                                <img className="h-20 w-20 rounded-lg border border-gray-200 object-contain" src={productImageUrl} alt='img' />
                              </div>
                              <div className="ml-5 flex flex-col justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-900">{title}</p>
                                  <p className="mt-1.5 text-sm font-medium text-gray-500">{category}</p>
                                </div>
                                <p className="mt-4 text-sm font-medium text-gray-500">x {quantity}</p>
                                <p className="mt-4 text-sm font-medium text-black">Rental days</p>
                                <p className="mt-4 text-sm font-medium text-black">Total Amount</p>
                              </div>
                            </div>
                            <div className="ml-auto flex flex-col items-end justify-between">
                              <p className="text-right text-sm font-bold text-gray-900">{price} DA</p>
                              <p className="mt-16 text-right text-sm font-bold text-gray-900">{rentalDays} day(s)</p>
                              <p className="text-right text-sm font-bold text-gray-900">{price * quantity * rentalDays} DA</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderDetails;
