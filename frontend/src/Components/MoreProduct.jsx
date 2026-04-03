import ProductItem from './ProductItem';
import { useState, useEffect } from 'react';


const MoreRecepies = (props) => {

    const [Products, setProducts] = useState([])
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${BASE_URL}/product/featured`);
                const data = await res.json();
                setProducts(data || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);


    const displayedProducts = Products.slice(0, props.count);

    return (

        <div>

            {props.count === 8 && (
                <div className="d-flex columnFlex" style={{ justifyContent: "space-around", marginTop: "100px" }}>
                    <h1 className='heading headingLearn center' style={{ fontWeight: 700, width: "445px" }}>
                        Bring joy to your table with this <span style={{ color: 'red' }}>irresistible</span> recipe!
                    </h1>
                    <p className='headingLearn center' style={{ width: "500px" }}>
                        Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim
                    </p>
                </div>
            )}

            {props.count === 4 && (
                <div className="d-flex heading headingLearn center" style={{ justifyContent: "space-around", marginTop: "100px" }}>
                    <h1 style={{ fontWeight: 700, width: "700px" }}>
                        <span style={{ color: "red" }}>Craving more?</span> Try these recipes too
                    </h1>


                </div>
            )}

            <div style={{ marginTop: "60px" }}>


                <div className='mt-3 ItemMargin ' style={{ marginLeft: 135 }}>
                    <div className="row g-0 custom-gap">
                        {displayedProducts.map((item, index) => (
                            <div key={index} className="col-12 col-md-4 mb-4 " style={{ width: "320px" }}>
                                <ProductItem
                                    id={item._id}
                                    title={item.title}
                                    details={item.category?.title}
                                    image={item.image}
                                    price={item.price}
                                    isFeatured={item.featured}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default MoreRecepies
