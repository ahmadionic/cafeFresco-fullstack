import React, { useContext, useState, useEffect } from 'react';
import {
    TextField, Button, Card, CardContent, Grid, Typography, Box
} from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'react-router';
const AdAddPage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { adminRole } = useContext(MainContext);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isConfirmed = window.confirm("Are you sure you want to update this category?");
        if (!isConfirmed) return;

        setLoading(true);

        const formData = new FormData();
        if (adData.title) formData.append('title', adData.title.trim());
        if (adData.description) formData.append('description', adData.description.trim());
        if (adData.image instanceof File) {
            formData.append('image', adData.image);
        }

        // Debug form data
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }

        try {
            const response = await fetch(`${BASE_URL}/category/update/${id}`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                alert('Category updated successfully');
                setAdData({ title: '', description: '', image: null });
                setImagePreview(null);
                navigate('/admin/all-category')
            } else {
                const errorData = await response.json();
                console.error('Failed to update category:', errorData.message);
                alert(`Failed to update category: ${errorData.message}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('Internal Server Error');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await fetch(`${BASE_URL}/category/${id}`, {
                    method: 'GET',
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setAdData({
                        title: data.title || "",
                        description: data.description || "",
                        image: data.image || null,

                    });

                    if (data.image) {
                        setImagePreview(`${BASE_URL}${data.image}`);
                    }
                } else {
                    console.error('Failed to fetch product details');
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        if (id) {
            fetchDetail();
        }
    }, [id, BASE_URL]);



    const handleDiscard = () => {
        navigate('/admin/all-category');
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
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Update'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default AdAddPage;
