const express = require('express');
const isLogged = require('../middleware/isLogged');
const router = express.Router();
const Payment = require('../models/payment');

// ✅ Safe Stripe Initialization
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn("⚠️ STRIPE_SECRET_KEY is not defined. Stripe will be disabled.");
}

// =============================
// Create Payment Intent
// =============================
router.post('/payment-intent', isLogged, async (req, res) => {
    const { amount } = req.body;

    // Validation
    if (!amount || typeof amount !== 'number') {
        return res.status(400).json({ message: 'Invalid amount provided' });
    }

    // Check Stripe availability
    if (!stripe) {
        return res.status(500).json({
            message: "Stripe is not configured. Please add STRIPE_SECRET_KEY"
        });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// =============================
// Save Payment Record
// =============================
router.post('/payment/create', isLogged, async (req, res) => {
    try {
        const {
            orderId,
            paymentMethod,
            transactionId,
            amount,
            paymentDetails = {}
        } = req.body;

        const userId = req.user.userId;

        const newPayment = new Payment({
            orderId,
            userId,
            paymentMethod,
            transactionId,
            amount,
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
            paymentDetails
        });

        await newPayment.save();

        res.status(201).json({
            message: 'Payment recorded successfully',
            payment: newPayment
        });

    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;
