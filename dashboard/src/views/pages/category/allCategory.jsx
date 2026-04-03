import React, { useContext, useState, useEffect } from 'react';
import {
    Container, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Pagination
} from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';

const AllCategories = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { categories, adminRole, fetchCategories } = useContext(MainContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 10;

    useEffect(() => {
        fetchCategories();
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const totalPages = Math.ceil(categories.length / categoriesPerPage);
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const visibleCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            const response = await fetch(`${BASE_URL}/category/delete/${id}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Error deleting category");
            alert("Category deleted successfully!");
            fetchCategories();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/edit-category/${id}`);
    };



    return (
        <Container>
            <Box display="flex" justifyContent="space-between" my={4}>
                <Button variant="contained" color="error" onClick={() => navigate('/admin/dashboard')}>
                    Cancel
                </Button>

            </Box>


            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : categories.length === 0 ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <p>No categories found</p>
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
                                    sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 20
                                        }
                                    }}
                                >
                                    Category Name
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }} align="right" sx={{ pr: 18 }}>Actions</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleCategories.map((category, index) => (

                                <TableRow key={category._id}>
                                    <TableCell sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 5
                                        }
                                    }} align="left">{indexOfFirstCategory + index + 1}</TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            "@media (min-width: 1024px)": {
                                                pl: 20,
                                            }
                                        }}
                                    >
                                        {category.title}
                                    </TableCell>
                                    <TableCell sx={{ pr: 12 }} align="right">
                                        <Button
                                            onClick={() => handleEdit(category._id)}
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
                                            disabled={adminRole?.toLowerCase() === "editor"}
                                            onClick={() => handleDelete(category._id)}
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

export default AllCategories;
