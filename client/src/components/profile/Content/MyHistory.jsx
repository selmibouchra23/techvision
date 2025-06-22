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
  HStack,
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react'
import { auth, db } from '../../firebase' // Ensure Firebase is correctly imported
import { collection, getDocs } from 'firebase/firestore'
import { getDatabase, ref, get } from 'firebase/database'

function MyHistory() {
  const [developmentRequests, setDevelopmentRequests] = useState(
    () => JSON.parse(localStorage.getItem('developmentRequests')) || [], // Load from localStorage
  )
  const [repairRequests, setRepairRequests] = useState(
    () => JSON.parse(localStorage.getItem('repairRequests')) || [], // Load from localStorage
  )
  const [selectedRequest, setSelectedRequest] = useState(null) // To store the clicked request details
  const [loading, setLoading] = useState(true)

  const { isOpen, onOpen, onClose } = useDisclosure() // Modal controls

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      const userId = auth.currentUser?.uid // Get logged-in user's ID
      if (!userId) {
        console.error('User not authenticated.')
        setLoading(false)
        return
      }

      try {
        const db = getDatabase()
        // Fetch Development Requests
        const devRef = ref(db, `Users/${userId}/RequestsDevelopment`)
        const devSnapshot = await get(devRef)
        const devRequests = devSnapshot.exists()
          ? Object.entries(devSnapshot.val()).map(([id, data]) => ({
              id,
              ...data,
              projectName:
                data.projectDetails?.projectName || 'Unnamed Project',
              status: data.status || 'pending', // Get status field
               rawTimestamp: data.timestamp ? new Date(data.timestamp).getTime() : 0,
               
               timestamp: data.timestamp || 'Unknown'
            }
          )).sort((a, b) => b.rawTimestamp - a.rawTimestamp) // newest first
          : []

        // Fetch Repair Requests
        const repairRef = ref(db, `Users/${userId}/requestsRepair`)
        const repairSnapshot = await get(repairRef)
        const repairRequests = repairSnapshot.exists()
          ? Object.entries(repairSnapshot.val()).map(([id, data]) => ({
              id,
              ...data,
              deviceType: data.deviceDetails?.deviceType || 'Unknown Device',
              damageTitle:
                data.issueDescription?.damageTitle || 'Unknown Device',
              status: data.status || 'pending', // Get status field
               rawTimestamp: data.timestamp ? new Date(data.timestamp).getTime() : 0,
               
               timestamp: data.timestamp || 'Unknown'
            }
          )).sort((a, b) => b.rawTimestamp - a.rawTimestamp)  //  newest first
          : []

        // 🔹 Save Data in State & Local Storage
        setDevelopmentRequests(devRequests)
        setRepairRequests(repairRequests)
        localStorage.setItem('developmentRequests', JSON.stringify(devRequests))
        localStorage.setItem('repairRequests', JSON.stringify(repairRequests))
      } catch (error) {
        console.error('Error fetching history:', error)
      }

      setLoading(false)
    }

    fetchHistory()
  }, [])

  // Open the modal and set the selected request
  const handleOpenDetails = request => {
    setSelectedRequest(request)
    onOpen()
  }

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        My History
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
             {" You don't have a development request."}
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
                    Request {index + 1}:{item.projectName}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Submitted on: {item.timestamp || 'Unknown'}
                  </Text>
                  {/* 🟢 Display Status */}
                  <Text fontSize="sm">
                    Status:
                    <Badge
                      colorScheme={
                        item.status === 'accepted'
                          ? 'green'
                          : item.status === 'rejected'
                            ? 'red'
                            : 'yellow'
                      }
                      ml={2}
                    >
                      {item.status}
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
             {" You don't have a repair request."}
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
                    Request {index + 1}:{item.deviceType || 'Unknown Device'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Issue: {item.damageTitle || 'No Title'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Submitted on: {item.timestamp || 'Unknown'}
                  </Text>
                  {/* 🟢 Display Status */}
                  <Text fontSize="sm">
                    Status:
                    <Badge
                      colorScheme={
                        item.status === 'accepted'
                          ? 'green'
                          : item.status === 'rejected'
                            ? 'red'
                            : 'yellow'
                      }
                      ml={2}
                    >
                      {item.status}
                    </Badge>
                  </Text>

                  <Button
                    size="xs"
                    colorScheme="red"
                    mt={2}
                    onClick={() => handleOpenDetails(item)}
                  >
                    Details
                  </Button>
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
                {/*  <Text mb={2} fontSize="lg" fontWeight="bold" color="gray.700">ID: {selectedRequest.id}</Text> */}

                {/*  {/* If it's a Development Request */}
                {selectedRequest.projectDetails && (
                  <>
                    <Badge colorScheme="blue" mb={2}>
                      Development Request
                    </Badge>

                    {/* 🔹 Personal Information Section */}
                    <Box bg="gray.50" p={4} borderRadius="md" shadow="sm">
                      <Heading size="md" color="blue.700" mb={2}>
                        Personal Information
                      </Heading>
                      <Divider mb={3} />

                      <VStack align="start" spacing={2}>
                        <Text>
                          <b>Full Name:</b>{' '}
                          {selectedRequest.personalInfo?.fullname || 'Unnamed'}
                        </Text>
                        <Text>
                          <b>Full Name (Arabic):</b>{' '}
                          {selectedRequest.personalInfo?.fullnameInArabic ||
                            'Unnamed'}
                        </Text>
                        <Text>
                          <b>Date of Birth:</b>{' '}
                          {selectedRequest.personalInfo?.dateOfBirth ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>Place of Birth:</b>{' '}
                          {selectedRequest.personalInfo?.placeOfBirth ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>National ID:</b>{' '}
                          {selectedRequest.personalInfo?.nationalId ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>Phone Number:</b>{' '}
                          {selectedRequest.personalInfo?.phoneNumber ||
                            'Unknown'}
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
                        <b>Status:</b>{' '}
                        {selectedRequest.academicInfo?.status || 'Unknown'}
                      </Text>

                      {selectedRequest.academicInfo?.status === 'student' && (
                        <VStack align="start" spacing={2} mt={2}>
                          <Text>
                            <b>University:</b>{' '}
                            {selectedRequest.academicInfo?.institution || 'N/A'}
                          </Text>
                          <Text>
                            <b>Registration Number:</b>{' '}
                            {selectedRequest.academicInfo?.registrationNumber ||
                              'N/A'}
                          </Text>
                          <Text>
                            <b>Faculty:</b>{' '}
                            {selectedRequest.academicInfo?.faculty || 'N/A'}
                          </Text>
                          <Text>
                            <b>Department:</b>{' '}
                            {selectedRequest.academicInfo?.department || 'N/A'}
                          </Text>
                          <Text>
                            <b>Field of Study:</b>{' '}
                            {selectedRequest.academicInfo?.fieldOfStudy ||
                              'N/A'}
                          </Text>
                          <Text>
                            <b>Specialty:</b>{' '}
                            {selectedRequest.academicInfo?.specialty || 'N/A'}
                          </Text>
                        </VStack>
                      )}

                      {selectedRequest.academicInfo?.status ===
                        'businessOwner' && (
                        <VStack align="start" spacing={2} mt={2}>
                          <Text>
                            <b>Company Name:</b>{' '}
                            {selectedRequest.academicInfo?.companyName || 'N/A'}
                          </Text>
                          <Text>
                            <b>Business Type:</b>{' '}
                            {selectedRequest.academicInfo?.businessType ||
                              'N/A'}
                          </Text>
                          <Text>
                            <b>Company Address:</b>{' '}
                            {selectedRequest.academicInfo?.companyAddress ||
                              'N/A'}
                          </Text>
                        </VStack>
                      )}

                      {selectedRequest.academicInfo?.status === 'other' && (
                        <Text mt={2}>
                          <b>Other Details:</b>{' '}
                          {selectedRequest.academicInfo?.otherDetail || 'N/A'}
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
                          {selectedRequest.projectDetails?.projectName ||
                            'Unnamed Project'}
                        </Text>
                        <Text>
                          <b>Project Description:</b>{' '}
                          {selectedRequest.projectDetails?.projectDescription ||
                            'No Description'}
                        </Text>
                        <Text>
                          <b>Technologies Used:</b>{' '}
                          {selectedRequest.projectDetails?.technologiesUsed ||
                            'Not Specified'}
                        </Text>
                        <Text>
                          <b>Start Date:</b>{' '}
                          {selectedRequest.projectDetails?.startDate ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>End Date:</b>{' '}
                          {selectedRequest.projectDetails?.endDate || 'Unknown'}
                        </Text>
                      </VStack>
                    </Box>
                  </>
                )}
                {/* If it's a Repair Request */}
                {/* If it's a Repair Request */}
                {selectedRequest.deviceDetails && (
                  <>
                    <Badge colorScheme="red" mb={2}>
                      Repair Request
                    </Badge>

                    {/* 🔹 Personal Information Section */}
                    <Box bg="gray.50" p={4} borderRadius="md" shadow="sm">
                      <Heading size="md" color="red.700" mb={2}>
                        Personal Information
                      </Heading>
                      <Divider mb={3} />

                      <VStack align="start" spacing={2}>
                        <Text>
                          <b>Full Name:</b>{' '}
                          {selectedRequest.personalInfoRepair?.fullname ||
                            'Unnamed'}
                        </Text>
                        <Text>
                          <b>Full Name (Arabic):</b>{' '}
                          {selectedRequest.personalInfoRepair
                            ?.fullnameInArabic || 'Unnamed'}
                        </Text>
                        <Text>
                          <b>Date of Birth:</b>{' '}
                          {selectedRequest.personalInfoRepair?.dateOfBirth ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>Place of Birth:</b>{' '}
                          {selectedRequest.personalInfoRepair?.placeOfBirth ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>National ID:</b>{' '}
                          {selectedRequest.personalInfoRepair?.nationalId ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>Phone Number:</b>{' '}
                          {selectedRequest.personalInfoRepair?.phoneNumber ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>Company Name:</b>{' '}
                          {selectedRequest.personalInfoRepair?.companyName ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>Company Address:</b>{' '}
                          {selectedRequest.personalInfoRepair?.companyAddress ||
                            'Unknown'}
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
                          {selectedRequest.deviceDetails?.deviceType ||
                            'Unknown Device'}
                        </Text>
                        <Text>
                          <b>Brand:</b>{' '}
                          {selectedRequest.deviceDetails?.brand || 'Unknown'}
                        </Text>
                        <Text>
                          <b>Model Number:</b>{' '}
                          {selectedRequest.deviceDetails?.modelNumber ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>Serial Number:</b>{' '}
                          {selectedRequest.deviceDetails?.serialNumber ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>Purchase Date:</b>{' '}
                          {selectedRequest.deviceDetails?.purchaseDate ||
                            'Unknown'}
                        </Text>
                        <Text>
                          <b>Warranty Status:</b>{' '}
                          {selectedRequest.deviceDetails?.status || 'Unknown'}
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
                          {selectedRequest.issueDescription?.damageTitle ||
                            'No Issue Title'}
                        </Text>
                        <Text>
                          <b>Damage Description:</b>{' '}
                          {selectedRequest.issueDescription
                            ?.damageDescription || 'No Issue Description'}
                        </Text>
                      </VStack>
                    </Box>
                  </>
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default MyHistory

/*import {
  Box,
  Text,
  VStack
} from '@chakra-ui/react';

function MyHistory() {
  const history = []; // Liste vide

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        My History
      </Text>
      {history.length === 0 ? (
        <Text color="gray.500">No history available.</Text>
      ) : (
        <VStack spacing={3} align="start">
          {history.map((item, index) => (
            <Box key={index} p={3} borderWidth="1px" borderRadius="md" width="100%">
              {item}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}

export default MyHistory; */


/*import {
  Box,
  Text,
  VStack
} from '@chakra-ui/react';

function MyHistory() {
  const history = []; // Liste vide

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        My History
      </Text>
      {history.length === 0 ? (
        <Text color="gray.500">No history available.</Text>
      ) : (
        <VStack spacing={3} align="start">
          {history.map((item, index) => (
            <Box key={index} p={3} borderWidth="1px" borderRadius="md" width="100%">
              {item}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}

export default MyHistory; */
