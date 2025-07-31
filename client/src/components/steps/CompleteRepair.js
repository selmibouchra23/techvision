//import React from 'react';
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase' // Ensure the correct path
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore'
import { useContext } from 'react'
import { StepperContextRepair } from '../contexts/StepperContextRepair'
import { getDatabase, ref, set, push, get } from 'firebase/database' // Import Realtime Database functions
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Final() {
  const navigate = useNavigate()

  const { userData, setUserData } = useContext(StepperContextRepair)
  const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [calendarMap, setCalendarMap] = useState({})
    const [currentMonth, setCurrentMonth] = useState(new Date())
    
  const appointmentsPerSlot = 3
  
  const timeSlots = [ '10:00', '13:00', '14:00']
    const getUnavailableDates = async () => {
      const realtimeDb = getDatabase()
      const appointmentsRef = ref(realtimeDb, 'Appointments')
      const snapshot = await get(appointmentsRef)
      const bookedMap = {}
  
      if (snapshot.exists()) {
        const data = snapshot.val()
        Object.entries(data).forEach(([date, slots]) => {
          bookedMap[date] = {}
          Object.entries(slots).forEach(([timeSlot, users]) => {
            bookedMap[date][timeSlot] = Object.keys(users).length
          })
        })
      }
  
      setCalendarMap(bookedMap)
    }
  
    const isSlotBooked = (date, time) => {
      return (calendarMap[date]?.[time] || 0) >= appointmentsPerSlot
    }
  
    const handleDateSelect = (date) => {
      setSelectedDate(date)
      setSelectedTime(null)
    }
  
    const handleTimeSelect = (time) => {
      setSelectedTime(time)
    }
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
            
          appointmentDate: selectedDate || null,
          
          appointmentTime: selectedTime || null
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
          issueDescription: {
            ... userData.issueDescription,
          
          appointmentDate: selectedDate || null,
        
          appointmentTime: selectedTime || null
        },

          timestamp: new Date().toISOString(),
          status: 'pending',
          requestType: "repair",
        },
      )
      if (selectedDate) {
              await set(ref(realtimeDb, `Appointments/${selectedDate}/${userId}`), {
                fullName: userData.personalInfoRepair.fullname,
                timestamp: new Date().toISOString(),
                requestId
              })
            }

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
      getUnavailableDates()
     // saveRequestToFirebase()
    } else {
      console.log(
        'useEffect did not trigger Firebase save because data is incomplete.',
      )
    }
  }, [])
    useEffect(() => {
      if (selectedDate && selectedTime) {
        saveRequestToFirebase()
      }
    }, [selectedTime])

  const handleClose = () => {
     setUserData({ personalInfoRepair: {}, deviceDetails: {}, issueDescription: {} })
  
    navigate('/services') // Assurez-vous que le chemin correspond à votre route définie dans votre Router
  }
  const { totalPrice = 0, totalDuration = 0 } = userData.issueDescription || {}
   const renderCalendar = () => {
      const monthStart = startOfMonth(currentMonth)
      const monthEnd = endOfMonth(monthStart)
      const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
      const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
      const dateFormat = 'd'
      const rows = []
      let days = []
      let day = startDate
  
      while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
          const formattedDate = format(day, 'yyyy-MM-dd')
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
          const isSelected = selectedDate === formattedDate
          const isCurrentMonth = day.getMonth() === monthStart.getMonth()
          const isFriday = day.getDay() === 5
          const isSaturday = day.getDay() === 6
         // const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
          const isPast = day < new Date() && !isToday
          const isDisabled = isPast || !isCurrentMonth || isFriday || isSaturday
  
          days.push(
            <div
              key={day}
              className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer text-sm font-medium
                ${isDisabled ? 'text-gray-300 cursor-not-allowed' :
                  isSelected ? 'bg-green-500 text-white' : 
                  'hover:bg-blue-100 text-gray-800'}`}
              onClick={() => !isDisabled && handleDateSelect(formattedDate)}
            >
              {format(day, dateFormat)}
            </div>
          )
          day = addDays(day, 1)
        }
        rows.push(
          <div className="flex justify-between" key={day}>
            {days}
          </div>
        )
        days = []
      }
  
      return (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>&lt;</button>
            <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>&gt;</button>
          </div>
          <div className="grid grid-cols-7 text-center text-gray-600 font-semibold mb-2">
            <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div className="text-red-500">Ven</div><div className="text-red-500">Sam</div><div>Dim</div>
          </div>
          {rows}
        </div>
      )
    }
  
    const renderTimeSlots = () => {
      if (!selectedDate) return null
  
      return (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {timeSlots.map((time, index) => {
            const isBooked = isSlotBooked(selectedDate, time)
            const isSelected = selectedTime === time
  
            return (
              <button
                key={index}
                disabled={isBooked || selectedTime}
                onClick={() => handleTimeSelect(time)}
                className={`px-4 py-2 rounded text-sm font-semibold border text-center transition
                  ${isSelected ? 'bg-blue-800 text-white' :
                  isBooked ? 'bg-gray-200 text-gray-500 cursor-not-allowed' :
                  'bg-white text-gray-800 hover:bg-blue-100'}`}
              >
                {format(new Date(`1970-01-01T${time}`), 'hh:mm a')}
              </button>
            )
          })}
        </div>
      )
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
        {/*  We will contact you within 24h.*/}
         <br />
        
           <p className="text-base font-normal text-gray-700 mt-2 normal-case">
    Please take an appointment to come to the local to discuss the details of your request.
  </p>
   </div>
    
         <div className="mt-8 w-full max-w-4xl flex flex-col md:flex-row justify-center gap-10">
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Book your appointment</h3>
            {renderCalendar()}
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
            {renderTimeSlots()}
            <button
              onClick={handleClose}
              className="mt-10 bg-green-600 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded"
            >
               Confirm
        </button>
      </div>
    </div>
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
