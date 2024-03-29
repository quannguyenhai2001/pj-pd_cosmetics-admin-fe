import React from "react";

import { useTheme } from "@emotion/react";
import {

    Edit,
    Delete,


    SearchOff,
} from "@mui/icons-material";
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Checkbox,
    IconButton,
    TableContainer,
    CardMedia,
} from "@mui/material";
import { Link } from "react-router-dom";

import AppTooltip from "components/AppTooltip/AppTooltip";

import { useStyles } from "../../UsersScreen.styles";

const ProductsTable = ({
    products,
    setProducts,
    pageInfo,
    setUserDeleteID,
    setOpenDeleteProductModal
}) => {
    const theme = useTheme();
    const classes = useStyles();

    const tableHeadContents = [
        { id: "checkAll", minWidth: 80 },
        {
            id: "product_name",
            label: "Tên người dùng",
            minWidth: 100,
        },
        {
            id: "thumbnail_url",
            label: "Ảnh",
            minWidth: 100,
        },
        {
            id: "manufacturer_name",
            label: "Email",
            minWidth: 120,
        },
        {
            id: "price",
            label: "Đía chỉ",
            minWidth: 70,
        },
        {
            id: "1",
            label: "Tuổi",
            minWidth: 70,
        },
        {
            id: "2",
            label: "Số điện thoại",
            minWidth: 70,
        },

        {
            id: "create_at",
            label: "Ngày tạo",
            minWidth: 70,
        },
    ];

    const isCheckedCurrentProduct = (products, currentIntern) => {
        return !!products.find(
            product => product.id === currentIntern.id && product.isSelected
        );
    };
    const handleCheckProduct = (id, isChecked) => {
        const newProducts = products.map(product => {
            if (product.id === id) {
                return { ...product, isSelected: isChecked };
            }
            return product;
        });
        setProducts(newProducts);
    };
    const isCheckedAllProducts = products => {
        return !!products.every(product => product.isSelected);
    };
    const handleSelectAll = isChecked => {
        const newProducts = products.map(product => {
            return { ...product, isSelected: isChecked };
        });
        setProducts(newProducts);
    };
    const isDisabledIcon = (products) => {
        const newProducts = products.filter(product => {
            return product.isSelected
        });
        if (newProducts.length > 0) {
            return true
        }
        return false
    }
    return (
        <Box>
            {!pageInfo.total ? (
                <Box textAlign="center" py={200} borderRadius={10} bgcolor="#f2f2f2">
                    <Typography>
                        <SearchOff fontSize="large" />
                    </Typography>
                    <Typography variant="h5">Không tìm thấy kết quả</Typography>
                </Box>
            ) : (
                <TableContainer
                    sx={{
                        borderTop: "none",
                        borderRadius: "5px",
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                        minWidth: 600,
                        minHeight: products.length >= 5 ? 450 : (products.length + 1) * 65,
                    }}
                >
                    <Table
                        stickyHeader
                        aria-label="sticky table"
                        className={classes.table}
                        size="small"
                    >
                        <TableHead>
                            <TableRow>
                                {tableHeadContents.map(columnContent =>
                                    columnContent.id === "checkAll" ? (
                                        <TableCell
                                            key={columnContent.id}
                                            align="center"
                                            sx={{
                                                minWidth: columnContent.minWidth,
                                                bgcolor: theme.palette.grey[400],
                                                fontWeight: "bold",
                                                borderTop: "none",
                                            }}
                                            rowSpan={2}
                                        >
                                            <AppTooltip title="Chọn tất cả">
                                                <Checkbox
                                                    onChange={e => {
                                                        handleSelectAll(e.target.checked);
                                                    }}
                                                    checked={isCheckedAllProducts(products)}
                                                />
                                            </AppTooltip>
                                        </TableCell>
                                    ) : (
                                        <TableCell
                                            key={columnContent.id}
                                            align="center"
                                            sx={{
                                                minWidth: columnContent.minWidth,
                                                bgcolor: theme.palette.grey[400],
                                                fontWeight: "bold",
                                                borderTop: "none",
                                                height: "60px",
                                            }}
                                            rowSpan={2}
                                        >
                                            {columnContent.label}
                                        </TableCell>
                                    )
                                )}

                                <TableCell
                                    colSpan={4}
                                    align="center"
                                    sx={{
                                        minWidth: 100,
                                        bgcolor: theme.palette.grey[400],
                                        fontWeight: "bold",
                                        borderTop: "none",
                                    }}
                                >
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {products.map(product => (
                                <TableRow
                                    key={product.id}
                                    sx={{
                                        ":hover": {
                                            bgcolor: theme.palette.grey[200],
                                        },
                                    }}
                                >
                                    <TableCell
                                        align="center"
                                        component="th"
                                        scope="row"
                                        size="medium"
                                    >
                                        <Checkbox
                                            onChange={e => {
                                                handleCheckProduct(product.id, e.target.checked);
                                            }}
                                            checked={isCheckedCurrentProduct(products, product)}
                                        />
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        component="th"
                                        scope="row"
                                        size="medium"
                                        sx={{ textDecoration: "underline" }}
                                    >
                                        <Link
                                            style={{
                                                color: theme.palette.text.dark,
                                            }}
                                            to={`/dashboard/users/${product.id}`}

                                        >
                                            {product.display_name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="center" size="small">
                                        {product.avatar ? (<CardMedia className={classes.rootCardMedia}
                                            component="img"
                                            height="70"
                                            image={product.avatar}
                                            alt="green iguana"
                                        />) : (
                                            <CardMedia className={classes.rootCardMedia}
                                                component="img"
                                                height="70"
                                                image='https://res.cloudinary.com/cosmeticv1/image/upload/v1653237466/cosmetic/products/Product17_2.webp'
                                                alt="green iguana"
                                            />
                                        )}
                                    </TableCell>

                                    <TableCell align="center" size="small">
                                        {product.email}
                                    </TableCell>
                                    <TableCell align="center" size="small">
                                        {product.address}
                                    </TableCell>
                                    <TableCell align="center" size="small">
                                        {product.age}
                                    </TableCell>
                                    <TableCell align="center" size="small">
                                        {product.phone_number}
                                    </TableCell>
                                    <TableCell align="center" size="small">
                                        {product.create_at}
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        size="small"
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <Box display="flex" justifyContent="center">

                                            <AppTooltip title="Xóa">
                                                <IconButton
                                                    disabled={isDisabledIcon(products)}
                                                    onClick={() => {
                                                        setOpenDeleteProductModal(true)
                                                        setUserDeleteID(product.id)
                                                    }}

                                                >
                                                    <Delete />
                                                </IconButton>
                                            </AppTooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <AppTooltip TooltipIcon={<Edit />} title="Edit" />
        </Box>
    );
};

export default ProductsTable;