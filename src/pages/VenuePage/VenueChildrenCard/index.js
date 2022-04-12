import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import { Center, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetVenue } from 'hooks/Network/Venues';
import CardBody from 'components/Card/CardBody';
import { useAuth } from 'contexts/AuthProvider';
import VenueDeviceTableWrapper from './VenueDeviceTableWrapper';
import VenueConfigurationsTableWrapper from './VenueConfigurationsTableWrapper';
import VenueChildrenTableWrapper from './VenueChildrenTableWrapper';
import VenueContactTableWrapper from './VenueContactTableWrapper';
import VenueDashboard from './VenueDashboard';
import VenueLiveView from './VenueLiveView';
import VenueResourcesTableWrapper from './VenueResourcesTableWrapper';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const VenueChildrenCard = ({ id }) => {
  const { t } = useTranslation();
  const { endpoints } = useAuth();
  const { data: venue, isFetching } = useGetVenue({ id });

  const panels = useMemo(() => {
    if (endpoints.owanalytics && venue?.boards.length > 0) {
      return (
        <TabPanels>
          <TabPanel overflowX="auto">
            <VenueDashboard boardId={venue.boards[0]} />
          </TabPanel>
          <TabPanel overflowX="auto">
            <VenueLiveView boardId={venue.boards[0]} />
          </TabPanel>
          <TabPanel overflowX="auto">
            <VenueChildrenTableWrapper venue={venue} />
          </TabPanel>
          <TabPanel overflowX="auto">
            <VenueConfigurationsTableWrapper venue={venue} />
          </TabPanel>
          <TabPanel overflowX="auto">
            <VenueDeviceTableWrapper venue={venue} />
          </TabPanel>
          <TabPanel overflowX="auto">
            <VenueContactTableWrapper venue={venue} />
          </TabPanel>
          <TabPanel overflowX="auto">
            <VenueResourcesTableWrapper venue={venue} />
          </TabPanel>
        </TabPanels>
      );
    }
    return (
      <TabPanels>
        <TabPanel overflowX="auto">
          <VenueChildrenTableWrapper venue={venue} />
        </TabPanel>
        <TabPanel overflowX="auto">
          <VenueConfigurationsTableWrapper venue={venue} />
        </TabPanel>
        <TabPanel overflowX="auto">
          <VenueDeviceTableWrapper venue={venue} />
        </TabPanel>
        <TabPanel overflowX="auto">
          <VenueContactTableWrapper venue={venue} />
        </TabPanel>
        <TabPanel overflowX="auto">
          <VenueResourcesTableWrapper venue={venue} />
        </TabPanel>
      </TabPanels>
    );
  }, [endpoints, venue]);

  return (
    <Card>
      <CardBody>
        <Tabs isLazy variant="enclosed" w="100%">
          <TabList>
            {endpoints.owanalytics && venue?.boards.length > 0 && (
              <>
                <Tab>{t('analytics.dashboard')}</Tab>
                <Tab>{t('analytics.live_view')}</Tab>
              </>
            )}
            <Tab>{t('venues.subvenues')}</Tab>
            <Tab>{t('configurations.title')}</Tab>
            <Tab>{t('inventory.title')}</Tab>
            <Tab>{t('contacts.other')}</Tab>
            <Tab>{t('resources.title')}</Tab>
          </TabList>
          {!venue && isFetching ? (
            <Center w="100%">
              <Spinner size="xl" />
            </Center>
          ) : (
            <LoadingOverlay isLoading={isFetching}>{panels}</LoadingOverlay>
          )}
        </Tabs>
      </CardBody>
    </Card>
  );
};

VenueChildrenCard.propTypes = propTypes;
export default VenueChildrenCard;
