import { Box, Button, TextField, Typography } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import Navbar from "../Components/Navbar";
import { contextValues } from "../Contexts/AuthContext";

export default function Profile(){

    const context = useContext(contextValues)

    async function updateUser(e){
        e.preventDefault()
        const data = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            emailID : e.target.emailID.value,
            phoneNo: e.target.phoneNo.value
        }
        try{
            await updateDoc(doc(context.db, "Students", context.currentUser.uid), {...data, uid: context.currentUser.uid})
            context.setAlert({variant: "success", message: "Your profile has been updated successfully.", show: true})
            context.navigate("/")
        }
        catch(error){
            console.log(error)
        }  
    }

    return (
        <>
        <Navbar />
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "99vh", mt:{xs:5, md:0}}}>
                <Box component="form" onSubmit={updateUser} sx={{bgcolor: "white", borderRadius: 3, width: 400, display: "flex", justifyContent: "center", flexDirection: "column", p:3, m:2}}>
                    <Typography my={2} sx={{fontWeight: 500, fontSize: 25}}>Update Profile</Typography>
                    <TextField name="firstName" label="First Name" sx={{my: 1}} defaultValue={context.userData.firstName}></TextField>
                    <TextField name="lastName" label="Last Name" sx={{my: 1}} defaultValue={context.userData.lastName}></TextField>
                    <TextField name="emailID" label="Email Address" disabled sx={{my: 1}} defaultValue={context.userData.emailID}></TextField>
                    <TextField name="phoneNo" label="Phone Number" disabled sx={{my: 1}} defaultValue={context.userData.phoneNo}></TextField>
                    <Button type="submit" variant="contained"sx={{my: 2}} size="large" >Update</Button>
                </Box>
            </Box>
        </>
    )
}