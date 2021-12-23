import { LoadingButton } from "@mui/lab";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { contextValues } from "../Contexts/AuthContext";

export default function PhoneAuth(){
    const context = useContext(contextValues)
    const [confirmation, setConfirmation] = useState({result : "", phoneNo: ""})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(context.currentUser){
            context.navigate("/")
        }
    }, [])

    function signInWithPhoneNo(e){
        e.preventDefault()
        setLoading(true)

        if (e.target.phoneNo.value === "" || e.target.phoneNo.value.length < 10){
            setLoading(false)
            alert("Enter the correct phone number")
            return 
        };
        
        window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {'size': 'invisible'}, context.auth)

        const appVerifier = window.recaptchaVerifier

        function onSignInSubmit(){
            signInWithPhoneNumber(context.auth, `+91 ${e.target.phoneNo.value}`, appVerifier)
                .then((confirmationResult) => {
                    setConfirmation({result : confirmationResult, phoneNo: e.target.phoneNo.value})
                    setLoading(false)
                }).catch((error) => {
                    console.log(error)
                    setLoading(false)
            });
        }   
        onSignInSubmit()
    }

    function verifyOTP(e){
        e.preventDefault()
        setLoading(true)
        confirmation.result.confirm(e.target.OTP.value).then((result) => {
            context.setCurrentUser(result.user)
            context.setLoading(true)
        }).catch((err) => {
            alert("Invalid code entered")
            setLoading(false)
            window.location.reload()
        })
    }
    

    
    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "90vh"}}>
            <Box sx={{bgcolor: "white", borderRadius: 3, width: 400, display: "flex", justifyContent: "center", flexDirection: "column", p:3}}>
                <Box component="form" onSubmit={signInWithPhoneNo} >
                <Typography my={2} sx={{fontWeight: 500, fontSize: 25}}>Login with Phone Number</Typography>
                <TextField 
                    label="Phone Number" 
                    sx={{my: 1}} 
                    name="phoneNo" 
                    fullWidth 
                    InputProps={{
                        startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                    }}>
                </TextField>
                {!confirmation.result && <LoadingButton size="large" sx={{my: 2}} loading={loading} variant="contained" id="sign-in-button" type="submit">Receive an OTP</LoadingButton>}
                </Box>
                {confirmation.result &&
                    <Box component="form" onSubmit={verifyOTP}>                
                        <Typography mt={3} mb={2} color="gray" textAlign="left">{`Enter the six digit code we sent to +91 ${confirmation.phoneNo}`}</Typography>
                        <TextField name="OTP" label="Verification Code" fullWidth ></TextField>
                        <LoadingButton type="submit" loading={loading} variant="contained"sx={{my: 2}} size="large" id="sign-in-button" fullWidth>Verify OTP</LoadingButton>
                    </Box>
                }
            </Box>
        </Box>
    )
}