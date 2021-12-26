import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { contextValues } from "../Contexts/AuthContext";

export default function Register(){
    const context = useContext(contextValues)
    const [standard, setStandard] = useState("")
    const [preparingFor, setPreparingFor] = useState("")
    

    useEffect(() => {
        if(context.userData){
            context.navigate("/profile")
        }
    }, [context.userData])
        
    async function registerUser(e){
        e.preventDefault()
        const data = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            emailID : e.target.emailID.value,
            phoneNo: e.target.phoneNo.value,
            city: e.target.city.value,
            class: e.target.class.value,
            preparingFor: e.target.preparingFor.value
        }

        try{
            await setDoc(doc(context.db, "Students", context.currentUser.uid), {...data, uid: context.currentUser.uid})
            context.setUserData({...data, uid: context.currentUser.uid})
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
                    <TextField name="city" label="City" sx={{my: 1}} ></TextField>
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
                    <Button type="submit" variant="contained"sx={{my: 2}} size="large" >Register</Button>
                </Box>
            </Box>
        </>
    )
}