import React from 'react';
import PropTypes from 'prop-types';
import EntityDeviceTableWrapper from 'pages/EntityPage/EntityChildrenCard/EntityDeviceTableWrapper';
import Card from 'components/Card';
import { Alert, Center, Heading, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetEntity } from 'hooks/Network/Entity';
import CardBody from 'components/Card/CardBody';
import EntityVenueTableWrapper from './EntityVenueTableWrapper';
import EntityLocationTableWrapper from './EntityLocationTableWrapper ';
import EntityContactTableWrapper from './EntityContactTableWrapper ';
import EntityChildrenTableWrapper from './EntityChildrenTableWrapper';
import EntityConfigurationsTableWrapper from './EntityConfigurationsTableWrapper';
import EntityResourcesTableWrapper from './EntityResourcesTableWrapper';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const EntityChildrenCard = ({ id }) => {
  const { t } = useTranslation();
  const { data: entity, isFetching } = useGetEntity({ id });

  return (
    <Card>
      <CardBody>
        <Tabs isLazy variant="enclosed" w="100%">
          <TabList>
            <Tab>{t('entities.title')}</Tab>
            <Tab>{t('venues.title')}</Tab>
            <Tab>{t('configurations.title')}</Tab>
            <Tab>{t('inventory.title')}</Tab>
            <Tab>{t('locations.other')}</Tab>
            <Tab>{t('contacts.other')}</Tab>
            <Tab>{t('resources.title')}</Tab>
          </TabList>
          {!entity && isFetching ? (
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

EntityChildrenCard.propTypes = propTypes;
export default EntityChildrenCard;
