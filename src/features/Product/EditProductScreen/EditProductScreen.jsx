

import { AddCircle } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Container, FormControl, FormGroup, Grid, IconButton, Stack, Typography } from '@mui/material';
import FormikCombobox from 'components/FormElements/FormikCombobox/FormikCombobox';
import FormikTextField from 'components/FormElements/FormikTextField/FormikTextField';
import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import ReactQuill from 'react-quill';
import { useDispatch } from 'react-redux';

import { fetchAsyncGetAllCategories } from 'redux/slices/CategorySlice';
import { fetchAsyncGetManufacturers } from 'redux/slices/ManufacturerSlice';
import { initUpdateProducts, updateProductSchema } from 'utils/FormValidate';
import { Toast } from 'utils/Toast';
import "./CreateProductScreen.css"
import { fetchAsyncGetProduct, fetchAsyncUpdateProduct } from 'redux/slices/ProductSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useStyles } from "./CreateProductScreen.styles";
const EditProductScreen = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate()
    const classes = useStyles();
    const [childCategoriesOptions, setChildCategoriesOptions] = useState([[
        {
            value: 0,
            label: "",
        },
    ]])
    const [manuOptions, setManuOptions] = useState([[
        {
            value: 0,
            label: "",
        },
    ]])

    const [thumbnail, setThumbnail] = React.useState("")
    const [galleryImages, setGalleryImages] = React.useState([])
    const [productInformation, setProductInformation] = React.useState("")
    const [ingredients, setIngredients] = React.useState("")
    const [usageInstructions, setUsageInstructions] = React.useState("")

    useEffect(() => {
        (async () => {
            try {
                const [manuData, categoriesData, productData] = await Promise.all([
                    await dispatch(
                        fetchAsyncGetManufacturers({

                            use_page: 0,
                        })
                    ).unwrap(),
                    dispatch(
                        fetchAsyncGetAllCategories({
                            use_page: 0,
                        })
                    ).unwrap(),
                    await dispatch(
                        fetchAsyncGetProduct({
                            product_id: id
                        })
                    ).unwrap()
                ])

                initUpdateProducts.product_name = productData.data.product_name
                initUpdateProducts.product_price = productData.data.price
                initUpdateProducts.product_promotion = productData.data.promotion
                initUpdateProducts.thumbnail_url = productData.data.thumbnail_url
                initUpdateProducts.gallery_image_urls = productData.data.gallery_image_urls
                initUpdateProducts.manufacturer_id = productData.data.manufacturer_id
                initUpdateProducts.category_id = productData.data.category_id
                setThumbnail(productData.data.thumbnail_url)
                if (productData.data.gallery_image_urls) {
                    setGalleryImages(JSON.parse(productData.data.gallery_image_urls))
                }
                setProductInformation(productData.data.product_information)
                setIngredients(productData.data.ingredients)
                setUsageInstructions(productData.data.usage_instructions)
                const clone = productData.data.sizes.map(item => ({ ...item, size_id: "" }))
                initUpdateProducts.sizes = clone || []
                productData.data.sizes.forEach((size, index) => {
                    console.log(size.id)
                    initUpdateProducts.sizes[index].id = index + 1
                    initUpdateProducts.sizes[index].size_name = size.name
                    initUpdateProducts.sizes[index].size_additional_price = size.additional_price
                    initUpdateProducts.sizes[index].quantity = size.quantity
                    initUpdateProducts.sizes[index].size_id = size.id

                })

                const categoriesOptions = categoriesData.data.filter(category => Number(category.father_category_id) !== 0)
                const newCategoriesOptions = categoriesOptions.map(category => {
                    return {
                        label: category.name,
                        value: category.id
                    }
                })
                setChildCategoriesOptions(newCategoriesOptions)

                const newManuOptions = manuData.data.map(category => {
                    return {
                        label: category.name,
                        value: category.id
                    }
                })
                setManuOptions(newManuOptions)
            } catch (e) {
                Toast('warning', "Lỗi!");
                console.log(e)
            }
        })();
    }, [dispatch, id]);
    console.log(initUpdateProducts)
    async function getBase64(files, type) {

        if (type === "multiple") {
            setGalleryImages([])
            delete files.length
            for (const key in files) {
                if (files.hasOwnProperty(key)) {
                    let reader = new FileReader();
                    reader.readAsDataURL(files[key]);
                    reader.onload = function () {
                        setGalleryImages(prevArray => [...prevArray, reader.result]);
                    };
                    reader.onerror = function (error) {
                        console.log('Error: ', error);
                    }
                }
            }
        }
        else {
            let reader = new FileReader();
            reader.readAsDataURL(files);
            reader.onload = function () {
                setThumbnail(reader.result);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            }
        }
    }

    const submitHandle = async (values) => {

        try {
            const payload = {
                ...values,
                product_id: id,
                productInformation,
                ingredients,
                usageInstructions
            }

            await dispatch(fetchAsyncUpdateProduct(payload))

            Toast('success', "Sửa sản phẩm thành công!");
            navigate("/dashboard/products")

        } catch (err) {
            Toast('warning', "Lỗi!");
        }
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h2" fontWeight="bold" fontSize="30px" mb={30}>
                Chỉnh sửa sản phẩm
            </Typography>
            <Formik
                initialValues={initUpdateProducts}
                validationSchema={updateProductSchema}
                onSubmit={(values, { setFieldError }) => {
                    submitHandle(values, setFieldError);
                }}
            >
                {({
                    errors,
                    values,
                    setFieldValue,
                    handleBlur,
                    isValid,
                    dirty,
                    setFieldError,
                    ...rest
                }) => (
                    <Form >
                        <Stack direction="column" spacing={20} mb="30px" >
                            <Grid
                                container
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item xs={4} sm={4} md={4} lg={2} xl={4}>
                                    Tên sản phẩm
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                    <FormikTextField
                                        size="small"
                                        variant="outlined"
                                        id="product_name"
                                        name="product_name"
                                        label="Tên sản phẩm"
                                        onBlur={e => {
                                            handleBlur(e);
                                            setFieldValue(
                                                "product_name",
                                                values.product_name.trim(),
                                                true
                                            );
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item xs={4} sm={4} md={4} lg={2} xl={4}>
                                    Giá
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                    <FormikTextField
                                        size="small"
                                        variant="outlined"
                                        id="product_price"
                                        name="product_price"
                                        label="Giá"
                                        onBlur={e => {
                                            handleBlur(e);
                                            setFieldValue(
                                                "product_price",
                                                values.product_price.trim(),
                                                true
                                            );
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item xs={4} sm={4} md={4} lg={2} xl={4}>
                                    Giảm giá
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                    <FormikTextField
                                        size="small"
                                        variant="outlined"
                                        id="product_promotion"
                                        name="product_promotion"
                                        label="Giảm giá"
                                        onBlur={e => {
                                            handleBlur(e);
                                            setFieldValue(
                                                "product_promotion",
                                                values.product_promotion.trim(),
                                                true
                                            );
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item xs={4} sm={4} md={4} lg={2} xl={4}>
                                    Ảnh minh họa
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                    <Button variant="contained" component="label">
                                        Tải lên
                                        <input hidden name="thumbnail_url" accept="image/*" type="file"
                                            onChange={(event) => {
                                                setFieldValue("thumbnail_url", event.currentTarget.files[0])
                                                getBase64(event.currentTarget.files[0])


                                            }} />
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                    {values.thumbnail_url &&
                                        <Box sx={{ height: 100 }}>
                                            <img style={{ height: "100%" }} src={thumbnail} alt="cat" />
                                        </Box>}
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item xs={4} sm={4} md={4} lg={2} xl={4}>
                                    Bộ sưu tập ảnh
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                    <Button variant="contained" component="label">
                                        Tải lên
                                        <input name="gallery_image_urls" hidden accept="image/*" multiple type="file"
                                            onChange={(event) => {
                                                setFieldValue("gallery_image_urls", event.currentTarget.files)
                                                getBase64(event.currentTarget.files, "multiple")
                                            }} />
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                    {values.gallery_image_urls &&
                                        <Box sx={{ height: 120, width: "100%", overflowX: "scroll", display: "flex" }}>
                                            {galleryImages.map((item, index) => <img key={index} style={{ height: "100%", marginRight: 10 }} src={item} alt="cat" />)}
                                        </Box>
                                    }
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item xs={4} sm={4} md={4} lg={2} xl={4}>
                                    Danh mục
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                    <FormikCombobox
                                        size="small"
                                        variant="outlined"
                                        name="category_id"
                                        placeholder="Danh mục"
                                        options={childCategoriesOptions}
                                        fullWidth
                                        sxPropsLabel={{ fontWeight: "bold" }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item xs={4} sm={4} md={4} lg={2} xl={4}>
                                    Nhà cung cấp
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                    <FormikCombobox
                                        size="small"
                                        variant="outlined"
                                        name="manufacturer_id"
                                        placeholder="Nhà cung cấp"
                                        options={manuOptions}
                                        fullWidth
                                        sxPropsLabel={{ fontWeight: "bold" }}
                                    />
                                </Grid>
                            </Grid>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" mb={10}>
                                    Chi tiết sản phẩm
                                </Typography>
                                <Box sx={{ mb: 10 }}>
                                    <Typography variant="h6" >
                                        &#183;  Thông tin sản phẩm
                                    </Typography>
                                    <ReactQuill theme="snow" value={productInformation} onChange={setProductInformation} />
                                </Box>
                                <Box sx={{ mb: 10 }}>
                                    <Typography variant="h6" >
                                        &#183;   Thành phần
                                    </Typography>
                                    <ReactQuill theme="snow" value={ingredients} onChange={setIngredients} />
                                </Box>
                                <Box sx={{ mb: 10 }}>
                                    <Typography variant="h6" >
                                        &#183;  Cách sử dụng
                                    </Typography>
                                    <ReactQuill theme="snow" value={usageInstructions} onChange={setUsageInstructions} />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" mb={10}>
                                    Phân loại hàng
                                </Typography>
                                <Box>
                                    <FieldArray
                                        name="sizes"
                                        render={arrayHelpersSizes => (
                                            <FormControl sx={{ width: "100%" }}>
                                                <FormGroup>
                                                    {values.sizes.map((size, sizeIndex) => (
                                                        <Box key={size.id}>
                                                            <Grid
                                                                container
                                                                alignItems="center"
                                                                mb={15}
                                                                spacing="10"
                                                            >
                                                                <Grid item xs={2}>
                                                                    <Typography required>
                                                                        Phân loại {sizeIndex + 1}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                                                    <FormikTextField
                                                                        size="small"
                                                                        variant="outlined"
                                                                        id={`sizes[${sizeIndex}].size_name`}
                                                                        name={`sizes[${sizeIndex}].size_name`}
                                                                        label="Tên phân loại"
                                                                        onBlur={e => {
                                                                            handleBlur(e);
                                                                            setFieldValue(
                                                                                `sizes[${sizeIndex}].size_name`,
                                                                                e.target.value.trim(),
                                                                                true
                                                                            );
                                                                        }}
                                                                        fullWidth
                                                                        FormHelperTextProps={{
                                                                            className: classes.helperText,
                                                                        }}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                                                    <FormikTextField
                                                                        size="small"
                                                                        variant="outlined"
                                                                        id={`sizes[${sizeIndex}].size_additional_price`}
                                                                        name={`sizes[${sizeIndex}].size_additional_price`}
                                                                        label="Giá cộng thêm"
                                                                        onBlur={e => {
                                                                            handleBlur(e);
                                                                            setFieldValue(
                                                                                `sizes[${sizeIndex}].size_additional_price`,
                                                                                e.target.value.trim(),
                                                                                true
                                                                            );
                                                                        }}
                                                                        fullWidth
                                                                        FormHelperTextProps={{
                                                                            className: classes.helperText,
                                                                        }}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                                                    <FormikTextField
                                                                        size="small"
                                                                        variant="outlined"
                                                                        name={`sizes[${sizeIndex}].quantity`}
                                                                        id={`sizes[${sizeIndex}].quantity`}
                                                                        label="Số lượng"
                                                                        onBlur={e => {
                                                                            handleBlur(e);
                                                                            setFieldValue(
                                                                                `sizes[${sizeIndex}].quantity`,
                                                                                e.target.value.trim(),
                                                                                true
                                                                            );
                                                                        }}
                                                                        fullWidth
                                                                        FormHelperTextProps={{
                                                                            className: classes.helperText,
                                                                        }}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={1}>
                                                                    <IconButton
                                                                        aria-label="delete"
                                                                        onClick={() => {
                                                                            arrayHelpersSizes.remove(
                                                                                sizeIndex,
                                                                                1
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            values.sizes.length === 1
                                                                        }
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    ))}
                                                </FormGroup>
                                                <Stack direction="row" alignItems="center">
                                                    <IconButton
                                                        color="success"
                                                        sx={{ ml: -10 }}
                                                        onClick={() => {
                                                            return arrayHelpersSizes.insert(values.sizes.length + 1, {
                                                                id:
                                                                    (!!values.sizes.length &&
                                                                        values.sizes[values.sizes.length - 1].id + 1) ||
                                                                    1,
                                                                size_name: "",
                                                                size_additional_price: "",
                                                                quantity: ""
                                                            });
                                                        }

                                                        }
                                                    >
                                                        <AddCircle />
                                                    </IconButton>
                                                    <Typography color="text.dark" fontWeight={600}>
                                                        Thêm mục
                                                    </Typography>
                                                </Stack>
                                            </FormControl>
                                        )}
                                    />
                                </Box>
                            </Box>
                        </Stack>
                        <Box display="flex" justifyContent="center" gap="30px">
                            <Button
                                sx={{ minWidth: "100px" }}
                                size="large"
                                variant="contained"
                                onClick={() => navigate(-1)}
                            >
                                Hủy
                            </Button>

                            <Button
                                sx={{ minWidth: "100px" }}
                                size="large"
                                variant="contained"
                                color="signature"
                                type="submit"
                                disabled={!dirty || !isValid}
                            >
                                Lưu
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Container >
    );
};

export default EditProductScreen;