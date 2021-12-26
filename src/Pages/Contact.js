import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import Navbar from "../Components/Navbar";
import { contextValues } from "../Contexts/AuthContext";

export default function Contact(){
    const context = useContext(contextValues)
    const [loading, setLoading] = useState(false)

    async function addMessage(e){
        e.preventDefault()
        setLoading(true)
        const data = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            emailID : e.target.emailID.value,
            message: e.target.message.value
        }
        try{
            await addDoc(collection(context.db, "Messages"), {...data, uid: context.currentUser.uid})
            context.setAlert({variant: "success", message: "We have received your message and we'll get back to you as soon as possible.", show: true})
            context.navigate("/")
        }
        catch(error){
            console.log(error)
        }  
        setLoading(false)
    }

    return (
        <>
        <Navbar />
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "99vh", mt:{xs:5, md:0}}}>
                <Box component="form" onSubmit={addMessage} sx={{bgcolor: "white", borderRadius: 3, width: 400, display: "flex", justifyContent: "center", flexDirection: "column", p:3, m:2}}>
                    <Typography my={2} sx={{fontWeight: 500, fontSize: 25}}>Contact Us</Typography>
                    <TextField name="firstName" label="First Name" sx={{my: 1}} disabled defaultValue={context.userData.firstName}></TextField>
                    <TextField name="lastName" label="Last Name" sx={{my: 1}} disabled defaultValue={context.userData.lastName}></TextField>
                    <TextField name="emailID" label="Email Address" disabled disabled sx={{my: 1}} defaultValue={context.userData.emailID}></TextField>
                    <TextField required multiline minRows={4} name="message" label="Message" sx={{my: 1}} defaultValue={context.userData.message}></TextField>
                    <LoadingButton type="submit" loading={loading} variant="contained"sx={{my: 2}} size="large" >Send Message</LoadingButton>
                </Box>
            </Box>
        </>
    )
}