import { Box, Button, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contextValues } from "../Contexts/AuthContext";

export default function Home(){
    const context = useContext(contextValues)

    useEffect(() => {
        console.log(context.examsData)
    }, [])

    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "90vh"}}>
            <Box sx={{bgcolor: "white", borderRadius: 3, p:3}}>
                <Typography sx={{textAlign: "left", fontSize: 20}}>Scheduled Exams</Typography>
                {context.examsData.map((exam) => {
                    return (
                        <Grid container key={exam.examID} sx={{display: "flex", minWidth: {xs: 400, md: 600}, py: 2}}>
                            <Grid item md={6} xs={12} sx={{textAlign: 'left'}}>
                                <Link className="examLink" to={`/exam/${exam.examID}`}> <Typography sx={{fontSize: 35}}>{exam.subject}</Typography></Link>
                                <Typography sx={{color: "#757575"}}>{exam.examName}</Typography>
                            </Grid>
                            <Grid item md={6} xs={12} sx={{textAlign: "right", display: "grid", placeContent: "center flex-end"}}>
                                <Button component={Link} to={`/exam/${exam.examID}`} variant="contained">View Exam</Button>
                            </Grid>
                        </Grid>
                    )
                })}
            </Box>
        </Box>
    )
}