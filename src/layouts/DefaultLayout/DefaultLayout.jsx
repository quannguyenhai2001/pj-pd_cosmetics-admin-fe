import React, { memo } from "react";

import CopyrightIcon from "@mui/icons-material/Copyright";
import { Box, Typography } from "@mui/material";

import AppSidebar from "components/AppSidebar/AppSidebar";

import "./DefaultLayout.styles.scss";

const DefaultLayout = ({ children }) => {
    return (
        <Box>
            <Box
                display="flex"
                flexDirection="column"
                minHeight="100vh"
                sx={{ backgroundColor: "rgb(252 252 252)" }}
            >
                <Box
                    component="main"
                    sx={{ flex: 1 }}
                    display="flex"
                    className="wrapper-main"
                >
                    <AppSidebar />
                    <Box
                        component="section"
                        sx={{ flexGrow: 1 }}
                        width="100%"
                    >
                        {children}
                    </Box>
                </Box>
            </Box>

        </Box>
    );
};

export default memo(DefaultLayout);