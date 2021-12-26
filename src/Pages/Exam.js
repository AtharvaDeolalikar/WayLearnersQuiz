import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { collection, doc, documentId, getDocs, query, setDoc, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { contextValues } from "../Contexts/AuthContext";
import Timer from "../Timer";
import {ReactComponent as ExamSVG} from "../Assets/AttemptStart.svg"

let startTime, endTime, currentTime

const timerStyles = {
    borderRadius: 4,
    p:3, 
    minWidth: 80,
    m:{xs: 1, sm: 2},
    fontSize:40,
    border: "1px solid #757575"
}

export default function Exam(){
    const context = useContext(contextValues)
    const {examID} = useParams()
    const [exam, setExam] = useState()
    const [timer, setTimer] = useState({loading: true})
    const [message, setMessage] = useState({heading: "", description: ""})


    useEffect(() => {
        async function getExam(){
            const examsRef = collection(context.db, "Exams");
            const q = query(examsRef, where(documentId(), "==", examID));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                var data = doc.data()
                setExam(data)
                startTime = data.startTime.toDate().getTime()
                endTime = data.endTime.toDate().getTime()
                currentTime = new Date().getTime()

                if(startTime > currentTime){
                    setMessage({heading: "Exam starting in", description: ""})
                }else if(currentTime > endTime){
                    setMessage({heading: "Exam deadline is over", description: ""})
                }else if(startTime < currentTime < endTime){
                    setMessage({heading: "Exam has been started"})
                }
            })
        }
        getExam()

        const interval = setInterval(function(){
            currentTime = currentTime + 1000
            setTimer(Timer(startTime, currentTime))
            if(startTime < currentTime && currentTime < endTime){
                setMessage({heading: "Exam has been started"})
            }
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [context.db, examID])

    async function startExam(){
        if(examID !== "demo"){
            try{
                await setDoc(doc(context.db, "Exams", examID, "Answersheets", context.currentUser.uid), {startedAt: new Date()}, { merge: true })
            }catch(error){
                console.log(error)
            }
        }
        context.navigate(`/exam/${examID}/attempt`)
    }


    if(timer.loading){
        return (
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "99vh"}}>
                <CircularProgress />
            </Box>
        )
    }
    

    return (
        <><Navbar />
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "99vh", my:{xs:7, md:5}}}>
            {exam ? 
            <Grid container sx={{bgcolor: "white", borderRadius: 3, m:2, maxWidth: 700}}  >
                <Grid item xs={12} p={3}>
                    <Grid container>
                        <Grid item xs={12} md={6} >
                            <Typography sx={{fontSize: 25, fontWeight: 500}}>{exam.topic}</Typography>
                            <Typography sx={{fontSize: 20, color: "#757575"}}>{exam.examName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{textAlign: {xs: "left", md: 'right'}}}>
                            <Chip label="20 Minutes" />
                        </Grid>
                    </Grid>
                </Grid>
                <Box sx={{display: "flex", justifyContent: "center", width: "100%", mb:3}}><ExamSVG style={{maxWidth: "300px", height: "auto"}} /></Box>
                <Grid item xs={12} sx={{textAlign: "center"}}>
                    <Typography fontSize={20} mb={2}>{message.heading}</Typography>
                    {!timer.error && <Stack sx={{display: "flex", flexWrap : "wrap", justifyContent: "center", flexDirection : "row"}}>
                        <Box sx={timerStyles} >{timer.days} <Typography >Day{timer.days > 1 && "s"}</Typography></Box>
                        <Box sx={timerStyles} >{timer.hours} <Typography >Hour{timer.hours > 1 && "s" }</Typography></Box>
                        <Box sx={timerStyles} >{timer.minutes} <Typography >Minute{timer.minutes > 1 && "s"}</Typography></Box>
                        <Box sx={timerStyles} >{timer.seconds} <Typography >Second{timer.seconds > 1 && "s"}</Typography></Box>
                    </Stack>}
                    {currentTime < endTime && <Button variant="contained" onClick={startExam} disabled={!timer.error} sx={{mb: 2}}>Start Exam</Button>}
                </Grid>
            </Grid> :
            <CircularProgress />}
        </Box>
        </>
    )
}