import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ContextProvider from "./Contexts/AuthContext";
import About from "./Pages/About";
import Attempt from "./Pages/Attempt";
import Contact from "./Pages/Contact";
import Exam from "./Pages/Exam";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import PhoneAuth from "./Pages/PhoneAuth";
import Profile from "./Pages/Profile";
import Register from "./Pages/Register";
import Result from "./Pages/Result";
import TermsConditions from "./Pages/TermsConditions";

function App() {
  return (
    <ContextProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/phone" element={<PhoneAuth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/exam" element={<Navigate to="/" />} />
        <Route path="/exam/:examID" element={<Exam />} />
        <Route path="/exam/:examID/attempt" element={<Attempt />} />
        <Route path="/exam/:examID/result" element={<Result />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
      </Routes>
    </ContextProvider>
  );
}

export default App;
