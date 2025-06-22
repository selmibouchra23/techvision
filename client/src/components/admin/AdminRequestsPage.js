import { ChakraProvider, Container, Box } from '@chakra-ui/react'
import AdminRequests from '../pages/AdminRequests'
import Sidebar from '../admin/Sidebar'
import { theme } from '../helpers/index'

export default function AdminRequestsPage() {
  return (
    <ChakraProvider theme={theme}>
      <Container display="flex" maxW="100vw"
       height="100vh" // Ensure full height
       overflow="hidden" // Prevent body scroll
       >
  <Box flex="1" p={6}
   overflowY="auto" //  Allows scrolling when needed
   maxH="100vh"
   bg="gray.50" // Light background for contrast
  >
    <AdminRequests />
  </Box>
</Container>

     {/* <Container display={{ base: 'block', md: 'flex' }} maxW="container.xl">
        <Sidebar /> 
        <AdminRequests />
      </Container>*/}
    </ChakraProvider>
  )
}
