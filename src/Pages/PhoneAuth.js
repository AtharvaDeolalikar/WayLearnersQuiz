import { Box, Button, TextField, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { contextValues } from "../Contexts/AuthContext";

export default function PhoneAuth(){
    const context = useContext(contextValues)

    function signInWithPhoneNo(e){
        e.preventDefault()
        context.signInWithPhoneNo(e.target.phone.value)
    }

    useEffect(() => {
        if(context.currentUser){
            context.navigate("/")
        }
    })
    

    return (
        <>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "90vh"}}>
                <Box component="form" onSubmit={signInWithPhoneNo} sx={{bgcolor: "white", borderRadius: 3, width: 400, display: "flex", justifyContent: "center", flexDirection: "column", p:3}}>
                    <Typography my={2} sx={{fontWeight: 500, fontSize: 25}}>Login</Typography>
                    <TextField label="Phone Number" sx={{my: 1}} name="phone" fullWidth></TextField>
                    <Button size="large" sx={{my: 2}} variant="outlined" type="submit" >Receive an OTP</Button>
                    <TextField name="password" label="Verification Code" sx={{my: 2}} fullWidth></TextField>
                    <Button type="submit" variant="contained"sx={{my: 2}} size="large" fullWidth>Verify OTP</Button>
                </Box>
            </Box>
        </>
    )
}