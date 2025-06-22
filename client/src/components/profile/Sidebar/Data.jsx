import { Box, Text, VStack } from '@chakra-ui/react'
import { auth, db } from '../../firebase'
import { getDatabase, ref, get, onValue } from 'firebase/database'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'

function Data() {
  const [requestCount, setRequestCount] = useState(
    () => JSON.parse(localStorage.getItem('requestCount')) || 0,
  ) // Load saved request count from localStorage


  useEffect(() => {
    const fetchRequestCount = async () => {
      const userId = auth.currentUser?.uid // Get the logged-in user ID
      if (!userId) return

      try {
        const db = getDatabase()
        const devRef = ref(db, `Users/${userId}/RequestsDevelopment`)
        const repairRef = ref(db, `Users/${userId}/requestsRepair`)

        // Listen for real-time updates
        onValue(devRef, devSnapshot => {
          onValue(repairRef, repairSnapshot => {
            const devCount = devSnapshot.exists()
              ? Object.keys(devSnapshot.val()).length
              : 0
            const repairCount = repairSnapshot.exists()
              ? Object.keys(repairSnapshot.val()).length
              : 0
            const totalRequests = devCount + repairCount

            setRequestCount(totalRequests) // ✅ Update in real-time
            localStorage.setItem('requestCount', JSON.stringify(totalRequests)) // Save to localStorage
          })
        })
      } catch (error) {
        console.error('Error fetching request count:', error)
      }
    }
    
    fetchRequestCount() //
  }, [])

  const list =[
        { id: 1, name: 'Completed projects', value: 1, color: 'green' },
        {
          id: 2,
          name: 'Projects under construction',
          value: 2,
          color: 'yellow',
        },
        {
          id: 3,
          name: 'Projects you requested',
          value: requestCount,
          color: 'cadet',
        },
      ]

  return (
    <VStack as="ul" spacing={0} listStyleType="none">
      {list.map(item => (
        <Box
          key={item.id}
          as="li"
          w="full"
          py={3}
          px={5}
          d="flex"
          alignItems="center"
          justifyContent="space-between"
          borderBottomWidth={1}
          borderColor="brand.light"
        >
          <Text color="brand.dark">{item.name}</Text>
          <Text color={`brand.${item.color}`} fontWeight="bold">
            {item.value}
          </Text>
        </Box>
      ))}
    </VStack>
  )
}

export default Data




/*import { Box, Text, VStack } from '@chakra-ui/react'

const list = [
  {
    id: 1,
    name: 'Completed projects',
    value: 1,
    color: 'green',
  },
  {
    id: 2,
    name: 'Projects under construction',
    value: 2,
    color: 'yellow',
  },
  {
    id: 3,
    name: 'Projects you requested',
    value: 3,
    color: 'cadet',
  },
]

function Data() {
  return (
    <VStack as="ul" spacing={0} listStyleType="none">
      {list.map(item => (
        <Box
          key={item.id}
          as="li"
          w="full"
          py={3}
          px={5}
          d="flex"
          alignItems="center"
          justifyContent="space-between"
          borderBottomWidth={1}
          borderColor="brand.light"
        >
          <Text color="brand.dark">{item.name}</Text>
          <Text color={`brand.${item.color}`} fontWeight="bold">
            {item.value}
          </Text>
        </Box>
      ))}
    </VStack>
  )
}

export default Data */
