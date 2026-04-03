import './CSS/wishlist.css';
import { useContext, useEffect, useState } from 'react';
import productContext from '../Context/ProductContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const Track = () => {
    const { ringtone } = useContext(productContext);
    const [loading, setLoading] = useState(false)
    const [wishlist, setWishlist] = useState([])
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

    const getHistory = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/order/user/history`, {
                method: 'GET',
                credentials: 'include',
            });

            const result = await response.json();
            if (response.ok) {
                setWishlist(result.orders || [])
            } else if (response.status === 401) {
                toast.error('Please login to view your order.')
                ringtone.play();
                navigate('/login');
            } else {
                toast.error(result.message || "Failed to fetch wishlist.")
                ringtone.play();
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getHistory();
    }, [BASE_URL])

    return (
        <div className="cart-wrap">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="main-heading mb-4 text-center fw-bold" style={{ fontSize: "30px" }}>Order History</h2>

                        <div className="table-responsive mt-4">
                            <table className="table table-bordered text-center">
                                <thead className="table-dark">
                                    <tr>
                                        <th style={{ width: "30%" }}>Order ID</th>
                                        <th style={{ width: "15%" }}>Amount</th>
                                        <th style={{ width: "15%" }}>Order Status</th>
                                        <th style={{ width: "15%" }}>Payment Status</th>
                                        <th style={{ width: "25%" }}>Created</th>
                                    </tr>
                                </thead>

                                {loading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                <div className="spinner-border text-danger mt-4" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : wishlist.length === 0 ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="5">
                                                <p className="text-center my-3">Order history is empty.</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    <tbody>
                                        {wishlist.map((order, index) => (
                                            <tr key={index}>
                                                <td>{order._id}</td>
                                                <td>${order.totalAmount}</td>
                                                <td>
                                                    <span style={{
                                                        padding: "3px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        color: "#fff",
                                                        backgroundColor:
                                                            order.orderStatus === "pending" ? "orange" :
                                                                order.orderStatus === "completed" ? "green" :
                                                                    order.orderStatus === "cancelled" ? "red" : "gray"
                                                    }}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{
                                                        padding: "3px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        color: "#fff",
                                                        backgroundColor:
                                                            order.paymentStatus === "completed" ? "green" :
                                                                order.paymentStatus === "unpaid" ? "red" : "gray"
                                                    }}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    {new Date(order.createdAt).toLocaleString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: true
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Track;
