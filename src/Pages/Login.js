import { Box, Button, Chip, Divider, Typography } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { useContext, useEffect } from "react";
import { contextValues } from "../Contexts/AuthContext";
import PhoneIcon from '@mui/icons-material/Phone';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {ReactComponent as LoginIllustration} from "../Assets/login.svg"
import Footer from "../Components/Footer";

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
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "90vh"}}>
                <Box sx={{bgcolor: "white", borderRadius: 3, width: 400, display: "flex", justifyContent: "center", flexDirection: "column", p:3, m:2}}>
                    <Typography my={2} sx={{fontWeight: 500, fontSize: 25}}>Login</Typography>
                    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}><LoginIllustration style={{width: "100%", height: "auto"}}/></Box>                    
                    <Button size="large" sx={{my: 2}} variant="contained" onClick={signInWithGoogle}><GoogleIcon style={{marginRight: 5}}/>Continue with Google</Button>
                    <Divider sx={{my: 1}}><Chip label="OR" /></Divider>
                    <Button variant="outlined"sx={{my: 2}} size="large" onClick={() => context.navigate("/login/phone")} fullWidth><PhoneIcon  style={{marginRight: 5}}/>Login with Phone Number</Button>
                </Box>
            </Box>
        </>
    )
}