import { Box, Button, TextField, Typography } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import Footer from "../Components/Footer";
import { contextValues } from "../Contexts/AuthContext";

export default function Register(){
    const context = useContext(contextValues)

    useEffect(() => {
        if(context.userData){
            context.navigate("/profile")
        }
    }, [])
        
    async function registerUser(e){
        e.preventDefault()
        const data = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            emailID : e.target.emailID.value,
            phoneNo: e.target.phoneNo.value
        }
        try{
            await setDoc(doc(context.db, "Students", context.currentUser.uid), {...data, uid: context.currentUser.uid})
            context.setAlert({variant: "success", message: "Your have been registered successfully.", show: true})
            context.navigate("/")
        }catch(error){
            console.log(error)
        }
            
    }

    return (
        <>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "90vh"}}>
                <Box component="form" onSubmit={registerUser} sx={{bgcolor: "white", borderRadius: 3, width: 400, display: "flex", justifyContent: "center", flexDirection: "column", p:3, m:2}}>
                    <Typography my={2} sx={{fontWeight: 500, fontSize: 25}}>Register</Typography>
                    <TextField name="firstName" label="First Name" sx={{my: 1}} required></TextField>
                    <TextField name="lastName" label="Last Name" sx={{my: 1}} required></TextField>
                    <TextField name="emailID" label="Email Address" defaultValue={context.currentUser.email} disabled={context.currentUser.email ? true : false} sx={{my: 1}} required></TextField>
                    <TextField name="phoneNo" label="Phone Number" defaultValue={context.currentUser.phoneNumber} disabled={context.currentUser.phoneNumber ? true : false} sx={{my: 1}} required></TextField>
                    <Button type="submit" variant="contained"sx={{my: 2}} size="large" >Register</Button>
                </Box>
            </Box>
        </>
    )
}