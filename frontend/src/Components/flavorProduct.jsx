
import ProductItem from './ProductItem';
import { useState, useEffect } from 'react';

const Recipes = () => {

    const [Products, setProducts] = useState([])
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${BASE_URL}/product/new-releases`);
                const data = await res.json();
                setProducts(data || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);




    return (
        <>
            <div style={{ marginTop: "100px" }}>
                <h1 className='heading' style={{ fontWeight: "700", textAlign: "center" }}>
                    <span style={{ color: "red" }}>Just dropped</span> Fresh & Flavorful Picks!
                </h1>

                <p className='FlavourWidth' style={{ marginBottom: "90px", textAlign: "center", margin: "0 auto" }}>Discover our selection of delicious and satisfying products. Enjoy a variety of flavors and options to satisfy your cravings.</p>


                <div className='mt-3 ItemMargin ' style={{ marginLeft: 135 }}>
                    <div className="row g-0 custom-gap">
                        {Products.map((item, index) => (
                            <div key={index} className="col-12 col-md-4 mb-4 " style={{ width: "320px" }}>
                                <ProductItem background="rgb(235, 250, 253, 0.89)"
                                    id={item._id}
                                    title={item.title}
                                    details={item.category?.title}
                                    image={item.image}
                                    price={item.price}
                                    description={item.description}
                                    image2={item.image2}
                                    isNew={item.newRelease}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Recipes;
