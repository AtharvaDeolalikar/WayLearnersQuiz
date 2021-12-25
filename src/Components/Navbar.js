import { AccountCircle } from "@mui/icons-material";
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { contextValues } from "../Contexts/AuthContext";
import wayLogo from "../Assets/WayEducationLogo.png"

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
                <MenuItem component={Link} to="/profile">Profile</MenuItem>
                <MenuItem onClick={context.logOut}>Logout</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
    )
}