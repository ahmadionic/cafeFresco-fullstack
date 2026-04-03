import image1 from '../assets/About/c1.jpg'
import image2 from '../assets/About/c2.jpg'
import image3 from '../assets/About/c3.jpg'
import image4 from '../assets/About/c4.jpg'
import { useEffect } from 'react'
const About = () => {

    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div>
            <section className="py-5">
                <div className="container">
                    <div className="row gx-4 align-items-center justify-content-between">
                        <div className="col-md-5 order-2 order-md-1">
                            <div className="mt-5 mt-md-0">
                                <span className="text-muted">Our Story</span>
                                <h2 className="display-5 fw-bold"><span style={{ color: 'red' }}>About Us</span></h2>
                                <p className="lead">Welcome to <strong className='bold' > Cafe Fresco </strong> , where every bite is a celebration of taste! Our menu is crafted with fresh ingredients and bold flavors to bring you the best of global cuisine. Whether you are craving a hearty meal or a sweet treat, Flavour Land promises a delightful dining experience for every occasion..</p>
                            </div>
                        </div>
                        <div className="col-md-6 offset-md-1 order-1 order-md-2">
                            <div className="row gx-2 gx-lg-3">
                                <div className="col-6">
                                    <div className="mb-2"><img className="img-fluid rounded-3" src={image1} /></div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-2"><img className="img-fluid rounded-3" src={image2} /></div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-2"><img className="img-fluid rounded-3" src={image3} /></div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-2"><img className="img-fluid rounded-3" src={image4} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
