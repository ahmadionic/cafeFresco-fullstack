import React, { useContext, useState, useEffect } from 'react';
import {
    Container, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Pagination, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, ListItemText
} from '@mui/material';


import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import Switch from '@mui/material/Switch';
import AccessDenied from '../../Error/AccessDenied.jsx'


const Distributor = () => {
    const categories = ['vegetables', 'meat', 'dairy', 'beverages', 'bakery', 'other'];
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { adminRole, distributer, fetchDistributor } = useContext(MainContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 10;
    const [allCode, setAllCode] = useState([])
    const [filterActive, setFilterActive] = useState(false);
    const [sortCategory, setSortCategory] = useState('All');
    const [distributorFilter, setDbFilter] = useState('All');



    if (!["admin", "manager", 'editor'].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }

    const handleCategoryChange = (event) => {
        setSortCategory(event.target.value);
    };


    useEffect(() => {
        fetchSupplier();
        fetchDistributor();
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [filterActive, distributorFilter, sortCategory]);

    const totalPages = Math.ceil(allCode.length / categoriesPerPage);
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const visibleCategories = allCode.slice(indexOfFirstCategory, indexOfLastCategory);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Distributor?")) return;

        try {
            const response = await fetch(`${BASE_URL}/distributer/delete/${id}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error deleting distributor");

            alert("Distributor deleted successfully!");
            fetchSupplier();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleEdit = (item) => {
        navigate(`/admin/edit-supplier/${item._id}`, { state: { supplier: item } });
    };


    const fetchSupplier = async () => {
        try {
            const queryParams = [];

            if (filterActive) {
                queryParams.push("isActive=true");
            }

            if (sortCategory && sortCategory !== "All") {
                queryParams.push(`supplies=${sortCategory}`);
            }

            if (distributorFilter && distributorFilter !== "All") {
                queryParams.push(`distributor=${distributorFilter}`);
            }

            const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

            const response = await fetch(`${BASE_URL}/supplier/${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            });

            if (!response.ok) {
                console.error('Failed to fetch Supplier');
                return;
            }

            const data = await response.json();

            if (Array.isArray(data.suppliers)) {
                setAllCode(data.suppliers);
            } else {
                console.error('Unexpected data format:', data);
                setAllCode([]);
            }

        } catch (error) {
            console.error('Error fetching Supplier:', error);
        }
    };

    const handleToggle = async (item) => {

        try {
            const response = await fetch(`${BASE_URL}/supplier/update/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(item),
            });

            if (!response.ok) {
                console.error('Failed to update supplier');
                return;
            }
            fetchSupplier();
        } catch (error) {
            console.error('Error updating supplier:', error);
        }
    };

    const handleToggleActive = (item, newIsActive) => {
        const updatedData = {
            ...item,
            isActive: newIsActive,
        };

        handleToggle(updatedData);
    };


    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" my={4} flexWrap="wrap">
                {/* Left side (Supplies) */}
                <Box display="flex" gap={2} flexGrow={1} flexWrap="wrap">
                    <FormControl style={{ minWidth: '120px' }}>
                        <InputLabel id="supplies-select-label">Supplies</InputLabel>
                        <Select
                            labelId="supplies-select-label"
                            value={sortCategory}
                            label="Supplies"
                            onChange={handleCategoryChange}
                        >
                            <MenuItem value="All">All</MenuItem>
                            {Array.isArray(categories) && categories.length > 0 ? (
                                categories.map(item => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No Supplies Available</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>

                {/* Right side (Distributor + Active Checkbox) */}
                <Box display="flex" alignItems="center" gap={2} mt={{ xs: 2, sm: 0 }}>
                    <FormControl style={{ minWidth: '120px' }}>
                        <InputLabel id="distributor-select-label">Distributor</InputLabel>
                        <Select
                            labelId="distributor-select-label"
                            value={distributorFilter}
                            label="Distributor"
                            onChange={(e) => setDbFilter(e.target.value)}
                        >
                            <MenuItem value="All">All</MenuItem>
                            {Array.isArray(distributer) && distributer.length > 0 ? (
                                distributer.map(item => (
                                    <MenuItem key={item._id} value={item._id}>
                                        {item.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No Distributor Available</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filterActive}
                                onChange={(e) => setFilterActive(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Show Only Active"
                    />
                </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" my={4}>
                <Button variant="contained" color="error" onClick={() => navigate('/admin/dashboard')}>
                    Cancel
                </Button>
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : allCode.length === 0 ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <p>No Supplier found</p>
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', width: 60, pl: { lg: 5 } }} align="left">No</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 150 }} align="center">Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 200 }} align="center">Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 130 }} align="center">Phone</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 180 }} align="center">Supplies</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 180 }} align="center">Distributor</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 100 }} align="center">Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 180, pr: { lg: 5 } }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleCategories.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell sx={{ pl: { lg: 5 } }} align="left">{indexOfFirstCategory + index + 1}</TableCell>

                                    <TableCell align="center">{item.name}</TableCell>
                                    <TableCell align="center">{item.email}</TableCell>
                                    <TableCell align="center">{item.phone}</TableCell>

                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
                                            {Array.isArray(item.supplies) && item.supplies.map((item, i) => (
                                                <Box
                                                    key={i}
                                                    sx={{
                                                        px: 1,
                                                        py: 0.5,
                                                        backgroundColor: '#e0e0e0',
                                                        borderRadius: 2,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {item}
                                                </Box>
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">{item.distributor?.name}</TableCell>

                                    <TableCell align="center">
                                        <Switch
                                            checked={item.isActive}
                                            onChange={(e) => handleToggleActive(item, e.target.checked)}
                                            color="primary"
                                        />
                                    </TableCell>

                                    <TableCell align="right" sx={{ pr: { lg: 5 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'nowrap', gap: 1 }}>
                                            <Button
                                                onClick={() => handleEdit(item)}
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                sx={{ border: "2px solid", borderRadius: 2, whiteSpace: 'nowrap' }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                disabled={!adminRole?.toLowerCase() === "admin"}
                                                onClick={() => handleDelete(item._id)}
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                sx={{ border: "2px solid", borderRadius: 2, whiteSpace: 'nowrap' }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
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

export default Distributor;
