import post1 from '../assets/posts/Post (1).png'
import post2 from '../assets/posts/Post (2).png'
import post3 from '../assets/posts/Post (3).png'
import post4 from '../assets/posts/Post.png'


const Posts = () => {
    return (
        <>

            <div className="post" style={{
                background: 'linear-gradient(0deg, #ffdca9 0%, #feeab3 50%, #ffffff 100%)'
            }}
            >

                <div style={{ marginTop: "100px" }}>
                    <h1 className='heading' style={{ textAlign: "center", fontWeight: 700 }}>Check out  <span style={{ color: "red" }}>@cafeFresco</span> on Instagram</h1>
                    <p className='FlavourWidth none' style={{ marginLeft: "450px", width: "600px", textAlign: "center" }}>Discover our amazing creations on Instagram @cafeFresco. Enjoy the perfect blend of taste and quality in every bite.</p>
                </div>


                <div className="container MobilePost " style={{ marginTop: "70px" }}>
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-12">
                            <img src={post1} className="img-fluid" alt="Image 1" />
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <img src={post2} className="img-fluid" alt="Image 2" />
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <img src={post3} className="img-fluid" alt="Image 3" />
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <img src={post4} className="img-fluid" alt="Image 4" />
                        </div>
                    </div>
                </div>


                <div className="d-flex justify-content-center">
                    <a style={{ backgroundColor: "red", textAlign: "center", marginBottom: "30px", height: "45px", borderRadius: "15px", marginTop: "60px", border: 'none' }} className="btn btn-dark">Visit Our Instagram</a>
                </div>
            </div >
        </>
    )
}

export default Posts
