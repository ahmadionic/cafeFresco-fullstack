import React, { useContext, useState, useEffect } from 'react';
import {
    TextField, MenuItem, Select, FormControl, InputLabel, Container, Box, Table, TableBody,
    TableCell, Stack, TableContainer, TableHead, TableRow, Paper, Pagination, Button, CircularProgress, Typography
} from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';

import AccessDenied from '../../Error/AccessDenied.jsx'
let searchTimeout;

const EmployeeList = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dpFilter, setdpFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const { departments, adminRole } = useContext(MainContext);
    const navigate = useNavigate();


    if (!["admin", "manager",'editor'].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }



    const fetchEmployee = async () => {
        setLoading(true);
        try {
            const departmentParam = dpFilter === 'All' ? '' : encodeURIComponent(dpFilter);
            const nameParam = encodeURIComponent(searchTerm || '');
            const response = await fetch(`${BASE_URL}/employee/fetch?department=${departmentParam}&page=${currentPage}&cnic=${nameParam}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const data = await response.json();
            if (data) {
                setEmployees(data.employees || []);
                setTotalPages(data.page);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEmployee();
    }, [dpFilter, currentPage]);

    useEffect(() => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchEmployee();
        }, 500);

        return () => clearTimeout(searchTimeout);
    }, [searchTerm]);

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleCategoryChange = (e) => setdpFilter(e.target.value);
    const handlePageChange = (_, value) => setCurrentPage(value);

    const handleUpdate = (item) => navigate(`/admin/edit-employee/${item._id}`, { state: { employee: item } },);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Employee?')) return;

        try {
            const response = await fetch(`${BASE_URL}/product/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong!');

            alert(data.message || 'Product deleted successfully!');
            fetchEmployee();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (

        <Container>
            {/* Filters */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                my={4}
                flexWrap="wrap"
                gap={2}
            >
                <FormControl style={{ flexBasis: '300px', flexGrow: 1, maxWidth: '200px' }}>
                    <InputLabel id="department-select-label">Department</InputLabel>
                    <Select
                        labelId="department-select-label"
                        value={dpFilter}
                        label="Department"
                        onChange={handleCategoryChange}
                    >
                        <MenuItem value="All">All</MenuItem>
                        {departments?.length > 0 ? (
                            departments.map((dept) => (
                                <MenuItem key={dept._id} value={dept._id}>
                                    {dept.name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No Departments Available</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <TextField
                    label="Search by CNIC"
                    value={searchTerm}
                    onChange={handleSearch}
                    variant="outlined"
                    style={{ flexBasis: '300px', flexGrow: 1, maxWidth: '200px' }}
                />
            </Box>


            {/* Content */}
            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : employees.length === 0 ? (
                <Typography variant="h6" align="center" my={4}>
                    No employees found.
                </Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>No</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>CNIC</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Phone</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Department</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Job Title</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.map((employee, index) => (
                                    <TableRow key={employee._id}>
                                        <TableCell align="center">
                                            {(currentPage - 1) * employees.length + index + 1}
                                        </TableCell>
                                        <TableCell align="center">{employee.name}</TableCell>
                                        <TableCell align="center">{employee.cnic}</TableCell>
                                        <TableCell align="center">{employee.email}</TableCell>
                                        <TableCell align="center">{employee.phone}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
                                                <Box
                                                    sx={{
                                                        px: 1,
                                                        py: 0.5,
                                                        backgroundColor: '#e0e0e0',
                                                        borderRadius: 2,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {employee.department?.name}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">{employee.position}</TableCell>
                                        <TableCell align="center">
                                            <span style={{
                                                backgroundColor: employee.isActive ? 'green' : 'red',
                                                color: 'white',
                                                borderRadius: '4px',
                                                padding: '2px 6px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                display: 'inline-block',
                                                minWidth: '60px',
                                                textAlign: 'center'
                                            }}>
                                                {employee.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>



                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Button
                                                    onClick={() => handleUpdate(employee)}
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    style={{ borderRadius: '8px' }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    disabled={!adminRole?.toLowerCase() === 'admin'}
                                                    onClick={() => handleDelete(employee._id)}
                                                    variant="outlined"
                                                    color="secondary"
                                                    size="small"
                                                    style={{ borderRadius: '8px' }}
                                                >
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
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

export default EmployeeList;
