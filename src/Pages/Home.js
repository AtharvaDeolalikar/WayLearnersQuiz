import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { collection, documentId, getDocs, orderBy, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { contextValues } from "../Contexts/AuthContext";
import logo from "../Assets/2.png"

export default function Home(){
    const context = useContext(contextValues)
    const [examsData, setExamsData] = useState()

    useEffect(() => {
        async function getExams(){
            const exams = []
            //const querySnapshot = await getDocs(collection(context.db, "Exams"))
            const q = query(collection(context.db, "Exams"), orderBy('sortNum'))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                exams.push({...doc.data(), examID: doc.id})
            })
            setExamsData(exams)
        }
        getExams()

        return () => {

        }
    }, [])

    return (
        <>
        <Navbar />
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "100vh", background: "linear-gradient(to bottom, #3A3186 0%, #A11981 100%)"}}>
            <Box sx={{ borderRadius: 3, p:3, m:1, my:{xs:9, sm:0}, minWidth: {md: 600}, color: "white"}}>
                <Box component="img" src={logo} sx={{width: {xs: 150, md:200}, height: "auto"}}/>
                <Typography sx={{textAlign: "left", fontSize: 18, mt:7}}>Scheduled Exams</Typography>
                {examsData ? 
                    <>
                    {examsData.map((exam) => {
                        return (
                            <Grid container key={exam.examID} sx={{display: "flex", py: 2}} rowSpacing={2}>
                                <Grid item md={6} xs={12} sx={{textAlign: 'left'}}>
                                    <Typography component={Link} to={`/exam/${exam.examID}`} sx={{fontSize: {xs: 25, md: 35}, color: "white", textDecoration: "none"}}>{exam.topic}</Typography>
                                    <Typography sx={{color: "#e0e0e0"}}>{exam.examName}</Typography>
                                </Grid>
                                <Grid item md={6} xs={12} sx={{ display: "grid", placeContent: {xs:"flex-start", md:"center flex-end"}}}>
                                    <Button component={Link} to={`/exam/${exam.examID}`} sx={{background: "linear-gradient(to bottom, #fee9a8 0%, #F5CF47 100%)", color:"black"}} variant="contained">View Details</Button>
                                </Grid>
                            </Grid>
                        )
                    })}
                </>
                : <CircularProgress sx={{my: 8}} />}
            </Box>
        </Box>
        </>
    )
}