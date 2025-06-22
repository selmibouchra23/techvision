import { useState } from "react";

const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                className="w-full px-4 py-3 text-center text-blue-900 bg-blue-100 border border-blue-600  
                                                   hover:bg-blue-200 hover:text-blue-800 active:bg-blue-600 active:text-gray-100 
                                                   rounded-xl transition duration-300"
            >
                Rent now
            </button>
            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-blue-50 p-6 rounded-xl w-96 shadow-lg">
                        <div className="mb-3">
                            <input
                                type="text"
                                name="name"
                                value={addressInfo.name}
                                onChange={(e) => setAddressInfo({ ...addressInfo, name: e.target.value })}
                                placeholder='Enter your name'
                                className='bg-blue-50 border border-blue-200 px-2 py-2 w-full rounded-md outline-none text-blue-600 placeholder-blue-300'
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                name="address"
                                value={addressInfo.address}
                                onChange={(e) => setAddressInfo({ ...addressInfo, address: e.target.value })}
                                placeholder='Enter your address'
                                className='bg-blue-50 border border-blue-200 px-2 py-2 w-full rounded-md outline-none text-blue-600 placeholder-blue-300'
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="number"
                                name="pincode"
                                value={addressInfo.pincode}
                                onChange={(e) => setAddressInfo({ ...addressInfo, pincode: e.target.value })}
                                placeholder='Enter your pincode'
                                className='bg-blue-50 border border-blue-200 px-2 py-2 w-full rounded-md outline-none text-blue-600 placeholder-blue-300'
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                name="mobileNumber"
                                value={addressInfo.mobileNumber}
                                onChange={(e) => setAddressInfo({ ...addressInfo, mobileNumber: e.target.value })}
                                placeholder='Enter your mobile number'
                                className='bg-blue-50 border border-blue-200 px-2 py-2 w-full rounded-md outline-none text-blue-600 placeholder-blue-300'
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleOpen}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleOpen();
                                    buyNowFunction();
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Rent now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BuyNowModal;
