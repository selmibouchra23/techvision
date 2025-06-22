import { Box } from '@chakra-ui/react'

import Actions from './Actions'
import Data from './Data'
import Profile from './Profile'

import { useState, useRef, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase'


function Sidebar() {

  const [userDetails, setUserDetails] = useState(null)
  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser
      if (!user) return

      try {
       // let docRef, docSnap

        // Check if user is an admin
        const docRef = doc(db, 'Users', user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setUserDetails(docSnap.data())
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }

    fetchUserDetails()
  }, [])
  
  return (
    <Box
      as="aside"
      flex={1}
      mr={{ base: 0, md: 5 }}
      mb={{ base: 5, md: 0 }}
      bg="white"
      rounded="md"
      borderWidth={1}
      borderColor="brand.light"
      style={{ transform: 'translateY(-100px)' }}
    >
      <Profile />
      <Data />
      <Actions />
    </Box>
  )
}

export default Sidebar
