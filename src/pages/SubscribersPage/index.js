import React from 'react';
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthProvider';
import { useTranslation } from 'react-i18next';
import Card from 'components/Card';
import Table from './Table';
import SubscriberInventory from './SubscriberInventory';

const SubscribersPage = () => {
  const { t } = useTranslation();
  const { isUserLoaded } = useAuth();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && (
        <Card>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>{t('subscribers.title')}</Tab>
              <Tab>{t('inventory.title')}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Table />
              </TabPanel>
              <TabPanel>
                <SubscriberInventory />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
      )}
    </Flex>
  );
};

export default SubscribersPage;
