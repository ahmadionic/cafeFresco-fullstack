import './CSS/login.css';
import reset from '../assets/reset.svg'
import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import productContext from '../Context/ProductContext';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [password, setPassword] = useState({ new: '', confirm: '' });
    const [loading, setLoading] = useState(false)
    const { ringtone } = useContext(productContext);
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const { token } = useParams();

    const handleSubmit = async () => {
        setLoading(true)
        if (password.new !== password.confirm) {
            toast.error("Passwords do not match");
            ringtone.play();
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/user/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword: password.new }),
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
    return (
        <section className="vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img
                            src={reset}
                            className="img-fluid"
                            alt="Reset"
                        />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form>
                            <h4 className="mb-4">Reset Your Password</h4>

                            {/* New Password */}
                            <div className="form-outline mb-3">
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="form-control form-control-lg"
                                    placeholder="New Password"
                                    value={password.new}
                                    onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                />
                                <label className="form-label" htmlFor="newPassword">
                                    New Password
                                </label>
                            </div>

                            {/* Confirm Password */}
                            <div className="form-outline mb-3">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="form-control form-control-lg"
                                    placeholder="Confirm Password"
                                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                    value={password.confirm}

                                />
                                <label className="form-label" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                {
                                    !loading ? (<button
                                        type="button"
                                        className="btn btn-yellow btn-lg"
                                        style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                                        onClick={handleSubmit}
                                    >
                                        Reset Password
                                    </button>) : <button
                                        type="button"
                                        className="btn btn-red btn-lg"
                                        style={{
                                            paddingLeft: "2.5rem",
                                            paddingRight: "2.5rem",
                                            backgroundColor: "#FBBF1B",
                                            borderColor: "#FBBF1B"
                                        }}
                                        disabled
                                    >
                                        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                        Updating...
                                    </button>}

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
        </section>
    );
};

export default ResetPassword;
