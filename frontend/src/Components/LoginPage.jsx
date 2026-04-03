import { useState } from "react";
import { useContext, useEffect, useRef } from 'react';
import productContext from '../Context/ProductContext';
import './CSS/login.css';
import login from '../assets/login.svg'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';


const LoginSection = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { ringtone } = useContext(productContext);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const [loginBlocked, setLoginBlocked] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const endTimeRef = useRef(null);


    const handleLogin = async () => {
        try {
            const res = await fetch(`${BASE_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data)
            // 🔒 Rate limit check
            if (!res.ok && data.message === "Too many requests, please try again later.") {
                setLoginBlocked(true);
                setCountdown(15 * 60); // 15 minutes
                toast.error(data.message);
                ringtone.play();
                return;
            }

            // 🚫 VPN check: if VPN is detected (vpnSuccess === true), block login
            if (data.vpnSuccess === true) {
                toast.error(data.message || "VPN detected. Please disable VPN.");
                ringtone.play();
                return;
            }

            // ✅ Login successful
            if (res.ok) {
                // if (data.userToken) {
                //     document.cookie = `userToken=${data.usertoken}; path=/; max-age=${15 * 24 * 60 * 60}; SameSite=None; Secure`;
                // }
                toast.success(data.message || "Login successful");
                ringtone.play();
                navigate('/');
            } else {
                // ❌ Any other login failure
                toast.error(data.message || "Login failed");
                ringtone.play();
            }

        } catch (error) {
            console.error("Error occurred:", error.message);
            toast.error("Something went wrong. Please try again.");
            ringtone.play();
        }
    };


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

    useEffect(() => {
        if (loginBlocked) {
            // Only set endTime once when blocking starts
            if (!endTimeRef.current) {
                endTimeRef.current = Date.now() + countdown * 1000;
            }

            const timer = setInterval(() => {
                const remaining = Math.floor((endTimeRef.current - Date.now()) / 1000);
                if (remaining > 0) {
                    setCountdown(remaining);
                } else {
                    setCountdown(0);
                    setLoginBlocked(false);
                    endTimeRef.current = null; // reset ref
                    clearInterval(timer);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [loginBlocked]);


    return (
        <section className="vh-100 login-page" style={{ overflow: 'hidden' }}>
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    {/* Image Column */}
                    <div className="col-md-9 col-lg-6 col-xl-5 mb-4 mb-md-0 text-center">
                        <img src={login} className="img-fluid" alt="Sample" style={{ maxWidth: "100%", height: "auto" }} />
                    </div>

                    {/* Form Column */}
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form>
                            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-lg-start gap-2">
                                <p className="lead fw-normal mb-2 mb-md-0 me-md-3">Sign in with</p>
                                <button type="button" className="btn btn-red btn-floating">
                                    <i className="fab fa-facebook-f"></i>
                                </button>
                                <button type="button" className="btn btn-yellow btn-floating">
                                    <i className="fab fa-twitter"></i>
                                </button>
                                <button type="button" className="btn btn-red btn-floating">
                                    <i className="fab fa-linkedin-in"></i>
                                </button>
                            </div>

                            <div className="divider d-flex align-items-center my-4">
                                <p className="text-center fw-bold mx-3 mb-0">Or</p>
                            </div>

                            {/* Email */}
                            <div className="form-outline mb-4">
                                <input
                                    type="email"
                                    id="form3Example3"
                                    className="form-control form-control-lg"
                                    placeholder="Enter a valid email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <label className="form-label" htmlFor="form3Example3">Email address</label>
                            </div>

                            {/* Password */}
                            <div className="form-outline mb-3">
                                <input
                                    type="password"
                                    id="form3Example4"
                                    className="form-control form-control-lg"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <label className="form-label" htmlFor="form3Example4">Password</label>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <div className="form-check mb-0">
                                    <input className="form-check-input me-2" type="checkbox" id="form2Example3" />
                                    <label className="form-check-label" htmlFor="form2Example3">Remember me</label>
                                </div>
                                <Link to="/forgot" className="text-body">Forgot password?</Link>
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button
                                    type="button"
                                    className="btn btn-red btn-lg w-100"
                                    onClick={handleLogin}
                                    disabled={loginBlocked}
                                >
                                    {loginBlocked
                                        ? `Try again in ${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}`
                                        : "Login"}
                                </button>
                                <p className="small fw-bold mt-2 pt-1 mb-0 text-center">
                                    Don't have an account? <Link to="/signup" className="link-danger">Register</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


        </section>

    );
};

export default LoginSection;
