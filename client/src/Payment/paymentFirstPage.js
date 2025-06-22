import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
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
          Payer en ligne
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

export default PaymentPage;
