import React, { useEffect, useState } from 'react';
import { useContext } from "react";
import productContext from '../Context/ProductContext';
import toast from 'react-hot-toast';
const UserProfile = () => {

    const [data, setData] = useState({})

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { ringtone } = useContext(productContext);
    const [loading, setLoading] = useState(false);

    const getUserInfo = async () => {
        try {
            const res = await fetch(`${BASE_URL}/user/user-info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await res.json();
            setData(data.user || {})
            if (!res.ok) {
                throw new Error(data.message || 'Failed to fetch user info');
            }

            return data.user;
        } catch (error) {
            console.error('Error fetching user info:', error.message);
            return null;
        }
    };

    const handleReset = async (email) => {
        if (!email) {
            toast.success('Server Problem, Reload');
            ringtone.play();
            return;
        }
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


    useEffect(() => {
        getUserInfo();
    }, [BASE_URL])

    return (
        <div className="container py-4">
            <div className="main-body">

                {/* Top Centered Profile Image */}
                <div className="d-flex justify-content-center mb-4">
                    <div className="text-center">
                        <img
                            src="https://bootdey.com/img/Content/avatar/avatar7.png"
                            alt="Admin"
                            className="rounded-circle border"
                            width="150"
                        />
                        <h4 className="mt-2">{data?.name || 'Unknown'}</h4>
                        <p className="text-secondary mb-1">{data?.email || 'example@gmail.com'}</p>
                        <p className="text-muted">{data?.address || 'Bay Area, San Francisco, CA'}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }} className="row gutters-sm">

                    {/* Right Section (Details) */}
                    <div className="col-md-8 mb-3 d-flex justify-content-center">
                        <div className="card w-100 border-0" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                            <div className="card-body p-4 p-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>Profile Information</h4>
                                    {/* <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '8px' }}>
                                        <i className="fas fa-pencil-alt me-1"></i> Edit
                                    </button> */}
                                </div>

                                {/* User Info Rows - Improved styling */}
                                {[
                                    {
                                        label: 'Full Name',
                                        value: data?.name || 'Unknown',  // Safely accesses data.name with fallback
                                        icon: 'user'
                                    },
                                    {
                                        label: 'Email',
                                        value: data?.email || 'example@gmail.com',  // Example with potential dynamic data
                                        icon: 'envelope'
                                    },
                                    {
                                        label: 'Phone',
                                        value: data?.phone || '(239) 816-9029',
                                        icon: 'phone-alt'
                                    },
                                    {
                                        label: 'Mobile',
                                        value: data?.mobile || '(320) 380-4539',
                                        icon: 'mobile-alt'
                                    },
                                    {
                                        label: 'Address',
                                        value: data?.address || 'Bay Area, San Francisco, CA',
                                        icon: 'map-marker-alt'
                                    },
                                ].map((item, idx) => (
                                    <div className="row mb-3 align-items-center" key={idx}>
                                        <div className="col-sm-3 col-md-4 text-sm-end mb-2 mb-sm-0">
                                            <div className="d-flex align-items-center justify-content-sm-end">
                                                <i className={`fas fa-${item.icon} text-muted me-2`} style={{ width: '20px' }}></i>
                                                <h6 className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>{item.label}</h6>
                                            </div>
                                        </div>
                                        <div className="col-sm-9 col-md-8">
                                            <div className="p-3 bg-light rounded" style={{ backgroundColor: '#f8f9fa!important' }}>
                                                <span className="text-dark fw-semibold" style={{ fontSize: '0.95rem' }}>{item.value}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Action Buttons */}
                                <div className="d-flex justify-content-center mt-5 gap-3">
                                    {/* <button
                                        className="btn btn-outline-secondary px-4 py-2 d-flex align-items-center"
                                        style={{
                                            fontWeight: '600',
                                            borderRadius: '10px',
                                            border: '1px solid #dee2e6'
                                        }}
                                    >
                                        <i className="fas fa-key me-2"></i> Change Password
                                    </button> */}
                                    <button
                                        className="btn btn-danger px-4 py-2 d-flex align-items-center"
                                        style={{
                                            fontWeight: '600',
                                            borderRadius: '10px',
                                            boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
                                        }}
                                        onClick={() => { handleReset(data?.email) }}
                                    >
                                        <i className="fas fa-sync-alt me-2"></i> Reset Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserProfile;
