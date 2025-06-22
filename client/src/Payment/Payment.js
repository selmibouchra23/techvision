import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
//import PaymentForm from './PaymentForm'; // Your form component
import React from 'react';
import PaymentForm from './PaymentForm';

console.log('Stripe Public Key:', process.env.REACT_APP_STRIPE_PUBLIC_KEY);


//const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

console.log(stripePromise)
function Payment() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}

export default Payment;
