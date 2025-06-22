import { FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { useContext } from 'react';
import myContext from '../../../context/myContext';

/*const products = [
  {
    id: 1,
    name: 'Nike Air Force 1 07 LV8',
    imageSrc:
      'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/54a510de-a406-41b2-8d62-7f8c587c9a7e/air-force-1-07-lv8-shoes-9KwrSk.png',
    href: '#',
    price: '61,999 DA',
    color: 'Orange',
    imageAlt: 'Nike Air Force 1 07 LV8',
    quantity: 1,
  },
];*/

function OrderDetails() {


  // user
     const userData = JSON.parse(localStorage.getItem("user"));

     const context = useContext(myContext);
    const { loading, getAllOrder } = context
    console.log(getAllOrder)

    // console.log(user)

  return (
    <div className="bottom">
      <div className="mx-auto my-4 max-w-6xl px-2 md:my-6 md:px-0">
        {/* text */}
        <h2 className="text-2xl lg:text-3xl font-bold">Order Details</h2>
        {/* main 2 */}
        {getAllOrder.filter((obj) => obj.userid === userData?.uid).map((order, index) => {

          return (
          <div key={index} className=''>
            {order.cartItems.map((item, index) => {
              console.log(item)
                                        // console.log('item', item);
                                        const { id, date, quantity, price, title, productImageUrl, category, rentalDays } = item
                                        // console.log('order', order)
                                        const { status } = order
                                        return (
                                          <div key={index}
            className="mt-5 flex flex-col overflow-hidden rounded-xl border border-blue-100 md:flex-row">
              {/* main 3 */}
              <div className="w-full border-r border-blue-100 bg-blue-50 md:max-w-xs">
                {/* left */}
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
                     {/*<div className="mb-4">
                      <div className="text-sm font-semibold">Rental days</div>
                      <div className="text-sm font-medium text-gray-900">{rentalDays} day(s)</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm font-semibold">Total Amount</div>
                      <div className="text-sm font-medium text-gray-900">{price * quantity *rentalDays} DA</div>
                    </div>*/}
                    <div className="mb-4">
                      <div className="text-sm font-semibold">Order Status</div>
                      <div className="text-sm font-medium text-green-800">"{order.status}"</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* right */}
              <div className="flex-1">
                <div className="p-8">
                  <ul className="-my-7 divide-y divide-gray-200">
                      <li  className="flex flex-col justify-between space-x-5 py-7 md:flex-row">
                        <div className="flex flex-1 items-stretch">
                          <div className="flex-shrink-0">
                            <img
                              className="h-20 w-20 rounded-lg border border-gray-200 object-contain"
                              src={productImageUrl}
                              alt='img' //
                            />
                          </div>
                          <div className="ml-5 flex flex-col justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900">{title}</p>
                              <p className="mt-1.5 text-sm font-medium text-gray-500">{category}</p>
                            </div>
                            <p className="mt-4 text-sm font-medium text-gray-500">x {quantity}</p>
                            <p className="mt-4 text-sm font-mediumtext-black">Rental days</p>
                            <p className="mt-4 text-sm font-medium text-black">Total Amount</p>
                            
                          </div>
                        </div>
                        <div className="ml-auto flex flex-col items-end justify-between">
                          <p className="text-right text-sm font-bold text-gray-900">{price} DA</p>
                          <p className="mt-16 text-right text-sm font-bold text-gray-900">{rentalDays} day(s)</p>
                          <p className="text-right text-sm font-bold text-gray-900">{price * quantity *rentalDays} DA</p>
                        </div>
                      </li>
                   
                  </ul>
                </div>
              </div>
            </div>
                                        )
        })}</div>)
        })}

        
      </div>
    </div>
  );
}

export default OrderDetails;
