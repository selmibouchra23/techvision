import { useEffect, useState } from "react";
import {Box,
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
  useToast,

} from "@chakra-ui/react";
import { FormControl, FormLabel, Switch } from '@chakra-ui/react'
import { auth, db } from "../../firebase";
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc,getDocs, addDoc } from "firebase/firestore";
import { getDatabase, ref, get, update, push, set } from 'firebase/database' // hafi li magithach w mchat bla biha nrml 

import notificationSound from "../../../assets/notification.mp3"
function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false)
    const [showPriceInput, setShowPriceInput] = useState(null)
    const [price, setPrice] = useState('')
    const [selectedRequest, setSelectedRequest] = useState(null)
    const toast = useToast();

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const adminRef = collection(db, "Admins", userId, "Notifications");

    const q = query(adminRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => ({
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
          // showSystemNotification(latestNotification)
        }
      setNotifications(newNotifications);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

   //  Function to play notification sound
    const playNotificationSound = () => {
      const audio = new Audio(notificationSound)
      audio.play().catch(error => console.log('Audio play blocked:', error))
    }

     //  When an admin clicks a notification, fetch full request details
  const handleNotificationClick = async notification => {
    console.log('Notification Data:', notification)
    // Check if notification contains required fields
    if (
      !notification.userId ||
      !notification.requestId ||
      !notification.requestType ||
      !notification.type
    ) {
      console.error(
        'Invalid notification: Missing userId, requestId, or requestType',
        notification,
      )
      setSelectedRequest(notification) // Show only basic details
      setModalOpen(true)
      return
    }
     // setSelectedRequest(notification)
      setModalOpen(true);
     
    const userId = notification.userId
    const requestId = notification.requestId
    const requestType =
      notification.requestType === 'development'
        ? 'RequestsDevelopment'
        : 'requestsRepair'

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
        }
        let requestData = requestSnapshot.data();
    console.log("Request Found:", requestData);

    
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

      // Mark notification as read
      const notificationDoc = doc(
        db, 'Admins' , auth.currentUser.uid ,
        'Notifications',
        notification.id,
      )

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
    } catch (error) {
      console.error('Error fetching request details:', error)
    }
  }

   //  Update request status (Accept/Reject)
    const updateRequestStatus = async (
      userId,
      requestId,
      newStatus,
      requestType,
    ) => {
      if (newStatus === 'accepted' && !price) {
        toast({
          title: "Error",
      description: 'Please enter a price before accepting the request.',
      status: "error",
      duration: 3000,
      isClosable: true,
    });
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
        });
  
        //real
        const dbR = getDatabase()
        const requestRef = ref(
          dbR,
          `Users/${userId}/${requestType === 'development' ? 'RequestsDevelopment' : 'requestsRepair'}/${requestId}`,
        )
  
        await update(requestRef, {
          status: newStatus,
          price: newStatus === 'accepted' ? price : null,
        });

        //  Update UI Fast (Optimistic Update)
    setSelectedRequest((prev) => ({
      ...prev,
      status: newStatus,
    }));
     //  Show success toast
     toast({
      title: `Request ${newStatus === "accepted" ? "Accepted" : "Rejected"}!`,
      description: `The request has been ${newStatus}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  
        // Send notification to user
        const notificationsRef = collection(db, 'Users', userId, 'Notifications')
        await addDoc(notificationsRef, {
          userId, 
          requestId, 
          requestType,
          message:
            newStatus === 'accepted'
              ? `Your request has been accepted. Please pay $${price}.`
              : 'Your request has been rejected.',
          type:
            newStatus === 'accepted' ? 'request_accepted' : 'request_rejected',
            read: false,
          timestamp: new Date().toISOString(),
        })
        // real
        const db = getDatabase()
        const notifrefreal =  ref(db, `Users/${userId}/Notifications`)
  
        const newNotificationRef = push(notifrefreal)
            await set(newNotificationRef, {
              userId, 
              requestId, 
              requestType,
              message:
              newStatus === 'accepted'
                ? `Your request has been accepted. Please pay $${price}.`
                : 'Your request has been rejected.',  
              type:
              newStatus === 'accepted' ? 'request_accepted' : 'request_rejected',  
              read: false,
              timestamp: Date.now(),
            })

        setShowPriceInput(null)
        setPrice('')
        setModalOpen(false)
      } catch (error) {
        console.error('Error updating request status:', error);
        toast({
          title: "Error",
          description: "Failed to update request status. Try again!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
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

      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Notifications
      </Text>

      {loading ? (
        <Spinner size="xl" />
      ) : notifications.length === 0 ? (
        <Text color="gray.500">No notifications available.</Text>
      ) : (
        <VStack spacing={3} align="start">
          {notifications.map((notifications) => (
            <Box 
            key={notifications.id}
             p={3} 
             borderWidth="1px"
              borderRadius="md" 
              width="100%"
               bg={notifications.read ? "gray.100" : "blue.100"}
               onClick={() => handleNotificationClick(notifications)}
                cursor="pointer"
               >
              <Badge 
              colorScheme={notifications.type === "request_accepted" ? "green" : "red"}>
                {notifications.type.replace("_", " ")}
              </Badge>
              <Text mt={2}>{notifications.message}</Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(notifications.timestamp).toLocaleString()}
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
                    >
                      Notification Details
                    </ModalHeader>
                    <ModalCloseButton  color="white" />
                    <ModalBody p={4}>
                       <Box mt={4}>
                                            <Badge color="blue.700" fontSize="lg" fontWeight="bold">
                                              Full Request Details
                                            </Badge>

                                            <Box bg="gray.50" p={4} borderRadius="md" shadow="sm">

                        <Divider mb={3} />
                        <VStack align="start" spacing={3}>
                                            <Text >
                                              <b>User:</b> {selectedRequest?.userName}
                                            </Text>
                                            <Text>
                                              <b>Status:</b>
                                              <Badge
                                                colorScheme={selectedRequest?.status === 'accepted'
                                                  ? 'green'
                                                  : selectedRequest?.status === 'rejected'
                                                    ? 'red'
                                                    : 'yellow'
                                              }
                                            >
                                              {selectedRequest?.status || 'pending'}
                                            </Badge>
                                            </Text>
                                            <Text>
                                              <b>Request Type:</b> {selectedRequest?.type}
                                            </Text>
                      
                                            {selectedRequest?.type === 'development' ? (
                                              <>
                                                <Text>
                                                  <b>Project Name:</b>{' '}
                                                  {selectedRequest?.projectDetails?.projectName ||
                                                    'No project name'}
                                                </Text>
                                                <Text>
                                                  <b>Technologies:</b>{' '}
                                                  {selectedRequest?.projectDetails?.technologiesUsed ||
                                                    'Unknown'}
                                                </Text>
                                                
                                              </>
                                              
                                            ) : (
                                              <>
                                                <Text>
                                                  <b>Device Type:</b>{' '}
                                                  {selectedRequest?.deviceDetails?.deviceType ||
                                                    'Unknown Device'}
                                                </Text>
                                                <Text>
                                                  <b>Damage Title:</b>{' '}
                                                  {selectedRequest?.issueDescription?.damageTitle ||
                                                    'No Issue'}
                                                </Text>
                                              </>
                                            )}
                                             </VStack>
                                             </Box>
                                             </Box>
                                            {/* Accept/Reject Buttons */}
                                           {/* <Box mt={4}>
                                              {selectedRequest?.status === 'pending' && (
                                                
                                                  <Box mt={4}>
                                                    {showPriceInput === selectedRequest.id ? (
                                                      <>
                                                        <Input
                                                          placeholder="Enter price"
                                                          value={price}
                                                          onChange={e => setPrice(e.target.value)}
                                                        />
                                                        <Button
                                                          size="xs"
                                                          colorScheme="blue"
                                                          mt={2}
                                                          ml={2}
                                                          onClick={() =>
                                                            updateRequestStatus(
                                                              selectedRequest.userId,
                                                              selectedRequest.id,
                                                              'accepted',
                                                              selectedRequest.type,
                                                            )
                                                          }
                                                        >
                                                          Confirm
                                                        </Button>
                                                        <Button
                                                          size="xs"
                                                          colorScheme="gray"
                                                          mt={2}
                                                          ml={2}
                                                          onClick={() => {
                                                            setShowPriceInput(null)
                                                            setPrice('')
                                                          }}
                                                        >
                                                          Cancel
                                                        </Button>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <Button
                                                          size="xs"
                                                          colorScheme="green"
                                                          mt={2}
                                                          ml={2}
                                                          onClick={() =>
                                                            setShowPriceInput(selectedRequest.id)
                                                          }
                                                        >
                                                          Accept
                                                        </Button>
                                                        <Button
                                                          size="xs"
                                                          colorScheme="red"
                                                          mt={2}
                                                          ml={2}
                                                          onClick={() =>
                                                            updateRequestStatus(
                                                              selectedRequest.userId,
                                                              selectedRequest.id,
                                                              'rejected',
                                                              selectedRequest.type,
                                                            )
                                                          }
                                                        >
                                                          Reject
                                                        </Button>
                                                      </>
                                                    )}
                                                  </Box>
                                                
                                              )}
                                            </Box>*/}
                                        
                                           </ModalBody>
                                                      </ModalContent>
                                                    </Modal>
              )}
              
    </Box>
  );
}

export default AdminNotifications;
