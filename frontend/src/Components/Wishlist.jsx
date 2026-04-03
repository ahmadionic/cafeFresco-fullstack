import './CSS/Wishlist.css';
import { useContext, useEffect, useState } from 'react';
import productContext from '../Context/ProductContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const Wishlist = () => {
    const { removeFromWish, addToCart, ringtone } = useContext(productContext);
    const [loading, setLoading] = useState(false)
    const [wishlist, setWishlist] = useState([])
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

    const handleCartSubmit = (item) => {
        const product = {
            id: item._id,
            quantity: 1,
        }
        addToCart(product);
        console.log(product);
    };

    const getWishlist = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/wishlist/all`, {
                method: 'GET',
                credentials: 'include',
            });

            const result = await response.json();

            if (response.ok) {
                setWishlist(result.wishlist || [])
            } else if (response.status === 401) {
                toast.error('Please login to view your wishlist.')
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
        getWishlist();
    }, [BASE_URL])

    return (
        <div className="cart-wrap">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="main-heading mb-10 text-center bold" style={{ fontSize: "34px" }}>My wishlist</div>
                        <div className="table-wishlist mt-5">
                            <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                <thead>
                                    <tr>
                                        <th width="45%">Product Name</th>
                                        <th width="15%">Unit Price</th>
                                        <th width="15%">Stock Status</th>
                                        <th width="15%"></th>
                                        <th width="10%"></th>
                                    </tr>
                                </thead>

                                {loading ? (
                                    <div className="mt-5" style={{ textAlign: 'center', marginLeft: "620px" }}>
                                        <div className="spinner-border text-danger" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>

                                ) : wishlist.length === 0 ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="5">
                                                <p style={{textAlign:'center'}}>Your wishlist is empty</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    <tbody>
                                        {wishlist.map((item, index) => (
                                            <tr key={index}>
                                                <td width="45%">
                                                    <div className="display-flex align-center">
                                                        <div className="img-product">
                                                            <img
                                                                src={`${BASE_URL}/${item.image}`}
                                                                alt={item.title}
                                                                className="mCS_img_loaded"
                                                            />
                                                        </div>
                                                        <div className="name-product">{item.title}</div>
                                                    </div>
                                                </td>
                                                <td width="15%" className="price">${item.price}</td>
                                                <td width="15%">
                                                    {(() => {
                                                        const inStock = item.inventory?.quantityInStock > 0;
                                                        return (
                                                            <span className={inStock ? "in-stock-box" : "out-of-stock-box"}>
                                                                {inStock ? "In Stock" : "Out of Stock"}
                                                            </span>
                                                        );
                                                    })()}
                                                </td>

                                                <td width="15%">
                                                    <button
                                                        style={{ borderRadius: "100px" }}
                                                        className="btn btn-warning small-btn"
                                                        onClick={() => handleCartSubmit(item)}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </td>
                                                <td width="10%" className="text-center">
                                                    <a onClick={() => { removeFromWish(item._id) }} href="#" className="trash-icon">
                                                        <i className="far fa-trash-alt"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Wishlist;
