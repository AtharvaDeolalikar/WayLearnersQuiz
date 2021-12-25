import { Alert, Snackbar, ThemeProvider } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import Theme from "./Theme";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../Utils/firebase";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import Footer from "../Components/Footer";

export const contextValues = createContext()

initializeApp(firebaseConfig)
const auth = getAuth()
auth.languageCode = 'en';
const db = getFirestore()



export default function ContextProvider({children}){
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(false)
    const [userData, setUserData] = useState(false)
    const [alert, setAlert] = useState({variant: "", message: "", show: false})

    let navigate = useNavigate()

    function AlertMessage(){
        function handleClose(){
            setAlert({show: false})
        }
        return (
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={alert.show} autoHideDuration={3000} onClose={handleClose}>
                <Alert variant="filled" onClose={handleClose} severity={alert.variant} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        )
    }

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
        logOut,
        setLoading,
        navigate,
        setAlert
    }
    return(
        <ThemeProvider theme={Theme}>
            <contextValues.Provider value={value}>
                {loading && <Loading />}
                {!loading && children}
                {alert.show && <AlertMessage />}
                {!loading && <Footer />}
            </contextValues.Provider>
        </ThemeProvider>
    )
}