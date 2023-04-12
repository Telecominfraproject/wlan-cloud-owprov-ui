import * as React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import EntityContacts from './EntityContacts';
import EntityLocations from './EntityLocations';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';

type Props = {
  id: string;
};

const EntityLocationContactsCard = ({ id }: Props) => {
  const { t } = useTranslation();

  return (
    <Card p={0}>
      <Tabs variant="enclosed" isLazy>
        <TabList>
          <CardHeader>
            <Tab>{t('locations.title')}</Tab>
            <Tab>{t('contacts.other')}</Tab>
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
              <EntityLocations id={id} />
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
              <EntityContacts id={id} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default EntityLocationContactsCard;
