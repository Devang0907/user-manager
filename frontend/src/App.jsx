import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from './Pages/Landing';
import NoPage from './Pages/NoPage';
import AddForm from './Pages/AddForm';
import UpdateForm from './Pages/UpdateForm'
import SignIn from './Pages/SignIn';
import Signup from './Pages/SignUp';
import VerifyEmailPage from './Pages/VerifyEmailPage';
import { jwtDecode } from "jwt-decode";
import ChangePassPage from './Pages/ChangePassPage';


function App() {

  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // Convert to milliseconds
    } catch (error) {
      return true; // Invalid token
    }
  };

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token"); // Remove expired token
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/landing" element={<PrivateRoute><Landing /></PrivateRoute>} />
        <Route path="/add" element={<PrivateRoute><AddForm /></PrivateRoute>} />
        <Route path="/update/:id" element={<PrivateRoute><UpdateForm /></PrivateRoute>} />
        <Route path="/changePassword" element={<PrivateRoute><ChangePassPage /></PrivateRoute>} />
        <Route path="/verify/:token" element={<VerifyEmailPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App