import React, { useContext, useState, useEffect } from 'react';
import {
    Container, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Pagination, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox
} from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx'
import Switch from '@mui/material/Switch';


const Department = () => {
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
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: false,
    })



    if (!["admin", "manager"].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }

    useEffect(() => {
        fetchDepartments();
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

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
        if (!window.confirm("Are you sure you want to delete this Department?")) return;

        try {
            const response = await fetch(`${BASE_URL}/department/delete/${id}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error deleting department");

            alert("Department deleted successfully!");
            fetchDepartments();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };


    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            description: item.description,
            isActive: item.isActive,

        });
        setItemID(item._id);
        setModalMode('edit');
        setOpenModal(true);
    };

    const handleAddClick = () => {
        setFormData({
            name: '',
            description: '',
            isActive: false
        });
        setModalMode('add');
        setOpenModal(true);
    };

    const handleAdd = async () => {
        const { name, description, isActive } = formData;
        console.log(formData)

        if (!name || !description) {
            return alert("Name and Description are required!");
        }

        try {
            const response = await fetch(`${BASE_URL}/department/add`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, isActive }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error adding item");

            alert("Item added successfully!");
            setOpenModal(false);
            setFormData({
                name: '',
                description: '',
                isActive: false
            });
            fetchDepartments();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleUpdate = async () => {
        const { name, description, isActive } = formData;

        if (!name || !description) {
            return alert("Name and Description are required!");
        }

        try {
            const response = await fetch(`${BASE_URL}/department/update/${itemId}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, isActive }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error updating department");

            alert("Department updated successfully!");
            setOpenModal(false);
            setFormData({
                name: '',
                description: '',
                isActive: false
            });
            setItemID('');
            fetchDepartments();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/department/fetch`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",

            });

            if (response.ok) {
                const data = await response.json();
                setAllCode(data.departments);
            } else {
                console.error('Failed to fetch Departments');
            }
        } catch (error) {
            console.error('Error fetching Departments:', error);
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
                    <p>No Department found</p>
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
                                    Name
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"

                                >
                                    Status
                                </TableCell>

                                <TableCell style={{ fontWeight: 'bold' }} align="right" sx={{ pr: 18 }}>Actions</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleCategories.map((item, index) => (

                                <TableRow key={item._id}>
                                    <TableCell sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 5
                                        }
                                    }} align="left">{indexOfFirstCategory + index + 1}</TableCell>
                                    <TableCell
                                        align="center"

                                    >
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            checked={item.isActive}
                                            onChange={(e) => handleToggleActive(item, e.target.checked)}
                                            color="primary"
                                        />
                                    </TableCell>



                                    <TableCell sx={{ pr: 12 }} align="right">
                                        <Button
                                            onClick={() => handleEdit(item)}
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
                                            onClick={() => handleDelete(item._id)}
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
                            name="name"
                            label="Name"
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <TextField
                            name="description"
                            label="Description"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
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

export default Department;
