import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import RadiusEndpointsManagement from './RadiusEndpoints';
import SystemSecrets from './SystemSecrets';

const SystemConfigurationPage = () => {
  const { t } = useTranslation();

  return (
    <Tabs>
      <TabList>
        <Tab>{t('openroaming.radius_endpoint_other')}</Tab>
        <Tab>{t('system.secrets')}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <RadiusEndpointsManagement />
        </TabPanel>
        <TabPanel px={0}>
          <SystemSecrets />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default SystemConfigurationPage;
