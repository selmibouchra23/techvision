import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

import AccountSettings from './AccountSettings'
import Actions from './Actions'
import MyHistory from './MyHistory'
import OrderDetails from './OrderDetails'
import Notifications from './Notifications'

const Content = () => {
  const tabs = ['Order Details', 'My History', 'Notifications', 'Account Settings']

  return (
    <Box
      as="main"
      flex={3}
      d="flex"
      flexDir="column"
      justifyContent="space-between"
      pt={5}
      bg="white"
      rounded="md"
      borderWidth={1}
      borderColor="gray.200"
      style={{ transform: 'translateY(-100px)' }}
    >
      <Tabs>
        <TabList px={5}>
          {tabs.map(tab => (
            <Tab
              key={tab}
              mx={3}
              px={0}
              py={3}
              fontWeight="semibold"
              color="brand.cadet"
              borderBottomWidth={1}
              _active={{ bg: 'transparent' }}
              _selected={{ color: 'brand.dark', borderColor: 'brand.blue' }}
            >
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels px={3} mt={5}>
          <TabPanel>
            
            <OrderDetails />
          </TabPanel>
          <TabPanel>
          <MyHistory />
            
          </TabPanel>

          <TabPanel>
          
          <Notifications />
          </TabPanel>

          <TabPanel>
          
          <AccountSettings />
          </TabPanel>
        </TabPanels>
      </Tabs>

    </Box>
  )
}

export default Content
