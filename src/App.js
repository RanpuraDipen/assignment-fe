import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Lists from "./pages/Lists";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Search from "./pages/Search";
import Signup from "./pages/Signup";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/search" replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/search" replace /> : <Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/search" element={<Search />} />
          <Route path="/lists" element={<Lists />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/search" : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;
