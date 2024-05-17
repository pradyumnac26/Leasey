import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../requests";
import leastlogo from "../../assets/leaseylogo.png";

const pages = [
    {
        name: "Home",
        path: "/",
        restrict: false,
    },
    {
        name: "Create Listing",
        path: "/create_listing",
        restrict: true,
    },
    {
        name: "My Listings",
        path: "/my_listings",
        restrict: true,
    },
    {
        name: "Analysis",
        path: "/analysis",
        restrict: false,
    },
    {
        name: "Support",
        path: "/support",
    },
];

const settings = ["Logout"];

function NavBar(props) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const location = useLocation();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        logoutUser(sessionStorage.getItem("access_token"))
            .then(() => {
                props.setUser(null);
            })
            .catch((err) => {
                console.log(err);
            });
        handleCloseUserMenu();
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        <img
                            src={leastlogo}
                            alt="Leasey Logo"
                            style={{ height: "40px", width: "40px" }}
                        />
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages
                                .filter((page) => {
                                    if (page.restrict) {
                                        return props.user;
                                    }
                                    return true;
                                })
                                .map((page) => (
                                    <Link
                                        to={page.path}
                                        key={page.name}
                                        style={{
                                            textDecoration: "none",
                                            color: "black",
                                        }}
                                    >
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">
                                                {page.name}
                                            </Typography>
                                        </MenuItem>
                                    </Link>
                                ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        <img
                            src={leastlogo}
                            alt="Leasey Logo"
                            style={{ height: "40px", width: "40px" }}
                        />
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            gap: 2,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {pages
                            .filter((page) => {
                                if (page.restrict) {
                                    return props.user;
                                }
                                return true;
                            })
                            .map((page) => (
                                <Link
                                    to={page.path}
                                    key={page.name}
                                    style={{
                                        textDecoration: "none",
                                        color: "black",
                                    }}
                                >
                                    <Button
                                        sx={{
                                            my: 2,
                                            color: "white",
                                            display: "block",
                                        }}
                                    >
                                        {page.name}
                                    </Button>
                                </Link>
                            ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {props.user && (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <Typography
                                            textAlign="center"
                                            sx={{ color: "white" }}
                                        >
                                            {props.user.username}
                                        </Typography>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem
                                            key={setting}
                                            onClick={handleLogout}
                                        >
                                            <Typography textAlign="center">
                                                {setting}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}

                        {!props.user && (
                            <Link
                                to="/login"
                                style={{ textDecoration: "none" }}
                                state={{ redirectTo: location }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{ my: 2, color: "white" }}
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default NavBar;
