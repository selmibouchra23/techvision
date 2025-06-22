import React, { useState, useEffect  } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../../App.css';
import { IconButton, IconInput } from '../../IconComponents';
import { MdOutlineMailOutline } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";

import { RiLockPasswordLine } from "react-icons/ri";

import LoginIlu from '../../img/102.jpg';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { setDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { position } from '@chakra-ui/react';

export default function SignUp() {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate(); // 

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      //  const user = auth.currentUser;
        const user = userCredential.user;

        try{
         // Send verification email
    await sendEmailVerification(user);
        
        //if (user) {
            const userData = {
                uid: user.uid,
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                createdAt: serverTimestamp(),
                
            };
        //      if (user.emailVerified ) {
        //       await setDoc(doc(db, "Users", user.uid), userData);
        //               console.log("User Registered Successfully!");
        // toast.success("User Registered Successfully!", { position: "top-center" });
        // // 
        // navigate('/log-in');
                    
        //             return;
        //           }

          await setDoc(doc(db, "Users", user.uid), userData);
            
            //sauvgarder les donner de l'utilisateur dans localStorage
         //   localStorage.setItem("user", JSON.stringify(userData));
      //  }

        console.log("User Registered Successfully!");
        toast.success("Verification email sent. Please check your inbox!", { position: "bottom-center" });

        // 
        navigate('/log-in');
        } catch (verificationError) {
      // Email not sent → delete the user
      await user.delete();
      console.error("Failed to send verification email:", verificationError.message);
      toast.error("Failed to send verification email. Please try again.", { position: "bottom-center" });
    }
    } catch (error) {
        setError(error.message);
        console.error("Registration Error:", error.message);
        toast.error(error.message, { position: "bottom-center" });
    }
};


  {/*const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // 
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      
      console.log(user);
      if (user){
        await setDoc(doc(db,"Users", user.uid),{
          email:user.email,
          firstName:firstName,
          lastName:lastName,
          password:password
        },);
      }
      console.log("User Registered Successfully!");
      toast.success("User Registered Successfully!", {position: "top-center"});
      // توجيه المستخدم بعد التسجيل الناجح
      navigate('/');
    } catch (error) {
      setError(error.message); // عرض رسالة الخطأ
      console.error("Registration Error:", error.message);
      toast.error(error.message, {position: "bottom-center"});
    }
  };*/}
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
 
  return (
    <div className='flex justify-center items-center w-full h-screen bg-slate-50'>
      <motion.div
        className={`mt-[25%] form-container overflow-hidden rounded-2xl flex flex-col lg:flex-row justify-between shadow-2xl border w-11/12 max-w-screen-xl ${isAnimating ? 'pointer-events-none' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={isAnimating ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >

        {/* صورة التسجيل */}
        <div className='illustration-section w-full lg:w-1/2 h-full order-1 lg:order-2 flex flex-col items-center relative'>
          <div className='illu-wrap flex justify-center items-center relative w-full h-full'>
            <img src={LoginIlu} alt='' className='rounded-tr-2xl rounded-bl-none object-cover w-full h-full' />
          </div>
        </div>

        {/* قسم التسجيل */}
        <form onSubmit={handleRegister} className='form-section w-full lg:w-1/2 px-8 lg:px-24 py-16 order-2 lg:order-1'>

          <div className='logo cursor-pointer text-2xl flex items-center'>
            TchVision <i className="fab fa-slack text-gray-700 text-2xl" />
          </div>

          <h1 className='text-3xl font-semibold mt-6 opacity-90'>Create Your Account</h1>
          <p className='text-black opacity-60 mt-3'>Join us today! Sign up with:</p>

          <div className='oath-btns flex justify-between gap-x-5 mt-2'>
            <IconButton text='Google' iconColor='#fff' onClick={googleLogin} type= "button">
              <FcGoogle />
            </IconButton>

            <IconButton text='Facebook' iconColor='#426782' type= "button" >
              <FaFacebook />
            </IconButton>
          </div>

          <span className='block text-center opacity-70 mt-5 mb-10 text-gray-800'>
            or sign up with email
          </span>

          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          {/* إدخال البريد الإلكتروني **/}
          <IconInput
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
           >
            <MdOutlineMailOutline />
           </IconInput>


           <IconInput
            type='text'
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            >
           <AiOutlineUser />
           </IconInput>
          
           <IconInput
      type='text'
      placeholder='Last Name'
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
    >
      <AiOutlineUser />
    </IconInput>

          {/* إدخال كلمة المرور */}
          <IconInput
      type='password'
      placeholder='Password'
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    >
      <RiLockPasswordLine />
    </IconInput>

          {/* الموافقة على الشروط **/}
          <div className='flex justify-between items-center mt-3 space-x-4'>
            <div className='item flex items-center space-x-2'>
              <input type='checkbox' required />
              <span className='text-neutral-500'>I agree to the terms</span>
            </div>
          </div>

          {/* زر التسجيل */}
          <button type='submit' className='bg-blue w-full py-4 mt-10 text-white text-wl'>
            Sign Up
          </button>

          <p className='text-center mt-6 text-neutral-500'>
            Already have an account? 
            <a href='/Log-in' className='text-blue cursor-pointer'> Log In</a>
          </p>

        </form>
      </motion.div>
    </div>
  );
}

