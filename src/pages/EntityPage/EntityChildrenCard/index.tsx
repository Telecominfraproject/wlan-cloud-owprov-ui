import React from 'react';
import { Alert, Center, Heading, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LoadingOverlay from 'components/LoadingOverlay';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import { useGetEntity } from 'hooks/Network/Entity';
import EntityChildrenTableWrapper from './EntityChildrenTableWrapper';
import EntityConfigurationsTableWrapper from './EntityConfigurationsTableWrapper';
import EntityContactTableWrapper from './EntityContactTableWrapper ';
import EntityLocationTableWrapper from './EntityLocationTableWrapper ';
import EntityResourcesTableWrapper from './EntityResourcesTableWrapper';
import EntityVenueTableWrapper from './EntityVenueTableWrapper';
import EntityDeviceTableWrapper from './EntityDeviceTableWrapper';

const getDefaultIndex = (id: string) => {
  localStorage.getItem(`entity.${id}.lastActiveIndex`);
  const index = parseInt(localStorage.getItem(`entity.${id}.lastActiveIndex`) || '0', 10);

  if (index >= 0 && index <= 6) return index;
  return 0;
};

const EntityChildrenCard = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { data: entity, isFetching } = useGetEntity({ id });
  const [tabIndex, setTabIndex] = React.useState(getDefaultIndex(id));

  const onTabChange = (index: number) => {
    setTabIndex(index);
    localStorage.setItem(`entity.${id}.lastActiveIndex`, index.toString());
  };

  return (
    <Card>
      <CardBody>
        <Tabs isLazy variant="enclosed" w="100%" index={tabIndex} onChange={onTabChange}>
          <TabList>
            <Tab>{t('entities.sub_other')}</Tab>
            <Tab>{t('venues.sub_other')}</Tab>
            <Tab>{t('configurations.title')}</Tab>
            <Tab>{t('inventory.title')}</Tab>
            <Tab>{t('locations.other')}</Tab>
            <Tab>{t('contacts.other')}</Tab>
            <Tab>{t('resources.title')}</Tab>
          </TabList>
          {!entity || isFetching ? (
            <Center w="100%">
              <Spinner size="xl" />
            </Center>
          ) : (
            <LoadingOverlay isLoading={isFetching}>
              <TabPanels>
                <TabPanel overflowX="auto">
                  <EntityChildrenTableWrapper entity={entity} />
                </TabPanel>
                <TabPanel overflowX="auto">
                  <EntityVenueTableWrapper entity={entity} />
                </TabPanel>
                <TabPanel overflowX="auto">
                  <EntityConfigurationsTableWrapper entity={entity} />
                </TabPanel>
                <TabPanel overflowX="auto">
                  {id === '0000-0000-0000' ? (
                    <Center minHeight="334px">
                      <Alert colorScheme="red" size="xl">
                        <Heading size="md">{t('entities.devices_under_root')}</Heading>
                      </Alert>
                    </Center>
                  ) : (
                    <EntityDeviceTableWrapper entity={entity} />
                  )}
                </TabPanel>
                <TabPanel overflowX="auto">
                  <EntityLocationTableWrapper entity={entity} />
                </TabPanel>
                <TabPanel overflowX="auto">
                  <EntityContactTableWrapper entity={entity} />
                </TabPanel>
                <TabPanel overflowX="auto">
                  <EntityResourcesTableWrapper entity={entity} />
                </TabPanel>
              </TabPanels>
            </LoadingOverlay>
          )}
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default EntityChildrenCard;
