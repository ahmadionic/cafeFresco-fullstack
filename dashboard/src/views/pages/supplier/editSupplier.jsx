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
import { useLocation } from 'react-router';


const SupplierAddPage = () => {
    const supplyOptions = ['vegetables', 'meat', 'dairy', 'beverages', 'bakery', 'other'];
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const { distributer } = useContext(MainContext);
    const location = useLocation();
    const passedSupplier = location.state?.supplier;

    const [formData, setFormData] = useState(() => ({
        name: passedSupplier?.name || '',
        phone: passedSupplier?.phone || '',
        email: passedSupplier?.email || '',
        address: passedSupplier?.address || '',
        supplies: passedSupplier?.supplies || [],
        distributor: passedSupplier?.distributor._id || '',
        isActive: passedSupplier?.isActive ?? true
    }));

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
            const response = await fetch(`${BASE_URL}/supplier/update/${passedSupplier._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                console.error('Failed to update supplier');
                alert("Supplier updated Failure!");
                return;
            }
            alert("Supplier updated successfully!");
            navigate('/admin/suppliers');
        } catch (error) {
            console.error('Error updating supplier:', error);
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
