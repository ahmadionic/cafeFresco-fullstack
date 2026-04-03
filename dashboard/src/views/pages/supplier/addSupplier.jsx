import React, { useState, useContext } from 'react';
import {
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    MenuItem,
    Switch,
    Box,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router';
import { MainContext } from '../../context/index.jsx';
import AccessDenied from '../../Error/AccessDenied.jsx'


const SupplierAddPage = () => {
    const supplyOptions = ['vegetables', 'meat', 'dairy', 'beverages', 'bakery', 'other'];
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const { distributer } = useContext(MainContext);
    const { adminRole } = useContext(MainContext);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        supplies: [],
        distributor: '',
        isActive: true
    });



    if (!["admin", "manager",'editor'].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSuppliesChange = (e) => {
        const {
            target: { value }
        } = e;
        setFormData((prev) => ({
            ...prev,
            supplies: typeof value === 'string' ? value.split(',') : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/supplier/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Supplier added successfully!');
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    supplies: [],
                    distributor: '',
                    isActive: true
                });
            } else {
                const error = await response.text();
                console.error('Error:', error);
                alert('Failed to add supplier.');
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
                                <Typography variant="h5" gutterBottom>Supplier Info</Typography>
                                <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
                                <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth margin="normal" />
                                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" type="email" />
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
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <Card sx={{ p: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>Details</Typography>
                                    <TextField
                                        select
                                        label="Supplies"
                                        name="supplies"
                                        value={formData.supplies}
                                        onChange={handleSuppliesChange}
                                        fullWidth
                                        margin="normal"
                                        SelectProps={{ multiple: true }}
                                    >
                                        {supplyOptions.map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}

                                    </TextField>

                                    <TextField
                                        select
                                        label="Distributor (optional)"
                                        name="distributor"
                                        value={formData.distributor}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    >
                                        {distributer.map((option) => (
                                            <MenuItem key={option._id} value={option._id}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                </CardContent>
                            </Card>

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
                            <Button type="submit" variant="contained" color="primary">Save Supplier</Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box >
    );
};

export default SupplierAddPage;
