import './CSS/login.css';
import login from '../assets/login.svg'
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import productContext from '../Context/ProductContext';
import toast from 'react-hot-toast';

const SignUp = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { ringtone } = useContext(productContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });


    useEffect(() => {
        const isDesktop = window.innerWidth >= 768;

        if (isDesktop) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            if (isDesktop) {
                document.body.style.overflow = 'auto';
            }
        };
    }, []);


    const handleRegister = async () => {
        try {
            const res = await fetch(`${BASE_URL}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                // if (data.userToken) {
                //     document.cookie = `userToken=${data.userToken}; path=/; max-age=${15 * 24 * 60 * 60}; SameSite=None; Secure`;
                // }
                console.log("Signup successful:");
                toast.success(data.message);
                ringtone.play();
                navigate('/');
            } else {
                console.error("Signup failed:", data.message);
                toast.error(data.message);
                ringtone.play();
            }

        } catch (error) {
            console.error("Error occurred:", error.message);
        }
    };




    return (
        <section className="vh-100 login">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img
                            src={login}
                            className="img-fluid"
                            alt="Sample"
                        />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form>
                            <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                                <p className="lead fw-normal mb-0 me-3">Sign up with</p>
                                <button type="button" className="btn btn-red btn-floating mx-1">
                                    <i className="fab fa-facebook-f"></i>
                                </button>

                                <button type="button" className="btn btn-yellow btn-floating mx-1">
                                    <i className="fab fa-twitter"></i>
                                </button>

                                <button type="button" className="btn btn-red btn-floating mx-1">
                                    <i className="fab fa-linkedin-in"></i>
                                </button>
                            </div>

                            <div className="divider d-flex align-items-center my-4">
                                <p className="text-center fw-bold mx-3 mb-0">Or</p>
                            </div>

                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control form-control-lg"
                                    placeholder="Enter a full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <label className="form-label" htmlFor="form3Example3">
                                    Full Name
                                </label>
                            </div>

                            {/* Email input */}
                            <div className="form-outline mb-4">
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control form-control-lg"
                                    placeholder="Enter a valid email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <label className="form-label" htmlFor="form3Example3">
                                    Email address
                                </label>
                            </div>

                            {/* Password input */}
                            <div className="form-outline mb-3">
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control form-control-lg"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <label className="form-label" htmlFor="form3Example4">
                                    Password
                                </label>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <div className="form-check mb-0">
                                    <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        value=""
                                        id="form2Example3"
                                    />
                                    <label className="form-check-label" htmlFor="form2Example3">
                                        Remember me
                                    </label>
                                </div>

                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button
                                    type="button"
                                    className="btn btn-red btn-lg"
                                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                                    onClick={handleRegister}
                                >
                                    Register
                                </button>
                                <p className="small fw-bold mt-2 pt-1 mb-0">
                                    Have an account?{" "}
                                    <Link to="/login" className="link-danger">
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


        </section>
    );
};

export default SignUp;
