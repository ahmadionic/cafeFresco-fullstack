import React, { useContext, useState, useEffect } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Button, CircularProgress, Dialog, DialogContent, DialogActions, DialogTitle, } from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx'

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
    const [formData, setFormData] = useState({ id: '', stock: '' });
    const [openModal, setModal] = useState(false)




    if (!["admin", "manager"].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }


    const fetchProducts = async () => {
        setLoading(true);
        try {
            const category = sortCategory === 'All' ? '' : encodeURIComponent(sortCategory);
            const sort = sortPrice === 'low' ? 'low' : sortPrice === 'high' ? 'high' : '';
            const name = encodeURIComponent(searchTerm || '');
            const response = await fetch(`${BASE_URL}/product/fetch?category=${category}&page=${currentPage}&name=${name}&sort=${sort}`);

            const data = await response.json();

            if (data.success) {
                setProducts(data.products);
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
        setFormData({ id, stock: '' });
        setModal(true);
    };



    const handleUpdateStock = async () => {
        if (!formData.stock || isNaN(formData.stock)) {
            alert("Please enter a valid stock quantity.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/product/inventory/update/${formData.id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quantityInStock: Number(formData.stock),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update stock.");
            }

            alert("Stock updated successfully!");
            setModal(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert(error.message);
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
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Last Update</TableCell>

                                    <TableCell align='center' style={{ fontWeight: 'bold', paddingLeft: '20px' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product, index) => (
                                    <TableRow key={product.id}>
                                        <TableCell align='center'>{(currentPage - 1) * products.length + index + 1}</TableCell>
                                        <TableCell align='center'>{product.title}</TableCell>
                                        <TableCell align='center'>{product.category.title}</TableCell>
                                        <TableCell align='center'>${product.discountedPrice}</TableCell>
                                        <TableCell align='center'>{product.featured ? "Yes" : "No"}</TableCell>
                                        <TableCell align='center'>{product.inventory?.quantityInStock}</TableCell>
                                        <TableCell align='center'>
                                            {product.inventory?.lastUpdated
                                                ? new Date(product.inventory.lastUpdated).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })
                                                : 'N/A'}
                                        </TableCell>

                                        <TableCell align='center'>
                                            <Button onClick={() => { handleUpdate(product._id) }} variant="outlined" color="primary" size="small" style={{ border: "2px solid", borderRadius: '8px' }}>ReStock</Button>


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


            <Dialog
                open={openModal}
                onClose={() => setModal(false)}
                maxWidth="sm"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        width: "500px",
                        borderRadius: 3,
                        padding: 2,
                    },
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
                    ReStock Product
                </DialogTitle>

                <DialogContent>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{ display: 'grid', gap: 2, mt: 1 }}
                    >
                        <TextField
                            name="code"
                            label="Code"
                            fullWidth
                            variant="outlined"
                            value={formData?.id || 'N/A'}
                            disabled
                        />
                        <TextField
                            name="stock"
                            label="New Stock Quantity"
                            fullWidth
                            variant="outlined"
                            type="number"
                            value={formData?.stock}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, stock: e.target.value }))
                            }
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <Button onClick={() => setModal(false)} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateStock}
                        color="primary"
                        variant="contained"
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>



        </Container>
    );
};

export default ProductDashboard;
