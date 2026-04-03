import learn from '../assets/logo/chef.svg'

const Learn = () => {
    return (
        <div>
            <div className="contianer d-flex ItemMargin " style={{ marginLeft: "160px", marginTop: "30px", justifyContent: "space-between", alignItems: "center", width: "80%" }}>
                <div className="right">
                    <div className="d-flex flex-column gap-3">
                        <h1 className='headingLearn' style={{ fontWeight: 700, width: "445px" }}>
                            Unleash your inner <span style={{ color: "red" }}>chef</span> — magic starts in your kitchen
                        </h1>

                        <p className='headingLearn' style={{ width: "450px" }}  >Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim </p>
                        <a style={{ width: "120px", borderRadius: "10px", backgroundColor: "red", border: "none" }} className='btn text-white'>
                            Learn more
                        </a>

                    </div>
                </div>
                <div className="left">
                    <img src={learn} style={{ width: 550, height: 490 }} />
                </div>
            </div>
        </div>
    )
}

export default Learn
