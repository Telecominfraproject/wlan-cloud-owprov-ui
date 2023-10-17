import * as React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, useColorMode } from '@chakra-ui/react';
import GlobalReachAccountTable from './GlobalReachPage/AccountTable';
import GoogleOrionPage from './GoogleOrionPage';

const OpenRoamingPage = () => {
  const { colorMode } = useColorMode();

  const isLight = colorMode === 'light';

  const tabStyle = {
    textColor: isLight ? 'var(--chakra-colors-blue-600)' : 'var(--chakra-colors-blue-300)',
    fontWeight: 'semibold',
    borderWidth: '0px',
    marginBottom: '-1px',
    borderBottom: '2px solid',
  };

  return (
    <Tabs>
      <TabList>
        <Tab _selected={tabStyle}>GlobalReach</Tab>
        <Tab _selected={tabStyle}>Google Orion</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <Box w="100%">
            <GlobalReachAccountTable />
          </Box>
        </TabPanel>
        <TabPanel px={0}>
          <Box w="100%">
            <GoogleOrionPage />
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default OpenRoamingPage;
