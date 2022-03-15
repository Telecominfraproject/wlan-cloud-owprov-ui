import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import {
  Center,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetVenue } from 'hooks/Network/Venues';
import CardBody from 'components/Card/CardBody';
import VenueDeviceTableWrapper from './VenueDeviceTableWrapper';
import VenueConfigurationsTableWrapper from './VenueConfigurationsTableWrapper';
import VenueChildrenTableWrapper from './VenueChildrenTableWrapper';
import VenueContactTableWrapper from './VenueContactTableWrapper';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const VenueChildrenCard = ({ id }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: venue, isFetching } = useGetVenue({ t, toast, id });

  return (
    <Card>
      <CardBody>
        <Tabs isLazy variant="enclosed" w="100%">
          <TabList>
            <Tab>{t('venues.subvenues')}</Tab>
            <Tab>{t('configurations.title')}</Tab>
            <Tab>{t('inventory.title')}</Tab>
            <Tab>{t('contacts.other')}</Tab>
          </TabList>
          {!venue && isFetching ? (
            <Center w="100%">
              <Spinner size="xl" />
            </Center>
          ) : (
            <LoadingOverlay isLoading={isFetching}>
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
              </TabPanels>
            </LoadingOverlay>
          )}
        </Tabs>
      </CardBody>
    </Card>
  );
};

VenueChildrenCard.propTypes = propTypes;
export default VenueChildrenCard;
