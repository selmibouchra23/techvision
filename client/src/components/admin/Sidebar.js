import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Ensure correct path
import { signOut } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore"; 
import {
    FiMenu,
    FiHome,
    FiInbox,
    FiUser,
    FiCalendar,
    FiBarChart2,
    FiFolder,
    FiSettings,
    FiList,
    FiLogOut, 
    FiBell,
    FiUsers,
    FiUserCheck
} from "react-icons/fi";
import notificationSound from '../../assets/notification.mp3'

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [previousUnread, setPreviousUnread] = useState(0);

    const showSystemNotification = (notification) => {
        if (!('Notification' in window)) {
          console.log('Browser does not support notifications.')
          return
        }
    
        if (Notification.permission === 'granted') {
          const systemNotification = new Notification('New Notification', {
            body: notification.message,
            // icon: "/logo192.png", // Replace with your site logo
          })
    
          //  Redirect to Notifications.jsx when clicked
          systemNotification.onclick = () => {
            window.open('/AdminNotifications', '_blank') // Opens in a new tab
          }
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              showSystemNotification(notification)
            }
          })
        }
      }

     //  If user is an admin and visits "/", redirect him to "/dashboard"
     useEffect(() => {
        if (localStorage.getItem("isAdmin") === "true" && location.pathname === "/") {
            navigate("/AdminDashboard");
        }
    }, [location, navigate]);

    // Collapse sidebar by default on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch Unread Notifications Count
    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const notificationsRef = collection(db, "Admins", userId, "Notifications");
        const q = query(notificationsRef, where("read", "==", false)); // Only unread notifications

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newUnreadCount = snapshot.size;
           // setUnreadCount(snapshot.size); // Update unread count
         // Play sound only if there is a new notification
    if (newUnreadCount > previousUnread) {
        const newNotification = snapshot.docs[0]?.data(); //Get the latest notification

        if (newNotification) {
        const audio = new Audio(notificationSound)
                audio.play().catch(error => console.log('Audio play blocked:', error))
                ;
                // hna knt dayra newUnreadCount ye3ni message t3 notif maybanch
                showSystemNotification(newNotification)
      } }
  
      setUnreadCount(newUnreadCount);
      setPreviousUnread(newUnreadCount);
        
        });

        return () => unsubscribe();
    }, [previousUnread]);

    // Logout Function
    const handleLogout = async () => {
        try {
            await signOut(auth); // Logout from Firebase
            localStorage.removeItem("isAdmin"); // Remove admin role
            localStorage.removeItem("userDetails"); // Clear stored details
            navigate("/"); // Redirect to home page
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const Menus = [
        { title: "Dashboard", icon: <FiHome size={24} />, to: "/AdminDashboard" },
        { title: "rental service dash", icon: <FiInbox size={24} />, to: "/RentalDashboard" },
        { title: "Accounts", icon: <FiUserCheck size={24} />, to: "/Account", gap: true },
        { title: "Notifications", icon: (
            <div className="relative">
        <FiBell size={24} 
        />
        {unreadCount > 0 && (
         <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
           {unreadCount}
          </span>
                    )}
                </div>
            ), 
         to: "/AdminNotifications" },
        { title: "Manage Requests", icon: <FiList size={24} />, to: "/AdminRequests" },
        { title: "Analytics", icon: <FiBarChart2 size={24} />, to: "/analytics" },
        { title: "Users", icon: <FiUsers size={24} />, to: "/Users", gap: true },
        { title: "Settings", icon: <FiSettings size={24} />, to: "/AdminAccountSettings" },
        { title: "Logout", icon: <FiLogOut size={24} />, onClick: handleLogout, gap: true }, 
    ];

    return (
        <>
       {/* <div className=" flex">*/}
            {/* Sidebar */}
            <div
                className={`${open ? "w-72" : "w-20"} 
                
                h-screen 
                p-5 
                pt-8 
                relative duration-300 
                bg-gradient-to-b from-[#2D2F33] via-[#2C2C2C] to-[#16181C]
                shadow-2xl rounded-3xl 
                border border-[#333333] 
                backdrop-blur-md
                fixed left-4 top-4 bottom-4 z-50
                transition-all duration-300
                `}
            >
                {/* Menu Toggle Button */}
                <button
                    className="absolute -right-3 top-9 w-7 h-7 flex items-center
                    justify-center border-2 border-gray-700 rounded-full bg-gray-800 text-white
                    transition hover:bg-gray-700"
                    onClick={() => setOpen(!open)}
                >
                    <FiMenu size={20} />
                </button>

                {/* Logo */}
                <div className="flex gap-x-4 items-center">
                    {open && (
                        <h1 className="text-white font-bold text-xl duration-300">
                            My Dashboard
                        </h1>
                    )}
                </div>

                {/* Menu Items */}
                <ul className="pt-6">
                    {Menus.map((menu, index) => (
                        <li key={index} className="mt-2">
                            {menu.to ? (
                                <Link 
                                    to={menu.to}  
                                    onClick={() => {
                                        if (window.innerWidth < 768) {
                                            setOpen(false);
                                        }
                                    }}
                                    className={`flex items-center rounded-md p-2 cursor-pointer text-gray-300 text-sm transition-all duration-200 
                                        hover:bg-[#007FFF] hover:bg-opacity-50 
                                        ${menu.gap ? "mt-9" : "mt-2"} 
                                        ${location.pathname === menu.to ? "bg-[#007FFF] text-white font-bold" : ""}
                                    `}
                                >
                                    <span className="text-white">{menu.icon}</span>
                                    {open && (
                                        <span className="ml-3 text-white font-medium duration-300">
                                            {menu.title}
                                        </span>
                                    )}
                                </Link>
                            ) : (
                                <button
                                    onClick={menu.onClick}
                                    className={`flex items-center w-full rounded-md p-2 cursor-pointer text-red-400 text-sm transition-all duration-200 
                                    hover:bg-red-500 hover:text-white`}
                                >
                                    <span className="text-red-400">{menu.icon}</span>
                                    {open && (
                                        <span className="ml-3 font-medium">
                                            {menu.title}
                                        </span>
                                    )}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
       {/* </div> */}
       </>
    );
};

export default Sidebar;














/*
import { useState, useEffect } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import {
    FiMenu,
    FiHome,
    FiInbox,
    FiUser,
    FiCalendar,
    FiSearch,
    FiBarChart2,
    FiFolder,
    FiSettings,
    FiClipboard,
    FiList,
    FiCheckSquare,
    FiLogOut,
} from "react-icons/fi";

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();

     // Check screen width to collapse the sidebar by default on mobile
     useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setOpen(false); // Collapse sidebar on mobile
            } else {
                setOpen(true); // Keep sidebar open on larger screens
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Check screen width on initial render

        return () => window.removeEventListener("resize", handleResize);
    }, []);

       // Logout Function
       const handleLogout = async () => {
        try {
            await signOut(auth); // Logout from Firebase
            localStorage.removeItem("isAdmin"); // Remove admin role
            localStorage.removeItem("userDetails"); // Clear stored details
            navigate("/"); // Redirect to home page
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const Menus = [
        { title: "Dashboard", icon: <FiHome size={24} /> },
        { title: "Inbox", icon: <FiInbox size={24} /> },
        { title: "Accounts", icon: <FiUser size={24} />, gap: true },
        { title: "Schedule", icon: <FiCalendar size={24} /> },
        //{ title: "Search", icon: <FiSearch size={24} /> },
        { title: "Manage Requests", icon: <FiList size={24} /> , to: "/AdminRequests" },
        { title: "Analytics", icon: <FiBarChart2 size={24} /> },
        { title: "Files", icon: <FiFolder size={24} />, gap: true },
        { title: "Settings", icon: <FiSettings size={24} />, to: "/AdminAccountSettings" },
        { title: "Logout", icon: <FiLogOut size={24} />, onClick: handleLogout, gap: true }, 
    ];

    return (
        
        <div className="flex">
            {/* Sidebar /}
            <div
                className=
                { 
                `${open ? "w-72" : "w-20"} 
                h-screen 
                p-5 
                pt-8 
                relative duration-300 
                 bg-gradient-to-b from-[#2D2F33] via-[#2C2C2C] to-[#16181C]
                shadow-2xl rounded-3xl 
                 border border-[#333333] 
                 backdrop-blur-md
                fixed left-4 top-4 bottom-4
                transition-all
                `}
            >
                {/* Bouton de bascule /}
                <button
                    className="absolute -right-3 
                    top-9 w-7 h-7 flex items-center
                    justify-center border-2 border-gray-700 
                    rounded-full bg-gray-800 text-white
                     transition hover:bg-gray-700 
"
                    onClick={() => setOpen(!open)}
                >
                    <FiMenu size={20} />
                </button>

                {/* Logo /}
                <div className="flex gap-x-4 items-center">
                    <h1
                        className={`text-white font-bold text-xl duration-300 ${!open && "hidden "}`}
                    >
                        My Dashboard
                    </h1>
                </div>

                {/* Menu /}
                <ul className="pt-6">
                    {Menus.map((menu, index) => (
                        <li
                        key={index} className="mt-2">
                        <Link 
                            to={menu.to}  
                            onClick={() =>
                                {
                                    if (window.innerWidth < 768) { setOpen(false);} // Close menu when a link is clicked (on mobile)
                                }}
                                    className={`flex items-center rounded-md p-2 cursor-pointer text-gray-300 text-sm transition-all duration-200 
                                hover:bg-[#007FFF] hover:bg-opacity-50 
                            ${menu.gap ? "mt-9" : "mt-2"} 
                            ${location.pathname === menu.to ? "bg-[#007FFF] text-white font-bold" : ""}
                            `}
                        >
                            <span className="text-white">{menu.icon}</span>
                            <span
                                className={`ml-3 text-white font-medium duration-300 ${
                                    !open && "hidden "
                                }`}
                            >
                                {menu.title}
                            </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Contenu principal /}
           {/* <div className="h-screen flex-1 p-7">
            {location.pathname === "/Sidebar" && (
                <h1 className="text-2xl font-semibold">Home Page</h1>
            )}</div>/}
        </div>
        
    );
};

export default Sidebar; */