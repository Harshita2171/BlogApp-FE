import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './components/Blog';
import CreateBlog from './components/CreateBlog';
import EditBlog from './components/EditBlog';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    }
  }, []);
  return (
    <Router>
      <Navbar userInfo={userInfo} setUserInfo={setUserInfo} />
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/blog/edit/:id" element={<EditBlog />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/blog/:id" element={<Blog />} />
      </Routes>

    </Router>
  );
}

export default App;
