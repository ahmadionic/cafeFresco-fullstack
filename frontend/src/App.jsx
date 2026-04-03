import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Components/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './Components/ProductPage';
import ProductDetail from './Components/ProductDetail';
import ProductState from './Context/ProductState';
import CartPage from './Components/CartPage';
import Track from './Components/Track';
import Payment from './Components/Payment';
import Address from './Components/Address';
import Contact from './Components/Contact';
import About from './Components/About';
import Wishlist from './Components/Wishlist';
import Login from './Components/LoginPage'
import SignUp from './Components/Signup';
import Forgot from './Components/Forgot';
import Profile from './Components/UserProfile';
import ResetPassword from './Components/Reset';
import { Toaster } from 'react-hot-toast';

function Layout() {

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/track" element={<Track />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/user/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:title" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/address" element={<Address />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/wishlist" element={<Wishlist />} />

      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ProductState>
      <Router>
        <Layout />
      </Router>
    </ProductState>
  );
}

export default App;
