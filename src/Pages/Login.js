import { Box, Button, Chip, Divider, TextField, Typography } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { useContext } from "react";
import { contextValues } from "../Contexts/AuthContext";

export default function Login(){
    const context = useContext(contextValues)

    function signInWithEmail(e){
        console.log(e)
        e.preventDefault();
        context.signInWithEmail(e.target.email.value, e.target.password.value)
    }

    return (
        <>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "90vh"}}>
                <Box component="form" onSubmit={signInWithEmail} sx={{bgcolor: "white", borderRadius: 3, width: 400, display: "flex", justifyContent: "center", flexDirection: "column", p:3}}>
                    <Typography my={2} sx={{fontWeight: 500, fontSize: 25}}>Login</Typography>
                    <TextField name="Email" label="Email Address" sx={{my: 1}} fullWidth></TextField>
                    <TextField name="password" label="Password" sx={{my: 2}} type="password" fullWidth></TextField>
                    <Button type="submit" variant="contained"sx={{my: 2}} size="large" fullWidth>Login</Button>
                    <Divider sx={{my: 1}}><Chip label="OR" /></Divider>
                    <Button size="large" sx={{my: 2}} variant="outlined" onClick={() => context.signInWithGoogle()}><GoogleIcon style={{marginRight: 5}}/>Sign in with Google</Button>
                </Box>
            </Box>
        </>
    )
}