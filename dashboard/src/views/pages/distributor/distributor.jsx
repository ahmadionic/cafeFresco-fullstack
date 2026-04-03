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
    const { adminRole } = useContext(MainContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 10;
    const [allCode, setAllCode] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [itemId, setItemID] = useState("");
    const [filterActive, setFilterActive] = useState(false);
    const [sortCategory, setSortCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        supplyCategories: [],
        isActive: true
    });




    if (!["admin", "manager"].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }


    const handleCategoryChange = (event) => {
        setSortCategory(event.target.value);
    };
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        fetchDistributor();
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [filterActive, sortCategory, searchTerm]);

    const totalPages = Math.ceil(allCode.length / categoriesPerPage);
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const visibleCategories = allCode.slice(indexOfFirstCategory, indexOfLastCategory);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
            fetchDistributor();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            contactPerson: item.contactPerson,
            phone: item.phone,
            email: item.email,
            address: item.address,
            supplyCategories: item.supplyCategories,
            isActive: item.isActive

        });
        setItemID(item._id);
        setModalMode('edit');
        setOpenModal(true);
    };

    const handleAddClick = () => {
        setFormData({
            name: '',
            contactPerson: '',
            phone: '',
            email: '',
            address: '',
            supplyCategories: [],
            isActive: true
        });
        setModalMode('add');
        setOpenModal(true);
    };

    const handleAdd = async () => {
        const {
            name,
            contactPerson,
            phone,
            email,
            address,
            supplyCategories,
            isActive
        } = formData;

        if (!name || !contactPerson || !phone || !email) {
            return alert("Name, Contact Person, Phone, and Email are required!");
        }

        try {
            const response = await fetch(`${BASE_URL}/distributer/create`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    contactPerson,
                    phone,
                    email,
                    address,
                    supplyCategories,
                    isActive
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error adding distributor");

            alert("Distributor added successfully!");
            setOpenModal(false);
            setFormData({
                name: '',
                contactPerson: '',
                phone: '',
                email: '',
                address: '',
                supplyCategories: [],
                isActive: false
            });
            fetchDistributor();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleUpdate = async () => {
        const { name, contactPerson, email, phone, supplyCategories, isActive } = formData;

        if (!name || !contactPerson || !email || !phone || !supplyCategories?.length) {
            return alert("All fields are required!");
        }

        try {
            const response = await fetch(`${BASE_URL}/distributer/update/${itemId}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, contactPerson, email, phone, supplyCategories, isActive }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error updating distributor");

            alert("Distributor updated successfully!");
            setOpenModal(false);
            setFormData({
                name: '',
                contactPerson: '',
                email: '',
                phone: '',
                supplyCategories: [],
                isActive: false
            });
            setItemID('');
            fetchDistributor();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const fetchDistributor = async () => {
        try {
            const queryParams = [];

            if (filterActive) {
                queryParams.push("isActive=true");
            }

            if (sortCategory && sortCategory !== "All") {
                queryParams.push(`supplyCategory=${sortCategory}`);
            }

            if (searchTerm.trim() !== "") {
                queryParams.push(`name=${encodeURIComponent(searchTerm.trim())}`);
            }

            const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

            const response = await fetch(`${BASE_URL}/distributer/${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            });

            if (!response.ok) {
                console.error('Failed to fetch distributors');
                return;
            }

            const data = await response.json();

            if (Array.isArray(data.distributors)) {
                setAllCode(data.distributors);
            } else {
                console.error('Unexpected data format:', data);
                setAllCode([]);
            }

        } catch (error) {
            console.error('Error fetching distributors:', error);
        }
    };

    const handleToggleActive = (item, newIsActive) => {
        const updatedData = {
            ...item,
            isActive: newIsActive,
        };

        setFormData(updatedData);
        setItemID(item._id);
        setShouldUpdate(true)
    };

    useEffect(() => {
        if (shouldUpdate) {
            handleUpdate();
            setShouldUpdate(false);
        }
    }, [shouldUpdate]);



    return (
        <Container>

            <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
                <FormControl style={{ minWidth: '100px' }}>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        value={sortCategory}
                        label="Category"
                        onChange={handleCategoryChange}
                    >
                        <MenuItem value="All">All</MenuItem>
                        {categories.length > 0 ? (
                            categories.map(cat => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
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
                    <p>No Distributor found</p>
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', width: 60, pl: { lg: 5 } }} align="left">No</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 150 }} align="center">Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 160 }} align="center">Contact Person</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 200 }} align="center">Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 130 }} align="center">Phone</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 180 }} align="center">Supply</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 100 }} align="center">Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 180, pr: { lg: 5 } }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleCategories.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell sx={{ pl: { lg: 5 } }} align="left">{indexOfFirstCategory + index + 1}</TableCell>

                                    <TableCell align="center">{item.name}</TableCell>
                                    <TableCell align="center">{item.contactPerson}</TableCell>
                                    <TableCell align="center">{item.email}</TableCell>
                                    <TableCell align="center">{item.phone}</TableCell>

                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
                                            {Array.isArray(item.supplyCategories) && item.supplyCategories.map((cat, i) => (
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
                                                    {cat}
                                                </Box>
                                            ))}
                                        </Box>
                                    </TableCell>

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
                    {modalMode === 'edit' ? 'Update Distributor' : 'Add New Distributor'}
                </DialogTitle>

                <DialogContent>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{ display: 'grid', gap: 2, mt: 1 }}
                    >
                        <TextField
                            name="name"
                            label="Name"
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <TextField
                            name="contactPerson"
                            label="Contact Person"
                            fullWidth
                            variant="outlined"
                            value={formData.contactPerson}
                            onChange={handleChange}
                        />

                        <TextField
                            name="phone"
                            label="Phone"
                            fullWidth
                            variant="outlined"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                        <TextField
                            name="email"
                            label="Email"
                            fullWidth
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <TextField
                            name="address"
                            label="Address"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={2}
                            value={formData.address}
                            onChange={handleChange}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="supplyCategories-label">Supply Categories</InputLabel>
                            <Select
                                label="Supply Categories"
                                labelId="supplyCategories-label"
                                multiple
                                name="supplyCategories"
                                value={formData.supplyCategories || []}
                                onChange={(e) => setFormData({ ...formData, supplyCategories: e.target.value })}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        <Checkbox checked={formData.supplyCategories.includes(category)} />
                                        <ListItemText primary={category} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isActive: e.target.checked })
                                    }
                                    color="primary"
                                />
                            }
                            label="Active"
                        />
                    </Box>
                </DialogContent>



                <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <Button onClick={() => setOpenModal(false)} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={modalMode === 'edit' ? handleUpdate : handleAdd}
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

export default Distributor;
