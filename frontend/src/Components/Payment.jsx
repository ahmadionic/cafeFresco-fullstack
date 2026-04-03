import './CSS/Payment.css';
import { useLocation } from 'react-router-dom';
import productContext from '../Context/ProductContext';
import { useContext } from 'react';
import WrappedPaymentForm from './StripePayment'


const Payment = () => {
    const location = useLocation();
    const { firstName, lastName, city, email, address } = location.state || {}; // Extract product details from state
    const { cart, Buy, totalPrice, originalTotal, discountApplied } = useContext(productContext); // Destructure cart and Buy from the context

    const isBuyEmpty = Object.keys(Buy).length === 0; // Check if Buy object is empty

    return (
        <div>
            <div className="container-payment">
                <div className="row m-0">
                    <div className="col-md-7 col-12">
                        <div className="row">
                            <div className="col-12 mb-4">
                                <div className="row box-right">
                                    <div className="col-md-8 ps-0 ">
                                        <p className="ps-3 text-muted fw-bold h6 mb-0">Customer Name</p>
                                        <p className="h1 fw-bold d-flex font-mobile">
                                            {firstName}
                                            <span style={{ marginLeft: "15px" }} className="text-muted">{lastName}</span>
                                        </p>
                                        <p className="ms-3 px-2 bg-green text-black">{email}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p className="p-blue">
                                            <span className="fas fa-circle pe-2"></span>Original Total
                                        </p>
                                        <p className="fw-bold mb-3 text-muted" style={{ textDecoration: discountApplied ? 'line-through' : 'none' }}>
                                            <span className="fas fa-dollar-sign pe-1"></span>
                                            {originalTotal}
                                        </p>

                                        {discountApplied && (
                                            <>
                                                <p className="p-org">
                                                    <span className="fas fa-circle pe-2"></span>Discounted Total
                                                </p>
                                                <p className="fw-bold text-success">
                                                    <span className="fas fa-dollar-sign pe-1"></span>{totalPrice}
                                                </p>
                                            </>
                                        )}

                                        {!discountApplied && (
                                            <>
                                                <p className="p-org">
                                                    <span className="fas fa-circle pe-2"></span>Final Total
                                                </p>
                                                <p className="fw-bold">
                                                    <span className="fas fa-dollar-sign pe-1"></span>{totalPrice}
                                                </p>
                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>

                            <div className="col-12 px-0 mt-3">
                                <div className="box-right">
                                    <div className="d-flex mb-2">
                                        <p className="fw-bold">Create new invoice</p>
                                        <p className="ms-auto text-muted">
                                            <span className="fas fa-times"></span>
                                        </p>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <p className="h7">#AL2545</p>
                                        <p className="ms-auto bg btn btn-primary p-blue h8 mobileLink">
                                            <span className="far fa-clone pe-2"></span>COPY PAYMENT LINK
                                        </p>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 mb-2">
                                            <p className="text-muted h8">Project / Description</p>
                                            <input className="form-control" type="text" placeholder="Legal Consulting" />
                                        </div>
                                        <div className="col-6">
                                            <p className="text-muted h8">Issued on</p>
                                            <input className="form-control" type="text" placeholder="Oct 25, 2020" />
                                        </div>
                                        <div className="col-6">
                                            <p className="text-muted h8">Due on</p>
                                            <input className="form-control" type="text" placeholder="Oct 25, 2020" />
                                        </div>
                                    </div>                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 col-12 ps-md-5 p-0">
                        <div className="box-left">
                            <p className="text-muted h8">Invoice</p>
                            <p className="fw-bold h7">{firstName} {lastName}</p>
                            <p className="bold text-muted h8">{city}</p>
                            <p className="bold text-muted h8 mb-2">{address}</p>

                            <div className="h8">
                                {isBuyEmpty ? (
                                    cart.length === 0 ? (
                                        <p>Your cart is empty</p>
                                    ) : (
                                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {cart.map((item, index) => (
                                                <div key={index} className="h8">
                                                    <div className="row m-0 border mb-3">
                                                        {/* Items */}
                                                        <div className="col-6 h8 pe-0 ps-2">
                                                            <p className="bold text-muted py-2">Items</p>
                                                            <span className="d-block py-2">{item.title}</span>
                                                        </div>

                                                        {/* Quantity */}
                                                        <div className="col-2 text-center p-0">
                                                            <p className="bold text-muted p-2">Qty</p>
                                                            <span className="d-block p-2">{item.quantity}</span>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="col-2 p-0 text-center h8 border-end">
                                                            <p className="bold text-muted p-2">Price</p>
                                                            <span className="d-block py-2">
                                                                <span className="fas fa-dollar-sign"></span>{item.price}
                                                            </span>
                                                        </div>

                                                        {/* Total */}
                                                        <div className="col-2 p-0 text-center">
                                                            <p className="bold text-muted p-2">Total</p>
                                                            <span className="d-block py-2">
                                                                <span className="fas fa-dollar-sign"></span>{item.price * item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    <div className="row m-0 border mb-3">
                                        <div className="col-6 h8 pe-0 ps-2">
                                            <p className="bold text-muted py-2">Items</p>
                                            <span className="d-block py-2">{Buy.title}</span>
                                        </div>

                                        <div className="col-2 text-center p-0">
                                            <p className="bold text-muted p-2">Qty</p>
                                            <span className="d-block p-2">{Buy.quantity}</span>
                                        </div>

                                        <div className="col-2 p-0 text-center h8 border-end">
                                            <p className="bold text-muted p-2">Price</p>
                                            <span className="d-block py-2">
                                                <span className="fas fa-dollar-sign"></span>{Buy.price}
                                            </span>
                                        </div>

                                        <div className="col-2 p-0 text-center">
                                            <p className="bold text-muted p-2">Total</p>
                                            <span className="d-block py-2">
                                                <span className="fas fa-dollar-sign"></span>{Buy.price * Buy.quantity}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="d-flex h7 mb-2 mt-3">
                                    <p className="bold">Total Amount</p>
                                    {discountApplied ? (
                                        <>
                                            {/* Original Price with line-through */}
                                            <p style={{ textDecoration: 'line-through', marginRight: '10px' }} className="ms-auto text-muted">
                                                <span className="fas fa-dollar-sign"></span>
                                                {originalTotal}
                                            </p>

                                            {/* Discounted Price */}
                                            <p className="ms-2 text-success fw-bold">
                                                <span className="fas fa-dollar-sign"></span>
                                                {totalPrice}
                                            </p>
                                        </>
                                    ) : (
                                        // Normal price if no discount applied
                                        <p className="ms-auto fw-bold">
                                            <span className="fas fa-dollar-sign"></span>
                                            {totalPrice}
                                        </p>
                                    )}

                                </div>
                            </div>

                            {/* Payment Form */}
                            <WrappedPaymentForm totalPrice={totalPrice} originalTotal={originalTotal} />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
