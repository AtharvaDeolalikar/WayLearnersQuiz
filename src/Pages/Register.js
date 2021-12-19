import { Box, Button, TextField, Typography } from "@mui/material";
import { useContext } from "react";
import { contextValues } from "../Contexts/AuthContext";

export default function Register(){

    const context = useContext(contextValues)

    function registerUser(e){
        e.preventDefault()
        const data = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            emailID : context.currentUser.email,
            phoneNo: e.target.phoneNo.value
        }
        context.registerUser(data)
    }

    return (
        <>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "90vh"}}>
                <Box component="form" onSubmit={registerUser} sx={{bgcolor: "white", borderRadius: 3, width: 400, display: "flex", justifyContent: "center", flexDirection: "column", p:3}}>
                    <Typography my={2} sx={{fontWeight: 500, fontSize: 25}}>Register</Typography>
                    <TextField name="firstName" label="First Name" sx={{my: 1}} required></TextField>
                    <TextField name="lastName" label="Last Name" sx={{my: 1}} required></TextField>
                    <TextField name="emailID" label="Email Address" defaultValue={context.currentUser.email} disabled sx={{my: 1}} required></TextField>
                    <TextField name="phoneNo" label="Phone Number" sx={{my: 1}} required></TextField>
                    <Button type="submit" variant="contained"sx={{my: 2}} size="large" >Register</Button>
                </Box>
            </Box>
        </>
    )
}