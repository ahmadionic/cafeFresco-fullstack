import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Card, CardContent, Grid, Typography, MenuItem, Switch, Box, Stack } from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx'

const EmployeeAddPage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { departments } = useContext(MainContext);
    const { adminRole } = useContext(MainContext);
    const navigate = useNavigate();




    if (!["admin", "manager", 'editor'].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }

    const [formData, setFormData] = useState({
        name: '',
        cnic: '',
        email: '',
        phone: '',
        position: '',
        salary: '',
        hireDate: '',
        department: '',
        address: '',
        isActive: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/employee/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Employee added successfully!');
                setFormData({
                    name: '',
                    cnic: '',
                    email: '',
                    phone: '',
                    position: '',
                    salary: '',
                    hireDate: '',
                    department: '',
                    address: '',
                    isActive: true,
                });
            } else {
                const error = await response.text();
                console.error('Error:', error);
                alert('Failed to add employee.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Something went wrong.');
        }
    };

    const handleDiscard = () => {
        navigate('/admin/dashboard');
    };

    return (
        <Box sx={{ padding: 4 }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Employee Info</Typography>
                                <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
                                <TextField label="CNIC" name="cnic" value={formData.cnic} onChange={handleChange} fullWidth margin="normal" type="number" />
                                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" type="email" />
                                <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth margin="normal" />
                                <TextField label="Position" name="position" value={formData.position} onChange={handleChange} fullWidth margin="normal" />
                                <TextField label="Salary" name="salary" value={formData.salary} onChange={handleChange} fullWidth margin="normal" type="number" />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            {/* Job Details Card */}
                            <Card sx={{ p: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>Job Details</Typography>
                                    <TextField
                                        select
                                        label="Department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    >
                                        {departments.map((dept) => (
                                            <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        label="Hire Date"
                                        name="hireDate"
                                        type="date"
                                        value={formData.hireDate}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        InputLabelProps={{ shrink: true }}
                                    />

                                    <TextField
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        multiline
                                        rows={2}
                                    />
                                </CardContent>
                            </Card>

                            {/* Status Card */}
                            <Card sx={{ p: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>Status</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography>Active</Typography>
                                        <Switch
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button onClick={handleDiscard} variant="outlined" color="error">Discard</Button>
                            <Button type="submit" variant="contained" color="primary">Save Employee</Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default EmployeeAddPage;