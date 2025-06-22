import React, { useState, useEffect, useMemo } from 'react';

import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';

import Services from './components/pages/Services';

import AboutUs from './components/pages/About-us';
import CantectUs from './components/pages/cantact-us';
import LogIn from './components/pages/login/Log-in';
import SignUp from './components/pages/login/Sign-up';


import WebsiteDevelopmentRequest from "./components/pages/WebsiteDevelopmentRequest";
import RentalServiceRequest from "./components/pages/RentalServiceRequest";
import RepairServiceRequest from "./components/pages/RepairServiceRequest";


import Cover from '../src/components/profile/Cover'
import Main from '../src/components/profile/Main'

import ProfilePage from './components/profile/profile'
import { ToastContainer } from 'react-toastify';
import ProductInfo from './components/pages/productInfo/ProductInfo';
import ScrollTop from './components/scrollTop/ScrollTop';
import CartPage from './components/pages/cart/CartPage';
import AllProduct from './components/pages/allProduct/AllProduct';

import AdminNotificationsPage from './components/admin/Notifications/AdminNotificationsPage';
import Notifications from './components/profile/Content/Notifications';
import AccountPage from './components/admin/Account/AccountPage';

import AdminSettingsPage from './components/admin/Settings/AdminSettingsPage';
import {  onAuthStateChanged } from "firebase/auth";
import {  doc, getDoc } from "firebase/firestore";
import Sidebar from './components/admin/Sidebar';
// Firebase setup
import { app, auth, db } from "./components/firebase"; 
import AdminRequestsPage from './components/admin/AdminRequestsPage';
import RentalDashboard from './components/admin/rentalDashboard/rentalDashboard';
import AddProductPage from './components/admin/rentalDashboard/AddProductPage';
import UpdateProductPage from './components/admin/rentalDashboard/UpdateProductPage';
import { MyProvider } from './context/myContext';
import { ProtectedRouteForAdmin } from './protectedRoute/ProtectedRouteForAdmin';
import MyState from './context/myState';
import CategoryPage from './components/pages/category/CategoryPage';


import Completion from './Payment/Completion';
import PaymentPage from './Payment/paymentFirstPage';
import Payment from './Payment/Payment';
//import Users from './components/admin/Users'
import Users from './components/admin/Users/Users'
import UsersPage from './components/admin/Users/UsersPage'
import Analytics from './components/admin/Analytics/Analytics';
import AnalyticsPage from './components/admin/Analytics/AnalyticsPage'
import AdminDashboard from './components/admin/dash/AdminDashboard';
import AdminDashboardPage from './components/admin/dash/AdminDashboardPage'

// import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // To prevent flickering on first load

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No user authenticated.");
        setIsAdmin(false);
        setLoading(false);
        return; 
      }
        try{
        // Check if the user is in the 'Admins' collection
        const adminRef = doc(db, "Admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          setIsAdmin(true);
          localStorage.setItem("isAdmin", "true"); // Save admin status
        } else {
          setIsAdmin(false);
          localStorage.removeItem("isAdmin");
        }
      } catch (error)  {
        console.error("Error fetching admin status:", error);
        setIsAdmin(false);
       // localStorage.removeItem("isAdmin");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);
  
  if (loading) {
    return (
     <div className="h-screen flex items-center justify-center text-xl">Loading...</div>
  );
}
  return (
    <MyProvider>
      
    <Router>
      {isAdmin ? (
      // Admin Panel (Only Admin Pages & Sidebar)
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-7">
            <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
          <Routes>
            <Route path="/AdminRequests" element={<AdminRequestsPage />} />
            <Route path="/AdminNotifications" element={<AdminNotificationsPage />} />
            <Route path="/AdminAccountSettings" element={<AdminSettingsPage />} />
           {/* <Route path='/' element={<Home />} /> */}
            <Route path='/Account' element={<AccountPage />} />
            <Route path='/Users' element={<UsersPage />} />
            <Route path='/analytics' element={<AnalyticsPage />} />
            <Route path='/AdminDashboard' element={<AdminDashboardPage />} />

            
          <Route path="/RentalDashboard" element={
            //<ProtectedRouteForAdmin>
              <RentalDashboard />
            //</ProtectedRouteForAdmin>
            
            } />
          <Route path="/addproductPage" element={
            //<ProtectedRouteForAdmin>
              <AddProductPage />
            //</ProtectedRouteForAdmin>
            } />
          <Route path="/updateproductPage/:id" element={
            //<ProtectedRouteForAdmin>
              <UpdateProductPage />
            //</ProtectedRouteForAdmin>
            } />

          </Routes>
          <ToastContainer />
        </div>
      </div>
    ) : (
       // Public Website (Only User Pages & Navbar)
      <div>
      <Navbar />
      <ScrollTop />
      
      <Routes>
      <Route path='/' element={<Home />} />
        
        <Route path='/services' element={<Services />} />

        <Route path="/request-website-development" element={<WebsiteDevelopmentRequest />} />
        <Route path="/request-rental-service" element={<RentalServiceRequest />} />
        <Route path="/request-repair-service" element={<RepairServiceRequest />} />


        <Route path='/about-us' element={<AboutUs />} />
        {/*<Route path='/AboutUs' element={<AboutUs />} />*/}
        
        <Route path='/cantect-us' element={<CantectUs />} />
        <Route path='/log-in' element={<LogIn />} />
        <Route path='/sign-up' element={<SignUp />} />



        <Route path="/profile" element={<ProfilePage />} />
        
        <Route path="/" element={<><Cover /><Main /></>} />

        <Route path="/Notifications" element={<Notifications />} />


        <Route path="/PaymentPage" element={<PaymentPage />} />
        <Route path="/Completion" element={<Completion />} />
        <Route path="/Payment" element={<Payment/>}/>

        <Route path="/productinfo/:id" element={<ProductInfo />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/allproduct" element={<AllProduct />} />
        <Route path="/category/:categoryname" element={<CategoryPage />} />


 
        
      </Routes> 
      </div>
    )}
     <ToastContainer /> 
    </Router>
    </MyProvider>
  );
}

export default App;
