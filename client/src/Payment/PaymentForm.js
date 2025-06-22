import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './PaymentForm.css'; // Custom styles here
import { useLocation } from 'react-router-dom';

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  
  const location = useLocation(); 
  const state = location.state;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', email: '',  phone: '',
    pays: '', });

//  const [amount, setAmount] = useState(state?.price || ''); // Get price from notification if available
  const amount = localStorage.getItem('price');

 /* useEffect(() => {
    // If there's no price, you can set an initial value for the user to enter.
    if (!amount) {
      setAmount('');
    }
  }, [amount]);*/


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
      //  pays: userInfo.pays
      },
     /* confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/Completion`,
      },*/
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    try {
     // const res = await fetch('http://localhost:5000/create-payment-intent', 
      const res = await fetch('https://techvision-s5le.onrender.com/create-payment-intent',

        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentMethodId: paymentMethod.id,
          amount: amount*100 , // pSQ lzm b cents
          customerName: userInfo.name,
          customerEmail: userInfo.email,
          customerPhone: userInfo.phone,
          customerPays: userInfo.pays,
        
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Payment successful!');
        window.location.href = '/completion'; // Redirect to completion page
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('Server error.');
    }

    setLoading(false);
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": { color: "#a0aec0" },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="payment-form-container">
      <form onSubmit={handleSubmit} className="payment-form">
        <h2 className="payment-title">Complete your payment</h2>

        <input
          type="text"
          placeholder="Name"
          value={userInfo.name}
          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          className="payment-input"
          required
        />
          <input
          type="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
          className="payment-input"
          required
        />
         <input
          type="text"
          placeholder="Phone"
          value={userInfo.phone}
          onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
          className="payment-input"
          required
        />
         <input
          type="text"
          placeholder="Country"
          value={userInfo.pays}
          onChange={(e) => setUserInfo({ ...userInfo, pays: e.target.value })}
          className="payment-input"
          required
        />
         {/* Display the price field */}
         <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => (e.target.value)}
          className="payment-input"
          disabled={!!state?.price} // Disable input if price is already set
          required
        />
        <div className="input-wrapper">
          <label htmlFor="card-element" className="floating-label">
            Card Details
          </label>
          <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
        </div>

        <button
          type="submit"
          className="payment-button"
          disabled={!stripe || loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {message && <div className="payment-message">{message}</div>}
      </form>
    </div>
  );
}

export default PaymentForm;




/*import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    const cardElement = elements.getElement(CardElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: userInfo.name,
        email: userInfo.email,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
     // setMessage(`Payment method created: ${paymentMethod.id}`);
      // In production, send this to your backend to create a paymentIntent and confirm
      const res = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: parseInt(process.env.REACT_APP_PRICE),
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage(`✅ Payment successful! ID: ${data.paymentIntent.id}`);
      } else {
        setMessage(`❌ Payment failed: ${data.error}`);
      }
      
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={userInfo.name}
        onChange={handleInputChange}
        required
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={userInfo.email}
        onChange={handleInputChange}
        required
      />

      <label>Card Details</label>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <h3>Total: ${(process.env.REACT_APP_PRICE / 100).toFixed(2)} USD</h3>

      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default PaymentForm;*/