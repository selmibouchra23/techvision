// src/pages/LogIn.js
import React, { useState,  useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import '../../../App.css';
import { Link } from 'react-router-dom';
//import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';  // Import Framer Motion
import { IconButton, IconInput } from '../../IconComponents';
//import LoginIlu from '../../img/login-sign-up-illustration1.png';

import LoginIlu from '../../img/100.jpg';
import './../../Navbar.css'

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FacebookAuthProvider,
   GoogleAuthProvider, signInWithCredential,
   signInWithEmailAndPassword, signInWithPopup,
    sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function LogIn() {



  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const [isAnimating, setIsAnimating] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");



  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Logged in UID:", user.uid);
        // 🔍 Check if user is an admin
    const adminDocRef = doc(db, "Admins", user.uid);
    const adminDocSnap = await getDoc(adminDocRef);
    const isAdmin = adminDocSnap.exists();
  
      if (!user.emailVerified && !isAdmin) {
        toast.error("Please verify your email before logging in.", {
          position: "bottom-center",
        });
        return;
      }

     // if (user) {
        // imporeter les donnees man Firestore
        const userDocRef = doc(db, "Users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          // sauvgarder les données dans localStorage
          localStorage.setItem("user", JSON.stringify(userData));
        }
  //    }
   // If admin, store admin 
    if (isAdmin) {
      localStorage.setItem("isAdmin", "true");
    }

  
      toast.success("User logged in Successfully!", { position: "top-center" });
     window.location.href = "/";

      /*   if (isAdmin) {
      window.location.href = "/AdminDashboard";
    } else {
      window.location.href = "/";
    }*/

    } catch (error) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };
  const handleForgotPassword = async () => {
     //t3 sendPasswordResetEmail hadi ida kan email t3 user kayen fe firebase
     //teb3ethlou link bah ybedel mdps ta3ou w la page hadik tji mn 3endhm
     // w ida email mknch fe firebase teb9a tkhourejlou success msg 3la jal securite
     // bah may3rfch wina emails kaynin fe database t3na 
  if (!email) {
    return toast.warn("Please enter your email above first.", {
      position: "top-center",
    });
  }
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("📧 Password reset email sent!", {
      position: "top-center",
    });
  } catch (error) {
    console.error("Error sending reset email:", error.message);
    toast.error(error.message, {
      position: "bottom-center",
    });
  }
};


 {/*} const handleRegister= async (e)=>{
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      console.log("User logged in Successflly!")
      window.location.href="/";
      toast.success("User logged in Successflly!", {position: "top-center"});
    } catch (error) {
      console.log(error.message); 
         //   console.error("Registration Error:", error.message);
            toast.error(error.message, {position: "bottom-center"});
    }

  }*/}


  const handleSignUpClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.location.href = '/sign-up'; // Redirect after animation
    }, 600); // Timing should match animation duration
  };

  const navigate = useNavigate(); 



  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log(result);
        if (result.user) {
          const user = result.user;
  
          // Vérifier si l'utilisateur existe déjà dans Firestore
          const userRef = doc(db, "Users", user.uid);
          const userSnap = await getDoc(userRef);
  
          if (!userSnap.exists()) {
            // Si l'utilisateur n'existe pas, le créer
            const userData = {
              uid: user.uid,
              email: user.email,
              firstName: user.displayName?.split(" ")[0] || "", // prendre le prénom du displayName
              lastName: user.displayName?.split(" ")[1] || "", // prendre le nom du displayName
              password: "", // pas de password pour Google login
            };
            await setDoc(userRef, userData);
  
            // Sauvegarder dans localStorage
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Si l'utilisateur existe déjà, sauvegarder ses données dans localStorage
            localStorage.setItem("user", JSON.stringify(userSnap.data()));
          }
  
          toast.success("User logged in Successfully!", { position: "top-center" });
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Error during Google login:", error);
        toast.error("Login failed!", { position: "bottom-center" });
      });
  }


   {/*
  function googleLogin(){
    const provider = new GoogleAuthProvider ();
    signInWithPopup(auth, provider).then(async(result)=>{
      console.log(result);
      if(result.user){
        toast.success("User logged in Successflly!", {position: "top-center"});
        window.location.href = "/";
      } 
    })
  }*/}
  function facebookLogin() {
    const fbAuthProvider = new FacebookAuthProvider();
    signInWithPopup(auth, fbAuthProvider).then(async (result) => {
      if (result.user) {
        toast.success("User logged in Successfully!", { position: "top-center" });
        window.location.href = "/";
      }
    }).catch(error => {
      toast.error("Facebook login failed: " + error.message, { position: "bottom-center" });
    });
  }

  
 

  return (
    <>
      <div className=' flex justify-center items-center w-full h-screen bg-slate-50'>
        {/* Using motion.div to animate the form-container */}
        <motion.div
          className={`mt-40 form-container overflow-hidden rounded-2xl flex flex-col lg:flex-row justify-between shadow-2xl border w-11/12 max-w-screen-xl ${isAnimating ? 'pointer-events-none' : ''}`}
          initial={{ y: -100, opacity: 0 }}  // Start position: above the screen
          animate={isAnimating ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}  // Final state: in position
          transition={{ duration: 0.6, ease: 'easeInOut' }}  // Animation duration and easing
        >


          {/* ta3 la photo jiha la droit */}
          <div className='illustration-section w-full h-full lg:w-1/2 h-full order-1 lg:order-2 flex flex-col items-center relative'>
      <div className='illu-wrap flex justify-center items-center relative h-full'>
        <img src={LoginIlu} alt='' className='rounded-tr-2xl rounded-bl-none object-cover h-full w-full' />
        <h2 className='mt-[52%] absolute text-gray-100 text-1xl  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
          Connect with every application
        </h2>
        <div className='dots flex justify-center items-center gap-x-3 mt-2 absolute bottom-5 left-1/2 transform -translate-x-1/2'>
          <div className='dot w-2 h-2 bg-white rounded-full block'></div>
          <div className='dot w-2 h-2 bg-white rounded-full block'></div>
          <div className='dot w-2 h-2 bg-white rounded-full block'></div>
        </div>
      </div>
    </div>







{/*le contenu ta3na  */}

          <form onSubmit={handleRegister} className='form-section w-full h-full lg:w-1/2 px-8 lg:px-24 py-16 order-2 lg:order-1'>
            <div className='logo cursor-pointer text-2xl flex items-center'>
              TchVision
               <img src="/logo1.png" alt="TechVision Logo" className="navbar-logo-img" />
              {/* <i className="fab fa-slack text-gray-700 text-2xl" /> */}
            </div>
            <h1 className='text-3xl font-semibold mt-6 opacity-90'>Log in to your Account</h1>
            <p className='text-blac opacity-60 mt-3'>Welcome back! Select method to log in:</p>

            <div className='oath-btns flex justify-between gap-x-5 mt-8'>
              <IconButton text='Google' iconColor='#fff' onClick={googleLogin} type= "button">
                <FcGoogle />
              </IconButton>



              <IconButton text='Facebook' iconColor='#426782' onClick={facebookLogin} type = "button"> 
                <FaFacebook />
              </IconButton>
            </div>




            <span className='block text-center opacity-70 mt-6 mb-10 text-gray-800'>
              or continue with email
            </span>



            <IconInput
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                       >
                        <MdOutlineMailOutline />
                       </IconInput>


              <IconInput
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  >
                    <RiLockPasswordLine />
                  </IconInput>


            {/*<IconInput placeholder="Email" text="text">
              <MdOutlineMailOutline />
            </IconInput>

            <IconInput placeholder="Password" text="Password">
              <RiLockPasswordLine />
            </IconInput>*/}

            <div className='flex justify-between items-center mt-3 space-x-4'>
              <div className='item flex items-center space-x-2'>
                <input type='checkbox' />
                <span className='text-neutral-500'>Remember me</span>
              </div>





              <div className='item'>
                <span href='#' className='text-blue cursor-pointer'
                onClick={handleForgotPassword} >
                  Forgot Password?
                  </span>
              </div>
            </div>




            


            {/*<button className='bg-blue w-full py-4 mt-10 text-white text-wl'>Login</button>*/}
            <button type='submit' className='bg-blue w-full py-4 mt-10 text-white text-wl'>
      Login
    </button>

            <p className='text-center mt-10 text-neutral-500'>
              Don't have an account?
              {/*<Link onClick={handleSignUpClick} className=' text-blue cursor-pointer'> Create an account</Link>*/}
              <Link to='/Sign-up' className=' text-blue cursor-pointer'   >
              Create an account 
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
}