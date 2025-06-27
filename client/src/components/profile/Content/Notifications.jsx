import { FormControl, FormLabel, Switch } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Box,
  Input,
  Text,
  VStack,
  Spinner,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Divider,
} from '@chakra-ui/react'
import { auth, db } from '../../firebase'
import {
  collection,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  addDoc,
} from 'firebase/firestore'
import notificationSound from '../../../assets/notification.mp3' // Add a sound file
import { getDatabase, ref, get, update, push, set } from 'firebase/database'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [showPriceInput, setShowPriceInput] = useState(null)
  const [price, setPrice] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)

  const navigate = useNavigate()
 
  useEffect(() => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const notificationsRef = collection(db, 'Users', userId, 'Notifications')
      

      //  Real-time listener
      const q = query(notificationsRef, orderBy('timestamp', 'desc'))
      const unsubscribe = onSnapshot(q, snapshot => {
        const newNotifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Only play sound & show system notification if it's a NEW notification (not just a read update)
        const latestNotification =
          newNotifications.length > 0 ? newNotifications[0] : null // Most recent notification

        // Play sound and show system notification for new notifications
        if (
          latestNotification &&
          newNotifications.length > notifications.length && // Only if a new one is added
          !latestNotification.read // Only if it's unread
        ) {
         // playNotificationSound()
          //showSystemNotification(latestNotification)
        }

        setNotifications(newNotifications)
        setLoading(false)
      })

      return () => unsubscribe()
    }, []);


  //  Function to play notification sound
  const playNotificationSound = () => {
    const audio = new Audio(notificationSound)
    audio.play().catch(error => console.log('Audio play blocked:', error))
  }


  //  When a user clicks a notification, fetch full request details
  const handleNotificationClick = async notification => {
    console.log('Notification Data:', notification)
    //  Check if notification contains required fields
    if (
      !notification.userId ||
      !notification.requestId ||
      !notification.requestType ||
      !notification.type
    ) {
      console.error(
        'Invalid notification: Missing adminId, requestId, or requestType',
        notification,
      )
      setSelectedRequest(notification) // Show only basic details
      setModalOpen(true)
      return
    }
    const userId = notification.userId
    const requestId = notification.requestId
    const requestType =
      notification.requestType === 'development'
        ? 'RequestsDevelopment'
        : 'requestsRepair'

    //console.log("User ID:", notification.userId);
    //console.log("Request ID:", notification.requestId);
    //console.log("Request Type:", requestType);

    //  Ensure requestType is valid before querying Firestore
    if (!requestType) {
      console.error('Invalid request type:', notification.requestType)
      return
    }

    try {
      const requestRef = doc(db, 'Users', userId, requestType, requestId)
      // const requestSnapshot = await getDocs(requestRef);
      const requestSnapshot = await getDoc(requestRef) 

      if (!requestSnapshot.exists()) {
        console.error("Request not found in Firestore.");
          return;
        /*console.log(' Request Found:', requestSnapshot.data())
        setSelectedRequest({
          id: requestId,
          userId,
          requestType: notification.requestType,
          ...requestSnapshot.data(),
        })
        setModalOpen(true)*/
      } 
      setModalOpen(true)
      let requestData = requestSnapshot.data();
      console.log(" Request Found:", requestData);

      let subcollections = {};
           if (requestType === "RequestsDevelopment") {
            const projectDetailsRef = collection(db, "Users", userId, requestType, requestId, "ProjectDetails");
            const projectDetailsSnap = await getDocs(projectDetailsRef);
            if (!projectDetailsSnap.empty) {
              subcollections.projectDetails = projectDetailsSnap.docs[0].data();
            }
          }
           // Fetch 'DeviceDetails' & 'IssueDescription' if it's a repair request
               if (requestType === "requestsRepair") {
                const deviceDetailsRef = collection(db, "Users", userId, requestType, requestId, "DeviceDetails");
                const issueDescriptionRef = collection(db, "Users", userId, requestType, requestId, "IssueDescription");
          
                const [deviceDetailsSnap, issueDescriptionSnap] = await Promise.all([
                  getDocs(deviceDetailsRef),
                  getDocs(issueDescriptionRef)
                ]);
          
                if (!deviceDetailsSnap.empty) {
                  subcollections.deviceDetails = deviceDetailsSnap.docs[0].data();
                }
                if (!issueDescriptionSnap.empty) {
                  subcollections.issueDescription = issueDescriptionSnap.docs[0].data();
                }
              }

               // Fetch user details
                   const userRef = doc(db, "Users", notification.userId);
                   const userSnap = await getDoc(userRef);
                   const userData = userSnap.exists() ? userSnap.data() : {};
               
                   //  Merge all data
                  setSelectedRequest({
                    id: requestId,
                    userId,
                    userName: `${userData.firstName} ${userData.lastName}`,
                    type: notification.requestType,
                    ...requestData,
                    ...subcollections, 
                  });
              
      //  Mark notification as read

      const notificationDoc = doc(
        db,
         'Users',
         auth.currentUser.uid ,
        'Notifications',
        notification.id,
      )
         
        console.log(" Updating Firestore Path:", notificationDoc.path);

      const notificationSnapshot = await getDoc(notificationDoc)
      if (notificationSnapshot.exists()) {
        //  await updateDoc(notificationDoc, { read: true });
        await updateDoc(notificationDoc, { read: true })
        console.log(' Notification marked as read:', notification.id)
      } else {
        console.warn(
          ' Notification document not found while marking as read.',
        )
      }
          //  Update UI Instantly

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notification.id ? { ...notif, read: true } : notif
        )
      );
     
       // Pass the price to the payment page 
   //   const price = requestData.price || null; 
     // navigate('/payment', { state: { price } }); // Pass price to payment page using navigation state
  
     localStorage.setItem('price', requestData.price || '');

    } catch (error) {
      console.error('Error fetching request details:', error)
    }
  }
  const handlePaymentRedirect = () => {
    // Navigate to the payment page
    navigate('/payment')
  }
  // Update request status (Accept/Reject)
  const updateRequestStatus = async (
    userId,
    requestId,
    newStatus,
    requestType,
  ) => {
    if (newStatus === 'accepted' && !price) {
      alert('Please enter a price before accepting the request.')
      return
    }
    try {
      //fire
      const requestDocRef = doc(
        db,
        'Users',
        userId,
        requestType === 'development'
          ? 'RequestsDevelopment'
          : 'requestsRepair',
        requestId,
      )
      await updateDoc(requestDocRef, {
        status: newStatus,
        price: newStatus === 'accepted' ? price : null,
      })

      //real
      const dbR = getDatabase()
      const requestRef = ref(
        dbR,
        `Users/${userId}/${requestType === 'development' ? 'RequestsDevelopment' : 'requestsRepair'}/${requestId}`,
      )

      await update(requestRef, {
        status: newStatus,
        price: newStatus === 'accepted' ? price : null,
      })

      // Send notification to user
      const notificationsRef = collection(db, 'Users', userId, 'Notifications')
      await addDoc(notificationsRef, {
        userId, // ✅ Store user ID
        requestId, // ✅ Store request ID
        requestType,
        message:
          newStatus === 'accepted'
            ? `Your request has been accepted. Please pay $${price}.`
            : 'Your request has been rejected.',
        type:
          newStatus === 'accepted' ? 'request_accepted' : 'request_rejected',
        timestamp: new Date().toISOString(),
      })

      setShowPriceInput(null)
      setPrice('')
      setModalOpen(false)
    } catch (error) {
      console.error('Error updating request status:', error)
    }
  }

  return (
    <Box p={4}>
      <FormControl
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <FormLabel
          htmlFor="notificationEmails"
          mb={0}
          cursor="pointer"
          userSelect="none"
        >
          Receive notification emails
        </FormLabel>
        <Switch id="notificationEmails" />
      </FormControl>
      <Box p={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Notifications
        </Text>

        {loading ? (
          <Spinner size="xl" />
        ) : notifications.length === 0 ? (
          <Text color="gray.500">No notifications available.</Text>
        ) : (
          <VStack spacing={3} align="start">
            {notifications.map(notification => (
              <Box
                key={notification.id}
                p={3}
                borderWidth="1px"
                borderRadius="md"
                width="100%"
                bg={notification.read ? 'gray.100' : 'blue.100'}
                onClick={() => handleNotificationClick(notification)}
                cursor="pointer"
              >
                <Badge
                  colorScheme={
                    notification.type === 'request_accepted' ? 'green' : 'red'
                  }
                >
                  {notification.type.replace('_', ' ')}
                </Badge>
                <Text mt={2}>{notification.message}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(notification.timestamp).toLocaleString()}
                </Text>
              </Box>
            ))}
          </VStack>
        )}

        {/*  Modal for Request Details */}
        {selectedRequest && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <ModalOverlay />
            <ModalContent borderRadius="md" overflow="hidden">
              <ModalHeader bg="teal.500" color="white" borderTopRadius="md"
              >Notification Details
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody p={4}>
               
                  {/* Show basic details for normal users */}
                  <Box mt={4}>
                    <Text fontSize="md">
                      {selectedRequest?.type === 'development'
                        ? `Project Name: ${selectedRequest?.projectDetails?.projectName || 'No project name available'}`
                        : `Damage Title: ${selectedRequest?.issueDescription?.damageTitle || 'No damage title available'}
                        
                        `
                        
                        }
                    </Text>
                  </Box>
                  <Button
                colorScheme="teal"
                onClick={handlePaymentRedirect}
                
                
                mt={4}
                width="100%"
              >
                Proceed to Payment
              </Button>
                
                
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </Box>
  )
}

export default Notifications
