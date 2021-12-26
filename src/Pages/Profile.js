import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import Navbar from "../Components/Navbar";
import { contextValues } from "../Contexts/AuthContext";

export default function Profile(){
    const context = useContext(contextValues)
    const [standard, setStandard] = useState(context.userData.class || "")
    const [preparingFor, setPreparingFor] = useState(context.userData.preparingFor || "")

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
                    <TextField name="city" label="City" sx={{my: 1}} defaultValue={context.userData.city}></TextField>
                    <FormControl fullWidth sx={{my: 1, textAlign: "left"}}>
                        <InputLabel>Class</InputLabel>
                        <Select
                            value={standard}
                            label="Class"
                            name="class"
                            onChange={(event) => setStandard(event.target.value)}
                        >
                            <MenuItem value={"11th"}>11th</MenuItem>
                            <MenuItem value={"12th"}>12th</MenuItem>
                            <MenuItem value={"Repeater"}>Repeater</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{my: 1, textAlign: "left"}}>
                        <InputLabel>Preparing for</InputLabel>
                        <Select
                            value={preparingFor}
                            label="preparingFor"
                            name="preparingFor"
                            onChange={(event) => setPreparingFor(event.target.value)}
                        >
                            <MenuItem value={"Jee"}>Jee</MenuItem>
                            <MenuItem value={"Neet"}>Neet</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained"sx={{my: 2}} size="large" >Update</Button>
                </Box>
            </Box>
        </>
    )
}