require('dotenv').config(); // Charger .env
const express = require('express');
const app = express();
const cors = require('cors');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{

  res.send('server is working');
  });
app.post('/create-payment-intent', async (req, res) => {
  const { amount, paymentMethodId, customerName, customerEmail, customerPhone, customerPays } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      // parseInt(amount),
      currency: 'DZD',
     // automatic_payment_methods: { enabled: true },
     payment_method: paymentMethodId,
      confirmation_method: "manual",
      confirm: true,
      description: `Payment from ${customerName} (${customerEmail})`,
      metadata: {
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        customerPays: customerPays,
        
      },
    });
   // res.send(paymentIntent.client_secret);
   res.send({ success: true, paymentIntent });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
