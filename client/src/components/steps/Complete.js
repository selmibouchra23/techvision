//import React from 'react';
import { useNavigate } from 'react-router-dom'

import React, { useEffect } from 'react'
import { auth, db } from '../firebase' // Ensure the correct path
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore'
import { useContext } from 'react'
import { StepperContext } from '../contexts/StepperContextApp'
import { getDatabase, ref, set, get, push } from 'firebase/database' // Import Realtime Database functions

export default function Final() {
  const navigate = useNavigate()

  const { userData, setUserData } = useContext(StepperContext)

  const saveRequestToFirebase = async () => {
    try {
      const userId = auth.currentUser?.uid
      if (!userId) {
        console.error('User not authenticated')
        return
      }

      // Ensure all data sections exist
      if (
        !userData.personalInfo ||
        !userData.academicInfo ||
        !userData.projectDetails
      ) {
        console.error('Incomplete form data')
        return
      }

      //  Add this log to check if ProjectDetails exists
      console.log('ProjectDetails before saving:', userData.projectDetails)

      console.log('Saving request with data:', userData) // Debugging

      // Initialize Realtime Database
      const realtimeDb = getDatabase()

      // Reference to the "requestsDevelopment" subcollection under the user
      const userRequestsRef = collection(
        db,
        'Users',
        userId,
        'RequestsDevelopment',
      )

      // Create a new request and get its document ID
      const requestRef = await addDoc(userRequestsRef, {
        timestamp: new Date().toISOString(),
        status: 'pending',
        requestType: "development",
      })

      const requestId = requestRef.id // Get the ID of the newly created request

      // Save data in subcollections
      await Promise.all([
        addDoc(
          collection(
            db,
            'Users',
            userId,
            'RequestsDevelopment',
            requestId,
            'PersonalInformations',
          ),
          {
            ...userData.personalInfo,
            // timestamp: new Date().toISOString(),
          },
        ),
        addDoc(
          collection(
            db,
            'Users',
            userId,
            'RequestsDevelopment',
            requestId,
            'AcademicAprofessionalSituation',
          ),
          {
            ...userData.academicInfo,
            // timestamp: new Date().toISOString(),
          },
        ),
        addDoc(
          collection(
            db,
            'Users',
            userId,
            'RequestsDevelopment',
            requestId,
            'ProjectDetails',
          ),
          {
            ...userData.projectDetails,
            // timestamp: new Date().toISOString(),
          },
        ),
      ])

      // Save data in Realtime Database under "Users/{userId}/requests/{requestId}"
      await set(
        ref(realtimeDb, `Users/${userId}/RequestsDevelopment/${requestId}`),
        {
          personalInfo: userData.personalInfo,
          academicInfo: userData.academicInfo,
          projectDetails: userData.projectDetails,
          timestamp: new Date().toISOString(),
          status: 'pending',
          requestType: "development",
        },
      )

      console.log(
        'Request successfully saved under user in Firestore & Realtime Database!',
      )

      //  Send Notification to Admins
      await sendNotificationToAdmins(
        userId,
        requestId,
        userData.personalInfo?.fullname,
      )

      // Reset form after submission
      setUserData({
        personalInfo: {},
        academicInfo: {},
        projectDetails: {},
      })
    } catch (error) {
      console.error('Error saving request:', error)
    }
  }

  //  SEND NOTIFICATION TO ALL ADMINS 

  const sendNotificationToAdmins = async (userId, requestId, userFullName) => {
    try {
      const adminsRef = collection(db, `Admins`)
      // Get all admin documents
      const adminsSnapshot = await getDocs(adminsRef)

      if (!adminsSnapshot.empty) {
        adminsSnapshot.forEach(async adminDoc => {
          const adminId = adminDoc.id // Get admin's Firestore ID

          // Reference to the notifications subcollection inside each admin's document
          const adminNotificationsRef = collection(
            db,
            'Admins',
            adminId,
            'Notifications',
          )

          // Add notification for this admin
          await addDoc(adminNotificationsRef, {
            message: `New development request from  ${userFullName}`,
            type: 'new_request',
            userId: userId, // Include userId
            requestId: requestId, // Include requestId
            requestType: 'development', // Include request type
            read: false,
            timestamp: new Date().toISOString(),
          })
        }) 

        console.log('Notification sent to all admins in Firestore.')
      } else {
        console.log('No admins found in Firestore.')
      }
    } catch (error) {
      console.error('Error sending notifications to admins:', error)
    }
  }
  // Call save function only once when component mounts
  useEffect(() => {
    if (
      userData.personalInfo &&
      userData.academicInfo &&
      userData.projectDetails &&
      Object.keys(userData.personalInfo).length > 0 &&
      Object.keys(userData.academicInfo).length > 0 &&
      Object.keys(userData.projectDetails).length > 0
    ) {
      saveRequestToFirebase()
    }
  }, [])

  const handleClose = () => {
    navigate('/services') // Assurez-vous que le chemin correspond à votre route définie dans votre Router
  }

  //When the component loads (useEffect), it will save the data automatically.

  return (
    <div className="container md:mt-10">
      <div className="flex flex-col items-center">
        {/* Icône de succès (SVG) */}
        <div className="text-green-400">
          <svg
            className="w-24 h-24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        {/* Titre de félicitations */}
        <div className="mt-3 text-xl font-semibold uppercase text-green-500">
          The request was completed successfully
        </div>

        {/* Message de succès */}
        <div className="text-lg font-semibold text-gray-500">
          We will contact you within 24h.
        </div>

        {/* Bouton "Close" */}
        <button
          onClick={handleClose}
          className="mt-10 h-10 px-5 text-green-700 transition-colors duration-150 border border-gray-300 rounded-lg focus:shadow-outline hover:bg-green-500 hover:text-green-100"
        >
          Close
        </button>
      </div>
    </div>
  )
}


/*import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Final() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/services'); // Assurez-vous que le chemin correspond à votre route définie dans votre Router
  };

  return (
    <div className="container md:mt-10">
      <div className="flex flex-col items-center">
        {/* Icône de succès (SVG) }
        <div className="text-green-400">
          <svg
            className="w-24 h-24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        {/* Titre de félicitations }
        <div className="mt-3 text-xl font-semibold uppercase text-green-500">
        The request was completed successfully
        </div>

        {/* Message de succès }
        <div className="text-lg font-semibold text-gray-500">
          We will contact you within 24h.
        </div>

        {/* Bouton "Close" }
        <button 
          onClick={handleClose} 
          className="mt-10 h-10 px-5 text-green-700 transition-colors duration-150 border border-gray-300 rounded-lg focus:shadow-outline hover:bg-green-500 hover:text-green-100"
        >
          Close
        </button>
      </div>
    </div>
  );
} */
