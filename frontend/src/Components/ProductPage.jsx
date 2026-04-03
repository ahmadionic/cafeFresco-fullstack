import { useState, useContext, useEffect } from 'react';
import ProductItem from './ProductItem';
import Subscribe from './Subscribe';
import productContext from '../Context/ProductContext'
import './CSS/product.css'
const Products = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const context = useContext(productContext);
    const { searchTerm, setSearchTerm, categories } = context;
    const [products, setProducts] = useState([])
    const productsPerPage = 16;

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);

    };

    useEffect(() => {
        setSearchTerm("");
        window.scrollTo(0, 0);
    }, [])



    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${BASE_URL}/product/all`);
                const data = await res.json();
                setProducts(data || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false)
            }
        };

        fetchProducts();
    }, []);


    const filteredProducts = products.filter((product) => {
        const productCategory = product.category?.title?.toLowerCase() || '';
        const selectedCatLower = selectedCategory.toLowerCase();
        const productTitle = product.title ? product.title.toLowerCase() : '';
        const searchTermLower = searchTerm.toLowerCase();

        // Check if product category matches the selected category or if selectedCategory is "all"
        const categoryMatch = selectedCatLower === 'all' || productCategory === selectedCatLower;

        // Check if product title includes the search term
        const titleMatch = productTitle.includes(searchTermLower);

        return categoryMatch && titleMatch;
    });


    // Calculate the number of pages
    const totalPages = filteredProducts ? Math.ceil(filteredProducts.length / productsPerPage) : Math.ceil(products.length / productsPerPage);

    // Get the products for the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const currentProducts = filteredProducts ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct) :
        products.slice(indexOfFirstProduct, indexOfLastProduct);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>

            <div className="d-flex flex-column gap-3" style={{ position: "relative", marginTop: "70px", justifyContent: "center", alignItems: "center", marginBottom: "50px" }}>
                <h1 className='heading center' style={{ fontWeight: 700 }}>Deliciousness to your inbox</h1>
                <p className='headingLearn center' style={{ width: "600px", textAlign: "center" }}>Discover our delicious range of products, from hearty breakfasts to indulgent desserts, all crafted to satisfy your cravings!</p>
                <div className="d-flex justify-content-center align-items-center" style={{ marginLeft: "90px", gap: "20px" }}>
                    {/* Select - aligned left inside parent container */}
                    <div style={{ position: "absolute", left: "140px" }}>
                        <select
                            className="form-select custom-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{
                                width: "200px",
                                height: "60px",
                                backgroundColor: "#fff",
                                color: "#000",
                            }}
                        >
                            <option value="All">All Categories</option>
                            {categories.map((cat, i) => (
                                <option key={i} value={cat.title}>
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Input + Search button - centered */}
                    <input
                        className="inputWidth"
                        onChange={handleSearchChange}
                        style={{
                            width: "400px",
                            height: "60px",
                            borderRadius: "16px",
                            border: "1px solid gray",
                            padding: "15px"
                        }}
                        placeholder="Search product by name"
                    />
                    <a
                        className="btn btn-dark Search"
                        style={{
                            position: "relative",
                            left: "-98px",
                            top: "-2px",
                            borderRadius: "20px"
                        }}
                    >
                        Search
                    </a>
                </div>

            </div>

            {loading ? (
                <div className="text-center mt-5">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : currentProducts.length > 0 ? (
                <div className="mt-3 ItemMargin" style={{ marginLeft: 135 }}>
                    <div className="row g-0 custom-gap">
                        {currentProducts.map((item, index) => (
                            <div key={index} className="col-12 col-md-4 mb-4" style={{ width: "320px" }}>
                                <ProductItem
                                    id={item._id}
                                    background="rgb(235, 250, 253, 0.89)"
                                    title={item.title}
                                    details={item.category?.title || "N/A"}
                                    image={item.image}
                                    price={item.price}
                                    description={item.description}
                                    isNew={item.newRelease}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p style={{ textAlign: 'center' }}>No products found.</p>
            )
            }


            {/* Pagination */}
            <nav className='d-flex' aria-label="Page navigation example" style={{ justifyContent: "center", marginBottom: "100px", marginTop: "60px" }}>
                <ul className="pagination" style={{ fontWeight: 700 }}>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <a className="page-link pagination-number" href="#" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <a
                                className="page-link pagination-number"
                                href="#"
                                onClick={() => handlePageChange(index + 1)}
                                style={{
                                    backgroundColor: currentPage === index + 1 ? 'black' : '',
                                    color: currentPage === index + 1 ? 'white' : '',
                                }}
                            >
                                {index + 1}
                            </a>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <a className="page-link pagination-number" href="#" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>


            <Subscribe />
        </div>
    );
};

export default Products;
