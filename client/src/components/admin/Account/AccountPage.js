import { ChakraProvider, Container, Box } from '@chakra-ui/react'
import { theme } from '../../../components/helpers/index'
// import Account from './Acount'
import Account from './Acount'
export default function AccountPage() {
  return (
    <ChakraProvider theme={theme}>
      <Container
      display="flex" 
      maxW="100%"
      height="100vh" // Ensure full height
      overflow="hidden" // Prevent body scroll
      p ={4} // Adds padding to avoid top cutoff
      alignItems="center" // ✅ Centers content vertically
      justifyContent="center" // ✅ Centers content horizontally
      mt={10} 
      >
        <Box flex="1"
         p={6}
         overflowY="auto" //  Allows scrolling when needed
         maxH="100%"
         height = "100%"
         bg="gray.50" // Light background for contrast
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
  
        <Account />
        </Box>
      </Container>
    </ChakraProvider>
  )
}
