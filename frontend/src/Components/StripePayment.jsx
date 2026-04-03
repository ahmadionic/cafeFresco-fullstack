import { useState, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import productContext from '../Context/ProductContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const PaymentForm = ({ totalPrice = 0, originalTotal = 0 }) => {
    const { Buy, cart, setTotalPrice, setOriginalTotal, setDiscountApplied, ringtone } = useContext(productContext);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const stripe = useStripe();
    const elements = useElements();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const isBuyEmpty = Object.keys(Buy).length === 0; // Check if Buy object is empty


    const createOrder = async (products, amount, paymentStatus) => {
        const res = await fetch(`${BASE_URL}/order/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                products,
                totalAmount: amount,
                payment: paymentStatus,
            }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Order creation failed");
        return data.order;
    };

    const createPayment = async (orderId, method, transactionId, amount, details = {}) => {
        const res = await fetch(`${BASE_URL}/stripe/payment/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                orderId,
                paymentMethod: method,
                transactionId,
                amount,
                paymentDetails: details,
            }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Payment creation failed");
        return data;
    };

    const setTransactionId = async (orderId, paymentId) => {
        const res = await fetch(`${BASE_URL}/order/set-transaction/${orderId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ paymentId: paymentId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update transaction ID");
        return data;
    };

    const sendOrderEmail = async (orderId, amount, status) => {
        try {
            const response = await fetch(`${BASE_URL}/order/send-order-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orderId, amount, status })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Failed to send order email:", data.message);
            } else {
                console.log("Order confirmation email sent successfully");
            }
        } catch (error) {
            console.error("Error sending order email:", error.message);
        }
    };


    const handleSubmit = async () => {
        const amount = totalPrice || originalTotal;
        const products = isBuyEmpty
            ? cart.map(item => ({ productId: item.productId, quantity: item.quantity }))
            : [{ productId: Buy._id, quantity: Buy.quantity }];

        try {
            if (paymentMethod === 'cod') {
                const order = await createOrder(products, amount, 'unpaid');

                const payment = await createPayment(
                    order._id,
                    'COD',
                    `txn_cod_${Date.now()}`,
                    amount
                );

                await setTransactionId(order._id, payment.payment._id);
                toast.success('Order placed successfully with Cash on Delivery!');
                ringtone.play();
                sendOrderEmail(order._id, amount, 'unpaid');
                setDiscountApplied(false);
                setOriginalTotal(0);
                setTotalPrice(0);
                navigate('/cart');


            } else if (paymentMethod === 'stripe') {
                if (!stripe || !elements) return alert("Stripe not loaded");

                // Step 1: Create intent
                const intentRes = await fetch(`${BASE_URL}/stripe/payment-intent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ amount: Math.round(amount * 100) })
                });
                const data = await intentRes.json();
                if (!data) return toast.error(data.message);

                // Step 2: Confirm card payment
                const result = await stripe.confirmCardPayment(data.clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                });

                if (result.error) return toast.error(result.error.message);
                console.log('Card payment Succesfull')

                if (result.paymentIntent.status === 'succeeded') {
                    const transactionId = result.paymentIntent.id;
                    const order = await createOrder(products, amount, 'paid');

                    const payment = await createPayment(
                        order._id,
                        'Debit Card',
                        transactionId,
                        amount,
                        result.paymentIntent
                    );

                    await setTransactionId(order._id, payment.payment._id);
                    toast.success('Payment successful and order placed!');
                    ringtone.play();
                    sendOrderEmail(order._id, amount, 'paid');
                    setDiscountApplied(false);
                    setOriginalTotal(0);
                    setTotalPrice(0);
                    navigate('/cart');

                }
            }
        } catch (error) {
            console.error("Error during submission:", error);
            toast.success(error.message || "Something went wrong");
            ringtone.play();
        }
    };




    return (
        <div style={{ marginTop: '10px' }}>
            <p className="h7 fw-bold mb-1">Pay this Invoice</p>
            <p className="text-muted h8 mb-2">Select your preferred payment method</p>

            {/* Payment Method Selection */}
            <div className="mb-3">
                <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="stripe">Credit/Debit Card (Stripe)</option>
                    <option value="cod">Cash on Delivery</option>
                </select>
            </div>

            {/* Card form only if Stripe selected */}
            {paymentMethod === 'stripe' && (
                <div className="border p-3 rounded mb-3">
                    <CardElement />
                </div>
            )}

            {/* Pay Button */}
            <button className="btn btn-warning d-block w-100" onClick={handleSubmit}>
                PAY ${totalPrice || originalTotal}
                <span className="ms-2 fas fa-arrow-right"></span>
            </button>
        </div>
    );
};

// Wrap your component with Elements provider (in parent component or here)
export default function WrappedPaymentForm(props) {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm {...props} />
        </Elements>
    );
}
