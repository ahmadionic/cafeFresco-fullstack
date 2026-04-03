import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import productContext from './ProductContext';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import audio from '../assets/ringtone.mp3'



const ProductState = (props) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const ringtone = new Audio(audio)
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [wishlists, setWishList] = useState('');
    const [Buy, setBuy] = useState({})
    const [categories, setCategories] = useState([])
    const token = Cookies.get('userToken');
    const [totalPrice, setTotalPrice] = useState(0);
    const [originalTotal, setOriginalTotal] = useState(0);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [loading, setLoading] = useState(false)



    const getCart = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/cart/all`, {
                method: 'GET',
                credentials: 'include',
            });

            const result = await response.json();
            if (response.ok) {
                setCart(result.cart || [])
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false)
        }
    };

    const getWishlist = async () => {
        try {
            const response = await fetch(`${BASE_URL}/wishlist/all`, {
                method: 'GET',
                credentials: 'include',
            });

            const result = await response.json();

            if (response.ok) {
                setWishList(result.wishlist.length || '')
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const addtoBuy = (product) => {
        setBuy(product);
    }

    const updateCartItemQuantity = async (index, newQuantity) => {
        setCart(prevCart => {
            const updatedCart = [...prevCart];
            updatedCart[index] = {
                ...updatedCart[index],
                quantity: newQuantity,
            };
            return updatedCart;
        });

        try {
            const productId = cart[index]._id || cart[index].productId;

            const res = await fetch(`${BASE_URL}/cart/update-quantity`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    productId,
                    quantity: newQuantity
                })
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to update quantity");
                ringtone.play();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Something went wrong while updating quantity');

        }
    };


    const addToCart = async (product) => {
        try {
            const response = await fetch(`${BASE_URL}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ productId: product.id, quantity: product.quantity }),
            });

            if (response.status === 401) {
                ringtone.play();
                toast.error('Please login to continue.');
                return <Navigate to="/login" />;
            }
            const result = await response.json();
            toast.success(result.message);
            ringtone.play();
            getCart();

        } catch (error) {
            console.error("Cart error:", error);
            toast.error('Something went wrong. Please try again');
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const res = await fetch(`${BASE_URL}/cart/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Removed from cart ✅');
                ringtone.play();
                await getCart();
            } else {
                toast.error(data.message || 'Failed to remove');
                ringtone.play();
            }
        } catch (error) {
            toast.error('Error removing item');
            console.error("Error removing item:", error);
        }
    };


    const removeFromWish = async (productId) => {
        try {
            const res = await fetch(`${BASE_URL}/wishlist/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Removed from wishlist ✅');
                ringtone.play();
                await getWishlist();
            } else {
                toast.error(data.message || "Failed to remove");
                ringtone.play();
            }
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error('"Error removing item');

        }
    };


    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BASE_URL}/category/fetch`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },

            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories || []);
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    useEffect(() => {
        fetchCategories();
        if (token) {
            getWishlist();
            getCart();
        }
    }, []);





    return (
        <productContext.Provider value={{ searchTerm, setSearchTerm, cart, getCart, setCart, addToCart, updateCartItemQuantity, removeFromCart, wishlists, getWishlist, removeFromWish, Buy, addtoBuy, categories, fetchCategories, totalPrice, setTotalPrice, originalTotal, setOriginalTotal, discountApplied, setDiscountApplied, ringtone, loading }}>
            {props.children}
        </productContext.Provider>
    );
};

ProductState.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProductState;
