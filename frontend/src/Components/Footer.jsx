import { Link } from 'react-router-dom'
import logo from '../assets/logo/logo2.png'
import vector from '../assets/logo/Vector2.png'
const Footer = () => {
    return (
        <div>
            <div className="d-flex" style={{ justifyContent: "space-around", marginTop: "80px", columnGap: "225px" }}>
                <div className="logoBottom">
                    <img src={logo} style={{ height: 40 }} />
                </div>

                <div className=" d-flex navBottom gap-5" style={{ color: "black", fontWeight: "700", marginTop: "7px" }}>
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/products">Product</Link>
                    <Link className="nav-link" to="/contact">Contact</Link>
                    <Link className="nav-link" to="/about">About</Link>
                </div>

            </div>

            <img className='vector' src={vector} />

{/* 𝕸𝖗 𝖎𝖘𝖒𝖆𝖊𝖊𝖑  */}
            <p style={{ fontSize: "20px", alignItems: "center", textAlign: "center" }}><strong>  © </strong>𝟮𝟬𝟮𝟱 𝕯𝖊𝖛𝖊𝖑𝖔𝖕𝖊𝖉 𝖇𝖞 <span style={{ color: "#ff0000", fontWeight: "700" }}>𝕸𝖗 𝖎𝖘𝖒𝖆𝖊𝖊𝖑 ,irfan,waleed</span></p>


        </div>
    )
}

export default Footer
