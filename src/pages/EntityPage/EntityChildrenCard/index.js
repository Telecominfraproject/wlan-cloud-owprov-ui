import React from 'react';
import PropTypes from 'prop-types';
import EntityDeviceTableWrapper from 'pages/EntityPage/EntityChildrenCard/EntityDeviceTableWrapper';
import Card from 'components/Card';
import { Center, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetEntity } from 'hooks/Network/Entity';
import CardBody from 'components/Card/CardBody';
import EntityVenueTableWrapper from './EntityVenueTableWrapper';
import EntityLocationTableWrapper from './EntityLocationTableWrapper ';
import EntityContactTableWrapper from './EntityContactTableWrapper ';
import EntityChildrenTableWrapper from './EntityChildrenTableWrapper';
import EntityConfigurationsTableWrapper from './EntityConfigurationsTableWrapper';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const EntityChildrenCard = ({ id }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: entity, isFetching } = useGetEntity({ t, toast, id });

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
                  <EntityDeviceTableWrapper entity={entity} />
                </TabPanel>
                <TabPanel overflowX="auto">
                  <EntityLocationTableWrapper entity={entity} />
                </TabPanel>
                <TabPanel overflowX="auto">
                  <EntityContactTableWrapper entity={entity} />
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
