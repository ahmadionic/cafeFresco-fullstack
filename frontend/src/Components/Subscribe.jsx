
import image1 from '../assets/logo/subs-1.png'
import image2 from '../assets/logo/subs-2.png'
const Subscribe = () => {
    return (
        <div className='MobileSubscribe' style={{ marginBottom: "40px" }}>
            <div style={{ backgroundColor: "#feeab3", width: "85%", height: "440px", borderRadius: "110px", marginLeft: "110px", overflow: "hidden" }}>

                <div className="d-flex flex-column gap-3" style={{ position: "relative", marginTop: "70px", justifyContent: "center", alignItems: "center" }}>

                    <h1 style={{ fontWeight: 700 }}>A taste of <span style={{ color: 'red' }}>delight</span> in your inbox</h1>
                    <p style={{ width: "600px", textAlign: "center" }}>Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim </p>

                    <div className="input " style={{ marginLeft: "90px" }}>
                        <input style={{ width: "400px", height: "60px", borderRadius: "16px", border: "none" }} placeholder=" Your email address">
                        </input>
                        <a style={{ position: "relative", left: "-100px", top: "-2px", borderRadius: "20px" }} className=' btn btn-dark'>Subscribe</a>


                    </div>
                </div>

                <img style={{ position: "relative", right: "0px", top: "-210px", borderRadius: "105px" }} src={image1}></img>
                <img style={{ position: "relative", right: "-562px", top: "-145px", borderRadius: "41px" }} src={image2}></img>
            </div>
        </div>
    )
}

export default Subscribe
