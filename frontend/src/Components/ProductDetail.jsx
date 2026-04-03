import { useState, useEffect, useContext } from 'react';
import MoreRecepies from './MoreProduct';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import productContext from '../Context/ProductContext';
import toast from 'react-hot-toast';


const ProductDetail = () => {
    const { title: encodedTitle } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [productData, setProductData] = useState({
        id: '',
        title: '',
        price: 0,
        details: '',
        description: '',
        image: ''
    });
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [quantity, setQuantity] = useState(1); // Manage quantity state
    const [imageProduct, setImage] = useState(''); // Manage the displayed image
    const [reviews, setReviews] = useState([

    ]);

    const context = useContext(productContext);
    const { addToCart, getWishlist, ringtone } = context;

    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const formatPrice = (price) => {
        // Ensure the price is a number and format to 2 decimal places
        return Number(price).toFixed(2);
    };

    // Set product data if available from location state
    useEffect(() => {
        if (location.state) {
            const { title, price, details, description, image, id } = location.state;
            setProductData({ id, title, price, details, description, image });
            setImage(image); // Initialize image state
        } else {
            navigate('/'); // Redirect if there's no product data
        }
    }, [location.state, navigate]);

    const decodedTitle = decodeURIComponent(encodedTitle); // Decode title from URL params

    // Handle image change
    const handleImageChange = (img) => {
        setImage(img);
    };

    // Handle quantity change with min 1
    const handleQuantityChange = (delta) => {
        setQuantity((prevQuantity) => Math.max(prevQuantity + delta, 1));
    };


    const priceProduct = productData.price * quantity;
    const totalPrice = formatPrice(priceProduct);



    // Add to cart function
    const handleCartSubmit = () => {
        const product = {
            id: productData.id,
            quantity: quantity
        };
        addToCart(product);
    };

    const handleWishList = async () => {
        try {
            const response = await fetch(`${BASE_URL}/wishlist/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ productId: productData.id }),
            });

            if (response.status === 401) {
                toast.error('Please login to continue.');
                ringtone.play();
                navigate('/login');
                return;
            }

            const result = await response.json();

            toast.success(result.message);
            ringtone.play();

            if (response.ok) {
                navigate('/products');
                getWishlist();
            }
        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error('Something went wrong. Please try again.');
        }
    };


    const addReview = async (productId, rating, reviewText) => {
        try {

            const response = await fetch(`${BASE_URL}/review/add/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // For cookies if needed
                body: JSON.stringify({
                    rating,
                    review: reviewText
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add review');
            }

            return data;
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    };

    const handleSubmitReview = async () => {
        try {
            const result = await addReview(productData.id, rating, reviewText);
            // Handle success (update UI, etc.)
            toast.success(result.message)
            ringtone.play();
            console.log('Review added:');
            fetchReviews();
        } catch (error) {
            // Handle error
            toast.error(error.message)
            ringtone.play();
        }
    };

    const getProductReviews = async (productId) => {
        console.log(productData.id)
        try {
            const response = await fetch(`${BASE_URL}/review/all/${productId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }

            const data = await response.json();
            console.log(data)
            return data
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    };

    const fetchReviews = async () => {
        try {
            const reviews = await getProductReviews(productData.id);
            setReviews(reviews);
        } catch (error) {
            console.log(error.message)
        }
    };
    // Fetch reviews on component mount
    useEffect(() => {

        fetchReviews();
    }, [productData.id]);


    return (
        <div>
            <section className="py-5" style={{ marginTop: "60px" }}>
                <div className="container">
                    <div className="row gx-5">
                        <aside className="col-lg-6">
                            <div className="border rounded-5 mb-3 d-flex justify-content-center">
                                <a data-fslightbox="mygalley" className="rounded-4" rel="noreferrer" data-type="image">
                                    <img
                                        style={{ width: "41vw", height: "55vh", maxWidth: '100%', maxHeight: '65vh', margin: 'auto' }}
                                        className="rounded-4 fit Mobile-product-image"
                                        src={`${BASE_URL}/${imageProduct}`}
                                        alt={decodedTitle}
                                    />
                                </a>
                            </div>
                            <div className="d-flex justify-content-center mb-3">
                                <a
                                    style={{ cursor: 'pointer' }}
                                    data-fslightbox="mygalley"
                                    className="border mx-1 rounded-2"
                                    rel="noreferrer"
                                    data-type="image"
                                    onClick={() => handleImageChange(productData.image)}
                                >
                                    <img width="60" height="60" className="rounded-2" src={`${BASE_URL}/${productData.image}`} alt="Product 1" />
                                </a>
                            </div>
                        </aside>
                        <main className="col-lg-6">
                            <div className="ps-lg-3">
                                <h4 className="title text-dark">
                                    {decodedTitle} <br />
                                </h4>
                                <div className="d-flex flex-row my-3">
                                    <div className="text-warning mb-1 me-2">
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fas fa-star-half-alt"></i>
                                        <span className="ms-1">4.5</span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="h5">Price: {totalPrice}$</span>
                                </div>
                                <p>{productData.description}</p>
                                <div className="row">
                                    <dt className="col-3">Category:</dt>
                                    <dd className="col-9">{productData.details}</dd>
                                </div>
                                <hr />
                                <div className="row mb-4">
                                    <div className="col-md-4 col-6 mb-3">
                                        <label className="mb-2 d-block">Quantity</label>
                                        <div className="input-group mb-3" style={{ width: '170px' }}>
                                            <button
                                                className="btn btn-white border border-secondary px-3"
                                                type="button"
                                                onClick={() => handleQuantityChange(-1)}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <input
                                                type="text"
                                                className="form-control text-center border border-secondary"
                                                value={quantity}
                                                readOnly
                                            />
                                            <button
                                                className="btn btn-white border border-secondary px-3"
                                                type="button"
                                                onClick={() => handleQuantityChange(1)}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex gap-3">
                                    {/* <a onClick={handlePayment} href="#" className="btn btn-warning shadow-0  MobileBtn">Buy now</a> */}
                                    <a
                                        style={{ padding: "8px", backgroundColor: 'red', border: 'none' }}
                                        onClick={handleCartSubmit}
                                        href="#"
                                        className="btn btn-primary shadow-0"
                                    >
                                        <i className="me-1 fa fa-shopping-basket"></i>Add to cart
                                    </a>
                                    <a
                                        onClick={handleWishList}
                                        className="btn btn-light border border-secondary py-2 icon-hover px-3"
                                    >
                                        <i className="me-1 fa fa-heart fa-lg"></i> Save
                                    </a>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </section>

            <section className="py-4 border-top">
                <div className="container">
                    <h4 className="mb-4">Customer Reviews</h4>

                    {/* Review Form */}
                    <div className="card mb-5">
                        <div className="card-body">
                            <h5 className="card-title">Write a Review</h5>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Rating</label>
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i
                                                key={star}
                                                className={`fa${star <= rating ? 's' : 'r'} fa-star`}
                                                style={{ color: '#ffc107', cursor: 'pointer', fontSize: '1.5rem' }}
                                                onClick={() => setRating(star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="reviewText" className="form-label">Your Review</label>
                                    <textarea
                                        className="form-control"
                                        id="reviewText"
                                        rows="3"
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                    ></textarea>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    style={{ padding: "8px", backgroundColor: 'red', border: 'none' }}

                                    onClick={handleSubmitReview}
                                >
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Reviews Carousel */}
                    <div className="mb-5">
                        <h5 className="mb-4 text-center">Customer Feedback</h5>
                        {reviews.length > 0 ? (
                            <div className="position-relative">
                                <div id="reviewCarousel" className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-inner">
                                        {reviews.map((review, index) => (
                                            <div
                                                key={review._id}
                                                className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                            >
                                                <div className="card border-0 mx-auto" style={{ maxWidth: '800px' }}>
                                                    <div className="card-body text-center">
                                                        <div className="d-flex flex-column align-items-center mb-3">
                                                            <div className="mb-3">
                                                                <div
                                                                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                                                                    style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                                                                >
                                                                    {review.user?.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h6 className="mb-1">{review.user?.email}</h6>
                                                                <div className="text-warning mb-2">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <i
                                                                            key={i}
                                                                            className={`fa${i < review.rating ? 's' : 'r'} fa-star`}
                                                                            style={{ fontSize: '1.2rem' }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="card-text px-4" style={{ fontSize: '1.1rem' }}>
                                                            "{review.review}"
                                                        </p>
                                                        <small className="text-muted d-block mt-3">
                                                            Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            }) || 'N/A'}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Carousel Controls */}
                                <button
                                    className="carousel-control-prev position-absolute start-0 top-50 translate-middle-y"
                                    type="button"
                                    data-bs-target="#reviewCarousel"
                                    data-bs-slide="prev"
                                    style={{ width: '40px', height: '40px', left: '-20px' }}
                                >
                                    <span className="carousel-control-prev-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                    className="carousel-control-next position-absolute end-0 top-50 translate-middle-y"
                                    type="button"
                                    data-bs-target="#reviewCarousel"
                                    data-bs-slide="next"
                                    style={{ width: '40px', height: '40px', right: '-20px' }}
                                >
                                    <span className="carousel-control-next-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        ) : (
                            <div className="alert alert-info text-center mx-auto" style={{ maxWidth: '800px' }}>
                                No reviews yet. Be the first to review!
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <MoreRecepies count={4} />
        </div>
    );
};

export default ProductDetail;
