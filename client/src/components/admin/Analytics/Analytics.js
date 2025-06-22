import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts';
import { collection, getDocs,updateDoc,
    doc,
    serverTimestamp } from "firebase/firestore";
import { db } from '../../firebase';
import './Analytics.css'

const Analytics = () => {
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [requestDistributionData, setRequestDistributionData] = useState([]);
  const [notificationsActivityData, setNotificationsActivityData] = useState([]);
  const [topActiveUsers, setTopActiveUsers] = useState([]);
   const [rentalOrderData, setRentalOrderData] = useState([]);

  //const pieColors = ['#4CAF50', '#FF9800', '#2196F3'];
  const pieColors = ['#1976D2', '#FFB300', '#43A047']; // blue, orange, green

  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  useEffect(() => {
    
    const fetchData = async () => {
      try {
       /* const patchMissingCreatedAt = async () => {
            const usersSnapshot = await getDocs(collection(db, "Users"));
            for (const userDoc of usersSnapshot.docs) {
              const data = userDoc.data();
              if (!data.createdAt) {
                await updateDoc(doc(db, "Users", userDoc.id), {
                  createdAt: serverTimestamp(),
                });
                console.log(`Patched user ${userDoc.id}`);
              }
            }
          };
      
          await patchMissingCreatedAt();*/
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const orderSnapshot = await getDocs(collection(db, "order"));
        const userGrowthMap = {};
        let monthlyUserCount = {};
        let developmentRequests = 0;
        let repairRequests = 0;
        let monthlyNotifications = {};
        let userActivityMap = {};
        let monthlyRentalOrders = {};
         

        // Prepare all users for parallel requests
        const userDataList = await Promise.all(
          usersSnapshot.docs.map(async (userDoc) => {
            const userId = userDoc.id;
            const userData = userDoc.data();
            const { firstName, lastName, createdAt } = userData;
            console.log('Processing user:', userId);

            // Process user creation date
            if (createdAt) {
            const createdAtDate = createdAt.toDate();
            
              const month = createdAtDate.toLocaleString('en-US', { month: 'short' });
              console.log(`User createdAt: ${createdAtDate}, Month: ${month}`); // Debugging line

              monthlyUserCount[month] = (monthlyUserCount[month] || 0) + 1;
           
         }

            // Fetch subcollections
            const [devRequestsSnapshot, repairRequestsSnapshot, notificationsSnapshot] = await Promise.all([
              getDocs(collection(db, 'Users', userId, 'RequestsDevelopment')),
              getDocs(collection(db, 'Users', userId, 'requestsRepair')),
              getDocs(collection(db, 'Admins', userId, 'Notifications'))
            ]);

            const devCount = devRequestsSnapshot.size;
            const repairCount = repairRequestsSnapshot.size;
            const totalActivity = devCount + repairCount;

            developmentRequests += devCount;
            repairRequests += repairCount;
          //  userActivityMap[userData.displayName || userId] = (userActivityMap[userData.displayName || userId] || 0) + totalActivity;
          //////////// 
          userActivityMap[userId] = (userActivityMap[userId] || 0) + totalActivity;


            notificationsSnapshot.forEach((notifDoc) => {
                let notifDate = notifDoc.data()
                let notifTimestamp = notifDate?.timestamp;
                if (notifTimestamp) {
                    const notifDate = new Date(notifTimestamp); 
                    console.log('Notification Timestamp:', notifTimestamp, 'Converted to Date:', notifDate);
    
                    const month = notifDate.toLocaleString('en-US', { month: 'short' });
                    console.log('Month:', month);
                    monthlyNotifications[month] = (monthlyNotifications[month] || 0) + 1;
                    console.log('Monthly Notifications:', monthlyNotifications);

                  } else {
                    console.warn(`No valid timestamp for notification ${notifDoc.id}`);
                  }

                //hadiii t3 servertimestamp hna nbedel createat ....
              /*notifDate = notifDate?.createdAt?.toDate?.();
              if (notifDate) {
                const month = notifDate.toLocaleString('default', { month: 'short' });
                monthlyNotifications[month] = (monthlyNotifications[month] || 0) + 1;
              } else {
                console.warn(`No valid createdAt date for notification ${notifDoc.id}`);
              }*/
            });
            console.log("Fetched Notifications:", notificationsSnapshot.size)

            return null;
          })
        );
        console.log("Fetched Users:", usersSnapshot.docs.length);
        
          // Process rental orders
        orderSnapshot.forEach(orderDoc => {
          const data = orderDoc.data();
          const timestamp = typeof data.time === 'string' ? new Date(data.time) : data.time?.toDate?.();
          if (timestamp) {
            const month = timestamp.toLocaleString('en-US', { month: 'short' });
            monthlyRentalOrders[month] = (monthlyRentalOrders[month] || 0) + 1;
          }
        });
        // Process users and count them by month
        /*usersSnapshot.docs.forEach((userDoc) => {
            const data = userDoc.data();
            const createdAt = data.createdAt;
            if (createdAt) {
              const createdAtDate = createdAt.toDate();
              const month = createdAtDate.toLocaleString('default', { month: 'short' });
  
              // Update the count of users for that month
              monthlyUserCount[month] = (monthlyUserCount[month] || 0) + 1;
            }
          });/*

        // Format user growth
       /*  const userGrowth =
         Object.keys(monthlyUserCount).map((month) => ({
            name: month,
            users: monthlyUserCount[month],
          }));
          setUserGrowthData(userGrowth);*/
       const userGrowth = monthOrder
         // .filter(month => monthlyUserCount[month])
          .map(month => ({ name: month, users: monthlyUserCount[month] || 0 }));
        setUserGrowthData(userGrowth);

        // Request distribution
        const requestDistribution = [
          { name: 'Development', value: developmentRequests  },
          { name: 'Repair', value: repairRequests   },
          
          { name: 'Rental', value: orderSnapshot.size  },
        ];
      


        setRequestDistributionData(requestDistribution);


    const notificationsActivity = monthOrder
        //  .filter(month => monthlyNotifications[month])
          .map(month => ({ name: month, notifications: monthlyNotifications[month] || 0 }));
        setNotificationsActivityData(notificationsActivity);

        const rentalOrderChart = monthOrder.map(month => ({
          name: month,
          orders: monthlyRentalOrders[month] || 0
        }));
        setRentalOrderData(rentalOrderChart);

        // Top active users
        const topUsersArray = Object.entries(userActivityMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([userId, requests]) => 
          {
             // Fetch the first name and last name for each user
             const userDoc = usersSnapshot.docs.find(doc => doc.id === userId);
             const userData = userDoc?.data();
             const firstName = userData?.firstName || 'N/A';
             const lastName = userData?.lastName || 'N/A';
             return { name: `${firstName} ${lastName}`, requests };

          }
           );
        setTopActiveUsers(topUsersArray);

      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);
  // to switch to barchart ida kayen frd hana exp: rental brk
        const activeTypes = requestDistributionData.filter(d => d.value > 0);
const usePieChart = activeTypes.length > 1;

  return (
    <div className="p-8 bg-gray.50 text-gray-800 min-h-screen
    overflow-y-scroll pr-4 scrollbar-hide pt-6
    ">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      {/* User Growth */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">User Growth Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#007FFF" />
          </LineChart>
        </ResponsiveContainer>
      </div>
            {/* Rental Orders Over Time */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Rental Orders Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rentalOrderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#FF5722" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Request Distribution */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Request Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          {usePieChart ? (
          <PieChart>
          <Tooltip
      formatter={(value, name, props) => {
        const total = requestDistributionData.reduce((sum, entry) => sum + entry.value, 0);
        const percent = ((value / total) * 100).toFixed(1);
        return [`${value} Requests (${percent}%)`, name];
      }}
    />
            <Pie data={requestDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} 
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {requestDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
          </PieChart>
           ) : (
      <BarChart data={requestDistributionData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#43A047" />
      </BarChart>
    )}
        </ResponsiveContainer>
      </div>

      {/* Notifications Activity */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Notifications Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={notificationsActivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="notifications" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Active Users */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Top Active Users</h2>
        <ul className="space-y-2">
          {topActiveUsers.map((user, index) => (
            <li key={index} className="flex justify-between p-4 bg-gray-100 shadow-sm rounded-lg">
              <span>{user.name}</span>
              <span className="font-semibold">{user.requests} Requests</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
