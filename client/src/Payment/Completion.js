import React from 'react';
import './Completion.css';

function Completion(props) {
  const handleGoHome = () => {
    window.location.href = '/'; };
  return  (
    <div className="completion-page-container">
    <div className="completion-message">
      <h1 className="completion-title">Payment Successful! 🎉</h1>
      <p className="completion-text">Your payment has been successfully processed. Thank you for your purchase!</p>
    </div>
    <button onClick={handleGoHome} className="go-home-button">
      Go to Home
    </button>
  </div>
  );
}

export default Completion;
