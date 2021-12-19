import { ThemeProvider } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import Theme from "./Theme";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, getDocs, collection, updateDoc } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../Utils/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";

export const contextValues = createContext()

export default function ContextProvider({children}){
    const app = initializeApp(firebaseConfig)
    const auth = getAuth()
    const db = getFirestore()
    const provider = new GoogleAuthProvider()

    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(false)
    const [userData, setUserData] = useState(false)
    const [examsData, setExamsData] = useState()

    let navigate = useNavigate()

    useEffect(() => { 
        async function getUserData(uid){
            const docSnap = await getDoc(doc(db, "Students", uid));
            if (docSnap.exists()) {
                setUserData(docSnap.data())
                if(window.location.pathname == "/register"){
                    navigate("/")
                }
                setLoading(false)
              } else {
                setLoading(false)
                navigate("/register")
              }
        }
        
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user)
                getUserData(user.uid)
                console.log(user)
            } else {
                navigate("/login")   
                setLoading(false)
            }
        })

        getExams()
    }, [])

    function signInWithEmail(email, password){
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigate("/")
            })
            .catch((error) => {
                console.log(error)
            });
    }

    function signInWithGoogle(){
        console.log("ABC")
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                setCurrentUser(user)
                navigate("/")
            }).catch((error) => {
                console.log(error)
            });
    }

    async function registerUser(data){
        try{
            await setDoc(doc(db, "Students", currentUser.uid), {
                firstName: data.firstName,
                lastName: data.lastName,
                emailID : currentUser.email,
                phoneNo: data.phoneNo
            })
            navigate("/")
        }catch(error){
            console.log(error)
        }
          
    }

    async function updateUser(data){
        try{
            await updateDoc(doc(db, "Students", currentUser.uid), {
                firstName: data.firstName,
                lastName: data.lastName,
                emailID : currentUser.email,
                phoneNo: data.phoneNo
              });
            //console.log("Updated")
        }
        catch(error){
            console.log(error)
        }  
    }

    async function getExams(){
        const querySnapshot = await getDocs(collection(db, "Exams"))
        const exams = []
        querySnapshot.forEach((doc) => {
            exams.push({...doc.data(), examID: doc.id})
        })
        setExamsData(exams)
    }

    async function saveHandler(answerIndex, currentQuestion, examID){
        var tempData = {}
        tempData[currentQuestion] = Number(answerIndex)

        try{
            await updateDoc(doc(db, "Exams", examID, "Answersheets" ,currentUser.uid), tempData)
        }catch(error) {
            if(error.code == "not-found"){
                await setDoc(doc(db, "Exams", examID, "Answersheets", currentUser.uid), tempData)
            }
        }   
    }

    async function logOut(){
        signOut(auth).then(() => {
            navigate("/login")
          }).catch((error) => {
            console.log(error)
          });
    }


    const value = {
        signInWithEmail,
        signInWithGoogle,
        currentUser,
        userData,
        examsData,
        registerUser,
        saveHandler,
        updateUser,
        getExams,
        logOut,
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