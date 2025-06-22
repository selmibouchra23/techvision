import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

function Contactus () {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm('service_9lb0j5s', 'template_hf4rmmr',  form.current, {
        publicKey: 'tP35vZHBBWm-yJS8n',
      })
      .then(
        (response) => {
          console.log('SUCCESS!', response.text);
          alert('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Failed to send message. Please try again.');
        },
      ).finally(() => setLoading(false));
  };
 
  
   
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form submitted:', formData);
    };
  
    return (
      <div className='mt-[40px] flex justify-center items-center w-full min-h-screen bg-slate-50'>
        <div className='form-container overflow-hidden rounded-2xl shadow-2xl border w-10/12 max-w-screen-lg p-12 bg-white'>
          <h1 className='text-4xl font-semibold text-center mb-8'>Send a message to us!</h1>
          <form  ref={form} onSubmit={sendEmail} className='space-y-6'>
            <input 
              type='text' 
              name='name' 
              placeholder='Name' 
              value={formData.name} 
              onChange={handleChange} 
              className='w-full p-4 border rounded-lg' 
              required
            />
            <input 
              type='email' 
              name='email' 
              placeholder='Email' 
              value={formData.email} 
              onChange={handleChange} 
              className='w-full p-4 border rounded-lg' 
              required
            />
            <input 
              type='text' 
              name='subject' 
              placeholder='Subject' 
              value={formData.subject} 
              onChange={handleChange} 
              className='w-full p-4 border rounded-lg' 
              required
            />
            <textarea 
              name='message' 
              placeholder='Message' 
              value={formData.message} 
              onChange={handleChange} 
              className='w-full p-4 border rounded-lg h-40' 
              required
            ></textarea>

            {/*hadi t3 time t3 emailjs*/}
            <input type="hidden" name="time" value={new Date().toLocaleString()} />


            <button 
            type='submit' 
            className='bg-black w-full py-4 text-white rounded-lg'
            disabled={loading}
            >
               {loading ? 'Sending...' : 'Send a message'}
              {/*Send a message*/}
              </button>
          </form>
        </div>
      </div>
    );
  }
  
  export default Contactus;
