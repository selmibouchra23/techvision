import { ChakraProvider, Container, Box } from '@chakra-ui/react'
import { theme } from '../../../components/helpers/index'
import AdminAccountSettings from './AdminAccountSettings'
export default function AdminSettingsPage() {
  return (
    <ChakraProvider theme={theme}>
      <Container display="flex" 
      maxW="100vw"
      height="100vh" // Ensure full height
      overflow="hidden" // Prevent body scroll
      >
        <Box flex="1" p={6}
         overflowY="auto" // ✅ Allows scrolling when needed
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
  
        <AdminAccountSettings />
        </Box>
      </Container>
    </ChakraProvider>
  )
}
