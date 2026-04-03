import { useContext, useState, useEffect } from 'react';
import productContext from '../Context/ProductContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartPage = () => {
    const { cart, getCart, removeFromCart, updateCartItemQuantity, totalPrice, setTotalPrice, originalTotal, setOriginalTotal, discountApplied, setDiscountApplied, ringtone, loading } = useContext(productContext);
    const [quantities, setQuantities] = useState([]);
    const [discountCode, setDiscountCode] = useState('');


    useEffect(() => {
        if (cart && cart.length > 0) {
            setQuantities(cart.map(item => item.quantity));
        }
    }, [cart]);


    const navigate = useNavigate()
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Function to handle quantity change
    const handleQuantityChange = (index, delta) => {
        const newQuantities = [...quantities]; // Create a copy of the quantities array
        newQuantities[index] = Math.max(newQuantities[index] + delta, 1); // Update quantity but don't allow it to be less than 1
        setQuantities(newQuantities); // Update the state
        updateCartItemQuantity(index, newQuantities[index]);
    };

    const formatPrice = (price) => {
        // Ensure the price is a number and format to 2 decimal places
        return Number(price).toFixed(2);
    };

    // Function to calculate total price based on quantity
    const calculateItemPrice = (price, quantity) => price * quantity;

    useEffect(() => {
        const calculateTotalPrice = () => {
            return cart.reduce((acc, item, index) => {
                return acc + item.price * quantities[index];
            }, 0);
        };

        const price = formatPrice(calculateTotalPrice());
        setOriginalTotal(price);

        // ✅ Only update totalPrice if no discount has been applied
        if (!discountApplied) {
            setTotalPrice(price);
        }
    }, [cart, quantities]);

    useEffect(() => {
        getCart();
    }, []);

    const handlePayment = () => {
        navigate(`/address/`)
    }

    const handleDiscount = async () => {
        const cartTotal = totalPrice
        const code = discountCode
        try {
            const res = await fetch(`${BASE_URL}/discount/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, cartTotal }),
                credentials: 'include',
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to apply");
                ringtone.play();
                return;
            }
            toast.success(data.message || "Applied");
            ringtone.play();
            setTotalPrice(data.newTotal);
            setDiscountApplied(true);

        } catch (error) {
            console.error("Error apply code:", error);
            toast.error('Error apply code');
        }
    }

    return (
        <div>
            <section className="h-100">
                <div className="container h-100 py-5">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-10">

                            <div className="d-flex justify-content-center align-items-center" style={{ marginBottom: "50px" }} >
                                <h1 style={{ textAlign: "center" }} className=" bold fw-normal mb-0">Shopping Cart</h1>

                            </div>

                            {loading ? (<div className="mt-5" style={{ textAlign: 'center' }}>
                                <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>) :
                                cart.length === 0 ? (
                                    <p style={{ textAlign: 'center' }}>Your cart is empty</p>
                                ) : (
                                    cart.map((item, index) => (
                                        <div className="card rounded-3 mb-4 " style={{ marginTop: "10px" }} key={index}>
                                            <div className="card-body p-4">
                                                <div className="row d-flex justify-content-between align-items-center">
                                                    <div className="col-md-2 col-lg-2 col-xl-2">
                                                        <img
                                                            src={`${BASE_URL}/${item.image}`} // Use item.image instead of cart.image
                                                            className="img-fluid rounded-3"
                                                            alt={item.title} // Use item.title for alt
                                                        />
                                                    </div>
                                                    <div className="col-md-3 col-lg-3 col-xl-3">
                                                        <p className="lead fw-normal mb-2">{item.title}</p>
                                                        <p>
                                                            <span className="text-muted">Category: </span>{item.category?.title}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                                        {/* Minus Button */}
                                                        <button
                                                            className="btn btn-link px-2"
                                                            onClick={() => handleQuantityChange(index, -1)}
                                                        >
                                                            <i className="fas fa-minus"></i>
                                                        </button>

                                                        {/* Quantity Input */}
                                                        <input
                                                            id={`form1-${index}`}
                                                            min="1"
                                                            name={`quantity-${index}`}
                                                            value={quantities[index]}
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            readOnly
                                                        />

                                                        {/* Plus Button */}
                                                        <button
                                                            className="btn btn-link px-2"
                                                            onClick={() => handleQuantityChange(index, 1)}
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1 totalMobile">
                                                        {/* Display total price for this item based on the quantity */}
                                                        <h5 className="mb-0">
                                                            ${calculateItemPrice(item.price, quantities[index]).toFixed(2)}
                                                        </h5>
                                                    </div>
                                                    <div className="col-md-1 col-lg-1 col-xl-1 text-end ">
                                                        <a href="#!" className="text-danger" onClick={() => { removeFromCart(item.productId) }} >
                                                            <i className="fas fa-trash fa-lg"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}

                            <div className="card mb-4">
                                <div className="card-body p-4 d-flex flex-row">
                                    <div className="form-outline flex-fill">
                                        <input
                                            type="text"
                                            id="discountCode"
                                            className="form-control form-control-lg"
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                        />
                                        <label className="form-label" htmlFor="discountCode">
                                            Discount code
                                        </label>
                                    </div>
                                    {discountApplied && (
                                        <button type="button" style={{ height: "47px", width: '130px' }} className="btn btn-secondary btn-lg ms-3" onClick={() => {
                                            setTotalPrice(originalTotal);
                                            setDiscountApplied(false);
                                            setDiscountCode('');
                                        }}>
                                            Remove Discount
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="btn btn-outline-warning btn-lg ms-3"
                                        style={{ height: "47px" }}
                                        onClick={handleDiscount}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div className="card ">
                                <div className=" d-flex card-body space-between " >
                                    <button onClick={handlePayment}
                                        type="button"
                                        className="btn btn-warning btn-block btn-lg MobileBtn"
                                    >
                                        Proceed to Pay
                                    </button>
                                    <h3>{totalPrice}$</h3>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CartPage;
