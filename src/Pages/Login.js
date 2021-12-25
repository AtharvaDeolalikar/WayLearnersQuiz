import { Box, Button, Checkbox, Chip, Divider, FormControlLabel, Grid, IconButton, Stack, Typography } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { useContext, useEffect } from "react";
import { contextValues } from "../Contexts/AuthContext";
import PhoneIcon from '@mui/icons-material/Phone';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import logo from "../Assets/2.png"
import banner from "../Assets/1.png"
import footer from "../Assets/5.png"

const provider = new GoogleAuthProvider()

export default function Login(){
    const context = useContext(contextValues)

    function signInWithGoogle(){
        signInWithPopup(context.auth, provider)
            .then((result) => {
                const user = result.user;
                context.setCurrentUser(user)
                context.setLoading(true)
            }).catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        if(context.currentUser){
            context.navigate("/")
        }
    }, [])
    

    return (
        <>
            <Box sx={{display: "flex", textAlign: "center", minHeight: "100vh", background: "linear-gradient(to bottom, #3A3186 0%, #A11981 100%)"}}>
                <Box sx={{position:"absolute", top:20, left:0, mb:8}}>
                    <img src={banner} style={{width: "300px", height: "auto"}}/>
                </Box>
                <Grid container sx={{width: "100%", display: "flex", justifyContent: "center", color: "white", mt:15}}>
                        <Grid item xs={12}>  
                           <Box component="img" src={logo} sx={{width: {xs: 250, md:400}, height: "auto"}} />
                            <Typography mt={5} mb={1}>Login with</Typography>
                            <Box>                  
                                <IconButton sx={{background: "linear-gradient(to bottom, #fee9a8 0%, #F5CF47 100%)", color:"black", mx:2}} onClick={signInWithGoogle} disableRipple><GoogleIcon /></IconButton>
                                <IconButton sx={{background: "linear-gradient(to bottom, #fee9a8 0%, #F5CF47 100%)", color:"black", mx:2}} onClick={() => context.navigate("/login/phone")} disableRipple><PhoneIcon  /></IconButton>
                            </Box>
                            <Box>
                                <FormControlLabel sx={{color: "white", mt:2}} control={<Checkbox size="small" color="temp" defaultChecked />} label="I agree to all the terms and conditions" />
                            </Box>
                        </Grid>
                </Grid>
                <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                    <img src={footer} style={{width: "200px", height: "auto", position: "absolute", bottom:20}}/>
                </Box>
            </Box>
        </>
    )
}