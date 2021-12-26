import { AccountCircle } from "@mui/icons-material";
import { AppBar, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { contextValues } from "../Contexts/AuthContext";
import wayLogo from "../Assets/WayEducationLogo.png"
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar(){
    const [anchorEl, setAnchorEl] = useState(null)
    const context = useContext(contextValues)

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }


    return (
        <AppBar sx={{bgcolor: "white", color: "black"}} >
        <Toolbar sx={{display: "flex", justifyContent: "space-between"}} >
        <Link to="/"><img src={wayLogo} style={{maxWidth: 80, height:"auto"}}/></Link>
          
          {/* <Typography variant="h6" component="div" >
            Way Education
          </Typography> */}

            <div>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/">
                  <ListItemIcon>
                    <HomeIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Home</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to="/about">
                  <ListItemIcon>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>About</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to="/contact">
                  <ListItemIcon>
                    <ContactPageIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Contact</ListItemText></MenuItem>
                <MenuItem component={Link} to="/terms-and-conditions">
                  <ListItemIcon>
                    <ArticleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Terms and conditions</ListItemText>
                </MenuItem>
                <MenuItem onClick={context.logOut}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
    )
}