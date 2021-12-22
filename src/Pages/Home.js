import { Box, Button, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { contextValues } from "../Contexts/AuthContext";

export default function Home(){
    const context = useContext(contextValues)

    return (
        <>
        <Navbar />
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "90vh"}}>
            <Box sx={{bgcolor: "white", borderRadius: 3, p:3, m:1}}>
                <Typography sx={{textAlign: "left", fontSize: 18}}>Scheduled Exams</Typography>
                {context.examsData.map((exam) => {
                    return (
                        <Grid container key={exam.examID} sx={{display: "flex", minWidth: {md: 600}, py: 2}} rowSpacing={2}>
                            <Grid item md={6} xs={12} sx={{textAlign: 'left'}}>
                                <Link className="examLink" to={`/exam/${exam.examID}`}> <Typography sx={{fontSize: {xs: 25, md: 35}}}>{exam.topic}</Typography></Link>
                                <Typography sx={{color: "#757575"}}>{exam.examName}</Typography>
                            </Grid>
                            <Grid item md={6} xs={12} sx={{ display: "grid", placeContent: {xs:"flex-start", md:"center flex-end"}}}>
                                <Button component={Link} to={`/exam/${exam.examID}`} variant="contained">View Details</Button>
                            </Grid>
                        </Grid>
                    )
                })}
            </Box>
        </Box>
        </>
    )
}