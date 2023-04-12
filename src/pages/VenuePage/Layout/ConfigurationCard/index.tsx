import * as React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import VenueConfigurations from './VenueConfigurations';
import VenueResources from './VenueResources';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';

type Props = {
  id: string;
};

const VenueConfigurationCard = ({ id }: Props) => {
  const { t } = useTranslation();

  return (
    <Card p={0}>
      <Tabs variant="enclosed" isLazy>
        <TabList>
          <CardHeader>
            <Tab>{t('configurations.title')}</Tab>
            <Tab>{t('resources.title')}</Tab>
          </CardHeader>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Box
              borderLeft="1px solid"
              borderRight="1px solid"
              borderBottom="1px solid"
              borderColor="var(--chakra-colors-chakra-border-color)"
              borderBottomLeftRadius="15px"
              borderBottomRightRadius="15px"
            >
              <VenueConfigurations id={id} />
            </Box>
          </TabPanel>
          <TabPanel p={0}>
            <Box
              borderLeft="1px solid"
              borderRight="1px solid"
              borderBottom="1px solid"
              borderColor="var(--chakra-colors-chakra-border-color)"
              borderBottomLeftRadius="15px"
              borderBottomRightRadius="15px"
            >
              <VenueResources id={id} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default VenueConfigurationCard;
