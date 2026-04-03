import React, { useContext, useState, useEffect } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Button, CircularProgress } from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';

let searchTimeout;

const ProductDashboard = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCategory, setSortCategory] = useState('All');
    const [sortPrice, setSortPrice] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const { categories, adminRole } = useContext(MainContext);
    const navigate = useNavigate();


    const fetchProducts = async () => {
        setLoading(true);
        try {
            const category = sortCategory === 'All' ? '' : encodeURIComponent(sortCategory);
            const sort = sortPrice === 'low' ? 'low' : sortPrice === 'high' ? 'high' : '';
            const name = encodeURIComponent(searchTerm || '');
            const response = await fetch(`${BASE_URL}/product/fetch?category=${category}&page=${currentPage}&name=${name}&sort=${sort}`);

            const data = await response.json();

            if (data.success) {
                setProducts(data.products || []);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        setLoading(false);

    };

    useEffect(() => {
        fetchProducts();
    }, [sortCategory, sortPrice, currentPage]);


    useEffect(() => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(searchTimeout);
    }, [searchTerm, sortCategory, sortPrice, currentPage]);


    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleCategoryChange = (e) => setSortCategory(e.target.value);
    const handlePriceSort = (e) => setSortPrice(e.target.value);
    const handlePageChange = (event, value) => setCurrentPage(value);

    const handleUpdate = (id) => {
        navigate(`/admin/edit-product/${id}`);
    }

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this product?");

        if (!isConfirmed) return;
        try {
            const response = await fetch(`${BASE_URL}/product/delete/${id}`, {
                method: 'DELETE',
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
            }

            alert(data.message || "Product deleted successfully!");
            fetchProducts();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };


    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
                <FormControl style={{ minWidth: '100px' }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={sortCategory} label="Category" onChange={handleCategoryChange}>
                        <MenuItem value="All">All</MenuItem>
                        {categories && categories.length > 0 ? (
                            categories
                                .filter(category => category)
                                .map(category => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.title}
                                    </MenuItem>
                                ))
                        ) : (
                            <MenuItem disabled>No Categories Available</MenuItem>
                        )}
                    </Select>

                </FormControl>

                <TextField
                    label="Search by name"
                    value={searchTerm}
                    onChange={handleSearch}
                    variant="outlined"
                    style={{ minWidth: '300px' }}
                />

                <FormControl style={{ minWidth: '170px' }}>
                    <InputLabel>Sort by Price</InputLabel>
                    <Select value={sortPrice} label="Sort by Price" onChange={handlePriceSort}>
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="low">Low to High</MenuItem>
                        <MenuItem value="high">High to Low</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : products.length === 0 ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <p>No Product found</p>
                </Box>) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>No</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Category</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Price</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Featured</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Stock</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Discount</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Rating</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold', paddingLeft: '20px' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product, index) => (
                                    <TableRow key={product.id}>
                                        <TableCell align="center">{(currentPage - 1) * 10 + index + 1}</TableCell>

                                        <TableCell align='center'>{product.title || 'N/A'}</TableCell>
                                        <TableCell align='center'>{product.category.title}</TableCell>
                                        <TableCell align='center'>${product.discountedPrice}</TableCell>
                                        <TableCell align='center'>{product.featured ? "Yes" : "No"}</TableCell>
                                        <TableCell align='center'>{product.inventory?.quantityInStock}</TableCell>
                                        <TableCell align='center'>{product.discount}%</TableCell>
                                        <TableCell align='center'>{product.averageRating}</TableCell>
                                        <TableCell align='center'>
                                            <Button onClick={() => { handleUpdate(product._id) }} variant="outlined" color="primary" size="small" style={{ border: "2px solid", borderRadius: '8px' }}>Edit</Button>
                                            <Button
                                                disabled={adminRole?.toLowerCase() === "editor"}
                                                onClick={() => handleDelete(product._id)}
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                style={{ marginLeft: '8px', border: "2px solid", borderRadius: '8px' }}
                                            >
                                                Delete
                                            </Button>



                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};

export default ProductDashboard;
