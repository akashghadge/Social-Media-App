import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { AddBox, Dashboard, Home } from "@material-ui/icons"
import { NavLink } from "react-router-dom"
import { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios"
import { useSelector } from 'react-redux';
const useStyles = makeStyles((theme) => ({
    AppBar: {
        color: "#ffffff",
        backgroundColor: "#220080",
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        '&:hover': {
            cursor: "pointer"
        }
    },
    title: {
        // display: 'none',
        textAlign: 'center',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    navlink: {
        textDecoration: "none",
        color: "inherit",
        '&:hover': {
            color: "inherit"
        }
    }
}));
export default function PrimarySearchAppBar() {
    let [notificationCount, setNotificationCount] = useState(0);
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    useEffect(() => {
        console.log("use effect");
        let token = localStorage.getItem("token");
        if (token == null) {
            setNotificationCount(0);
        }
        else {
            const urlNotification = "/api/notification/all";
            axios.post(urlNotification, {
                token: token
            })
                .then((data) => {
                    if (data.data == null || data.data.length == 0) {
                        setNotificationCount(0);
                    }
                    else {
                        setNotificationCount(data.data.length);
                    }
                })
        }
    }, [LoggedUser._id])


    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    // small subbox menu for profile section
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <NavLink exact to="/profile" className={classes.navlink}>
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            </NavLink>
            <NavLink exact to="/settings" className={classes.navlink}>
                <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            </NavLink>
            <NavLink exact to="/sign" className={classes.navlink}>
                <MenuItem onClick={handleMenuClose}>Sign In/Up</MenuItem>
            </NavLink>
        </Menu>
    );

    // for mobile menu : <- in 
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <NavLink exact to="/" className={classes.navlink}>
                <MenuItem>
                    <IconButton aria-label="show 11 new notifications" color="inherit">
                        <Home />
                    </IconButton>
                    <p className="mb-0">Home</p>
                </MenuItem>
            </NavLink>
            <NavLink exact to="/create-post" className={classes.navlink}>
                <MenuItem>
                    <IconButton aria-label="show 11 new notifications" color="inherit">
                        <AddBox />
                    </IconButton>
                    <p className="mb-0">Create</p>
                </MenuItem>
            </NavLink>
            <NavLink exact to="/messages" className={classes.navlink}>
                <MenuItem>
                    <IconButton aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={0} color="secondary">
                            <MailIcon />
                        </Badge>
                    </IconButton>
                    <p className="mb-0">Messages</p>
                </MenuItem>
            </NavLink>
            <NavLink exact to="/notifications" className={classes.navlink}>
                <MenuItem>
                    <IconButton aria-label="show 11 new notifications" color="inherit">
                        <Badge badgeContent={notificationCount} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <p className="mb-0">Notifications</p>
                </MenuItem>
            </NavLink>
            <NavLink exact to="/profile" className={classes.navlink}>
                <MenuItem onClick={handleProfileMenuOpen}>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <p className="mb-0">Profile</p>
                </MenuItem>
            </NavLink>
        </Menu>
    );

    return (
        // for main desktop menu
        <div className={classes.grow}>
            <AppBar position="relative" className={classes.AppBar}>
                <Toolbar>
                    <NavLink exact to="/" className={classes.navlink}>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                        >
                            <Dashboard />
                        </IconButton>
                    </NavLink>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Social-Media
                    </Typography>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <NavLink exact to="/" className={classes.navlink}>
                            <IconButton aria-label="show 4 new mails" color="inherit">
                                <Badge color="secondary">
                                    <Home />
                                </Badge>
                            </IconButton>
                        </NavLink>
                        <NavLink exact to="/create-post" className={classes.navlink}>
                            <IconButton aria-label="show 4 new mails" color="inherit">
                                <Badge color="secondary">
                                    <AddBox />
                                </Badge>
                            </IconButton>
                        </NavLink>
                        <NavLink exact to="/messages" className={classes.navlink}>
                            <IconButton aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={0} color="secondary">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                        </NavLink>
                        <NavLink exact to="/notifications" className={classes.navlink}>
                            <IconButton aria-label="show 17 new notifications" color="inherit">
                                <Badge badgeContent={notificationCount} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </NavLink>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit">
                            <AccountCircle />
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit">
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}
