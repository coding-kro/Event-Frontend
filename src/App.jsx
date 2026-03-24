import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from '../src/pages/Home';
import AdminDashboard from '../src/pages/AdminDashboard';
import EventDetail from '../src/pages/EventDetail';
import Login from '../src/pages/Login';
import PaymentFailed from '../src/pages/PaymentFailed';
import PaymentSuccess from '../src/pages/PaymentSuccess';
import Register from '../src/pages/Register';
import UserDashboard from '../src/pages/UserDashboard';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
            <Route
              path="*"
              element={
                <h1 className="text-3xl font-bold text-center mt-20">
                  404 - Page Not Found
                </h1>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
