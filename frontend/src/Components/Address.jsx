import { useState } from 'react';
import './CSS/Address.css'
import { useNavigate } from 'react-router-dom';



const Address = () => {

    // const location = useLocation();
    // const { firstName, lastName, city, email, address } = location.state || {};  // Extract product details from state
    const navigate = useNavigate();
    const [addressDetail, setAddressDetail] = useState({
        firstName: '',
        lastName: '',
        city: '',
        zip: '',
        address: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddressDetail((prevDetail) => ({
            ...prevDetail,
            [name]: value
        }));

    };

    const handleSubmit = () => {
        navigate(`/payment/`, {
            state: {
                firstName: addressDetail.firstName,
                lastName: addressDetail.lastName,
                city: addressDetail.city,
                zip: addressDetail.zip,
                address: addressDetail.address,
                email: addressDetail.email,

            },
        });

    }

    return (
        <div style={{ marginTop: '55px' }}>
            <div className="row mt-3 mx-3 gradient-custom" style={{ borderRadius: "50px" }} >
                <div className="col-md-3">
                    <div style={{ marginTop: '100px', marginLeft: '10px' }} className="text-center">
                        <i id="animationDemo" data-mdb-animation="slide-right" data-mdb-toggle="animation"
                            data-mdb-animation-reset="true" data-mdb-animation-start="onScroll"
                            data-mdb-animation-on-scroll="repeat" className="fas fa-3x fa-shipping-fast text-black"></i>
                        <h3 className="mt-3 bold text-black">Welcome</h3>
                        <p className="white-black">You are 30 seconds away from completing your order!</p>
                    </div>
                    <div className="text-center margin-bottom">
                        <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-white btn-rounded back-button">Go back</button>
                    </div>
                </div>
                <div className="col-md-9 justify-content-center">
                    <div className="card card-custom pb-4">
                        <div className="card-body mt-0 mx-5">
                            <div className="text-center mb-3 pb-2 mt-3">
                                <h4 className='bold' style={{ color: 'black' }}>Delivery Details</h4>
                            </div>

                            <form className="mb-0" onSubmit={handleSubmit}>
                                <div className="row mb-4">
                                    <div className="col">
                                        <div data-mdb-input-init className="form-outline">
                                            <input onChange={handleChange} name='firstName' type="text" id="form9Example1" className="form-control input-custom" />
                                            <label className="form-label" htmlFor="form9Example1">First name</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div data-mdb-input-init className="form-outline">
                                            <input onChange={handleChange} name='lastName' type="text" id="form9Example2" className="form-control input-custom" />
                                            <label className="form-label" htmlFor="form9Example2">Last name</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col">
                                        <div data-mdb-input-init className="form-outline">
                                            <input onChange={handleChange} name='city' type="text" id="form9Example3" className="form-control input-custom" />
                                            <label className="form-label" htmlFor="form9Example3">City</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div data-mdb-input-init className="form-outline">
                                            <input onChange={handleChange} name='zip' type="text" id="form9Example4" className="form-control input-custom" />
                                            <label className="form-label" htmlFor="form9Example4">Zip</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col">
                                        <div data-mdb-input-init className="form-outline">
                                            <input onChange={handleChange} name='address' type="text" id="form9Example6" className="form-control input-custom" />
                                            <label className="form-label" htmlFor="form9Example6">Address</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div data-mdb-input-init className="form-outline">
                                            <input onChange={handleChange} name='email' type="email" id="typeEmail" className="form-control input-custom" />
                                            <label className="form-label" htmlFor="typeEmail">Email</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="float-end">
                                    <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-warning btn-rounded"
                                    >Place order</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Address;
