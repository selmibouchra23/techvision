import { ChakraProvider, Container, Box } from '@chakra-ui/react'
import { theme } from '../../../components/helpers/index'
import AdminDashboard from './AdminDashboard'
export default function AdminNotificationsPage() {
  return (
    <ChakraProvider theme={theme}>
      <Container
      display="flex" 
      maxW="100%"
      height="100vh" // Ensure full height
      overflow="hidden" // Prevent body scroll
      p ={4} //  Adds padding to avoid top cutoff
      alignItems="center" //  Centers content vertically
      justifyContent="center" //  Centers content horizontally
      mt={10} 
      >
        <Box flex="1"
         p={6}
         overflowY="auto" //  Allows scrolling when needed
         maxH="100%"
         height = "100%"
        // bg="gray.50" // Light background for contrast
         bg='gradient-to-br from-indigo-100 via-white to-indigo-200 p-8'
         rounded="md"
        shadow="md"
        sx={{
          // Hides scrollbar for WebKit browsers
          '::-webkit-scrollbar': {
            display: 'none',
          },
          // Hides scrollbar for Firefox
          scrollbarWidth: 'none',
          // Optional: better overflow control
          msOverflowStyle: 'none',
        }}
        >
  
        <AdminDashboard />
        </Box>
      </Container>
    </ChakraProvider>
  )
}
