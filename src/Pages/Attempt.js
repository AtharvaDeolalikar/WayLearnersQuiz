import { Box, Button, Chip, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { contextValues } from "../Contexts/AuthContext";
import Timer from "../Timer";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Navbar from "../Components/Navbar";

export default function Attempt(){
    const {examID} = useParams()
    const context = useContext(contextValues)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [questions, setQuestions] = useState()
    const [timer, setTimer] = useState()
    const [points, setPoints] = useState()
    const [solvedAnswers, setSolvedAnswers] = useState(false)
    let _points = 600
    
    useEffect(() => {
        var exam = context.examsData.find(exam => exam.examID === examID)
        setQuestions(exam.questions)

        async function getAnswers(){
            const answers = await getDoc(doc(getFirestore(), "Exams", examID, "Answersheets", context.currentUser.uid))
            setSolvedAnswers(answers.data())
            console.log(answers.data())
        }
        
        getAnswers()

        function decrementPoints(){
            _points = _points - 1
            setPoints(_points)
        }

        const pointsInterval = setInterval(decrementPoints, 200)

        var deadline = new Date("Dec 20, 2021 03:50:30 GMT+0530").getTime()
        var current = new Date().getTime()
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


    function moveToPreviousQuestion(){
        if(currentQuestion === 0){
            return
        }else{
            setCurrentQuestion(currentQuestion - 1)
        }
    }


    function moveToNextQuestion(){
        if(currentQuestion + 1 === questions.length){
            return
        }else{
            setCurrentQuestion(currentQuestion + 1)
        }
    }

    function saveHandler(index){
        context.saveHandler(index, currentQuestion, examID)
    }   


    return (
        <>
        <Navbar />
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "95vh"}}>
            {!timer.expired ? <Box sx={{bgcolor: "white", borderRadius: 3, p:3, width: { md: 800}, display: "flex", flexDirection: "column"}}>
             <Typography fontWeight={500} fontSize={20} sx={{textAlign: "left"}}>Q. {currentQuestion+1} {questions[currentQuestion].question}</Typography>
                <FormControl component="fieldset" sx={{my: 2}} >
                    <RadioGroup onChange={(e) => saveHandler(e.target.value)} >
                        {questions[currentQuestion].options.map((option, index) => {
                            return(
                                <FormControlLabel key={index} value={index} control={<Radio />} label={option} />
                            )
                        })}
                    </RadioGroup>
                </FormControl>
                <Grid container rowSpacing={2}>
                    <Grid item xs={12} sm={6} sx={{justifyContent: {xs: "center", sm: "flex-start"}, display: "flex", alignItems: "center"}}>
                        <Chip label={`${timer.minutes} Minutes ${timer.seconds} Seconds`}  />
                    </Grid>
                    <Grid item xs={12} sm={3} sx={{justifyContent: "center", display: "flex"}}>
                        <Button variant="outlined" onClick={moveToPreviousQuestion} >Previous Question</Button>
                    </Grid>
                    <Grid item xs={12} sm={3} sx={{justifyContent: "center", display: "flex"}}>
                        <Button variant="outlined" onClick={moveToNextQuestion} >Next Question</Button>
                    </Grid>
                </Grid>
            </Box> : 
            <Box sx={{bgcolor: "white" , p:4, borderRadius: 2}}>
                <Typography fontSize={20} fontWeight={600}>Exam deadline is over!</Typography>
                <Typography fontSize={20} fontWeight={300}>We'll let you know the results very soon.</Typography>
            </Box>}
        </Box>
        </>
    )
}