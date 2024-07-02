import {
    Box,
    Button,
    Grid, Link,
    Menu, MenuItem,
    Stack,
    Typography
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {colors} from '../../utils/Color.js'
import {useState} from "react";

function Header() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>

        <Box>
            <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                <Grid item xs={12} sm={6} md={4} >
                    <Typography
                        variant="h2"
                        component="h2"
                        align="center"
                        sx={{
                            backgroundImage: `linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(121,9,111,1) 50%, rgba(0,212,255,1) 100%)`,
                            backgroundSize: "100%",
                            backgroundRepeat: "repeat",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}
                        >
                        Logo
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} alignContent="center">
                    <Stack gap={3} direction="row" alignItems="center" justifyContent="center">
                    <Link href="/" sx={{textDecoration:"none"}} color={colors.secondary}>Home</Link>
                    <Link href="/" sx={{textDecoration:"none"}} color={colors.secondary}>Customers</Link>
                    <Link href="/employee" sx={{textDecoration:"none"}} color={colors.secondary}>Employee</Link>
                    <Link href="/reservation" sx={{textDecoration:"none"}} color={colors.secondary}>Reservation</Link>
                    <Link href="/order" sx={{textDecoration:"none"}} color={colors.secondary}>Order</Link>
                    <Link href="/menu" sx={{textDecoration:"none"}} color={colors.secondary}>Menu</Link>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4} alignContent="center">
                    <Stack>
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            endIcon={<KeyboardArrowDownIcon/>}
                            sx={{
                                color:colors.secondary,
                                fontWeight:"bold"
                            }}
                        >
                            Account
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </Menu>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
        </>
    );
}

export default Header;