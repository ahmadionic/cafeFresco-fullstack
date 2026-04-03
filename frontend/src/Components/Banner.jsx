import side1 from '../assets/logo/Rectangle 5.png';
import side2 from '../assets/logo/Rectangle 6.png';
import left from '../assets/logo/left-banner.png';
import hot from '../assets/logo/recipe.png';
import badge from '../assets/logo/Badge.png';
import line from '../assets/logo/lines.png';
import line2 from '../assets/logo/line2.png';

const Banner = () => {
    return (
        <div style={{ marginTop: 40 }}>
            <div className="d-flex banner">
                {/* Disable line on mobile */}
                <img className="line-img" style={{ width: "115px", position: "absolute", left: "-19px", top: "170px", height: "415px" }} src={line} />
                <img className="side-img" src={side1} />

                <div className="Container d-flex">
                    <div className="badge-banner">
                        <img src={badge} />
                    </div>
                    <div style={{ width: "50%", backgroundColor: '#feeab3' }} className="left d-flex flex-column gap-5">
                        <div className='bannerBtn' style={{ boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)", marginLeft: "50px", textAlign: 'center', color: 'black', fontWeight: 700, backgroundColor: 'white' }}>
                            <img src={hot} />
                            <span>Hot Recipes</span>
                        </div>
                        <div className="bannerData d-flex flex-column gap-4">
                            <h2>Spicy delicious <span>Fresco Bombs</span></h2>
                            <p>Experience an array of mouthwatering dishes and delightful treats, expertly crafted to satisfy your cravings and elevate your dining experience.</p>
                            <div className=" d-flex gap-2">
                                <div className="d-flex gap-1 bannerBtn">
                                    <box-icon type='solid' name='time'></box-icon>30 Minutes
                                </div>
                                <div className="d-flex gap-1 bannerBtn">
                                    <box-icon name='fork'></box-icon>Dinning
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right" style={{ width: "50%" }}>
                        <img className="banner" src={left} />
                    </div>
                </div>

                {/* Disable line2 and side image on mobile */}
                <img className="line-img" style={{ width: "115px", position: "absolute", right: "-30px", top: "170px", height: "415px", zIndex: "10000" }} src={line2} />
                <img className="side-img" style={{ position: 'relative', right: 0 }} src={side2} />
            </div>
        </div>
    );
};

export default Banner;
