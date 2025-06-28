import { useState } from "react";

const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const openModals = () => setShowConfirmation(true);

    const handleAccept = () => {
        setShowConfirmation(false);
        setShowForm(true);
    };

    const handleReject = () => {
        setShowConfirmation(false);
        setShowForm(false);
    };

    const handleCancelForm = () => setShowForm(false);

    return (
        <>
            <button
                type="button"
                onClick={openModals}
                className="w-full px-4 py-3 text-center text-blue-900 bg-blue-100 border border-blue-600  
                       hover:bg-blue-200 hover:text-blue-800 active:bg-blue-600 active:text-gray-100 
                       rounded-xl transition duration-300"
            >
                Rent now
            </button>

            {/* model de confirmation */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-xl w-96 shadow-lg text-center">
                        <p className="text-gray-800 mb-6">
                            The customer must pay 50% of the price three days before the order date, otherwise his order will be <strong>cancelled</strong>.
                        </p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                No, I don't accept
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Yes, I accept.
                            </button>
                            
                        </div>
                    </div>
                </div>
            )}

            {/* 2eme model*/}
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
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
                                name="identification_number"
                                value={addressInfo.identification_number}
                                onChange={(e) => setAddressInfo({ ...addressInfo, identification_number: e.target.value })}
                                placeholder='Enter your national identification number'
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
                                onClick={handleCancelForm}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
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
};

export default BuyNowModal;
