import { ThemeProvider } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import Theme from "./Theme";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../Utils/firebase";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";

export const contextValues = createContext()

initializeApp(firebaseConfig)
const auth = getAuth()
auth.languageCode = 'en';
const db = getFirestore()


export default function ContextProvider({children}){
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(false)
    const [userData, setUserData] = useState(false)

    let navigate = useNavigate()

    useEffect(() => {   
        async function getUserData(uid){
            const docSnap = await getDoc(doc(db, "Students", uid))
            if (docSnap.exists()) {
                setUserData(docSnap.data())
                setLoading(false)
              } else {
                navigate("/register")
                setLoading(false)
              }
        }

        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user)
                getUserData(user.uid)
            } else {
                navigate("/login")
                setLoading(false)
            }
        })

    }, [currentUser])

    async function registerUser(data){
        try{
            await setDoc(doc(db, "Students", currentUser.uid), {...data, uid: currentUser.uid})
            navigate("/")
        }catch(error){
            console.log(error)
        }
          
    }

    async function updateUser(data){
        try{
            await updateDoc(doc(db, "Students", currentUser.uid), {...data, uid: currentUser.uid});
            //console.log("Updated")
        }
        catch(error){
            console.log(error)
        }  
    }

    async function saveHandler(answerIndex, currentQuestion, examID){
        var tempObj={}
        tempObj[currentQuestion] = answerIndex
        try{
            await setDoc(doc(db, "Exams", examID, "Answersheets", currentUser.uid), {answers: tempObj, userExamStatus: "ongoing"}, { merge: true })
        }catch(error) {
            console.log(error)
        }   
    }

    async function submitExam(examID, points){
        try{
            await updateDoc(doc(db, "Exams", examID, "Answersheets" ,currentUser.uid), {points, userExamStatus: "finished"})
        }catch(error) {
            console.log(error)
        }   
    }

    async function logOut(){
        signOut(auth).then(() => {
            setLoading(true)
            setCurrentUser()
          }).catch((error) => {
            console.log(error)
          });
    }


    const value = {
        setCurrentUser,
        auth,
        db,
        currentUser,
        userData,
        registerUser,
        saveHandler,
        submitExam,
        updateUser,
        logOut,
        setLoading,
        navigate
    }
    return(
        <ThemeProvider theme={Theme}>
            <contextValues.Provider value={value}>
                {loading && <Loading />}
                {!loading && children}
            </contextValues.Provider>
        </ThemeProvider>
    )
}