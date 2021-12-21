import { Box, Button, Chip, CircularProgress, Stack, Typography } from "@mui/material";
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

        var deadline = new Date("Dec 18, 2021 01:06:00 GMT+0530").getTime()
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
        minWidth: 130,
        m:{xs: 1, sm: 2},
        fontSize:40,
        border: "1px solid #757575"
    }

    if(!timer){
        return (
            <CircularProgress />
        )
    }
    

    return (
        <><Navbar />
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh"}}>
            {currentExam ? 
            <Box sx={{bgcolor: "white", borderRadius: 3, p:3, minWidth: 450}}>
                <Box sx={{display: "flex" , justifyContent: "space-between", alignItems: "center"}}>
                    <Box>
                        <Typography sx={{fontSize: 25, fontWeight: 500}}>{currentExam.subject}</Typography>
                        <Typography sx={{fontSize: 20, color: "#757575"}}>{currentExam.examName}</Typography>
                    </Box>
                    <Chip label="20 Minutes"></Chip>
                </Box>
                <Box sx={{textAlign: "center", mt: 5}}>
                    <Typography mt={2}>{!timer.expired ? "Exam starting in" : "Exam has been started" }</Typography>
                    {!timer.expired && <Stack sx={{display: "flex", flexWrap : "wrap", justifyContent: "center", flexDirection : "row"}}>
                        <Box sx={timerStyles} >{timer.days} <Typography >Day{timer.days > 1 && "s"}</Typography></Box>
                        <Box sx={timerStyles} >{timer.hours} <Typography >Hour{timer.hours > 1 && "s" }</Typography></Box>
                        <Box sx={timerStyles} >{timer.minutes} <Typography >Minute{timer.minutes > 1 && "s"}</Typography></Box>
                        <Box sx={timerStyles} >{timer.seconds} <Typography >Second{timer.seconds > 1 && "s"}</Typography></Box>
                    </Stack>}
                <Button variant="contained" component={Link} to={`/exam/${examID}/attempt`} disabled={!timer.expired} sx={{mt: 2}}>Start Exam</Button>
                </Box>
            </Box> :
            <CircularProgress />}
        </Box>
        </>
    )
}