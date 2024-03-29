

import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchAsyncGetSize } from 'redux/slices/SizeSlice';
import { Toast } from 'utils/Toast';

const SizeDetailScreen = () => {
    const dispatch = useDispatch();
    const [userDetail, setUserDetail] = useState({})
    const { id } = useParams()
    useEffect(() => {
        (async () => {
            try {
                const res = await dispatch(
                    fetchAsyncGetSize({
                        size_id: id
                    })
                ).unwrap();

                setUserDetail(res.data)
            } catch (e) {
                Toast('warning', "Lỗi!");
            }
        })();
    }, []);
    return (
        <Container maxWidth="md">
            <Typography variant="h2" fontWeight="bold" fontSize="30px" mb={30}>
                Chi tiết phân loại hàng
            </Typography>

            {Object.keys(userDetail).length > 0 ? (
                <Stack direction="column" spacing={10} >

                    <Typography variant="h5" fontWeight="bold" mb={10}>
                        Thông tin sản phẩm
                    </Typography>
                    <Grid
                        container
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Grid item xs={4} sm={4} md={4} lg={2} xl={4}>
                            Tên sản phẩm :
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                            <Typography>
                                {userDetail?.name}
                            </Typography>
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
                            Giá :
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                            <Typography>
                                {userDetail?.price}
                            </Typography>
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
                            Giảm giá :
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                            <Typography>
                                {userDetail?.promotion}%
                            </Typography>
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
                            Đánh giá trung bình :
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                            <Typography>
                                {userDetail?.rating ? (<>{userDetail?.rating}/5</>) : (<>Không</>)}
                            </Typography>
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
                            Ảnh minh họa :
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                            <Box sx={{ height: 100 }}>
                                <img style={{ height: "100%" }} src={userDetail.thumbnail_url} alt="cat" />
                            </Box>
                        </Grid>
                    </Grid>



                    <Typography variant="h5" fontWeight="bold" mb={10}>
                        Thông tin phân loại hàng
                    </Typography>
                    <Grid
                        container
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Grid item xs={4} sm={4} md={4} lg={2} xl={4}>
                            Tên phân loại :
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                            <Typography>
                                {userDetail?.size_name}
                            </Typography>
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
                            Giá cộng thêm :
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                            <Typography>
                                {userDetail?.additional_price}
                            </Typography>
                        </Grid>
                    </Grid>  <Grid
                        container
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Grid item xs={4} sm={4} md={4} lg={2} xl={4}>
                            Số lượng :
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                            <Typography>
                                {userDetail?.quantity}
                            </Typography>
                        </Grid>
                    </Grid>

                </Stack>
            ) : (<>Lỗi</>)}
        </Container >
    );
};

export default SizeDetailScreen;