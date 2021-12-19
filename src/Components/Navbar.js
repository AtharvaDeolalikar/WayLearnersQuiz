import { AccountCircle } from "@mui/icons-material";
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { contextValues } from "../Contexts/AuthContext";

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
        <AppBar sx={{bgcolor: "white", color: "black"}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Way Learners
          </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
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