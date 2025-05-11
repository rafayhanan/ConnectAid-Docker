import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import DonationCallsList from './pages/DonationCallList';
import MainLayout from './layouts/MainLayout';
import AddDonationCall from './pages/AddDonationCall';
import UserContributions from './pages/UserContributions';
import DonationAppealsDashboard from './pages/DonationAppealsDashboard';
import SingleDonation from "./pages/SingleDonation";
import EditProfile from './pages/EditProfile';
import EditDonationAppeal from './pages/EditDonationAppeal';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<><NavBar /><Home /></>} />
        <Route path="/login" element={<><NavBar /><Login /></>} />
        <Route path="/signup" element={<><NavBar /><SignUp /></>} />
        <Route path="/donation-calls/:id" element={
          <MainLayout>
            <SingleDonation />
          </MainLayout>
        } />

        {/* Protected routes */}
        <Route path="/main" element={
          <ProtectedRoute>
            <MainLayout>
              <DonationCallsList />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/main/add-donation" element={
          <ProtectedRoute>
            <MainLayout>
              <AddDonationCall />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/main/my-contributions" element={
          <ProtectedRoute>
            <MainLayout>
              <UserContributions />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/main/my-appeals" element={
          <ProtectedRoute>
            <MainLayout>
              <DonationAppealsDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/main/donation-calls/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <SingleDonation />
              </MainLayout>
            </ProtectedRoute>
          } />


          <Route path="/main/edit-profile" element={
            <ProtectedRoute>
              <MainLayout>
                <EditProfile/>
              </MainLayout>
            </ProtectedRoute>
            }/>

          <Route path="/main/edit-appeal/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <EditDonationAppeal/>
              </MainLayout>
            </ProtectedRoute>
          }
          />

    
      </Routes>
    </Router>
  );
}

export default App;
