import {
  Box, Avatar, Badge, Button, Heading, VStack, Text,
  useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, ModalCloseButton, HStack
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

function Account() {
  const [adminDetails, setAdminDetails] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const profileImage = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      try {
        const adminRef = doc(db, "Admins", user.uid);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
          const data = adminSnap.data();
          setAdminDetails(data);
          if (data.photoURL) setAdminProfile(data.photoURL);
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    });
    return () => unsubscribe();
  }, []);

  const openChooseImage = () => profileImage.current.click();

  const changeProfileImage = async (event) => {
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    const selected = event.target.files[0];

    if (!selected || !ALLOWED_TYPES.includes(selected.type)) {
      onOpen();
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result; // Base64 string
      setAdminProfile(base64Image); // Set for preview
      setAdminDetails((prev) => ({ ...prev, photoURL: base64Image }));

      try {
        const user = auth.currentUser;
        const adminRef = doc(db, "Admins", user.uid);
        await updateDoc(adminRef, { photoURL: base64Image });
      } catch (error) {
        console.error("Failed to update Firestore with Base64 image:", error);
      }
    };
    reader.readAsDataURL(selected);
  };

  if (!adminDetails) {
    return <p>Loading...</p>;
  }

  return (
    <Box
      maxW="400px"
      bg="gray.800"
      color="white"
      rounded="lg"
      boxShadow="xl"
      textAlign="center"
      p={6}
      mx="auto"
    >
      <VStack spacing={4}>
        <Avatar
          size="2xl"
          name={`${adminDetails.firstName} ${adminDetails.lastName}`}
          src={adminProfile || "/img/tim-cook.jpg"}
          border="4px solid white"
        />
        <Badge colorScheme="green" px={3} py={1} borderRadius="full">
          Admin
        </Badge>
        <Heading as="h3" fontSize="xl">
          {`${adminDetails.firstName} ${adminDetails.lastName}`}
        </Heading>
        <Text color="gray.400" fontSize="sm">{adminDetails.email}</Text>
        <Button colorScheme="blue" size="sm" onClick={openChooseImage}>
          Change Profile Picture
        </Button>
        <input hidden type="file" ref={profileImage} onChange={changeProfileImage} />
      </VStack>

      {/* Error Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invalid File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Only PNG, JPG, and JPEG files are supported.</Text>
            <HStack mt={2}>
              <Badge colorScheme="green">PNG</Badge>
              <Badge colorScheme="green">JPG</Badge>
              <Badge colorScheme="green">JPEG</Badge>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Account;



/*import { Box, Avatar, Badge, Button, Heading, VStack, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, HStack } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Account() {
  const [adminDetails, setAdminDetails] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const profileImage = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      try {
        const adminRef = doc(db, "Admins", user.uid);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
          const data = adminSnap.data();
          setAdminDetails(data);
          if (data.photoURL) setAdminProfile(data.photoURL);
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    });
    return () => unsubscribe();
  }, []);

  const openChooseImage = () => profileImage.current.click();

  const changeProfileImage =async (event) => {
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    const selected = event.target.files[0];

  /*  if (selected && ALLOWED_TYPES.includes(selected.type)) {
      let reader = new FileReader();
      reader.onloadend = () => setAdminProfile(reader.result);
      return reader.readAsDataURL(selected);
    }*
   // onOpen();
   if (!selected || !ALLOWED_TYPES.includes(selected.type)) {
    onOpen();
    return;
  }
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result; // Base64 string
    setAdminProfile(base64Image); // Set for preview
    setAdminDetails((prev) => ({ ...prev, photoURL: base64Image }));

    try {
      const user = auth.currentUser;
      const adminRef = doc(db, "Admins", user.uid);
      await updateDoc(adminRef, { photoURL: base64Image });
    } catch (error) {
      console.error("Failed to update Firestore with Base64 image:", error);
    }
  };
  reader.readAsDataURL(selected);

/* 
  const user = auth.currentUser;
 const storage = getStorage();
  const storageRef = ref(storage, `AdminProfileImages/${user.uid}`);
  try {
    // Upload file to Firebase Storage
    await uploadBytes(storageRef, selected);
    // Get the download URL
    const url = await getDownloadURL(storageRef);
    setAdminProfile(url); // update preview
    setAdminDetails((prev) => ({ ...prev, photoURL: url })); // update local state

    // Update Firestore
    const adminRef = doc(db, "Admins", user.uid);
    await updateDoc(adminRef, { photoURL: url });
  } catch (error) {
    console.error("Image upload failed:", error);
  }
  };*

  if (!adminDetails) {
    return <p>Loading...</p>;
  }

  return (
    <Box
      maxW="400px"
      bg="gray.800"
      color="white"
      rounded="lg"
      boxShadow="xl"
      textAlign="center"
      p={6}
      mx="auto"
    >
      <VStack spacing={4}>
        <Avatar
          size="2xl"
          name={`${adminDetails.firstName} ${adminDetails.lastName}`}
          src={adminProfile || /* adminDetails.photoURL || *
            "/img/tim-cook.jpg"}
          border="4px solid white"
        />
        <Badge colorScheme="green" px={3} py={1} borderRadius="full">
          Admin
        </Badge>
        <Heading as="h3" fontSize="xl">
          {`${adminDetails.firstName} ${adminDetails.lastName}`}
        </Heading>
        <Text color="gray.400" fontSize="sm">{adminDetails.email}</Text>
        <Button colorScheme="blue" size="sm" onClick={openChooseImage}>
          Change Profile Picture
        </Button>
        <input hidden type="file" ref={profileImage} onChange={changeProfileImage} />
      </VStack>

      {/* Error Modal *}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invalid File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Only PNG, JPG, and JPEG files are supported.</Text>
            <HStack mt={2}>
              <Badge colorScheme="green">PNG</Badge>
              <Badge colorScheme="green">JPG</Badge>
              <Badge colorScheme="green">JPEG</Badge>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Account;






{/*import { Box, Avatar,
    AvatarBadge,
    Badge,
    Button,
    Heading,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    VStack,} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

function Account() {
  const [adminDetails, setAdminDetails] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null)

  const { isOpen, onOpen, onClose } = useDisclosure()
    const profileImage = useRef(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user)
        {console.log("No user logged in."); return; // If no user is logged in, exit
        }
        console.log("User UID:", user.uid);

      try {
        const adminRef = doc(db, "Admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
            console.log("Admin Data:", adminSnap.data());
          setAdminDetails(adminSnap.data()); // ✅ Save admin details
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    });
    

    return () => unsubscribe(); 
  }, []);

  const openChooseImage = () => {
    profileImage.current.click()
  }
  const changeProfileImage = event => {
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg']
    const selected = event.target.files[0]

    if (selected && ALLOWED_TYPES.includes(selected.type)) {
      let reader = new FileReader()
      reader.onloadend = () => setAdminProfile(reader.result)
      return reader.readAsDataURL(selected)
    }

    onOpen()
  }
  if (!adminDetails) {
    return <p>Loading...</p>
  }

  return (
    <Box
      as="aside"
      flex={1}
      mr={{ base: 0, md: 5 }}
      mb={{ base: 5, md: 0 }}
      bg="gray.800"
      color="white"
      rounded="md"
      textAlign="center"
      borderWidth={1}
      borderColor="brand.light"
      style={{ transform: 'translateY(-100px)' }}
    >
      {adminDetails ? (
        <VStack spacing={3} py={5} borderBottomWidth={1} borderColor="brand.light">
          <Avatar
            size="2xl"
            name={`${adminDetails.firstName} ${adminDetails.lastName}`}
            cursor="pointer"
            src={adminProfile || adminDetails.photoURL ||  '/img/tim-cook.jpg'} // ✅ Default avatar if none
            >
                 <Badge colorScheme="green" fontSize="xs" px={2} borderRadius="full">
              Admin
            </Badge>
           { /*<AvatarBadge bg="brand.blue" boxSize="1em">
                    <svg width="0.4em" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      />
                    </svg>
                  </AvatarBadge>/ }
         </Avatar >
         <input
        hidden
        type="file"
        ref={profileImage}
        onChange={changeProfileImage}
      />
      {/* Error Modal /}
      <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Something went wrong</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text>File not supported!</Text>
                  <HStack mt={1}>
                    <Text color="brand.cadet" fontSize="sm">
                      Supported types:
                    </Text>
                    <Badge colorScheme="green">PNG</Badge>
                    <Badge colorScheme="green">JPG</Badge>
                    <Badge colorScheme="green">JPEG</Badge>
                  </HStack>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose}>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

           <VStack spacing={1}>
                   <Heading as="h3" fontSize="xl" color="gray.200">
                     {`${adminDetails.firstName} ${adminDetails.lastName}`}
                   </Heading>
                   <Text color="gray.400" fontSize="sm">
                     {adminDetails.email}
                   </Text>
                   <Text fontSize="xs" color="blue.300">Admin</Text> 
                 </VStack>
          
        </VStack>
      ) : (
        <Text fontSize="sm">Loading...</Text>
      )}
    </Box>
  );
}

export default Account;
*/
