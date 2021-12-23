import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ContextProvider from './Contexts/AuthContext';
import Attempt from './Pages/Attempt';
import Exam from './Pages/Exam';
import Home from './Pages/Home';
import Login from './Pages/Login';
import PhoneAuth from './Pages/PhoneAuth';
import Profile from './Pages/Profile';
import Register from './Pages/Register';
import Temp from './Pages/Temp';


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
        <Route path="/profile" element={<Profile />} />
        <Route path="/temp" element={<Temp />} />
      </Routes>
    </ContextProvider>
  );
}

export default App;
