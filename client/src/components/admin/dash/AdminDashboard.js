import React, { useEffect, useState } from "react";
import {
  Bell,
  UserPlus,
  ClipboardList,
  BarChart3,
  AlertTriangle,
  PackageSearch
} from "lucide-react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


export default function AdminDashboard() {
  const [adminName, setAdminName] = useState("Admin");
  const [totalUsers, setTotalUsers] = useState(0);
  const [newRequests, setNewRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);

  const [newOrders, setNewOrders] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          const adminDocRef = doc(db, "Admins", currentUser.uid);
          const adminDocSnap = await getDoc(adminDocRef);

          if (adminDocSnap.exists()) {
            const adminData = adminDocSnap.data();
            if (adminData.firstName && adminData.lastName) {
              setAdminName(`${adminData.firstName} ${adminData.lastName}`);
            } else {
              setAdminName("Admin");
            }
          } else {
            setAdminName("Admin");
          }
        }

        // Fetch total users count
        const usersSnap = await getDocs(collection(db, "Users"));
        setTotalUsers(usersSnap.size);

        // Time range for recent requests (last 24 hours)
        const oneDayAgo = new Date();
        // Timestamp.now().toDate();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        let newRequestsCount = 0;
        let newOrdersCount = 0;
        let pendingRequestsCount = 0;
        const recent = [];

        // Iterate through all users
        for (const userDoc of usersSnap.docs) {
          const userId = userDoc.id;
          const userData = userDoc.data();
const userName = userData.firstName && userData.lastName
  ? `${userData.firstName} ${userData.lastName}`
  : "Unknown User";

          // Queries for requests from last 24 hours
          const devQuery = query(
            collection(db, "Users", userId, "RequestsDevelopment"),
            where("timestamp", ">=", oneDayAgo.toISOString())
          );
          const repairQuery = query(
            collection(db, "Users", userId, "RequestsRepair"),
            where("timestamp", ">=", oneDayAgo.toISOString())
          );

          const devSnap = await getDocs(devQuery);
          const repairSnap = await getDocs(repairQuery);

          // Count new requests
          newRequestsCount += devSnap.size + repairSnap.size;

          // Get pending requests
          const pendingDevQuery = query(
            collection(db, "Users", userId, "RequestsDevelopment"),
            where("status", "==", "pending")
          );
          const pendingRepairQuery = query(
            collection(db, "Users", userId, "RequestsRepair"),
            where("status", "==", "pending")
          );
          const [pendingDevSnap, pendingRepairSnap] = await Promise.all([
            getDocs(pendingDevQuery),
            getDocs(pendingRepairQuery),
          ]);
        //  setPendingRequests(pendingDevSnap.size + pendingRepairSnap.size);

   /*       // Get pending requests count (non-real-time)
const pendingDevSnap = await getDocs(pendingDevQuery);
const pendingRepairSnap = await getDocs(pendingRepairQuery);*/

pendingRequestsCount += pendingDevSnap.size + pendingRepairSnap.size
          // Aggregate pending requests count using real-time listeners
         /* onSnapshot(pendingDevQuery, (snapshot) => {
            setPendingRequests((prev) => prev + snapshot.size);
          });

          onSnapshot(pendingRepairQuery, (snapshot) => {
            setPendingRequests((prev) => prev + snapshot.size);
          });*/

          // Add recent activities
          devSnap.forEach((doc) =>{
            const data = doc.data();
            const timestamp = typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp.toDate();
           
            recent.push({
              ...data,
              type: "Development",
              timestamp: timestamp,
              userName: userName,
            })
        });
          repairSnap.forEach((doc) =>{
            const data = doc.data();
            const timestamp = typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp.toDate();
          
            recent.push({
              ...data,
              type: "Repair",
              timestamp: timestamp,
              userName: userName,
            })
        });
        }
        setPendingRequests(pendingRequestsCount);

                // --- Rental Orders ---
        const orderQuery = query(
          collection(db, "order"),
          where("timestamp", ">=", oneDayAgo.toISOString())
        );
        const orderSnap = await getDocs(orderQuery);
        newOrdersCount += orderSnap.size;

        // const pendingOrderQuery = query(
        //   collection(db, "order"),
        //   where("status", "==", "pending")
        // );
        // const pendingOrderSnap = await getDocs(pendingOrderQuery);
        // pendingRequestsCount += pendingOrderSnap.size;

        orderSnap.forEach(doc => {
          const data = doc.data();
          const timestamp = typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp.toDate();
          recent.push({ ...data, type: "Rental", timestamp, userName: data.fullName || "Unknown User" });
        });
         setNewOrders(newOrdersCount);
        // Set the new requests count
        setNewRequests(newRequestsCount);
        // Sort and show the most recent activities
        recent.sort((a, b) => b.timestamp - a.timestamp);
        setRecentActivities(recent.slice(0, 3));
        
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    fetchDashboardData();
  }, []);

  
  const Card = ({ title, value, Icon, color }) => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
      setHasMounted(true);
    }, []);
   
   {/* <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
    > 
      <div className="flex items-center mb-2">
        <Icon className={`h-5 w-5 mr-2 ${color}`} />
        <h2 className="text-md font-medium text-gray-700">{title}</h2>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </motion.div>*/}
    const content = (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
        <div className="flex items-center mb-2">
          <Icon className={`h-5 w-5 mr-2 ${color}`} />
          <h2 className="text-md font-medium text-gray-700">{title}</h2>
        </div>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      );
      return hasMounted ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {content}
        </motion.div>
      ) : (
        content
      );
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-8">
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6"
    >
      <h1 className="text-2xl font-semibold text-gray-800">Welcome back, {adminName}!</h1>
      <p className="text-gray-500">Here’s a quick summary of today’s activity.</p>
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <Card title="Total Users" value={totalUsers} Icon={UserPlus} color="text-blue-600" />
      <Card title="New Requests" value={newRequests} Icon={ClipboardList} color="text-purple-600" />
       <Card title="New Orders" value={newOrders} Icon={PackageSearch} color="text-green-600" />
      <Card title="Pending Requests" value={pendingRequests} Icon={AlertTriangle} color="text-yellow-600" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow mb-6"
    >
      <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
        <ClipboardList className="mr-2" /> Recent Activity
      </h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        {recentActivities.map((item, index) => (
          <li key={index}>
            {item.userName} submitted a <strong>{item.type}</strong> request at{" "}
            {item.timestamp?.toLocaleString()}
          </li>
        ))}
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow mb-6"
    >
      <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
        ⚡ Quick Actions
      </h2>
      <div className="flex flex-wrap gap-4">
        <button onClick={() => navigate("/AdminRequests")} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
          <ClipboardList className="mr-2 h-5 w-5" /> View All Requests
        </button>
        <button onClick={() => navigate("/AdminNotifications")} className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition flex items-center">
          <Bell className="mr-2 h-5 w-5" /> Notifications
        </button>
        <button onClick={() => navigate("/analytics")} className="px-4 py-2 bg-rose-300 text-black rounded-lg hover:bg-rose-500 transition flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" /> Analytics
        </button>
        <button onClick={() => navigate("/RentalDashboard")} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition flex items-center">
          <UserPlus className="mr-2 h-5 w-5" /> Rental Dashboard
        </button>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow"
    >
      <h2 className="text-lg font-semibold mb-3 text-yellow-600 flex items-center">
        <AlertTriangle className="mr-2" /> Alerts
      </h2>
      <ul className="list-disc pl-5 text-gray-700 space-y-2">
        <li>
          {pendingRequests > 3
            ? `${pendingRequests} requests pending for over 2 days`
            : "No critical delays"}
        </li>
        <li>Check payment integration status</li>
      </ul>
    </motion.div>
  </div>
);
}
    
  {/*}  <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h2 className="text-lg font-semibold mb-2">
          Welcome back, {adminName}!
        </h2>
        <p className="text-gray-500">
          Here’s a quick summary of today’s activity.
        </p>
        </motion.div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Total Users</h2>
        <p className="text-2xl font-bold">{totalUsers}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">New Requests</h2>
        <p className="text-2xl font-bold">{newRequests}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Pending Requests</h2>
        <p className="text-2xl font-bold">{pendingRequests}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <ul className="list-disc pl-4 space-y-2">
          {recentActivities.map((item, index) => (
            <li key={index}>
              {item.userName || "Unknown User"} submitted a {item.type} request{" "}
              {item.timestamp?.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button 
          onClick={() => navigate("/AdminRequests")} 
          className="px-4 py-2 bg-gray-200 rounded flex items-center">
            <ClipboardList className="mr-2 h-4 w-4" />
            View All Requests
          </button>
          <button 
          onClick={() => navigate("/AdminNotifications")} 
          className="px-4 py-2 bg-gray-200 rounded flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </button>
          <button 
          onClick={() => navigate("/analytics")} 
          className="px-4 py-2 bg-gray-200 rounded flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Admin
          </button>

        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2">
          <AlertTriangle className="inline mr-2 text-yellow-500" /> Alerts
        </h2>
        <ul className="list-disc pl-4 space-y-2">
          <li>
            {pendingRequests > 3
              ? `${pendingRequests} requests pending for over 2 days`
              : "No critical delays"}
          </li>
          <li>Check payment integration status</li>
        </ul>
      </div>
   {/* </div>
    
  );
}*/}




/*import React, { useEffect, useState } from "react";
import {
  Bell,
  UserPlus,
  ClipboardList,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  Timestamp,
  limit,
  onSnapshot
} from "firebase/firestore";
import { db } from "../../firebase";
import { getDatabase, ref, get as getRT } from "firebase/database";
import { getAuth } from "firebase/auth";

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState("Admin");
  const [totalUsers, setTotalUsers] = useState(0);
  const [newRequests, setNewRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            const adminDocRef = doc(db, "Admins", currentUser.uid);
            const adminDocSnap = await getDoc(adminDocRef);
  
            if (adminDocSnap.exists()) {
              const adminData = adminDocSnap.data();
              // Ensure we get first and last name
              if (adminData.firstName && adminData.lastName) {
                setAdminName(`${adminData.firstName} ${adminData.lastName}`);
              } else {
                setAdminName("Admin");
              }
            } else {
              setAdminName("Admin");
            }
        }
// total t3 users
        const usersSnap = await getDocs(collection(db, "Users"));
        setTotalUsers(usersSnap.size);
// time range t4 recent requests (b3d 24h mithel)
        const oneDayAgo = Timestamp.now().toDate();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        let newRequestsCount = 0;
        let pendingRequestsCount = 0;
        const recent = [];
        // bah nejbed requests loop
        for (const userDoc of usersSnap.docs) {
            const userId = userDoc.id;

        const devQuery = query(
          collection(db, "Users", userId, "RequestsDevelopment"),
          where("timestamp", ">=", Timestamp.fromDate(oneDayAgo))
        );
        const repairQuery = query(
          collection(db, "Users", userId, "requestsRepair"),
          where("timestamp", ">=", Timestamp.fromDate(oneDayAgo))
        );
        const devSnap = await getDocs(devQuery);
        const repairSnap = await getDocs(repairQuery);
       // setNewRequests(devSnap.size + repairSnap.size);
        newRequestsCount += devSnap.size + repairSnap.size;
// pending
        const pendingDevQuery = query(
          collection(db, "Users", userId, "RequestsDevelopment"),
          where("status", "==", "pending"),
         // limit(10) // limit to a smaller number of documents
        );
        const pendingRepairQuery = query(
          collection(db, "Users", userId, "requestsRepair"),
          where("status", "==", "pending"),
        //  limit(10) // limit to a smaller number of documents
        );
        // Fetch both queries in parallel
         // Real-time listeners
    const unsubscribeDev = onSnapshot(pendingDevQuery, (snapshot) => {
        setPendingRequests((prev) => prev + snapshot.size); // Increment based on the latest data
      });
  
      const unsubscribeRepair = onSnapshot(pendingRepairQuery, (snapshot) => {
        setPendingRequests((prev) => prev + snapshot.size); // Increment based on the latest data
      });
      
  
      //  const pendingDevSnap = await getDocs(pendingDevQuery);
      //  const pendingRepairSnap = await getDocs(pendingRepairQuery);
       // setPendingRequests(pendingDevSnap.size + pendingRepairSnap.size);
        pendingRequestsCount += pendingDevSnap.size + pendingRepairSnap.size;


        devSnap.forEach((doc) =>
          recent.push({ ...doc.data(), type: "Development", 
           // userName: userDoc.data().userName 
        })
        );
        repairSnap.forEach((doc) =>
          recent.push({ ...doc.data(), type: "Repair",
           //  userName: userDoc.data().userName 
            })
        );
    }
        recent.sort(
          (a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()
        );
        // Take the latest 3 requests
        setRecentActivities(recent.slice(0, 3));
        // Set the new and pending requests counts
        setNewRequests(newRequestsCount);
        setPendingRequests(pendingRequestsCount);
    
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };
// Cleanup the listeners when the component unmounts
return () => { 
    fetchDashboardData();
    unsubscribeDev();
    unsubscribeRepair();
  };
   
  }, []);

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2">
          Welcome back, {adminName}!
        </h2>
        <p className="text-gray-500">
          Here’s a quick summary of today’s activity.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Total Users</h2>
        <p className="text-2xl font-bold">{totalUsers}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">New Requests</h2>
        <p className="text-2xl font-bold">{newRequests}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Pending Requests</h2>
        <p className="text-2xl font-bold">{pendingRequests}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <ul className="list-disc pl-4 space-y-2">
          {recentActivities.map((item, index) => (
            <li key={index}>
              {item.userName || "Unknown User"} submitted a {item.type} request{" "}
              {item.timestamp?.toDate().toLocaleString()}
            </li>
          ))}
        </ul>
      </div> 

  

      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded flex items-center">
            <ClipboardList className="mr-2 h-4 w-4" />
            View All Requests
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Admin
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2">
          <AlertTriangle className="inline mr-2 text-yellow-500" /> Alerts
        </h2>
        <ul className="list-disc pl-4 space-y-2">
          <li>
            {pendingRequests > 3
              ? `${pendingRequests} requests pending for over 2 days`
              : "No critical delays"}
          </li>
          <li>Check payment integration status</li>
        </ul>
      </div>
    </div>
  );
}*/










/*
import React, { useEffect, useState } from "react";
import { Bell, UserPlus, ClipboardList, BarChart3, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from '../../firebase'; // adjust the path if necessary
import { getDatabase, ref, get as getRT } from "firebase/database";
import { getAuth } from "firebase/auth";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [newRequests, setNewRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [adminName, setAdminName] = useState("Admin");

 
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            const dbRT = getDatabase();
            const adminRef = ref(dbRT, `Admins/${currentUser.uid}`);
            const snapshot = await getRT(adminRef);
            if (snapshot.exists()) {
              const data = snapshot.val();
              setAdminName(`${data.firstName} ${data.lastName}`);
            }
          }
        const usersSnap = await getDocs(collection(db, "Users"));
        setTotalUsers(usersSnap.size);

        const oneDayAgo = Timestamp.now().toDate();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const devQuery = query(
          collection(db, "RequestsDevelopment"),
          where("timestamp", ">=", Timestamp.fromDate(oneDayAgo))
        );
        const repairQuery = query(
          collection(db, "requestsRepair"),
          where("timestamp", ">=", Timestamp.fromDate(oneDayAgo))
        );
        const devSnap = await getDocs(devQuery);
        const repairSnap = await getDocs(repairQuery);
        setNewRequests(devSnap.size + repairSnap.size);

        const pendingDevQuery = query(
          collection(db, "RequestsDevelopment"),
          where("status", "==", "pending")
        );
        const pendingRepairQuery = query(
          collection(db, "requestsRepair"),
          where("status", "==", "pending")
        );
        const pendingDevSnap = await getDocs(pendingDevQuery);
        const pendingRepairSnap = await getDocs(pendingRepairQuery);
        setPendingRequests(pendingDevSnap.size + pendingRepairSnap.size);

        const recent = [];
        devSnap.forEach((doc) => recent.push({ ...doc.data(), type: "Development" }));
        repairSnap.forEach((doc) => recent.push({ ...doc.data(), type: "Repair" }));
        recent.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());
        setRecentActivities(recent.slice(0, 3));
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2">Welcome back, {adminName}!</h2>
        <p className="text-gray-500">Here’s a quick summary of today’s activity.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Total Users</h2>
        <p className="text-2xl font-bold">{totalUsers}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">New Requests</h2>
        <p className="text-2xl font-bold">{newRequests}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Pending Requests</h2>
        <p className="text-2xl font-bold">{pendingRequests}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <ul className="list-disc pl-4 space-y-2">
          {recentActivities.map((item, index) => (
            <li key={index}>
              {item.userName || "Unknown User"} submitted a {item.type} request {item.timestamp?.toDate().toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">User Growth</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[{ month: "Jan", users: 100 }, { month: "Feb", users: 150 }]}> 
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Request Trend</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ month: "Jan", requests: 20 }, { month: "Feb", requests: 30 }]}> 
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requests" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded flex items-center"><ClipboardList className="mr-2 h-4 w-4" />View All Requests</button>
          <button className="px-4 py-2 bg-gray-200 rounded flex items-center"><Bell className="mr-2 h-4 w-4" />Notifications</button>
          <button className="px-4 py-2 bg-gray-200 rounded flex items-center"><UserPlus className="mr-2 h-4 w-4" />Add Admin</button>
          <button className="px-4 py-2 bg-gray-200 rounded flex items-center"><BarChart3 className="mr-2 h-4 w-4" />Analytics</button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2"><AlertTriangle className="inline mr-2 text-yellow-500" /> Alerts</h2>
        <ul className="list-disc pl-4 space-y-2">
          <li>{pendingRequests > 3 ? `${pendingRequests} requests pending for over 2 days` : 'No critical delays'}</li>
          <li>Check payment integration status</li>
        </ul>
      </div>
    </div>
  );
} */