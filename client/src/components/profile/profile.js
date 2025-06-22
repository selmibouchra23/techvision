import Cover from '../profile/Cover'
import Main from '../profile/Main'
import SimpleBar from 'simplebar-react'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../helpers/index'

export default function ProfilePage() {
  return (

    <SimpleBar style={{ maxHeight: '100vh'}}>
      <ChakraProvider theme={theme}>
      <Cover />
      <Main />
      </ChakraProvider>
    </SimpleBar>
    
  )
}