import React, { useState, useEffect } from "react";
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { toast } from 'react-toastify';
import { FormControl, FormLabel, Grid, Input, InputGroup, InputRightElement, Button, Box, Text, VStack } from '@chakra-ui/react';

// أيقونات إظهار وإخفاء كلمة المرور
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.52 10.52 0 0 1 12 20c-7 0-11-8-11-8a19.37 19.37 0 0 1 3.22-4.94"></path>
    <path d="M1 1l22 22"></path>
  </svg>
);

function AccountSettings() {
  const [userDetails, setUserDetails] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // جلب بيانات المستخدم
  const fetchUserDetails = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserDetails(userData);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
        }
      }
    });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // تحديث 
  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      const docRef = doc(db, "Users", user.uid);

      await updateDoc(docRef, {
        firstName,
        lastName,
        email,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile: " + error.message);
    }
  };

  // تغييرر
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password: " + error.message);
    }
  };

  if (!userDetails) {
    return <Text textAlign="center" fontSize="lg" fontWeight="bold" color="gray.600">Loading...</Text>;
  }

  return (
    <Box p={4}>
      <Text textColor= "black" fontSize="xl" fontWeight="bold" mb={4}>Edit My Account</Text>
      
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={10}>
        {/*colon 1*/}
        <VStack spacing={4} align="stretch">
          <FormControl id="firstName">
            <FormLabel color="gray.600">First Name</FormLabel>
            <Input  color="black" borderColor="gray" focusBorderColor="brand.blue" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value) } borderRadius="2"/>
          </FormControl>

          <FormControl id="lastName">
            <FormLabel color="gray.600">Last Name</FormLabel>
            <Input color="black" borderColor="gray" focusBorderColor="brand.blue" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}borderRadius="2" />
          </FormControl>

          <FormControl id="emailAddress">
            <FormLabel color="gray.600">Email Address</FormLabel>
            <Input color="black" borderColor="gray" focusBorderColor="brand.blue" type="email" value={email} onChange={(e) => setEmail(e.target.value)}borderRadius="2" />
          </FormControl>

          <Button colorScheme="blue" onClick={handleUpdateProfile}borderRadius="2">Save Changes</Button>
        </VStack>

        {/* colon 2 */}
        <VStack spacing={4} align="stretch">
          <FormControl id="currentPassword">
            <FormLabel color="gray.600">Current Password</FormLabel>
            <InputGroup>
              <Input color="black" borderColor="gray" focusBorderColor="brand.blue" type={showPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} borderRadius="2" />
              {/*<InputRightElement>
                <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </InputRightElement>*/}
            </InputGroup>
          </FormControl>

          <FormControl id="newPassword">
            <FormLabel color="gray.600">New Password</FormLabel>
            <Input color="black" borderColor="gray" focusBorderColor="brand.blue" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}borderRadius="2" />
          </FormControl>

          <FormControl id="confirmPassword">
            <FormLabel color="gray.600">Confirm New Password</FormLabel>
            <Input color="black" borderColor="gray" focusBorderColor="brand.blue" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}borderRadius="2" />
          </FormControl>

          <Button colorScheme="green" onClick={handleChangePassword} borderRadius="2">Change Password</Button>
        </VStack>
      </Grid>
    </Box>
  );
}

export default AccountSettings;
