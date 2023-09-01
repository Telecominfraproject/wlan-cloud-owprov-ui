import * as React from 'react';
import { Box, HStack, Heading, Icon, Spacer, VStack } from '@chakra-ui/react';
import { Buildings } from '@phosphor-icons/react';
import VenueActions from './Actions';
import DeleteVenuePopover from './DeleteVenuePopover';
import StartAnalyticsModal from './StartAnalyticsModal';
import ViewAnalyticsSettingsModal from './ViewAnalyticsSettingsModal';
import RefreshButton from 'components/Buttons/RefreshButton';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CreateVenueButton from 'components/CreateVenueButton';
import EntityBreadcrumb from 'components/EntityBreadcrumb';
import { useGetVenue } from 'hooks/Network/Venues';
import EntityFavoritesButton from 'layout/Sidebar/EntityNavigationButton/Tree/EntityFavoritesButton';
import { axiosAnalytics, axiosSec } from 'utils/axiosInstances';

type Props = {
  id: string;
  boardId?: string;
};

const VenuePageHeader = ({ id, boardId }: Props) => {
  const getVenue = useGetVenue({ id });
  const isAnalyticsAvailable = axiosSec.defaults.baseURL !== axiosAnalytics.defaults.baseURL;

  return (
    <Card py={2}>
      <CardHeader px={4} variant="unstyled" display="flex">
        <HStack spacing={2} alignItems="start">
          <VStack alignItems="start">
            <HStack marginRight="auto" spacing={2} alignItems="start">
              <Icon my="auto" as={Buildings} color="inherit" boxSize="24px" />
              <Heading my="auto" size="md">
                {getVenue.data?.name}
              </Heading>
              <Box pt={-1}>
                <EntityFavoritesButton id={id} type="venue" />
              </Box>
            </HStack>
            <EntityBreadcrumb id={id} />
          </VStack>
        </HStack>
        <Spacer />
        <HStack spacing={2}>
          <CreateVenueButton id={id} type="venue" />
          <DeleteVenuePopover venue={getVenue.data} isDisabled={getVenue.isFetching || !getVenue.data} />
          {boardId && isAnalyticsAvailable ? <ViewAnalyticsSettingsModal boardId={boardId} venueId={id} /> : null}
          {!boardId && isAnalyticsAvailable ? <StartAnalyticsModal id={id} /> : null}
          <VenueActions isDisabled={!getVenue.data} venueId={id} />
          <RefreshButton onClick={getVenue.refetch} isFetching={getVenue.isFetching} isCompact />
        </HStack>
      </CardHeader>
    </Card>
  );
};

export default VenuePageHeader;
