import { ChakraProvider, Container, Box } from '@chakra-ui/react'

import Analytics from './Analytics'
//import Sidebar from '../admin/Sidebar'
import { theme } from '../../helpers/index'

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
    <Analytics />
  </Box>
</Container>

     {/* <Container display={{ base: 'block', md: 'flex' }} maxW="container.xl">
        <Sidebar /> 
        <AdminRequests />
      </Container>*/}
    </ChakraProvider>
  )
}
