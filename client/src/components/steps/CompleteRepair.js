//import React from 'react';
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { auth, db } from '../firebase' // Ensure the correct path
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore'
import { useContext } from 'react'
import { StepperContextRepair } from '../contexts/StepperContextRepair'
import { getDatabase, ref, set, push, get } from 'firebase/database' // Import Realtime Database functions

export default function Final() {
  const navigate = useNavigate()

  const { userData, setUserData } = useContext(StepperContextRepair)

  const saveRequestToFirebase = async () => {
    try {
      //bah nchoufou esQ rah yji ged ged ou nn
      console.log('User ID:', auth.currentUser?.uid)
      const userId = auth.currentUser?.uid
      if (!userId) {
        console.error('User not authenticated')
        return
      }

      // Ensure all data sections exist
      if (
        !userData.personalInfoRepair ||
        !userData.deviceDetails ||
        !userData.issueDescription
      ) {
        console.error('Incomplete form data')
        return
      }

      // if ProjectDetails exists
      // console.log("ProjectDetails before saving:", userData.projectDetails);

      console.log('Saving request with data:', userData) // Debugging
      //  console.log("Context in CompleteRepair:", (StepperContextRepair));

      // Initialize Realtime Database
      const realtimeDb = getDatabase()

      // Reference to the "requestsRepair" subcollection under the user
      const userRequestsRef = collection(db, 'Users', userId, 'requestsRepair')

      // Create a new request and get its document ID
      const requestRef = await addDoc(userRequestsRef, {
        timestamp: new Date().toISOString(),
        status: 'pending',
        requestType: "repair",
      })

      const requestId = requestRef.id // Get the ID of the newly created request

      // Save data in subcollections
      await Promise.all([
        addDoc(
          collection(
            db,
            'Users',
            userId,
            'requestsRepair',
            requestId,
            'PersonalInfoRepair',
          ),
          {
            ...userData.personalInfoRepair,
            // timestamp: new Date().toISOString(),
          },
        ),
        addDoc(
          collection(
            db,
            'Users',
            userId,
            'requestsRepair',
            requestId,
            'DeviceDetails',
          ),
          {
            ...userData.deviceDetails,
            // timestamp: new Date().toISOString(),
          },
        ),
        addDoc(
          collection(
            db,
            'Users',
            userId,
            'requestsRepair',
            requestId,
            'IssueDescription',
          ),
          {
            ...userData.issueDescription,
            // timestamp: new Date().toISOString(),
          },
        ),
      ])

      // Save data in Realtime Database under "Users/{userId}/requests/{requestId}"
      await set(
        ref(realtimeDb, `Users/${userId}/requestsRepair/${requestId}`),
        {
          personalInfoRepair: userData.personalInfoRepair,
          deviceDetails: userData.deviceDetails,
          issueDescription: userData.issueDescription,
          timestamp: new Date().toISOString(),
          status: 'pending',
          requestType: "repair",
        },
      )

      console.log(
        'Request successfully saved under user in Firestore & Realtime Database!',
      )

      // ✅ Send Notification to Admins
      await sendNotificationToAdmins(
        userId,
        requestId,
        userData.personalInfoRepair?.fullname,
      )

      // Reset form after submission
      setUserData({
        personalInfoRepair: {},
        deviceDetails: {},
        issueDescription: {},
      })
    } catch (error) {
      console.error('Error saving request:', error)
    }
  }

  // 🔹 SEND NOTIFICATION TO ALL ADMINS 🔹

  const sendNotificationToAdmins = async (userId, requestId, userFullName) => {
    try {
      const adminsRef = collection(db, 'Admins')
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
            message: `New repair request from user ${userFullName}`,
            type: 'new_request',
            userId: userId, // Include userId
            requestId: requestId, //  Include requestId
            requestType: 'repair', //  Include request type
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
    console.log('useEffect triggered, userData:', userData)

    /*  console.log("Personal Info:", userData.personalInfoRepair);
    console.log("Device Details:", userData.deviceDetails);
    console.log("Issue Description:", userData.issueDescription);
    console.log("Keys Lengths:", 
      Object.keys(userData.personalInfoRepair).length,  
      Object.keys(userData.deviceDetails).length, 
      Object.keys(userData.issueDescription).length
     );*/

    if (
      userData.personalInfoRepair &&
      userData.deviceDetails &&
      userData.issueDescription &&
      Object.keys(userData.personalInfoRepair).length > 0 &&
      Object.keys(userData.deviceDetails).length > 0 &&
      Object.keys(userData.issueDescription).length > 0
    ) {
      saveRequestToFirebase()
    } else {
      console.log(
        'useEffect did not trigger Firebase save because data is incomplete.',
      )
    }
  }, [])

  const handleClose = () => {
    navigate('/services') // Assurez-vous que le chemin correspond à votre route définie dans votre Router
  }

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
