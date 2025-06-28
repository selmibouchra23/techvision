import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  VStack,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Badge,
  Heading,
  Input,
  useToast,
} from '@chakra-ui/react'
import { auth, db } from '../firebase'
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore'
import { getDatabase, ref, get, update, push, set } from 'firebase/database'

function AdminRequests() {
  const toast = useToast(); 
  const [developmentRequests, setDevelopmentRequests] = useState([])
  const [repairRequests, setRepairRequests] = useState([])

  const [selectedRequest, setSelectedRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [price, setPrice] = useState('')
  const [showPriceInput, setShowPriceInput] = useState(null)

  // useEffect(() => {
  //   const fetchRequests = async () => {
  //     setLoading(true)
  //     const db = getDatabase()
  //     const usersRef = ref(db, 'Users')

  //     try {
  //       const snapshot = await get(usersRef)
  //       if (!snapshot.exists()) {
  //         console.error('No users found.')
  //         setLoading(false)
  //         return
  //       }

  //       const usersData = snapshot.val()
  //       let allDevelopmentRequests = []
  //       let allRepairRequests = []

  //       //  Loop through users to get their requests
  //       Object.keys(usersData).forEach(userId => {
  //         const user = usersData[userId]

  //         // Extract user details 
  //         const userEmail = user.email || 'Unknown Email'
  //         const firstName = user.firstName || 'Unknown'
  //         const lastName = user.lastName || 'Unknown'

  //         //  Fetch Development Requests
  //         if (user.RequestsDevelopment) {
  //           Object.keys(user.RequestsDevelopment).forEach(reqId => {
  //             const request = user.RequestsDevelopment[reqId]

  //             allDevelopmentRequests.push({
  //               id: reqId,
  //               userId,
  //               userEmail,
  //               userFullName: `${firstName} ${lastName}`,
  //               status: request.status || 'pending',
  //               //timestamp: request.timestamp   || "Unknown",
  //               rawTimestamp: request.timestamp
  //               ? new Date(request.timestamp).getTime()
  //               : 0,
  //               timestamp: request.timestamp
  //                 ? new Date(request.timestamp).toLocaleString()
  //                 : '0',
  //               //personalInfo: request.PersonalInformations || {},
  //               fullname: request.personalInfo?.fullname || 'Unknown',
  //               fullnameInArabic:
  //                 request.personalInfo?.fullnameInArabic || 'Unknown',
  //               dateOfBirth: request.personalInfo?.dateOfBirth || 'Unknown',
  //               placeOfBirth: request.personalInfo?.placeOfBirth || 'Unknown',
  //               nationalId: request.personalInfo?.nationalId || 'Unknown',
  //               phoneNumber: request.personalInfo?.phoneNumber || 'Unknown',
  //               //academicstatus: request.academicInfo,status || {},
  //               statuss: request.academicInfo?.status || 'Unknown',
  //               institution: request.academicInfo?.institution || 'Unknown',
  //               registrationNumber:
  //                 request.academicInfo?.registrationNumber || 'Unknown',
  //               faculty: request.academicInfo?.faculty || 'Unknown',
  //               department: request.academicInfo?.department || 'Unknown',
  //               fieldOfStudy: request.academicInfo?.fieldOfStudy || 'Unknown',
  //               specialty: request.academicInfo?.specialty || 'Unknown',
  //               companyName: request.academicInfo?.companyName || 'Unknown',
  //               businessType: request.academicInfo?.businessType || 'Unknown',
  //               companyAddress:
  //                 request.academicInfo?.companyAddress || 'Unknown',
  //               otherDetail: request.academicInfo?.otherDetail || 'Unknown',
  //               //ne7tajha fe condition
  //               projectDetails: request.projectDetails || {},
  //               projectName: request.projectDetails?.projectName || 'Unknown',
  //               projectDescription:
  //                 request.projectDetails?.projectDescription || 'Unknown',
  //               technologiesUsed:
  //                 request.projectDetails?.technologiesUsed || 'Unknown',
  //               startDate: request.projectDetails?.startDate || 'Unknown',
  //               endDate: request.projectDetails?.endDate || 'Unknown',
  //               type: 'development',
  //             })
  //           })
  //         }

  //         //  Fetch Repair Requests
  //         if (user.requestsRepair) {
  //           Object.keys(user.requestsRepair).forEach(reqId => {
  //             const request = user.requestsRepair[reqId]

  //             allRepairRequests.push({
  //               id: reqId,
  //               userId,
  //               userEmail,
  //               userFullName: `${firstName} ${lastName}`,
  //               status: request.status || 'pending',
  //               //timestamp: request.timestamp || "Unknown",
  //               rawTimestamp: request.timestamp
  //               ? new Date(request.timestamp).getTime()
  //               : 0,
  //                timestamp: request.timestamp
  //                 ? new Date(request.timestamp).toLocaleString()
  //                 : '0',
  //               //personalInfoRepair: request.personalinforepair || {},
  //               fullname: request.personalInfoRepair?.fullname || 'Unknown',
  //               fullnameInArabic:
  //                 request.personalInfoRepair?.fullnameInArabic || 'Unknown',
  //               dateOfBirth:
  //                 request.personalInfoRepair?.dateOfBirth || 'Unknown',
  //               placeOfBirth:
  //                 request.personalInfoRepair?.placeOfBirth || 'Unknown',
  //               nationalId: request.personalInfoRepair?.nationalId || 'Unknown',
  //               phoneNumber:
  //                 request.personalInfoRepair?.phoneNumber || 'Unknown',
  //               companyName:
  //                 request.personalInfoRepair?.companyName || 'Unknown',
  //               companyAddress:
  //                 request.personalInfoRepair?.companyAddress || 'Unknown',
  //               deviceDetails: request.deviceDetails || {},
  //               deviceType: request.deviceDetails?.deviceType || 'Unknown',
  //               brand: request.deviceDetails?.brand || 'Unknown',
  //               modelNumber: request.deviceDetails?.modelNumber || 'Unknown',
  //               serialNumber: request.deviceDetails?.serialNumber || 'Unknown',
  //               purchaseDate: request.deviceDetails?.purchaseDate || 'Unknown',
  //               warrantyStatus: request.deviceDetails?.status || 'Unknown',
  //               //issueDescription: request.issueDescription || {},
  //               damageTitle: request.issueDescription?.damageTitle || 'Unknown',
  //               damageDescription:
  //                 request.issueDescription?.damageDescription || 'Unknown',
  //               type: 'repair',
  //             })
  //           })
  //         }
  //       })

  //       //  Sort by timestamp (newest first)
  //     /*  allDevelopmentRequests.sort((a, b) =>
  //         new Date(a.timestamp).getTime() < new Date(b.timestamp).getTime() ? 1 : -1
  //       )
  //       allRepairRequests.sort((a, b) =>
  //           new Date(a.timestamp).getTime() < new Date(b.timestamp).getTime() ? 1 : -1
  //     )*/

        
  //       allDevelopmentRequests.sort((a, b) => b.rawTimestamp - a.rawTimestamp);
  //       allRepairRequests.sort((a, b) => b.rawTimestamp - a.rawTimestamp);

  //     /*  allDevelopmentRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  //       allRepairRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  //       */

  //       //  Update State & Save to LocalStorage
  //       setDevelopmentRequests(allDevelopmentRequests)
  //       setRepairRequests(allRepairRequests)
  //       //  localStorage.setItem("developmentRequests", JSON.stringify(allDevelopmentRequests));
  //       //  localStorage.setItem("repairRequests", JSON.stringify(allRepairRequests));
  //     } catch (error) {
  //       console.error('Error fetching requests:', error)
  //     }
  //     setLoading(false)
  //   }

  //   fetchRequests()
  // }, [])

 

useEffect(() => {
  const fetchRequests = async () => {
    setLoading(true);
    const realtimeDb = getDatabase();
    try {
      // 1. Get all users from Firestore
      const usersSnapshot = await getDocs(collection(db, 'Users'));
      let allDevelopmentRequests = [];
      let allRepairRequests = [];

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();

        const userEmail = userData.email || 'Unknown Email';
        const firstName = userData.firstName || 'Unknown';
        const lastName = userData.lastName || 'Unknown';

        // 2. Fetch Development Requests from Realtime DB
        const devRef = ref(realtimeDb, `Users/${userId}/RequestsDevelopment`);
        const devSnap = await get(devRef);
        if (devSnap.exists()) {
          const devData = devSnap.val();
          Object.keys(devData).forEach((reqId) => {
            const req = devData[reqId];
            allDevelopmentRequests.push({
              id: reqId,
              userId,
              userEmail,
              userFullName: `${firstName} ${lastName}`,
              status: req.status || 'pending',
              rawTimestamp: req.timestamp ? new Date(req.timestamp).getTime() : 0,
              timestamp: req.timestamp ? new Date(req.timestamp).toLocaleString() : 'Unknown',
              fullname: req.personalInfo?.fullname || 'Unknown',
              fullnameInArabic: req.personalInfo?.fullnameInArabic || 'Unknown',
              dateOfBirth: req.personalInfo?.dateOfBirth || 'Unknown',
              placeOfBirth: req.personalInfo?.placeOfBirth || 'Unknown',
             // nationalId: req.personalInfo?.nationalId || 'Unknown',
              phoneNumber: req.personalInfo?.phoneNumber || 'Unknown',
              statuss: req.academicInfo?.status || 'Unknown',
              institution: req.academicInfo?.institution || 'Unknown',
              registrationNumber: req.academicInfo?.registrationNumber || 'Unknown',
              faculty: req.academicInfo?.faculty || 'Unknown',
              department: req.academicInfo?.department || 'Unknown',
              fieldOfStudy: req.academicInfo?.fieldOfStudy || 'Unknown',
              specialty: req.academicInfo?.specialty || 'Unknown',
              companyName: req.academicInfo?.companyName || 'Unknown',
              businessType: req.academicInfo?.businessType || 'Unknown',
              companyAddress: req.academicInfo?.companyAddress || 'Unknown',
              otherDetail: req.academicInfo?.otherDetail || 'Unknown',
              projectDetails: req.projectDetails || {},
              projectName: req.projectDetails?.projectName || 'Unknown',
              projectype: req.academicInfo?.status || 'Unknown',
              projectDescription: req.projectDetails?.projectDescription || 'Unknown',
              technologiesUsed: req.projectDetails?.technologiesUsed || 'Unknown',
              startDate: req.projectDetails?.startDate || 'Unknown',
              endDate: req.projectDetails?.endDate || 'Unknown',
              type: 'development'
            });
          });
        }

        // 3. Fetch Repair Requests from Realtime DB
        const repairRef = ref(realtimeDb, `Users/${userId}/requestsRepair`);
        const repairSnap = await get(repairRef);
        if (repairSnap.exists()) {
          const repairData = repairSnap.val();
          Object.keys(repairData).forEach((reqId) => {
            const req = repairData[reqId];
            allRepairRequests.push({
              id: reqId,
              userId,
              userEmail,
              userFullName: `${firstName} ${lastName}`,
              status: req.status || 'pending',
              rawTimestamp: req.timestamp ? new Date(req.timestamp).getTime() : 0,
              timestamp: req.timestamp ? new Date(req.timestamp).toLocaleString() : 'Unknown',
              fullname: req.personalInfoRepair?.fullname || 'Unknown',
              fullnameInArabic: req.personalInfoRepair?.fullnameInArabic || 'Unknown',
              dateOfBirth: req.personalInfoRepair?.dateOfBirth || 'Unknown',
              placeOfBirth: req.personalInfoRepair?.placeOfBirth || 'Unknown',
            //  nationalId: req.personalInfoRepair?.nationalId || 'Unknown',
              phoneNumber: req.personalInfoRepair?.phoneNumber || 'Unknown',
              companyName: req.personalInfoRepair?.companyName || 'Unknown',
              companyAddress: req.personalInfoRepair?.companyAddress || 'Unknown',
              deviceDetails: req.deviceDetails || {},
              deviceType: req.deviceDetails?.deviceType || 'Unknown',
              brand: req.deviceDetails?.brand || 'Unknown',
              modelNumber: req.deviceDetails?.modelNumber || 'Unknown',
              serialNumber: req.deviceDetails?.serialNumber || 'Unknown',
              purchaseDate: req.deviceDetails?.purchaseDate || 'Unknown',
              warrantyStatus: req.deviceDetails?.status || 'Unknown',
              damageTitle: req.issueDescription?.damageTitle || 'Unknown',
              damageDescription: req.issueDescription?.damageDescription || 'Unknown',
              type: 'repair'
            });
          });
        }
      }

      // Sort and update state
      allDevelopmentRequests.sort((a, b) => b.rawTimestamp - a.rawTimestamp);
      allRepairRequests.sort((a, b) => b.rawTimestamp - a.rawTimestamp);

      setDevelopmentRequests(allDevelopmentRequests);
      setRepairRequests(allRepairRequests);
    } catch (error) {
      console.error('Error fetching users or requests:', error);
    }
    setLoading(false);
  };

  fetchRequests();
}, []);
 //notif
  
  const sendNotification = async (
    userId,
    requestId,
    requestType,
    message,
    type,
  ) => {
    const db = getDatabase()
    const notificationRef = ref(db, `Users/${userId}/Notifications`)
    const newNotificationRef = push(notificationRef)
    await set(newNotificationRef, {
      userId, // Store user ID
      requestId, //  Store request ID
      requestType,
      message,
      type, //  Store user ID
      timestamp: Date.now(),
      read: false,
    })
  }

  const sendNotification2 = async (
    userId,
    requestId,
    requestType,
    message,
    type,
  ) => {
    const notificationsRef = collection(db, 'Users', userId, 'Notifications')
    await addDoc(notificationsRef, {
      userId, //  Store user ID
      requestId, // Store request ID
      requestType,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
    })
  }

  // Function to update request status in Realtime Database
  const updateRequestStatus = async (
    userId,
    requestId,
    newStatus,
    //type,
    requestType,
  ) => {
    if (newStatus === 'accepted' && !price) {
     // alert('Please enter a price before accepting the request.')
      toast({
        title: "Error",
        description: "Please enter a price before accepting the request.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return
    }
    try {
      // fire
     const requType = requestType === 'development'
            ? 'RequestsDevelopment'
            : 'requestsRepair';

      const requestDocRef = doc(
       // collection(
          db,
          'Users',
          userId,
          requType ,
        requestId,   )
    // );
      await updateDoc(requestDocRef, {
        status: newStatus,
        price: newStatus === 'accepted' ? price : null,
      });
      //real
      const dbR = getDatabase()
      const requestRef = ref(
        dbR,
        `Users/${userId}/${requType}/${requestId}`,
      );

      await update(requestRef, {
        status: newStatus,
        price: newStatus === 'accepted' ? price : null,
      });
        //  Update UI Instantly (Optimistic UI Update)
    setSelectedRequest((prev) => ({
      ...prev,
      status: newStatus,
    }));

     //  Remove Accept/Reject Buttons Immediately
     if (requestType === "development") {
      setDevelopmentRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } else {
      setRepairRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    }

    //  setShowPriceInput(null)
      //setPrice('')
      //Send Notification to Firestore
      await sendNotification2(
        userId,
        requestId,
        requestType,
        newStatus === 'accepted'
          ? `Your request has been accepted. Please pay $${price}.`
          : 'Your request has been rejected.',
        newStatus === 'accepted' ? 'request_accepted' : 'request_rejected',
      )

      //Send Notification to Realtime Database
      await sendNotification(
        userId,

        requestId,
        requestType,
        newStatus === 'accepted'
          ? `Your request has been accepted. Please pay $${price}.`
          : 'Your request has been rejected.',
        newStatus === 'accepted' ? 'request_accepted' : 'request_rejected',
      )


      // Update state to reflect changes
      if (requestType === 'development') {
        setDevelopmentRequests(
          developmentRequests.map(req =>
            req.id === requestId ? { ...req, status: newStatus } : req,
          ),
        )
      } else {
        setRepairRequests(
          repairRequests.map(req =>
            req.id === requestId ? { ...req, status: newStatus } : req,
          ),
        )
      }

      toast({
        title: `Request ${newStatus === "accepted" ? "Accepted" : "Rejected"}!`,
        description: `The request has been ${newStatus}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Close Modal After Confirmation
      setShowPriceInput(null)
      setPrice('')
      onClose()
    } catch (error) {
      console.error('Error updating request status:', error)
      toast({
        title: "Error",
        description: "Failed to update request status. Try again!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const handleOpenDetails = request => {
    console.log('Opening request details:', request) // Debugging
    setSelectedRequest(request)
    onOpen()
  }

  return (
    <Box p={4} flex="1" w-full>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Admin - Manage Requests
      </Text>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          {/* 🔹 Development Requests Section */}
          <Text fontSize="xl" fontWeight="bold" mt={4} color="blue.600">
            Development Requests
          </Text>
          {developmentRequests.length === 0 ? (
            <Alert status="info" mt={2}>
              <AlertIcon />
              No development requests found.
            </Alert>
          ) : (
            <VStack spacing={3} align="start" mt={2}>
              {developmentRequests.map((item, index) => (
                <Box
                  key={item.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  width="100%"
                >
                  <Text fontWeight="bold">
                    Request {index + 1}: {item.projectName}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Submitted by: {item.userFullName} ({item.userEmail}){' '}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Status:
                    <Badge
                      colorScheme={
                        item.status === 'accepted'
                          ? 'green'
                          : item.status === 'rejected'
                            ? 'red'
                            : 'yellow'
                      }
                    >
                      {item.status || 'pending'}
                    </Badge>
                  </Text>
                  <Button
                    size="xs"
                    colorScheme="blue"
                    mt={2}
                    onClick={() => handleOpenDetails(item)}
                  >
                    Details
                  </Button>
                  {item.status === 'pending' && (
                    <>
                      {/*<Input placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} mt={2} />*/}
                      {showPriceInput === item.id ? (
                        <>
                          <Input
                            placeholder="Enter price"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            mt={2}
                          />
                          <Button
                            size="xs"
                            colorScheme="blue"
                            mt={2}
                            ml={2}
                            onClick={() =>
                              updateRequestStatus(
                                item.userId,
                                item.id,
                                'accepted',
                                'development',
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
                            onClick={() => setShowPriceInput(item.id)}
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
                                item.userId,
                                item.id,
                                'rejected',
                                'development',
                              )
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {/* <Button 
                      size="xs" 
                      colorScheme="green" 
                      mt={2} ml={2} 
                      onClick={() =>  updateRequestStatus(item.userId, item.id, "accepted", "development")}>
                        Accept
                        </Button>
                      <Button 
                      size="xs" 
                      colorScheme="red" 
                      mt={2} ml={2} 
                      onClick={() => updateRequestStatus(item.userId, item.id, "rejected", "development")}>
                        Reject
                        </Button>*/}
                    </>
                  )}
                </Box>
              ))}
            </VStack>
          )}

          <Divider my={6} />

          {/* 🔹 Repair Requests Section */}
          <Text fontSize="xl" fontWeight="bold" mt={4} color="red.600">
            Repair Requests
          </Text>
          {repairRequests.length === 0 ? (
            <Alert status="info" mt={2}>
              <AlertIcon />
              No repair requests found.
            </Alert>
          ) : (
            <VStack spacing={3} align="start" mt={2}>
              {repairRequests.map((item, index) => (
                <Box
                  key={item.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  width="100%"
                >
                  <Text fontWeight="bold">
                    Request {index + 1}: {item.deviceType || 'Unknown Device'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Submitted by: {item.userFullName} ({item.userEmail})
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Status:
                    <Badge
                      colorScheme={
                        item.status === 'accepted'
                          ? 'green'
                          : item.status === 'rejected'
                            ? 'red'
                            : 'yellow'
                      }
                    >
                      {item.status || 'pending'}
                    </Badge>
                  </Text>
                  <Button
                    size="xs"
                    colorScheme="blue"
                    mt={2}
                    onClick={() => handleOpenDetails(item)}
                  >
                    Details
                  </Button>
                  {item.status === 'pending' && (
                    <>
                      {showPriceInput === item.id ? (
                        <>
                          <Input
                            placeholder="Enter price"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            mt={2}
                          />
                          <Button
                            size="xs"
                            colorScheme="blue"
                            mt={2}
                            ml={2}
                            onClick={() =>
                              updateRequestStatus(
                                item.userId,
                                item.id,
                                'accepted',
                                'repair',
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
                            onClick={() => setShowPriceInput(item.id)}
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
                                item.userId,
                                item.id,
                                'rejected',
                                'repair',
                              )
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {/*  <Button size="xs" colorScheme="green" mt={2} ml={2} onClick={() => updateRequestStatus(item.userId, item.id, "accepted", "repair")}>Accept</Button>
                      <Button size="xs" colorScheme="red" mt={2} ml={2} onClick={() => updateRequestStatus(item.userId, item.id, "rejected", "repair")}>Reject</Button>*/}
                    </>
                  )}
                </Box>
              ))}
            </VStack>
          )}
        </>
      )}

      {/* 🔹 Modal for Request Details */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="teal.500" color="white" borderTopRadius="md">
            Request Details
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={4}>
            {selectedRequest && (
              <>
                {/* If it's a Development Request */}
                {selectedRequest.type === 'development' &&
                  selectedRequest.projectDetails && (
                    <>
                      <Badge
                        colorScheme={
                          selectedRequest.type === 'development'
                            ? 'blue'
                            : 'red'
                        }
                        mb={2}
                      >
                        {selectedRequest.type === 'development'
                          ? 'Development Request'
                          : 'Repair Request'}
                      </Badge>

                      {/* 🔹 General Information */}
                      <Box bg="gray.50" p={4} borderRadius="md" shadow="sm">
                        <Heading size="md" color="blue.700" mb={2}>
                          General Information
                        </Heading>
                        <Divider mb={3} />
                        <VStack align="start" spacing={2}>
                          <Text>
                            <b>Full Name:</b> {selectedRequest.fullname}{' '}
                          </Text>
                          <Text>
                            <b>Full Name (Arabic):</b>{' '}
                            {selectedRequest.fullnameInArabic || 'Unnamed'}
                          </Text>
                          <Text>
                            <b>Date of Birth:</b>{' '}
                            {selectedRequest.dateOfBirth || 'Unknown'}
                          </Text>
                          <Text>
                            <b>Place of Birth:</b>{' '}
                            {selectedRequest.placeOfBirth || 'Unknown'}
                          </Text>
                         {/* <Text>
                            <b>National ID:</b>{' '}
                            {selectedRequest.nationalId || 'Unknown'}
                          </Text>*/}
                          <Text>
                            <b>Phone Number:</b>{' '}
                            {selectedRequest.phoneNumber || 'Unknown'}
                          </Text>
                          <Text>
                            <b>Email:</b>{' '}
                            {selectedRequest.userEmail || 'Unknown'}
                          </Text>
                          <Text>
                            <b>Status:</b>
                            <Badge
                              colorScheme={
                                selectedRequest.status === 'accepted'
                                  ? 'green'
                                  : selectedRequest.status === 'rejected'
                                    ? 'red'
                                    : 'yellow'
                              }
                            >
                              {selectedRequest.status || 'pending'}
                            </Badge>
                          </Text>
                          <Text>
                            <b>Submission Date:</b>{' '}
                            {selectedRequest.timestamp || 'Unknown'}
                          </Text>
                        </VStack>
                      </Box>

                      {/* 🔹 Academic Details Section */}
                      <Box
                        bg="gray.50"
                        p={4}
                        borderRadius="md"
                        shadow="sm"
                        mt={4}
                      >
                        <Heading size="md" color="purple.700" mb={2}>
                          Academic Details
                        </Heading>
                        <Divider mb={3} />

                        <Text>
                          <b>Status:</b> {selectedRequest.statuss || 'Unknown'}
                        </Text>

                        {selectedRequest.statuss === 'student' && (
                          <VStack align="start" spacing={2} mt={2}>
                            <Text>
                              <b>University:</b>{' '}
                              {selectedRequest.institution || 'N/A'}
                            </Text>
                            <Text>
                              <b>Registration Number:</b>{' '}
                              {selectedRequest.registrationNumber || 'N/A'}
                            </Text>
                            <Text>
                              <b>Faculty:</b> {selectedRequest.faculty || 'N/A'}
                            </Text>
                            <Text>
                              <b>Department:</b>{' '}
                              {selectedRequest.department || 'N/A'}
                            </Text>
                            <Text>
                              <b>Field of Study:</b>{' '}
                              {selectedRequest.fieldOfStudy || 'N/A'}
                            </Text>
                            <Text>
                              <b>Specialty:</b>{' '}
                              {selectedRequest.specialty || 'N/A'}
                            </Text>
                          </VStack>
                        )}

                        {selectedRequest.statuss === 'businessOwner' && (
                          <VStack align="start" spacing={2} mt={2}>
                            <Text>
                              <b>Company Name:</b>{' '}
                              {selectedRequest.companyName || 'N/A'}
                            </Text>
                            <Text>
                              <b>Business Type:</b>{' '}
                              {selectedRequest.businessType || 'N/A'}
                            </Text>
                            <Text>
                              <b>Company Address:</b>{' '}
                              {selectedRequest.companyAddress || 'N/A'}
                            </Text>
                          </VStack>
                        )}

                        {selectedRequest.statuss === 'other' && (
                          <Text mt={2}>
                            <b>Other Details:</b>{' '}
                            {selectedRequest.otherDetail || 'N/A'}
                          </Text>
                        )}
                      </Box>

                      {/* 🔹 Project Details Section */}
                      <Box
                        bg="gray.50"
                        p={4}
                        borderRadius="md"
                        shadow="sm"
                        mt={4}
                      >
                        <Heading size="md" color="green.700" mb={2}>
                          Project Details
                        </Heading>
                        <Divider mb={3} />

                        <VStack align="start" spacing={2}>
                          <Text>
                            <b>Project Name:</b>{' '}
                            {selectedRequest.projectName || 'Unnamed Project'}
                          </Text>
                           <Text>
                            <b>Project Type:</b>{' '}
                            {selectedRequest.projectype || 'Unnamed Project'}
                          </Text>
          
                          <Text>
                            <b>Project Description:</b>{' '}
                            {selectedRequest.projectDescription ||
                              'No Description'}
                          </Text>
                          <Text>
                            <b>Technologies Used:</b>{' '}
                            {selectedRequest.technologiesUsed ||
                              'Not Specified'}
                          </Text>
                          <Text>
                            <b>Start Date:</b>{' '}
                            {selectedRequest.startDate || 'Unknown'}
                          </Text>
                          <Text>
                            <b>End Date:</b>{' '}
                            {selectedRequest.endDate || 'Unknown'}
                          </Text>
                        </VStack>
                      </Box>
                    </>
                  )}

                {/* If it's a Repair Request */}
                {selectedRequest.type === 'repair' &&
                  selectedRequest.deviceDetails && (
                    <>
                      <Badge colorScheme="red" mb={2}>
                        Repair Request
                      </Badge>

                      {/* 🔹 Personal Information Section */}
                      <Box bg="gray.50" p={4} borderRadius="md" shadow="sm">
                        <Heading size="md" color="red.700" mb={2}>
                          General Informations
                        </Heading>
                        <Divider mb={3} />

                        <VStack align="start" spacing={2}>
                          <Text>
                            <b>Full Name:</b>{' '}
                            {selectedRequest.fullname || 'Unnamed'}
                          </Text>
                          <Text>
                            <b>Full Name (Arabic):</b>{' '}
                            {selectedRequest.fullnameInArabic || 'Unnamed'}
                          </Text>
                          <Text>
                            <b>Date of Birth:</b>{' '}
                            {selectedRequest.dateOfBirth || 'Unknown'}
                          </Text>
                          <Text>
                            <b>Place of Birth:</b>{' '}
                            {selectedRequest.placeOfBirth || 'Unknown'}
                          </Text>
                        {/*}  <Text>
                            <b>National ID:</b>{' '}
                            {selectedRequest.nationalId || 'Unknown'}
                          </Text>*/}
                          <Text>
                            <b>Phone Number:</b>{' '}
                            {selectedRequest.phoneNumber || 'Unknown'}
                          </Text>
                          <Text>
                            <b>Company Name:</b>{' '}
                            {selectedRequest.companyName || 'Unknown'}
                          </Text>
                          <Text>
                            <b>Company Address:</b>{' '}
                            {selectedRequest.companyAddress || 'Unknown'}
                          </Text>
                        </VStack>
                      </Box>

                      {/* 🔹 Device Details Section */}
                      <Box
                        bg="gray.50"
                        p={4}
                        borderRadius="md"
                        shadow="sm"
                        mt={4}
                      >
                        <Heading size="md" color="blue.700" mb={2}>
                          Device Details
                        </Heading>
                        <Divider mb={3} />

                        <VStack align="start" spacing={2}>
                          <Text>
                            <b>Device Type:</b>{' '}
                            {selectedRequest.deviceType || 'Unknown Device'}
                          </Text>
                          <Text>
                            <b>Brand:</b> {selectedRequest.brand || 'Unknown'}
                          </Text>
                          <Text>
                            <b>Model Number:</b>{' '}
                            {selectedRequest.modelNumber || 'Unknown'}
                          </Text>
                          <Text>
                            <b>Serial Number:</b>{' '}
                            {selectedRequest.serialNumber || 'Unknown'}
                          </Text>
                          <Text>
                            <b>Purchase Date:</b>{' '}
                            {selectedRequest.purchaseDate || 'Unknown'}
                          </Text>
                          <Text>
                            <b>Warranty Status:</b>{' '}
                            {selectedRequest.warrantyStatus || 'Unknown'}
                          </Text>
                        </VStack>
                      </Box>

                      {/* 🔹 Issue Details Section */}
                      <Box
                        bg="gray.50"
                        p={4}
                        borderRadius="md"
                        shadow="sm"
                        mt={4}
                      >
                        <Heading size="md" color="purple.700" mb={2}>
                          Issue Details
                        </Heading>
                        <Divider mb={3} />

                        <VStack align="start" spacing={2}>
                          <Text>
                            <b>Damage Title:</b>{' '}
                            {selectedRequest.damageTitle || 'No Issue Title'}
                          </Text>
                          <Text>
                            <b>Damage Description:</b>{' '}
                            {selectedRequest.damageDescription ||
                              'No Issue Description'}
                          </Text>
                        </VStack>
                      </Box>
                    </>
                  )}

                {/* Show Status with Badge */}
                <Text fontSize="md" fontWeight="bold" mt={2}>
                  Status:
                </Text>
                <Badge
                  colorScheme={
                    selectedRequest.status === 'accepted'
                      ? 'green'
                      : selectedRequest.status === 'rejected'
                        ? 'red'
                        : 'yellow'
                  }
                  p={2}
                >
                  {selectedRequest.status || 'Pending'}
                </Badge>
                {/* Show Accept/Reject Buttons ONLY IF Status is Pending */}
                {selectedRequest.status === 'pending' && (
                  <Box mt={4}>
                    {showPriceInput === selectedRequest.id ? (
                      <>
                        <Input
                          placeholder="Enter price"
                          value={price}
                          onChange={e => setPrice(e.target.value)}
                          mt={2}
                        />
                        <Button
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
                          colorScheme="green"
                          mr={2}
                          onClick={() => setShowPriceInput(selectedRequest.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          colorScheme="red"
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

                    {/*  <Button 
            colorScheme="green" 
            mr={2} 
            onClick={() => {
              updateRequestStatus(selectedRequest.userId, selectedRequest.id, "accepted", selectedRequest.type);
              onClose(); // Close modal after action
            }}
          >
            Accept
          </Button>

          <Button 
            colorScheme="red" 
            onClick={() => {
              updateRequestStatus(selectedRequest.userId, selectedRequest.id, "rejected", selectedRequest.type);
              onClose(); // Close modal after action
            }}
          >
            Reject
          </Button>*/}
                  </Box>
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AdminRequests










// import { useEffect, useState } from 'react'
// import {
//   Box,
//   Text,
//   VStack,
//   Divider,
//   Spinner,
//   Alert,
//   AlertIcon,
//   Button,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   useDisclosure,
//   Badge,
//   Heading,
//   Input,
//   useToast,
// } from '@chakra-ui/react'
// import { auth, db } from '../firebase'
// import { collection, getDocs, updateDoc, doc, addDoc, getDoc } from 'firebase/firestore'
// import { getDatabase, ref, get, update, push, set } from 'firebase/database'

// function AdminRequests() {
//   const toast = useToast(); 
//   const [developmentRequests, setDevelopmentRequests] = useState([])
//   const [repairRequests, setRepairRequests] = useState([])

//   const [selectedRequest, setSelectedRequest] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const { isOpen, onOpen, onClose } = useDisclosure()
//   const [price, setPrice] = useState('')
//   const [showPriceInput, setShowPriceInput] = useState(null)

//   useEffect(() => {
//     const fetchRequests = async () => {
//       setLoading(true)
//       // const db = getDatabase()
//       // const usersRef = ref(db, 'Users')

//         const userRef = doc(db, "Users", userId);
//   const userSnap = await getDoc(userRef);

//       try {
//        // const snapshot = await get(usersRef)
//         // if (!snapshot.exists()) {
//         //   console.error('No users found.')
//         //   setLoading(false)
//         //   return
//         // }
//         if (!userSnap.exists()) {
//           console.error('No users found.')
//           setLoading(false)
//           return
//         }

//         //const usersData = snapshot.val()
//         const usersData = []
//         const userData = []
//         let allDevelopmentRequests = []
//         let allRepairRequests = []

//         //  Loop through users to get their requests
//         Object.keys(usersData).forEach(userId => {
//           const user = usersData[userId]

//           // Extract user details
//           const userEmail = user.email || 'Unknown Email'
//           const firstName = user.firstName || 'Unknown'
//           const lastName = user.lastName || 'Unknown'

//           //  Fetch Development Requests
//           if (user.RequestsDevelopment) {
//             Object.keys(user.RequestsDevelopment).forEach(reqId => {
//               const request = user.RequestsDevelopment[reqId]

//               allDevelopmentRequests.push({
//                 id: reqId,
//                 userId,
//                 userEmail,
//                 userFullName: `${firstName} ${lastName}`,
//                 status: request.status || 'pending',
//                 //timestamp: request.timestamp   || "Unknown",
//                 rawTimestamp: request.timestamp
//                 ? new Date(request.timestamp).getTime()
//                 : 0,
//                 timestamp: request.timestamp
//                   ? new Date(request.timestamp).toLocaleString()
//                   : '0',
//                 //personalInfo: request.PersonalInformations || {},
//                 fullname: request.personalInfo?.fullname || 'Unknown',
//                 fullnameInArabic:
//                   request.personalInfo?.fullnameInArabic || 'Unknown',
//                 dateOfBirth: request.personalInfo?.dateOfBirth || 'Unknown',
//                 placeOfBirth: request.personalInfo?.placeOfBirth || 'Unknown',
//                 nationalId: request.personalInfo?.nationalId || 'Unknown',
//                 phoneNumber: request.personalInfo?.phoneNumber || 'Unknown',
//                 //academicstatus: request.academicInfo,status || {},
//                 statuss: request.academicInfo?.status || 'Unknown',
//                 institution: request.academicInfo?.institution || 'Unknown',
//                 registrationNumber:
//                   request.academicInfo?.registrationNumber || 'Unknown',
//                 faculty: request.academicInfo?.faculty || 'Unknown',
//                 department: request.academicInfo?.department || 'Unknown',
//                 fieldOfStudy: request.academicInfo?.fieldOfStudy || 'Unknown',
//                 specialty: request.academicInfo?.specialty || 'Unknown',
//                 companyName: request.academicInfo?.companyName || 'Unknown',
//                 businessType: request.academicInfo?.businessType || 'Unknown',
//                 companyAddress:
//                   request.academicInfo?.companyAddress || 'Unknown',
//                 otherDetail: request.academicInfo?.otherDetail || 'Unknown',
//                 //ne7tajha fe condition
//                 projectDetails: request.projectDetails || {},
//                 projectName: request.projectDetails?.projectName || 'Unknown',
//                 projectDescription:
//                   request.projectDetails?.projectDescription || 'Unknown',
//                 technologiesUsed:
//                   request.projectDetails?.technologiesUsed || 'Unknown',
//                 startDate: request.projectDetails?.startDate || 'Unknown',
//                 endDate: request.projectDetails?.endDate || 'Unknown',
//                 type: 'development',
//               })
//             })
//           }

//           //  Fetch Repair Requests
//           if (user.requestsRepair) {
//             Object.keys(user.requestsRepair).forEach(reqId => {
//               const request = user.requestsRepair[reqId]

//               allRepairRequests.push({
//                 id: reqId,
//                 userId,
//                 userEmail,
//                 userFullName: `${firstName} ${lastName}`,
//                 status: request.status || 'pending',
//                 //timestamp: request.timestamp || "Unknown",
//                 rawTimestamp: request.timestamp
//                 ? new Date(request.timestamp).getTime()
//                 : 0,
//                  timestamp: request.timestamp
//                   ? new Date(request.timestamp).toLocaleString()
//                   : '0',
//                 //personalInfoRepair: request.personalinforepair || {},
//                 fullname: request.personalInfoRepair?.fullname || 'Unknown',
//                 fullnameInArabic:
//                   request.personalInfoRepair?.fullnameInArabic || 'Unknown',
//                 dateOfBirth:
//                   request.personalInfoRepair?.dateOfBirth || 'Unknown',
//                 placeOfBirth:
//                   request.personalInfoRepair?.placeOfBirth || 'Unknown',
//                 nationalId: request.personalInfoRepair?.nationalId || 'Unknown',
//                 phoneNumber:
//                   request.personalInfoRepair?.phoneNumber || 'Unknown',
//                 companyName:
//                   request.personalInfoRepair?.companyName || 'Unknown',
//                 companyAddress:
//                   request.personalInfoRepair?.companyAddress || 'Unknown',
//                 deviceDetails: request.deviceDetails || {},
//                 deviceType: request.deviceDetails?.deviceType || 'Unknown',
//                 brand: request.deviceDetails?.brand || 'Unknown',
//                 modelNumber: request.deviceDetails?.modelNumber || 'Unknown',
//                 serialNumber: request.deviceDetails?.serialNumber || 'Unknown',
//                 purchaseDate: request.deviceDetails?.purchaseDate || 'Unknown',
//                 warrantyStatus: request.deviceDetails?.status || 'Unknown',
//                 //issueDescription: request.issueDescription || {},
//                 damageTitle: request.issueDescription?.damageTitle || 'Unknown',
//                 damageDescription:
//                   request.issueDescription?.damageDescription || 'Unknown',
//                 type: 'repair',
//               })
//             })
//           }
//         })
//            userSnap.forEach((doc) => {
//         userData.push({
//           id: doc.id,
//           email: userData.email,
//           ...doc.data(),
//         });
//       });

//         //  Sort by timestamp (newest first)
//       /*  allDevelopmentRequests.sort((a, b) =>
//           new Date(a.timestamp).getTime() < new Date(b.timestamp).getTime() ? 1 : -1
//         )
//         allRepairRequests.sort((a, b) =>
//             new Date(a.timestamp).getTime() < new Date(b.timestamp).getTime() ? 1 : -1
//       )*/

        
//         allDevelopmentRequests.sort((a, b) => b.rawTimestamp - a.rawTimestamp);
//         allRepairRequests.sort((a, b) => b.rawTimestamp - a.rawTimestamp);

//       /*  allDevelopmentRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//         allRepairRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//         */

//         //  Update State & Save to LocalStorage
//         setDevelopmentRequests(allDevelopmentRequests)
//         setRepairRequests(allRepairRequests)
//         //  localStorage.setItem("developmentRequests", JSON.stringify(allDevelopmentRequests));
//         //  localStorage.setItem("repairRequests", JSON.stringify(allRepairRequests));
//       } catch (error) {
//         console.error('Error fetching requests:', error)
//       }
//       setLoading(false)
//     }

//     fetchRequests()
//   }, [])

//   //notif
//   const sendNotification = async (
//     userId,
//     requestId,
//     requestType,
//     message,
//     type,
//   ) => {
//     const db = getDatabase()
//     const notificationRef = ref(db, `Users/${userId}/Notifications`)
//     const newNotificationRef = push(notificationRef)
//     await set(newNotificationRef, {
//       userId, // ✅ Store user ID
//       requestId, // ✅ Store request ID
//       requestType,
//       message,
//       type, // ✅ Store user ID
//       timestamp: Date.now(),
//       read: false,
//     })
//   }

//   const sendNotification2 = async (
//     userId,
//     requestId,
//     requestType,
//     message,
//     type,
//   ) => {
//     const notificationsRef = collection(db, 'Users', userId, 'Notifications')
//     await addDoc(notificationsRef, {
//       userId, //  Store user ID
//       requestId, // Store request ID
//       requestType,
//       message,
//       type,
//       read: false,
//       timestamp: new Date().toISOString(),
//     })
//   }

//   // Function to update request status in Realtime Database
//   const updateRequestStatus = async (
//     userId,
//     requestId,
//     newStatus,
//     //type,
//     requestType,
//   ) => {
//     if (newStatus === 'accepted' && !price) {
//      // alert('Please enter a price before accepting the request.')
//       toast({
//         title: "Error",
//         description: "Please enter a price before accepting the request.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       return
//     }
//     try {
//       // fire
//      const requType = requestType === 'development'
//             ? 'RequestsDevelopment'
//             : 'requestsRepair';

//       const requestDocRef = doc(
//        // collection(
//           db,
//           'Users',
//           userId,
//           requType ,
//         requestId,   )
//     // );
//       await updateDoc(requestDocRef, {
//         status: newStatus,
//         price: newStatus === 'accepted' ? price : null,
//       });
//       //real
//       const dbR = getDatabase()
//       const requestRef = ref(
//         dbR,
//         `Users/${userId}/${requType}/${requestId}`,
//       );

//       await update(requestRef, {
//         status: newStatus,
//         price: newStatus === 'accepted' ? price : null,
//       });
//         //  Update UI Instantly (Optimistic UI Update)
//     setSelectedRequest((prev) => ({
//       ...prev,
//       status: newStatus,
//     }));

//      //  Remove Accept/Reject Buttons Immediately
//      if (requestType === "development") {
//       setDevelopmentRequests((prev) =>
//         prev.map((req) =>
//           req.id === requestId ? { ...req, status: newStatus } : req
//         )
//       );
//     } else {
//       setRepairRequests((prev) =>
//         prev.map((req) =>
//           req.id === requestId ? { ...req, status: newStatus } : req
//         )
//       );
//     }

//     //  setShowPriceInput(null)
//       //setPrice('')
//       //Send Notification to Firestore
//       await sendNotification2(
//         userId,
//         requestId,
//         requestType,
//         newStatus === 'accepted'
//           ? `Your request has been accepted. Please pay $${price}.`
//           : 'Your request has been rejected.',
//         newStatus === 'accepted' ? 'request_accepted' : 'request_rejected',
//       )

//       //Send Notification to Realtime Database
//       await sendNotification(
//         userId,

//         requestId,
//         requestType,
//         newStatus === 'accepted'
//           ? `Your request has been accepted. Please pay $${price}.`
//           : 'Your request has been rejected.',
//         newStatus === 'accepted' ? 'request_accepted' : 'request_rejected',
//       )


//       // Update state to reflect changes
//       if (requestType === 'development') {
//         setDevelopmentRequests(
//           developmentRequests.map(req =>
//             req.id === requestId ? { ...req, status: newStatus } : req,
//           ),
//         )
//       } else {
//         setRepairRequests(
//           repairRequests.map(req =>
//             req.id === requestId ? { ...req, status: newStatus } : req,
//           ),
//         )
//       }

//       toast({
//         title: `Request ${newStatus === "accepted" ? "Accepted" : "Rejected"}!`,
//         description: `The request has been ${newStatus}.`,
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });

//       // Close Modal After Confirmation
//       setShowPriceInput(null)
//       setPrice('')
//       onClose()
//     } catch (error) {
//       console.error('Error updating request status:', error)
//       toast({
//         title: "Error",
//         description: "Failed to update request status. Try again!",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   }

//   const handleOpenDetails = request => {
//     console.log('Opening request details:', request) // Debugging
//     setSelectedRequest(request)
//     onOpen()
//   }

//   return (
//     <Box p={4} flex="1" w-full>
//       <Text fontSize="2xl" fontWeight="bold" mb={4}>
//         Admin - Manage Requests
//       </Text>

//       {loading ? (
//         <Spinner size="xl" />
//       ) : (
//         <>
//           {/* 🔹 Development Requests Section */}
//           <Text fontSize="xl" fontWeight="bold" mt={4} color="blue.600">
//             Development Requests
//           </Text>
//           {developmentRequests.length === 0 ? (
//             <Alert status="info" mt={2}>
//               <AlertIcon />
//               No development requests found.
//             </Alert>
//           ) : (
//             <VStack spacing={3} align="start" mt={2}>
//               {developmentRequests.map((item, index) => (
//                 <Box
//                   key={item.id}
//                   p={3}
//                   borderWidth="1px"
//                   borderRadius="md"
//                   width="100%"
//                 >
//                   <Text fontWeight="bold">
//                     Request {index + 1}: {item.projectName}
//                   </Text>
//                   <Text fontSize="sm" color="gray.500">
//                     Submitted by: {item.userFullName} ({item.userEmail}){' '}
//                   </Text>
//                   <Text fontSize="sm" color="gray.500">
//                     Status:
//                     <Badge
//                       colorScheme={
//                         item.status === 'accepted'
//                           ? 'green'
//                           : item.status === 'rejected'
//                             ? 'red'
//                             : 'yellow'
//                       }
//                     >
//                       {item.status || 'pending'}
//                     </Badge>
//                   </Text>
//                   <Button
//                     size="xs"
//                     colorScheme="blue"
//                     mt={2}
//                     onClick={() => handleOpenDetails(item)}
//                   >
//                     Details
//                   </Button>
//                   {item.status === 'pending' && (
//                     <>
//                       {/*<Input placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} mt={2} />*/}
//                       {showPriceInput === item.id ? (
//                         <>
//                           <Input
//                             placeholder="Enter price"
//                             value={price}
//                             onChange={e => setPrice(e.target.value)}
//                             mt={2}
//                           />
//                           <Button
//                             size="xs"
//                             colorScheme="blue"
//                             mt={2}
//                             ml={2}
//                             onClick={() =>
//                               updateRequestStatus(
//                                 item.userId,
//                                 item.id,
//                                 'accepted',
//                                 'development',
//                               )
//                             }
//                           >
//                             Confirm
//                           </Button>
//                           <Button
//                             size="xs"
//                             colorScheme="gray"
//                             mt={2}
//                             ml={2}
//                             onClick={() => {
//                               setShowPriceInput(null)
//                               setPrice('')
//                             }}
//                           >
//                             Cancel
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button
//                             size="xs"
//                             colorScheme="green"
//                             mt={2}
//                             ml={2}
//                             onClick={() => setShowPriceInput(item.id)}
//                           >
//                             Accept
//                           </Button>
//                           <Button
//                             size="xs"
//                             colorScheme="red"
//                             mt={2}
//                             ml={2}
//                             onClick={() =>
//                               updateRequestStatus(
//                                 item.userId,
//                                 item.id,
//                                 'rejected',
//                                 'development',
//                               )
//                             }
//                           >
//                             Reject
//                           </Button>
//                         </>
//                       )}
//                       {/* <Button 
//                       size="xs" 
//                       colorScheme="green" 
//                       mt={2} ml={2} 
//                       onClick={() =>  updateRequestStatus(item.userId, item.id, "accepted", "development")}>
//                         Accept
//                         </Button>
//                       <Button 
//                       size="xs" 
//                       colorScheme="red" 
//                       mt={2} ml={2} 
//                       onClick={() => updateRequestStatus(item.userId, item.id, "rejected", "development")}>
//                         Reject
//                         </Button>*/}
//                     </>
//                   )}
//                 </Box>
//               ))}
//             </VStack>
//           )}

//           <Divider my={6} />

//           {/* 🔹 Repair Requests Section */}
//           <Text fontSize="xl" fontWeight="bold" mt={4} color="red.600">
//             Repair Requests
//           </Text>
//           {repairRequests.length === 0 ? (
//             <Alert status="info" mt={2}>
//               <AlertIcon />
//               No repair requests found.
//             </Alert>
//           ) : (
//             <VStack spacing={3} align="start" mt={2}>
//               {repairRequests.map((item, index) => (
//                 <Box
//                   key={item.id}
//                   p={3}
//                   borderWidth="1px"
//                   borderRadius="md"
//                   width="100%"
//                 >
//                   <Text fontWeight="bold">
//                     Request {index + 1}: {item.deviceType || 'Unknown Device'}
//                   </Text>
//                   <Text fontSize="sm" color="gray.500">
//                     Submitted by: {item.userFullName} ({item.userEmail})
//                   </Text>
//                   <Text fontSize="sm" color="gray.500">
//                     Status:
//                     <Badge
//                       colorScheme={
//                         item.status === 'accepted'
//                           ? 'green'
//                           : item.status === 'rejected'
//                             ? 'red'
//                             : 'yellow'
//                       }
//                     >
//                       {item.status || 'pending'}
//                     </Badge>
//                   </Text>
//                   <Button
//                     size="xs"
//                     colorScheme="blue"
//                     mt={2}
//                     onClick={() => handleOpenDetails(item)}
//                   >
//                     Details
//                   </Button>
//                   {item.status === 'pending' && (
//                     <>
//                       {showPriceInput === item.id ? (
//                         <>
//                           <Input
//                             placeholder="Enter price"
//                             value={price}
//                             onChange={e => setPrice(e.target.value)}
//                             mt={2}
//                           />
//                           <Button
//                             size="xs"
//                             colorScheme="blue"
//                             mt={2}
//                             ml={2}
//                             onClick={() =>
//                               updateRequestStatus(
//                                 item.userId,
//                                 item.id,
//                                 'accepted',
//                                 'repair',
//                               )
//                             }
//                           >
//                             Confirm
//                           </Button>
//                           <Button
//                             size="xs"
//                             colorScheme="gray"
//                             mt={2}
//                             ml={2}
//                             onClick={() => {
//                               setShowPriceInput(null)
//                               setPrice('')
//                             }}
//                           >
//                             Cancel
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button
//                             size="xs"
//                             colorScheme="green"
//                             mt={2}
//                             ml={2}
//                             onClick={() => setShowPriceInput(item.id)}
//                           >
//                             Accept
//                           </Button>
//                           <Button
//                             size="xs"
//                             colorScheme="red"
//                             mt={2}
//                             ml={2}
//                             onClick={() =>
//                               updateRequestStatus(
//                                 item.userId,
//                                 item.id,
//                                 'rejected',
//                                 'repair',
//                               )
//                             }
//                           >
//                             Reject
//                           </Button>
//                         </>
//                       )}
//                       {/*  <Button size="xs" colorScheme="green" mt={2} ml={2} onClick={() => updateRequestStatus(item.userId, item.id, "accepted", "repair")}>Accept</Button>
//                       <Button size="xs" colorScheme="red" mt={2} ml={2} onClick={() => updateRequestStatus(item.userId, item.id, "rejected", "repair")}>Reject</Button>*/}
//                     </>
//                   )}
//                 </Box>
//               ))}
//             </VStack>
//           )}
//         </>
//       )}

//       {/* 🔹 Modal for Request Details */}
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader bg="teal.500" color="white" borderTopRadius="md">
//             Request Details
//           </ModalHeader>
//           <ModalCloseButton color="white" />
//           <ModalBody p={4}>
//             {selectedRequest && (
//               <>
//                 {/* If it's a Development Request */}
//                 {selectedRequest.type === 'development' &&
//                   selectedRequest.projectDetails && (
//                     <>
//                       <Badge
//                         colorScheme={
//                           selectedRequest.type === 'development'
//                             ? 'blue'
//                             : 'red'
//                         }
//                         mb={2}
//                       >
//                         {selectedRequest.type === 'development'
//                           ? 'Development Request'
//                           : 'Repair Request'}
//                       </Badge>

//                       {/* 🔹 General Information */}
//                       <Box bg="gray.50" p={4} borderRadius="md" shadow="sm">
//                         <Heading size="md" color="blue.700" mb={2}>
//                           General Information
//                         </Heading>
//                         <Divider mb={3} />
//                         <VStack align="start" spacing={2}>
//                           <Text>
//                             <b>Full Name:</b> {selectedRequest.fullname}{' '}
//                           </Text>
//                           <Text>
//                             <b>Full Name (Arabic):</b>{' '}
//                             {selectedRequest.fullnameInArabic || 'Unnamed'}
//                           </Text>
//                           <Text>
//                             <b>Date of Birth:</b>{' '}
//                             {selectedRequest.dateOfBirth || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Place of Birth:</b>{' '}
//                             {selectedRequest.placeOfBirth || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>National ID:</b>{' '}
//                             {selectedRequest.nationalId || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Phone Number:</b>{' '}
//                             {selectedRequest.phoneNumber || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Email:</b>{' '}
//                             {selectedRequest.userEmail || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Status:</b>
//                             <Badge
//                               colorScheme={
//                                 selectedRequest.status === 'accepted'
//                                   ? 'green'
//                                   : selectedRequest.status === 'rejected'
//                                     ? 'red'
//                                     : 'yellow'
//                               }
//                             >
//                               {selectedRequest.status || 'pending'}
//                             </Badge>
//                           </Text>
//                           <Text>
//                             <b>Submission Date:</b>{' '}
//                             {selectedRequest.timestamp || 'Unknown'}
//                           </Text>
//                         </VStack>
//                       </Box>

//                       {/* 🔹 Academic Details Section */}
//                       <Box
//                         bg="gray.50"
//                         p={4}
//                         borderRadius="md"
//                         shadow="sm"
//                         mt={4}
//                       >
//                         <Heading size="md" color="purple.700" mb={2}>
//                           Academic Details
//                         </Heading>
//                         <Divider mb={3} />

//                         <Text>
//                           <b>Status:</b> {selectedRequest.statuss || 'Unknown'}
//                         </Text>

//                         {selectedRequest.statuss === 'student' && (
//                           <VStack align="start" spacing={2} mt={2}>
//                             <Text>
//                               <b>University:</b>{' '}
//                               {selectedRequest.institution || 'N/A'}
//                             </Text>
//                             <Text>
//                               <b>Registration Number:</b>{' '}
//                               {selectedRequest.registrationNumber || 'N/A'}
//                             </Text>
//                             <Text>
//                               <b>Faculty:</b> {selectedRequest.faculty || 'N/A'}
//                             </Text>
//                             <Text>
//                               <b>Department:</b>{' '}
//                               {selectedRequest.department || 'N/A'}
//                             </Text>
//                             <Text>
//                               <b>Field of Study:</b>{' '}
//                               {selectedRequest.fieldOfStudy || 'N/A'}
//                             </Text>
//                             <Text>
//                               <b>Specialty:</b>{' '}
//                               {selectedRequest.specialty || 'N/A'}
//                             </Text>
//                           </VStack>
//                         )}

//                         {selectedRequest.statuss === 'businessOwner' && (
//                           <VStack align="start" spacing={2} mt={2}>
//                             <Text>
//                               <b>Company Name:</b>{' '}
//                               {selectedRequest.companyName || 'N/A'}
//                             </Text>
//                             <Text>
//                               <b>Business Type:</b>{' '}
//                               {selectedRequest.businessType || 'N/A'}
//                             </Text>
//                             <Text>
//                               <b>Company Address:</b>{' '}
//                               {selectedRequest.companyAddress || 'N/A'}
//                             </Text>
//                           </VStack>
//                         )}

//                         {selectedRequest.statuss === 'other' && (
//                           <Text mt={2}>
//                             <b>Other Details:</b>{' '}
//                             {selectedRequest.otherDetail || 'N/A'}
//                           </Text>
//                         )}
//                       </Box>

//                       {/* 🔹 Project Details Section */}
//                       <Box
//                         bg="gray.50"
//                         p={4}
//                         borderRadius="md"
//                         shadow="sm"
//                         mt={4}
//                       >
//                         <Heading size="md" color="green.700" mb={2}>
//                           Project Details
//                         </Heading>
//                         <Divider mb={3} />

//                         <VStack align="start" spacing={2}>
//                           <Text>
//                             <b>Project Name:</b>{' '}
//                             {selectedRequest.projectName || 'Unnamed Project'}
//                           </Text>
//                           <Text>
//                             <b>Project Description:</b>{' '}
//                             {selectedRequest.projectDescription ||
//                               'No Description'}
//                           </Text>
//                           <Text>
//                             <b>Technologies Used:</b>{' '}
//                             {selectedRequest.technologiesUsed ||
//                               'Not Specified'}
//                           </Text>
//                           <Text>
//                             <b>Start Date:</b>{' '}
//                             {selectedRequest.startDate || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>End Date:</b>{' '}
//                             {selectedRequest.endDate || 'Unknown'}
//                           </Text>
//                         </VStack>
//                       </Box>
//                     </>
//                   )}

//                 {/* If it's a Repair Request */}
//                 {selectedRequest.type === 'repair' &&
//                   selectedRequest.deviceDetails && (
//                     <>
//                       <Badge colorScheme="red" mb={2}>
//                         Repair Request
//                       </Badge>

//                       {/* 🔹 Personal Information Section */}
//                       <Box bg="gray.50" p={4} borderRadius="md" shadow="sm">
//                         <Heading size="md" color="red.700" mb={2}>
//                           General Informations
//                         </Heading>
//                         <Divider mb={3} />

//                         <VStack align="start" spacing={2}>
//                           <Text>
//                             <b>Full Name:</b>{' '}
//                             {selectedRequest.fullname || 'Unnamed'}
//                           </Text>
//                           <Text>
//                             <b>Full Name (Arabic):</b>{' '}
//                             {selectedRequest.fullnameInArabic || 'Unnamed'}
//                           </Text>
//                           <Text>
//                             <b>Date of Birth:</b>{' '}
//                             {selectedRequest.dateOfBirth || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Place of Birth:</b>{' '}
//                             {selectedRequest.placeOfBirth || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>National ID:</b>{' '}
//                             {selectedRequest.nationalId || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Phone Number:</b>{' '}
//                             {selectedRequest.phoneNumber || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Company Name:</b>{' '}
//                             {selectedRequest.companyName || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Company Address:</b>{' '}
//                             {selectedRequest.companyAddress || 'Unknown'}
//                           </Text>
//                         </VStack>
//                       </Box>

//                       {/* 🔹 Device Details Section */}
//                       <Box
//                         bg="gray.50"
//                         p={4}
//                         borderRadius="md"
//                         shadow="sm"
//                         mt={4}
//                       >
//                         <Heading size="md" color="blue.700" mb={2}>
//                           Device Details
//                         </Heading>
//                         <Divider mb={3} />

//                         <VStack align="start" spacing={2}>
//                           <Text>
//                             <b>Device Type:</b>{' '}
//                             {selectedRequest.deviceType || 'Unknown Device'}
//                           </Text>
//                           <Text>
//                             <b>Brand:</b> {selectedRequest.brand || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Model Number:</b>{' '}
//                             {selectedRequest.modelNumber || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Serial Number:</b>{' '}
//                             {selectedRequest.serialNumber || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Purchase Date:</b>{' '}
//                             {selectedRequest.purchaseDate || 'Unknown'}
//                           </Text>
//                           <Text>
//                             <b>Warranty Status:</b>{' '}
//                             {selectedRequest.warrantyStatus || 'Unknown'}
//                           </Text>
//                         </VStack>
//                       </Box>

//                       {/* 🔹 Issue Details Section */}
//                       <Box
//                         bg="gray.50"
//                         p={4}
//                         borderRadius="md"
//                         shadow="sm"
//                         mt={4}
//                       >
//                         <Heading size="md" color="purple.700" mb={2}>
//                           Issue Details
//                         </Heading>
//                         <Divider mb={3} />

//                         <VStack align="start" spacing={2}>
//                           <Text>
//                             <b>Damage Title:</b>{' '}
//                             {selectedRequest.damageTitle || 'No Issue Title'}
//                           </Text>
//                           <Text>
//                             <b>Damage Description:</b>{' '}
//                             {selectedRequest.damageDescription ||
//                               'No Issue Description'}
//                           </Text>
//                         </VStack>
//                       </Box>
//                     </>
//                   )}

//                 {/* Show Status with Badge */}
//                 <Text fontSize="md" fontWeight="bold" mt={2}>
//                   Status:
//                 </Text>
//                 <Badge
//                   colorScheme={
//                     selectedRequest.status === 'accepted'
//                       ? 'green'
//                       : selectedRequest.status === 'rejected'
//                         ? 'red'
//                         : 'yellow'
//                   }
//                   p={2}
//                 >
//                   {selectedRequest.status || 'Pending'}
//                 </Badge>
//                 {/* Show Accept/Reject Buttons ONLY IF Status is Pending */}
//                 {selectedRequest.status === 'pending' && (
//                   <Box mt={4}>
//                     {showPriceInput === selectedRequest.id ? (
//                       <>
//                         <Input
//                           placeholder="Enter price"
//                           value={price}
//                           onChange={e => setPrice(e.target.value)}
//                           mt={2}
//                         />
//                         <Button
//                           colorScheme="blue"
//                           mt={2}
//                           ml={2}
//                           onClick={() =>
//                             updateRequestStatus(
//                               selectedRequest.userId,
//                               selectedRequest.id,
//                               'accepted',
//                               selectedRequest.type,
//                             )
//                           }
//                         >
//                           Confirm
//                         </Button>
//                         <Button
//                           colorScheme="gray"
//                           mt={2}
//                           ml={2}
//                           onClick={() => {
//                             setShowPriceInput(null)
//                             setPrice('')
//                           }}
//                         >
//                           Cancel
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <Button
//                           colorScheme="green"
//                           mr={2}
//                           onClick={() => setShowPriceInput(selectedRequest.id)}
//                         >
//                           Accept
//                         </Button>
//                         <Button
//                           colorScheme="red"
//                           onClick={() =>
//                             updateRequestStatus(
//                               selectedRequest.userId,
//                               selectedRequest.id,
//                               'rejected',
//                               selectedRequest.type,
//                             )
//                           }
//                         >
//                           Reject
//                         </Button>
//                       </>
//                     )}

                   
//                   </Box>
//                 )}
//               </>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Box>
//   )
// }

// export default AdminRequests
