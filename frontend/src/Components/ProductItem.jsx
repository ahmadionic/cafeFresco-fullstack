import 'boxicons';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import productContext from '../Context/ProductContext';
import toast from 'react-hot-toast';
import audio from '../assets/ringtone.mp3'



const ProductItem = (props) => {

    const navigate = useNavigate();
    const Context = useContext(productContext)
    const URL = encodeURIComponent(props.title);
    const [check, setCheck] = useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const ringtone = new Audio(audio)
    const isNew = props.isNew;
    const isFeatured = props.isFeatured

    const { addToCart } = Context;

    const handleClick = () => {
        // Pass the product data to the ProductDetail page using navigate's state
        navigate(`/product/${URL}`, {
            state: {
                id: props.id,
                title: props.title,
                price: props.price,
                details: props.details,
                image: props.image,
                description: props.description,

            },
        });
    };


    const handleCartSubmit = () => {
        const product = {
            id: props.id,
            quantity: 1
        };
        addToCart(product);
        setTimeout(() => {
            setCheck(true)
        }, 200);
    };


    return (
        <div>
            <div className="card cardItem" style={{ borderRadius: "15px", background: '#feeab3', height: "340px", width: '18rem', marginTop: 30, marginBottom: 40 }}>
                {isNew && (
                    <span style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "red",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        zIndex: 1
                    }}>
                        New
                    </span>
                )}
                {isFeatured && (
                    <span style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "red",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        zIndex: 1
                    }}>
                        Featured
                    </span>
                )}

                <img onClick={handleClick} style={{ width: "287px", height: "200px", borderRadius: "17px" }} className="card-img-top " src={`${BASE_URL}/${props.image}`} alt="Card image cap" />
                <div className="card-body">
                    <h5 className="card-title">{props.title}</h5>
                    <div className="d-flex gap-2" style={{ marginTop: "30px" }}>
                        <div className="d-flex " >
                            {props.price}<box-icon style={{ width: "30px", height: "17px", marginTop: "3px", marginLeft: "-7px" }}
                                name='dollar' ></box-icon>
                        </div>
                        <div className="d-flex gap-1 ">
                            <box-icon name='fork'></box-icon>{props.details}
                        </div>


                    </div>

                    <box-icon
                        className="mobile-icon-item"
                        name={!check ? 'cart-add' : 'check-square'}
                        type="solid"
                        onClick={() => {
                            if (document.cookie.includes("userToken")) {
                                if (!check) {
                                    handleCartSubmit();
                                }
                            } else {
                                ringtone.play()
                                toast.error('Please login first to use the cart');
                            }
                        }}
                        style={{
                            cursor: "pointer",
                            position: "relative",
                            top: "-27px",
                            right: "-215px",
                            marginLeft: "15px",
                            width: "30px",
                            height: "30px",
                        }}
                    ></box-icon>

                </div>
            </div>
        </div>
    );
}

export default ProductItem;


ProductItem.propTypes = {
    background: PropTypes.string,
    title: PropTypes.string,
    details: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.string,
    price: PropTypes.number,
    isNew: PropTypes.bool,
    isFeatured: PropTypes.bool,
};