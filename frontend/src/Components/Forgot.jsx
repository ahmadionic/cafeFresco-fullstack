import { useState } from "react";
import './CSS/login.css';
import forget from '../assets/forget.svg'
import { useEffect, useContext } from "react";
import productContext from '../Context/ProductContext';
import toast from 'react-hot-toast';


const Forgot = () => {
    const [email, setEmail] = useState('')
    const { ringtone } = useContext(productContext);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState(false);
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


    const handleSubmit = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/user/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                ringtone.play();
            } else {
                toast.error(data.message);
                ringtone.play();
            }

        } catch (error) {
            console.error("Error occurred:", error.message);
            toast.error('Server Error');
            ringtone.play();
        } finally {
            setLoading(false)
        }
    }


    return (
        <section className="vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img
                            src={forget}
                            className="img-fluid"
                            alt="Sample"
                        />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form>
                            <h4 className="mb-4">Forgot Password?</h4>
                            <p>Enter your email to receive reset instructions.</p>

                            {/* Email input */}
                            <div className="form-outline mb-4">
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control form-control-lg"
                                    placeholder="Enter your email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />

                                <label className="form-label" htmlFor="email">
                                    Email address
                                </label>
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                {!loading ? (
                                    <button
                                        type="button"
                                        className="btn btn-red btn-lg"
                                        style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                                        onClick={handleSubmit}
                                    >
                                        Send Reset Link
                                    </button>
                                ) : <button
                                    type="button"
                                    className="btn btn-red btn-lg"
                                    style={{
                                        paddingLeft: "2.5rem",
                                        paddingRight: "2.5rem",
                                        backgroundColor: "#dc3545",
                                        borderColor: "#dc3545"
                                    }}
                                    disabled
                                >
                                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    Sending...
                                </button>
                                }

                            </div>
                        </form>
                    </div>
                </div>
            </div >

        </section >
    );
};

export default Forgot;
