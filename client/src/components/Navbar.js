import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../components/firebase'; 
import { doc, getDoc, setDoc,  collection, query, where, onSnapshot  } from 'firebase/firestore';
import { Avatar, Text, Box } from '@chakra-ui/react';
import { Button } from './Button';
import './Navbar.css';
import { FiBell } from "react-icons/fi";
import notificationSound from '../assets/notification.mp3'

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();

    const [unreadCount, setUnreadCount] = useState(0)
    const [previousUnread, setPreviousUnread] = useState(0);
  
    const showSystemNotification = (notification) => {
        if (!('Notification' in window)) {
          console.log('Browser does not support notifications.')
          return
        }
    
        if (Notification.permission === 'granted') {
          const systemNotification = new Notification('New Notification', {
            body: notification.message,
            icon: "/logo1.png", 
          })
    
          //  Redirect to Notifications.jsx when clicked
          systemNotification.onclick = () => {
            window.open('/profile') 
          }
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              showSystemNotification(notification)
            }
          })
        }
      }
      useEffect(() => {
       // const user = auth.currentUser;

         const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (!user) return;
      
        const notificationsRef = collection(db, "Users", user.uid, "Notifications");
        const q = query(notificationsRef, where("read", "==", false));
      
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newUnreadCount = snapshot.size;
    
          // Play sound only if new notification is received
          if (newUnreadCount > previousUnread) {
            const newNotification = snapshot.docs[0]?.data(); // Get the latest notification
    
            if (newNotification) {
            const audio = new Audio(notificationSound)
            audio.play().catch(error => console.log('Audio play blocked:', error))
            ;
            showSystemNotification(newNotification) }
          }
          setUnreadCount(newUnreadCount); //Update unread count dynamically
          setPreviousUnread(newUnreadCount);
        });
      
        return () => unsubscribe();
          });
          return () => unsubscribeAuth();
      }, [previousUnread]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
           // setUser(currentUser);
           if (currentUser && currentUser.emailVerified) {
            setUser(currentUser);

          //  if (currentUser) {
                try {
                    const docRef = doc(db, "Users", currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUserDetails(docSnap.data());
                    } else {
                        console.log("User data not found, setting default values.");

                        // تقسيم الاسم الكامل إذا لم يكن الاسم الأول والاسم الثاني محفوظين مسبقًا
                        const fullName = currentUser.displayName || "";
                        const [firstName, lastName] = fullName.split(" ");

                        const newUser = {
                            firstName: firstName || "",
                            lastName: lastName || "",
                            email: currentUser.email,
                        };

                        await setDoc(docRef, newUser);
                        setUserDetails(newUser);
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            } else {
                // Not verified or not logged in
            setUser(null);

                setUserDetails(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        setButton(window.innerWidth > 960);
    };

    useEffect(() => {
        showButton();
    }, []);

    window.addEventListener('resize', showButton);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    TchVision <i className="fab fa-slack"/>  {/* % lodo ta3na */}   
                </Link>

                <div className='menu-icon' onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>

                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'><Link to='/' className='nav-links' onClick={closeMobileMenu}>Home</Link></li>
                    <li className='nav-item'><Link to='/services' className='nav-links' onClick={closeMobileMenu}>Services</Link></li>
                    <li className='nav-item'><Link to='/cantect-us' className='nav-links' onClick={closeMobileMenu}>Contact us</Link></li>
                    <li className='nav-item'><Link to='/about-us' className='nav-links' onClick={closeMobileMenu}>About us</Link></li>
                    
                    {/* Mobile Menu */}
                    {!user ? (
                        <li>
                            <Link to='/log-in' className='nav-links-mobile' onClick={closeMobileMenu}>
                                Login
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/profile" className="nav-links-mobile-profile" onClick={closeMobileMenu}>
                                <Box 
                                    display="flex" 
                                    alignItems="center" 
                                    justifyContent="center" 
                                    textAlign="center"
                                    _hover={{ bg: "whiteAlpha.300", transition: "0.3s" }}
                                >
                                    <Avatar boxSize="40px" objectFit="cover" borderRadius="50"  src={user.photoURL || "/default-avatar.png"} name={user.displayName} />
                                    {userDetails && (
                                         <Box display="flex" alignItems="center">
                    
                                        <Text fontSize="md" color="white" fontWeight="normal" ml={2}>
                                            {userDetails.firstName} {userDetails.lastName}
                                        </Text>
                                        <div className="relative">
                    <FiBell size={22} color="white" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {unreadCount}
        </span>
      )}
      </div>
      </Box>
                                    )}
                                </Box>
                            </Link>
                        </li>
                    )}
                </ul> 

                {/* Desktop */}
                {!user ? (
                    button && (
                        <Link to='/log-in'>
                            <Button buttonStyle='btn--outline'>Login</Button>
                        </Link>
                    )
                ) : (
                    button && (
                        <Link to="/profile" style={{ textDecoration: "none" }}>
                            <Box 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center" 
                                px={7} 
                                py={5} 
                                border="1px solid white" 
                                borderRadius="md"
                                _hover={{ bg: "whiteAlpha.300", transition: "0.3s" }}
                            >
                                <Avatar boxSize="40px" objectFit="cover" borderRadius="50%"  src={user.photoURL || "/default-avatar.png" } name={user.displayName} />
                                {userDetails && (
                                     <Box display="flex" alignItems="center">
                                    <Text fontSize="md" color="white" fontWeight="normal" ml={2}>
                                        {userDetails.firstName} {userDetails.lastName}
                                    </Text>
                                    <div className="relative">
                      <FiBell size={22} color="white" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                          {unreadCount}
                        </span>
                      )}
                      </div>
                      </Box>
                                )}
                            </Box>
                        </Link>
                    )
                )}
            </div>
        </nav>
    );
}

export default Navbar;
