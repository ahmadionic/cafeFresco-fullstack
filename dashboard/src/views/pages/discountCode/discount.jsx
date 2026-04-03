import React, { useContext, useState, useEffect } from 'react';
import {
    Container, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Pagination, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import AccessDenied from '../../Error/AccessDenied.jsx'
import { useNavigate } from 'react-router';

const AllDiscount = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { adminRole } = useContext(MainContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 10;
    const [allCode, setAllCode] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [itemId, setItemID] = useState("");
    const [formData, setFormData] = useState({
        code: '',
        expiryDate: '',
        minPurchase: '',
        maxUses: '',
        discountPercentage: '',
    })



    if (!["admin"].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }


    useEffect(() => {
        fetchDiscount();
    }, []);

    const totalPages = Math.ceil(allCode.length / categoriesPerPage);
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const visibleCategories = allCode.slice(indexOfFirstCategory, indexOfLastCategory);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Discount Code?")) return;
        try {
            const response = await fetch(`${BASE_URL}/discount/delete/${id}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Error deleting Discount Code");
            alert("Discount Code deleted successfully!");
            fetchDiscount();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            code: item.code,
            discountPercentage: item.discountPercentage,
            expiryDate: item.expiryDate,
            minPurchase: item.minPurchase,
            maxUses: item.maxUses
        });
        setItemID(item._id);
        setModalMode('edit');
        setOpenModal(true);
    };

    const handleAddClick = () => {
        setFormData({
            code: '',
            discountPercentage: '',
            expiryDate: '',
            minPurchase: '',
            maxUses: ''
        });
        setModalMode('add');
        setOpenModal(true);
    };


    const handleAddCode = async () => {
        const { code, discountPercentage, expiryDate, minPurchase, maxUses } = formData;

        // Proper validation
        if (!code || !discountPercentage || !expiryDate || !minPurchase || !maxUses) {
            return alert("All fields are required!");
        }

        try {
            const response = await fetch(`${BASE_URL}/discount/create`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, discountPercentage, expiryDate, minPurchase, maxUses }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error adding discount code");

            alert("Discount Code added successfully!");
            setOpenModal(false);
            setFormData({
                code: '',
                expiryDate: '',
                minPurchase: '',
                maxUses: '',
                discountPercentage: '',
            });
            fetchDiscount();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleUpdateCode = async () => {
        const { code, discountPercentage, expiryDate, minPurchase, maxUses } = formData;

        // Proper validation
        if (!code || !discountPercentage || !expiryDate || !minPurchase || !maxUses) {
            return alert("All fields are required!");
        }

        try {
            const response = await fetch(`${BASE_URL}/discount/update/${itemId}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ discountPercentage, expiryDate, minPurchase, maxUses }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error updating discount code");

            alert("Discount Code updating successfully!");
            setOpenModal(false);
            setFormData({
                code: '',
                expiryDate: '',
                minPurchase: '',
                maxUses: '',
                discountPercentage: '',
            });
            setItemID('');
            fetchDiscount();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const fetchDiscount = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/discount/fetch`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            });

            if (!response.ok) {
                console.error('Failed to fetch categories');
                return;
            }

            const data = await response.json();
            setAllCode(data.allCode || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };




    return (
        <Container>
            <Box display="flex" justifyContent="space-between" my={4}>
                <Button variant="contained" color="error" onClick={() => navigate('/admin/dashboard')}>
                    Cancel
                </Button>
                <Button variant="contained" color="warning" onClick={handleAddClick}>
                    Add
                </Button>

            </Box>


            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : allCode.length === 0 ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <p>No Discount Code found</p>
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }} sx={{
                                    "@media (min-width: 1024px)": {
                                        pl: 5
                                    }
                                }} align="left">No</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"

                                >
                                    Code
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"

                                >
                                    Percentage
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"

                                >
                                    Expired
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"

                                >
                                    Min Purchase
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"

                                >
                                    Max Uses
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }} align="right" sx={{ pr: 18 }}>Actions</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleCategories.map((discount, index) => (

                                <TableRow key={discount._id}>
                                    <TableCell sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 5
                                        }
                                    }} align="left">{indexOfFirstCategory + index + 1}</TableCell>
                                    <TableCell
                                        align="center"

                                    >
                                        {discount.code}
                                    </TableCell>
                                    <TableCell
                                        align="center"

                                    >
                                        {discount.discountPercentage}
                                    </TableCell>
                                    <TableCell align="center">
                                        {new Date(discount.expiryDate).toISOString().split('T')[0]}
                                    </TableCell>

                                    <TableCell
                                        align="center"

                                    >
                                        ${discount.minPurchase}
                                    </TableCell>
                                    <TableCell
                                        align="center"

                                    >
                                        {discount.maxUses}
                                    </TableCell>
                                    <TableCell sx={{ pr: 12 }} align="right">
                                        <Button
                                            onClick={() => handleEdit(discount)}
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            style={{
                                                border: "2px solid", borderRadius: '8px'
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            disabled={!adminRole?.toLowerCase() === "admin"}
                                            onClick={() => handleDelete(discount._id)}
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
            )}

            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
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
                    {modalMode === 'edit' ? 'Update Code' : 'Add New Code'}
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
                            value={formData.code}
                            onChange={handleChange}
                            disabled={modalMode === 'edit'}
                        />
                        <TextField
                            name="discountPercentage"
                            label="Discount Percentage (%)"
                            fullWidth
                            variant="outlined"
                            type="number"
                            value={formData.discountPercentage}
                            onChange={handleChange}
                        />
                        <TextField
                            name="expiryDate"
                            label="Expiry Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.expiryDate ? formData.expiryDate.slice(0, 10) : ''}
                            onChange={handleChange}
                        />
                        <TextField
                            name="minPurchase"
                            label="Minimum Spending ($)"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={formData.minPurchase}
                            onChange={handleChange}
                        />
                        <TextField
                            name="maxUses"
                            label="Maximum Use Limit"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={formData.maxUses}
                            onChange={handleChange}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <Button onClick={() => setOpenModal(false)} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={modalMode === 'edit' ? handleUpdateCode : handleAddCode}
                        color="primary"
                        variant="contained"
                    >
                        {modalMode === 'edit' ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>




            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

        </Container>
    );
};

export default AllDiscount;
