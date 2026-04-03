import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Card, CardContent, Grid, Typography, MenuItem, Switch, Box } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { MainContext } from '../../context/index.jsx';
import { useNavigate, useParams } from 'react-router';

const ProductEditPage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { categories } = useContext(MainContext);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [productData, setProductData] = useState({
        title: "",
        description: "",
        image: null,
        price: "",
        discount: "",
        stock: "",
        category: "",
        featured: false,
        newRelease: false
    });


    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setProductData({ ...productData, image: file });
            setImagePreview(URL.createObjectURL(file));
        } else if (type === 'checkbox') {
            setProductData({ ...productData, [name]: checked });
        } else {
            setProductData({ ...productData, [name]: value });
        }
    };


    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await fetch(`${BASE_URL}/product/${id}`, {
                    method: 'GET',
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setProductData({
                        title: data.title || "",
                        description: data.description || "",
                        image: data.image || null,
                        price: data.price || "",
                        discount: data.discount || "",
                        stock: data.stock || "",
                        category: data.category?._id || "",
                        featured: data.featured || false,
                        newRelease: data.newRelease || false
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure you want to Update this product?");

        if (!isConfirmed) {
            return;
        }

        const formData = new FormData();

        // Adding all form data to FormData object
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });

        try {
            const response = await fetch(`${BASE_URL}/product/update/${id}`, {
                method: 'PUT',
                credentials: "include",
                body: formData,
            });

            if (response.ok) {
                alert('Product Update successfully!');
                setProductData({
                    title: "",
                    description: "",
                    image: null,
                    price: "",
                    discount: "",
                    stock: "",
                    category: "",
                    featured: false,
                    newRelease: false
                });
                setImagePreview(null);
            } else {
                const errorMessage = await response.text();
                console.error('Failed to update product:', errorMessage);
                alert(`Failed to update product: ${errorMessage}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred.');
        }
    };

    const handleImageDelete = () => {
        setProductData({ ...productData, image: null });
        setImagePreview(null);
    };

    const handleDiscard = () => {
        navigate('/admin/dashboard');
    }


    return (
        <Box sx={{ padding: 4 }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    {/* General Information */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">General Information</Typography>
                                <TextField label="Product Name" name="title" value={productData.title} onChange={handleChange} fullWidth margin="normal" />
                                <TextField label="Description" name="description" value={productData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Product Media and Category */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Product Media</Typography>
                                <Button variant="outlined" component="label" fullWidth>
                                    Upload Image
                                    <input type="file" name="image" hidden onChange={handleChange} />
                                </Button>

                                {/* Reserved Space for Image Preview */}
                                <div style={{
                                    marginTop: '10px',
                                    width: '20%',
                                    height: '20%',
                                    borderRadius: '8px',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // border: imagePreview ? 'none' : '2px dashed #ccc'
                                }}>
                                    {imagePreview && (
                                        <>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                                            />
                                            <IconTrash
                                                stroke={2}
                                                onClick={handleImageDelete}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-10px',
                                                    right: '-10px',
                                                    cursor: 'pointer',
                                                    backgroundColor: 'white',
                                                    borderRadius: '50%',
                                                    padding: '2px'
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>



                        <Card sx={{ mt: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Category</Typography>
                                <TextField
                                    select
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                >
                                    {categories && categories.map(category => (
                                        <MenuItem key={category._id} value={category._id}>
                                            {category.title}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Pricing */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Pricing</Typography>
                                <TextField label="Base Price" name="price" value={productData.price} onChange={handleChange} fullWidth margin="normal" type="number" />
                                <TextField label="Discount (%)" name="discount" value={productData.discount} onChange={handleChange} fullWidth margin="normal" type="number" />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Additional Options */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Additional Options</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography>Featured</Typography>
                                    <Switch name="featured" checked={productData.featured} onChange={handleChange} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography>New Release</Typography>
                                    <Switch name="newRelease" checked={productData.newRelease} onChange={handleChange} />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Stock */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Available Stock</Typography>
                                <TextField label="Stock" name="stock" value={productData.stock} onChange={handleChange} fullWidth margin="normal" type="number" />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                            <Button onClick={handleDiscard} variant="outlined" color="error">Discard Changes</Button>
                            <Button variant="contained" color="warning" type="submit">Update Product</Button>
                        </div>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default ProductEditPage;
