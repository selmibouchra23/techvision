import { Container } from '@chakra-ui/react';

import Content from './Content/Content'
import Sidebar from './Sidebar/Sidebar'
 // bg="gray.100"

export default function Main() {
  return (
    <Container display={{ base: 'block', md: 'flex' }} maxW="container.xl"  >
      <Sidebar />
      <Content />
    </Container>
  )
}
