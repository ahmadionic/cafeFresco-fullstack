import 'boxicons';
import logo from '../assets/logo/logo2.png';
import vector from '../assets/logo/Vector2.png';
import { Link } from 'react-router-dom';
import productContext from '../Context/ProductContext';
import { useContext, useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
    const Context = useContext(productContext);
    const { cart, wishlists, setWishList } = Context;
    // const userToken = Cookies.get('userToken');
    const location = useLocation();
    const navigate = useNavigate();

    const [mobile_menu, setMobile] = useState(false);
    const menuRef = useRef(null);
    const profileRef = useRef(null);

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        const token = Cookies.get('userToken');
        console.log(Cookies.get('userToken'));
        setUserToken(token || null);
    }, []);

    const handleMobile = () => {
        setMobile(!mobile_menu);
    };

    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setMobile(false);
        }
        if (profileRef.current && !profileRef.current.contains(e.target)) {
            setShowProfileDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setMobile(false);
    }, [location]);

    return (
        <div>
            <nav style={{ alignItems: "center" }} className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid desktopMenu">
                    {/* Logo and Mobile Icons */}
                    <div className="d-flex align-items-center">
                        <img src={logo} alt="logo" style={{ height: 40 }} />

                        {/* Mobile Cart */}
                        <Link to="/cart" className="MobileCart d-lg-none ms-3" style={{
                            cursor: 'pointer', position: 'relative', top: "15px",
                            left: "-238px", width: "45px", height: "50px"
                        }}>
                            <box-icon name="cart" color="black"></box-icon>
                            {cart.length !== 0 && (
                                <span
                                    style={{ top: '-45px', right: '-17px' }}
                                    className="position-relative badge rounded-pill bg-danger"
                                >
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        {/* Toggle Button */}
                        <button className="navbar-toggler ms-2" style={{ position: "relative", right: "30px" }} onClick={handleMobile}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-5 topBotomBordersOut" style={{ fontSize: "16px", fontWeight: 600, position: "relative", top: "11px" }}>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`} to="/products">Products</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/about">About Us</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} to="/contact">Contact</Link>
                            </li>
                            <li className="nav-item position-relative">
                                <Link className={`nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`} to="/wishlist">Wishlist</Link>
                                {wishlists.length !== 0 && (
                                    <span
                                        style={{ top: '-36px', right: '-72px' }}
                                        className="position-relative translate-middle badge rounded-pill bg-danger"
                                    >
                                        {wishlists}
                                    </span>
                                )}
                            </li>
                        </ul>

                        {/* Right Side: Socials, Cart, Profile */}
                        <form className="d-flex mx-lg-4 gap-3 align-items-center">
                            <box-icon style={{ cursor: 'pointer' }} type="logo" name="facebook"></box-icon>
                            <box-icon style={{ cursor: 'pointer' }} type="logo" name="twitter"></box-icon>
                            <box-icon style={{ cursor: 'pointer' }} name="instagram-alt" type="logo"></box-icon>

                            {/* Desktop Cart */}
                            <Link to="/cart" className="d-none d-lg-block" style={{ marginTop: '7px', cursor: 'pointer', position: 'relative' }}>
                                <box-icon name="cart"></box-icon>
                                {cart.length !== 0 && (
                                    <span
                                        style={{ top: '-23px', right: '6px' }}
                                        className="position-relative badge rounded-pill bg-danger"
                                    >
                                        {cart.length}
                                    </span>
                                )}
                            </Link>

                            {/* Profile Icon */}
                            <div ref={profileRef} className="position-relative">
                                <button
                                    className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowProfileDropdown(prev => !prev);
                                    }}
                                >
                                    <i className="bi bi-person-fill fs-5 text-dark"></i>
                                </button>

                                {showProfileDropdown && (
                                    <div
                                        className="position-absolute end-0 mt-2 p-3 bg-white border rounded shadow-sm"
                                        style={{ minWidth: '160px', zIndex: 1000 }}
                                    >
                                        {!userToken ? (
                                            <>
                                                <Link to="/login" className="btn btn-outline-danger w-100 mb-2">
                                                    Login
                                                </Link>
                                                <Link
                                                    to="/signup"
                                                    className="btn w-100"
                                                    style={{ backgroundColor: '#FFD700', color: '#000', fontWeight: 600 }}
                                                >
                                                    Sign Up
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <div className="d-flex flex-column gap-2 p-2" style={{ width: '170px' }}>
                                                    <Link
                                                        to="/track"
                                                        className="btn btn-outline-warning py-1 px-3 shadow-sm"
                                                        style={{
                                                            fontWeight: 600,
                                                            fontSize: '0.95rem',
                                                            borderWidth: '1.5px',
                                                            borderRadius: '6px',
                                                            transition: 'all 0.2s ease',
                                                            color: '#000',
                                                            textAlign: 'center',
                                                            ':hover': {
                                                                backgroundColor: '#fff9e6',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                    >
                                                        <i className="fas fa-truck-fast me-2" style={{ fontSize: '0.9rem' }}></i>
                                                        Track Order
                                                    </Link>

                                                    <Link
                                                        to="/user/profile"
                                                        className="btn btn-outline-primary py-1 px-3 shadow-sm"
                                                        style={{
                                                            fontWeight: 600,
                                                            fontSize: '0.95rem',
                                                            borderWidth: '1.5px',
                                                            borderRadius: '6px',
                                                            transition: 'all 0.2s ease',
                                                            textAlign: 'center',
                                                            ':hover': {
                                                                backgroundColor: '#f0f7ff',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                    >
                                                        <i className="fas fa-user-pen me-2" style={{ fontSize: '0.8rem' }}></i>
                                                        User Profile
                                                    </Link>

                                                    <button
                                                        className="btn btn-outline-danger py-1 px-3 shadow-sm"
                                                        onClick={() => {
                                                            Cookies.remove('userToken');
                                                            navigate('/login');
                                                            setWishList(0);
                                                        }}
                                                        style={{
                                                            fontWeight: 600,
                                                            fontSize: '0.95rem',
                                                            borderWidth: '1.5px',
                                                            borderRadius: '6px',
                                                            transition: 'all 0.2s ease',
                                                            textAlign: 'center',
                                                            ':hover': {
                                                                backgroundColor: '#ffebee',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                    >
                                                        <i className="fas fa-right-from-bracket me-2" style={{ fontSize: '0.8rem' }}></i>
                                                        Logout
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}


                            </div>
                        </form>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobile_menu && (
                <div ref={menuRef} id="mobile_menu_hide">
                    <div className="mobile_menu">
                        <div className="navigation">
                            <Link to="/">Home</Link>
                            <Link to="/products">Products</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                        </div>
                        <div className="navigation_btn">
                            <box-icon style={{ cursor: 'pointer' }} type="logo" name="facebook"></box-icon>
                            <box-icon style={{ cursor: 'pointer' }} type="logo" name="twitter"></box-icon>
                            <box-icon style={{ cursor: 'pointer' }} name="instagram-alt" type="logo"></box-icon>
                        </div>
                        <div className="mt-3 text-center">
                            <Link to="/login" className="btn btn-outline-dark w-75 mb-2">Login</Link>
                            <Link to="/signup" className="btn btn-dark w-75">Sign Up</Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Vector Image */}
            <img className="vector" src={vector} alt="vector" style={{ width: '100%' }} />


        </div>
    );
};

export default Navbar;
