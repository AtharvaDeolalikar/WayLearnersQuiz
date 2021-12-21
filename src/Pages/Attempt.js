import { Box, Button, Chip, CircularProgress, FormControl, FormControlLabel, Input, Grid, Radio, RadioGroup, Typography, FormLabel } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { contextValues } from "../Contexts/AuthContext";
import Timer from "../Timer";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Navbar from "../Components/Navbar";

export default function Attempt(){
    const {examID} = useParams()
    const context = useContext(contextValues)
    const formRef = useRef()
    //let params = (new URL(document.location)).searchParams;

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [questions, setQuestions] = useState()
    const [timer, setTimer] = useState()
    const [points, setPoints] = useState()
    const [solvedAnswers, setSolvedAnswers] = useState(false)
    const [selectedOption, setSelectedOption] = useState("")
    let _points = 600
    
    useEffect(() => {
        var exam = context.examsData.find(exam => exam.examID === examID)
        setQuestions(exam.questions)

        async function getAnswers(){
            const answers = await getDoc(doc(getFirestore(), "Exams", examID, "Answersheets", context.currentUser.uid))
            setSolvedAnswers(answers.data())
        }
        
        //getAnswers()

        function decrementPoints(){
            _points = _points - 1
            setPoints(_points)
        }

        const pointsInterval = setInterval(decrementPoints, 200)

        var deadline = new Date("Dec 22, 2021 03:50:30 GMT+0530").getTime()
        var current = new Date().getTime()
        const interval = setInterval(function(){
            current = current + 1000
            setTimer(Timer(deadline, current))
        }, 1000)

        return () => {
            clearInterval(interval)
            clearInterval(pointsInterval)
        }

    }, [currentQuestion])

    if(!questions || !timer){
        return (
            <CircularProgress />
        )
    }

    function moveToNextQuestion(e){
        e.preventDefault()
        if(currentQuestion + 1 === questions.length){
            return
        }else{
            setSelectedOption("")
            setCurrentQuestion(currentQuestion + 1)
        }
    }

    function makeChoice(index){
        context.saveHandler(index, currentQuestion, examID)
        setSelectedOption(index)
        //setOption(false)
    }   

    


    return (
        <>
        <Navbar />
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "95vh"}}>
            {!timer.expired ? 
            <Box sx={{bgcolor: "white", borderRadius: 3, p:3, width: { md: 800}, display: "flex", flexDirection: "column"}} component="form" onSubmit={moveToNextQuestion}>
                <Box sx={{textAlign: "left", mb: 1}}>
                    <Chip label={`Question ${Number(currentQuestion)+1}/20`} color="primary"/>
                </Box>
                <Typography fontWeight={500} fontSize={20} sx={{textAlign: "left"}} variant="h3">
                    {questions[currentQuestion].question}
                </Typography>
                <FormControl component="fieldset" sx={{my: 2}} >
                    <RadioGroup>
                        {questions[currentQuestion].options.map((option, index) => {
                            return(
                                <FormControlLabel checked={Number(index) === selectedOption} onChange={(e) => makeChoice(Number(e.target.value))} key={index} value={index} control={<Radio />} label={option} />
                            )
                        })}
                        <FormLabel label="ABC">
                            <Input type="radio"/>
                        </FormLabel>    
                    </RadioGroup>
                </FormControl>
                <Grid container rowSpacing={2}>
                    <Grid item xs={12} sm={6} sx={{justifyContent: {xs: "center", sm: "flex-start"}, display: "flex", alignItems: "center"}}>
                        <Chip label={`${timer.minutes} Minutes ${timer.seconds} Seconds`}  />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{justifyContent: {xs: "center", sm: "flex-end"}, display: "flex"}}>
                        <Button variant="outlined" type="submit" >Next Question</Button>
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