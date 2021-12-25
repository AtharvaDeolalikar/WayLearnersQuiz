import { Box, Button, Chip, CircularProgress, FormControlLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { contextValues } from "../Contexts/AuthContext";
import Timer from "../Timer";
import Navbar from "../Components/Navbar";
import { collection, doc, documentId, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

let startTime, endTime, currentTime

export default function Attempt(){
    const {examID} = useParams()
    const context = useContext(contextValues)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [submitButton, showSubmitButton] = useState(false)
    const [userExamStatus, setUserExamStatus] = useState()
    const [exam, setExam] = useState()
    const [timer, setTimer] = useState()
    const [selectedOption, setSelectedOption] = useState("")     
    
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
                    context.navigate(`/exam/${examID}/`)
                }
            })            
        }
        
        async function getExamStatus(){
            const answers = await getDoc(doc(context.db, "Exams", examID, "Answersheets", context.currentUser.uid))
            var tempData = answers.data()
            if(tempData && tempData.userExamStatus === "finished"){
                setUserExamStatus("finished")
            }else return null
        }

        getExam()
        getExamStatus()

        const interval = setInterval(function(){
            currentTime = currentTime + 1000
            setTimer(Timer(endTime, currentTime))
        }, 1000)

        return () => {
            clearInterval(interval)
        }

    }, [])


    if(!exam || !timer){
        return (
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "99vh"}}>
                <CircularProgress />
            </Box>
        )
    }

    async function getAttemptedAnswer(questionIndex){
        if(examID !== "demo"){
            try{
                const answers = await getDoc(doc(context.db, "Exams", examID, "Answersheets", context.currentUser.uid))
                var tempData = answers.data()
                if(tempData && tempData.answers[questionIndex]){
                    return tempData.answers[questionIndex]
                }else return null
            }catch(error){
                console.log(error)
            }
        }else return null        
    }
    

    async function moveToNextQuestion(){
        if(currentQuestion + 1 === exam.questions.length){
            return
        }else{
            if(currentQuestion + 2 === exam.questions.length){
                showSubmitButton(true)
            }
            setSelectedOption("")
            setCurrentQuestion(currentQuestion + 1)
            var option = await getAttemptedAnswer(currentQuestion + 1)
            setSelectedOption(option)
            if(examID !== "demo"){
                try{
                    await setDoc(doc(context.db, "Exams", examID, "Answersheets", context.currentUser.uid), {lastAttemptedQuestion: currentQuestion}, { merge: true })
                }catch(error) {
                    console.log(error)
                }
            }
        }
    }


    async function moveToPreviousQuestion(){
        if(currentQuestion === 0){
           return 
        }else{
            setSelectedOption("")
            setCurrentQuestion(currentQuestion - 1)
            var option = await getAttemptedAnswer(currentQuestion - 1)
            setSelectedOption(option)
            if(examID !== "demo"){
                try{
                    await setDoc(doc(context.db, "Exams", examID, "Answersheets", context.currentUser.uid), {lastAttemptedQuestion: currentQuestion}, { merge: true })
                }catch(error) {
                    console.log(error)
                }
            }
        }
    }


    async function submitExam(){
        if(examID !== "demo"){
            try{
                await updateDoc(doc(context.db, "Exams", examID, "Answersheets", context.currentUser.uid), {points: (endTime - new Date().getTime()), submittedAt: new Date(), userExamStatus: "finished"})
            }catch(error) {
                console.log(error)
            }   
        } 
        setUserExamStatus("finished")  
    }



    function setChoice(index){
        if(examID !== "demo"){
                var tempObj={}
                tempObj[currentQuestion] = index
                try{
                    setDoc(doc(context.db, "Exams", examID, "Answersheets", context.currentUser.uid), {answers: tempObj, userExamStatus: "ongoing"}, { merge: true })
                }catch(error) {
                    console.log(error)
                }
            }
        setSelectedOption(index)
    }

    if(userExamStatus === "finished"){
        return(
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "95vh"}}>
                <Box sx={{bgcolor: "white", borderRadius: 3, p:3, m:2, width: { md: 800}, display: "flex", flexDirection: "column"}} >
                    <Typography fontSize={20} fontWeight={600}>Thank you for attempting this exam!</Typography>
                    <Typography fontSize={20} fontWeight={300} mt={1}>We'll let you know the results very soon.</Typography>
                    <Box mt={2}>
                        <Button onClick={() => context.navigate("/")}>Home</Button>
                    </Box>
                </Box>
            </Box>
        )
    }


    return (
        <>
        <Navbar />
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center",minHeight: "99vh", mt:{xs:5, md:0}}}>
            {!timer.error ? 
            <Box sx={{bgcolor: "white", borderRadius: 3, p:3,m:2, width: { md: 800}, display: "flex", flexDirection: "column"}} >
                <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
                    <Chip label={`Question ${Number(currentQuestion) + 1}/20`} />
                    <Chip label={`${timer.minutes} Minutes ${timer.seconds} Seconds`} color="primary" /> 
                </Box>
                <Typography fontWeight={500} fontSize={20} sx={{textAlign: "left"}} variant="h3">
                    {exam.questions[currentQuestion].question}
                </Typography>
                
                <RadioGroup sx={{my: 2, textAlign: "left"}}>
                    {exam.questions[currentQuestion].options.map((option, index) => {
                        return(
                            <FormControlLabel checked={index === selectedOption} onChange={(e) => setChoice(Number(e.target.value))} key={index} value={index} control={<Radio />} label={option} />
                        )
                    })}  
                </RadioGroup>
                
                <Grid container rowSpacing={2}>
                    {/* <Grid item xs={12} sm={4} sx={{justifyContent: {xs: "center", sm: "flex-start"}, display: "flex", alignItems: "center"}}>
                        <Chip label={`${timer.minutes} Minutes ${timer.seconds} Seconds`}  />
                    </Grid> */}
                    <Grid item xs={12} sx={{justifyContent: {xs: "center", sm: "flex-end"}, flexWrap: {xs: "wrap"}, flexDirection: {xs: "column", sm: "row"} , display: "flex"}}>
                        <Button variant="outlined" sx={{m:1}} onClick={moveToPreviousQuestion} disabled={currentQuestion === 0}>Previous Question</Button>
                        <Button variant="outlined" sx={{m:1}} onClick={moveToNextQuestion} disabled={currentQuestion + 1 === exam.questions.length}>Next Question</Button>
                        {submitButton && <Button variant="contained" onClick={submitExam} sx={{m:1}} >Submit</Button>}
                    </Grid>
                </Grid>
            </Box> : 
            <Box sx={{bgcolor: "white" , p:4, borderRadius: 2}}>
                <Typography fontSize={20} fontWeight={600}>Exam deadline is over!</Typography>
                <Typography fontSize={20} fontWeight={300} mt={1}>We'll let you the know the results very soon</Typography>
                <Box mt={2}>
                    <Button onClick={() => context.navigate("/")}>Home</Button>
                </Box>
            </Box>}
        </Box>
        </>
    )
}