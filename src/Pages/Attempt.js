import { Box, Button, Chip, CircularProgress, FormControlLabel, Grid, Radio, RadioGroup, Typography, FormLabel } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { contextValues } from "../Contexts/AuthContext";
import Timer from "../Timer";
import Navbar from "../Components/Navbar";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

export default function Attempt(){
    const {examID} = useParams()
    const context = useContext(contextValues)
    const [currentQuestion, setCurrentQuestion] = useState(1)
    const [userExamStatus, setUserExamStatus] = useState()
    const [questions, setQuestions] = useState()
    const [timer, setTimer] = useState()
    const [points, setPoints] = useState()
    const [selectedOption, setSelectedOption] = useState("")
    let _points = 600
    
    useEffect(() => {
        var exam = context.examsData.find(exam => exam.examID === examID)
        setQuestions(exam.questions)
        var deadline = new Date("Dec 22, 2021 20:05:10 GMT+0530").getTime()
        var current = new Date().getTime()

        async function getUserExamStatus(){
            const answers = await getDoc(doc(getFirestore(), "Exams", examID, "Answersheets", context.currentUser.uid))
            var tempData = answers.data()
            if(tempData && tempData.lastQuestion){
                setCurrentQuestion(tempData.lastQuestion)
            }else if(tempData){
                setUserExamStatus(tempData.userExamStatus)
            }
        }
        
        getUserExamStatus()

        function decrementPoints(){
            _points = _points - 1
            setPoints(_points)
        }

        const pointsInterval = setInterval(decrementPoints, 200)
        const interval = setInterval(function(){
            current = current + 1000
            setTimer(Timer(deadline, current))
        }, 1000)

        return () => {
            clearInterval(interval)
            clearInterval(pointsInterval)
        }

    }, [])

    if(!questions || !timer){
        return (
            <CircularProgress />
        )
    }

    async function moveToNextQuestion(){
        if(currentQuestion === questions.length){
            context.submitExam(examID, points)
            setUserExamStatus("finished")
        }else{
            setSelectedOption("")
            setCurrentQuestion(currentQuestion + 1)
            try{
                await setDoc(doc(getFirestore(), "Exams", examID, "Answersheets", context.currentUser.uid), {lastQuestion: currentQuestion + 1}, { merge: true })
            }catch(error) {
                console.log(error)
            }  
        }
    }

    function makeChoice(index){
        context.saveHandler(index, currentQuestion, examID)
        setSelectedOption(index)
        //setOption(false)
    }

    if(userExamStatus == "finished"){
        return(
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "95vh"}}>
                <Box sx={{bgcolor: "white", borderRadius: 3, p:3, width: { md: 800}, display: "flex", flexDirection: "column"}} >
                    <Typography fontSize={20} fontWeight={600}>Thank you for attempting this exam!</Typography>
                    <Typography fontSize={20} fontWeight={300} mt={2}>We'll let you know the results very soon.</Typography>
                </Box>
            </Box>
        )
    }


    return (
        <>
        <Navbar />
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "95vh"}}>
            {!timer.expired ? 
            <Box sx={{bgcolor: "white", borderRadius: 3, p:3, width: { md: 800}, display: "flex", flexDirection: "column"}} >
                <Box sx={{textAlign: "left", mb: 2}}>
                    <Chip label={`Question ${Number(currentQuestion)}/20`} color="primary"/>
                </Box>
                <Typography fontWeight={500} fontSize={20} sx={{textAlign: "left"}} variant="h3">
                    {questions[currentQuestion - 1].question}
                </Typography>
                
                <RadioGroup sx={{my: 2}}>
                    {questions[currentQuestion - 1].options.map((option, index) => {
                        return(
                            <FormControlLabel checked={index === selectedOption} onChange={(e) => makeChoice(Number(e.target.value))} key={index} value={index} control={<Radio />} label={option} />
                        )
                    })}  
                </RadioGroup>
                
                <Grid container rowSpacing={2}>
                    <Grid item xs={12} sm={6} sx={{justifyContent: {xs: "center", sm: "flex-start"}, display: "flex", alignItems: "center"}}>
                        <Chip label={`${timer.minutes} Minutes ${timer.seconds} Seconds`}  />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{justifyContent: {xs: "center", sm: "flex-end"}, display: "flex"}}>
                        <Button variant={currentQuestion === questions.length ? "contained" : "outlined"} onClick={moveToNextQuestion}>{currentQuestion === questions.length ? "Submit" : "Next Question"}</Button>
                    </Grid>
                </Grid>
            </Box> : 
            <Box sx={{bgcolor: "white" , p:4, borderRadius: 2}}>
                <Typography fontSize={20} fontWeight={600}>Exam deadline is over!</Typography>
                <Typography fontSize={20} fontWeight={300} mt={2}>We'll let you know the results very soon.</Typography>
            </Box>}
        </Box>
        </>
    )
}