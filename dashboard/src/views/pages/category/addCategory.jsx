import React, { useContext, useState } from 'react';
import {
    TextField, Button, Card, CardContent, Grid, Typography, Box
} from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx';
import CircularProgress from '@mui/material/CircularProgress';

const AdAddPage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { adminRole } = useContext(MainContext);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [adData, setAdData] = useState({
        title: "",
        description: "",
        image: null,
    });

    if (adminRole?.toLowerCase() !== "admin") {
        return <AccessDenied />;
    }

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setAdData({ ...adData, image: file });
            setImagePreview(URL.createObjectURL(file));
        } else {
            setAdData({ ...adData, [name]: value });
        }
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!adData.title || !adData.description || !adData.image) {
            return alert("Please fill in all fields including image");
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('title', adData.title);
        formData.append('description', adData.description);
        formData.append('image', adData.image);

        try {
            const response = await fetch(`${BASE_URL}/category/add`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                alert('Category added successfully');
                setAdData({ title: "", description: "", image: null });
                setImagePreview(null);
            } else {
                const errorMessage = await response.text();
                console.error('Failed to add category:', errorMessage);
                alert('Failed to add category');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('Internal Server Error');
        } finally {
            setLoading(false);
        }
    };

    const handleDiscard = () => {
        navigate('/admin/dashboard');
    };

    const handleImageDelete = () => {
        setAdData({ ...adData, image: null });
        setImagePreview(null);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    <Grid container justifyContent="center" sx={{ padding: 2 }}>
                        <Grid item xs={12} md={8} lg={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">Category Details</Typography>
                                    <TextField
                                        label="Title"
                                        name="title"
                                        value={adData.title}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={adData.description}
                                        onChange={handleChange}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        margin="normal"
                                    />
                                </CardContent>

                                <CardContent>

                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 200,
                                                height: 140,
                                                border: '2px dashed #ccc',
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                backgroundColor: '#f9f9f9',
                                            }}
                                        >
                                            {imagePreview ? (
                                                <>
                                                    <Box
                                                        component="img"
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <IconTrash
                                                        stroke={2}
                                                        onClick={handleImageDelete}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            cursor: 'pointer',
                                                            backgroundColor: 'white',
                                                            borderRadius: '50%',
                                                            padding: '4px',
                                                            boxShadow: '0 0 4px rgba(0,0,0,0.2)',
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <Typography color="textSecondary" sx={{ textAlign: 'center', px: 2 }}>
                                                    Image preview will appear here
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    <Button variant="outlined" component="label" fullWidth sx={{ mt: 3 }}>
                                        Upload Image
                                        <input
                                            type="file"
                                            name="image"
                                            hidden
                                            onChange={handleChange}
                                        />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>


                    {/* Image Upload */}
                    <Grid item xs={12} md={6}>
                        <Card>

                        </Card>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button onClick={handleDiscard} variant="outlined" color="error">
                                Discard
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Add'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default AdAddPage;
