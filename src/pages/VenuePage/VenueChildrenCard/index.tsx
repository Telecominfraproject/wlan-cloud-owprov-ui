import React, { useMemo } from 'react';
import { Center, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useGetVenue } from 'hooks/Network/Venues';
import { useAuth } from 'contexts/AuthProvider';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import LoadingOverlay from 'components/LoadingOverlay';
import VenueChildrenTableWrapper from './VenueChildrenTableWrapper';
import VenueClientLifecycle from './VenueClientLifecycle';
import VenueConfigurationsTableWrapper from './VenueConfigurationsTableWrapper';
import VenueContactTableWrapper from './VenueContactTableWrapper';
import VenueDashboard from './VenueDashboard';
import VenueDeviceTableWrapper from './VenueDeviceTableWrapper';
import VenueLiveView from './VenueLiveView';
import VenueResourcesTableWrapper from './VenueResourcesTableWrapper';

const getDefaultIndex = (hasAnalytics: boolean, id: string) => {
  localStorage.getItem('venue.lastActiveIndex');
  const index = parseInt(localStorage.getItem(`venue.${id}.lastActiveIndex`) || '0', 10);
  if (hasAnalytics) {
    return index >= 0 && index <= 7 ? index : 0;
  }

  if (index >= 0 && index <= 4) return index;
  return 0;
};

const VenueChildrenCard = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { endpoints } = useAuth();
  const { data: venue, isFetching } = useGetVenue({ id });
  const analyticsActive =
    endpoints?.owanalytics !== undefined &&
    venue?.boards !== undefined &&
    venue?.boards.length > 0 &&
    venue?.boards[0] !== undefined &&
    venue?.boards[0].length > 0;
  const [tabIndex, setTabIndex] = React.useState(getDefaultIndex(analyticsActive, id));

  const onTabChange = (index: number) => {
    setTabIndex(index);
    localStorage.setItem(`venue.${id}.lastActiveIndex`, index.toString());
  };

  React.useEffect(() => {
    setTabIndex(getDefaultIndex(analyticsActive, id));
  }, [analyticsActive]);

  const panels = useMemo(() => {
    if (analyticsActive && venue?.boards[0] !== undefined) {
      return (
        <TabPanels>
          <TabPanel overflowX="auto">
            <VenueDashboard boardId={venue.boards[0]} />
          </TabPanel>
          <TabPanel overflowX="auto">
            <VenueLiveView boardId={venue.boards[0]} venue={venue} />
          </TabPanel>
          <TabPanel overflowX="auto">
            <VenueClientLifecycle venueId={venue?.id} />
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
        <Tabs isLazy variant="enclosed" w="100%" index={tabIndex} onChange={onTabChange}>
          <TabList>
            {analyticsActive && (
              <>
                <Tab>{t('analytics.dashboard')}</Tab>
                <Tab>{t('analytics.live_view')}</Tab>
                <Tab>{t('analytics.client_lifecycle')}</Tab>
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

export default VenueChildrenCard;
