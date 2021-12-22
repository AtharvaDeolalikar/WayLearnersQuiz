import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { contextValues } from "../Contexts/AuthContext";
import Timer from "../Timer";

export default function Exam(){
    const context = useContext(contextValues)
    const {examID} = useParams()
    const [currentExam, setCurrentExam] = useState()
    const [timer, setTimer] = useState()

    useEffect(() => {
        var exam = context.examsData.find(exam => exam.examID === examID)
        setCurrentExam(exam)

        var deadline = new Date("Dec 22, 2021 13:11:30 GMT+0530").getTime()
        var current = new Date().getTime()
        const interval = setInterval(function(){
            current = current + 1000
            setTimer(Timer(deadline, current))
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const timerStyles = {
        borderRadius: 4,
        p:3, 
        minWidth: 80,
        m:{xs: 1, sm: 2},
        fontSize:40,
        border: "1px solid #757575"
    }

    if(!timer){
        return (
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "90vh"}}>
                <CircularProgress />
            </Box>
        )
    }
    

    return (
        <><Navbar />
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh"}}>
            {currentExam ? 
            <Grid container sx={{bgcolor: "white", borderRadius: 3, m:2, maxWidth: 700, mt:{xs:7}}}  >
                <Grid item xs={12} p={3}>
                    <Grid container>
                        <Grid item xs={12} md={6} >
                            <Typography sx={{fontSize: 25, fontWeight: 500}}>{currentExam.topic}</Typography>
                            <Typography sx={{fontSize: 20, color: "#757575"}}>{currentExam.examName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{textAlign: {xs: "left", md: 'right'}}}>
                            <Chip label="20 Minutes" />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{textAlign: "center"}}>
                    <Typography fontSize={20} >{!timer.expired ? "Exam starting in" : "Exam has been started" }</Typography>
                    {!timer.expired && <Stack sx={{display: "flex", flexWrap : "wrap", justifyContent: "center", flexDirection : "row"}}>
                        <Box sx={timerStyles} >{timer.days} <Typography >Day{timer.days > 1 && "s"}</Typography></Box>
                        <Box sx={timerStyles} >{timer.hours} <Typography >Hour{timer.hours > 1 && "s" }</Typography></Box>
                        <Box sx={timerStyles} >{timer.minutes} <Typography >Minute{timer.minutes > 1 && "s"}</Typography></Box>
                        <Box sx={timerStyles} >{timer.seconds} <Typography >Second{timer.seconds > 1 && "s"}</Typography></Box>
                    </Stack>}
                    <Button variant="contained" component={Link} to={`/exam/${examID}/attempt`} disabled={!timer.expired} sx={{my: 2}}>Start Exam</Button>
                </Grid>
            </Grid> :
            <CircularProgress />}
        </Box>
        </>
    )
}