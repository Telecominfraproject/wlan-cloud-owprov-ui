import * as React from 'react';
import { HStack, Heading, Icon, Spacer } from '@chakra-ui/react';
import { Buildings } from 'phosphor-react';
import VenueActions from './Actions';
import DeleteVenuePopover from './DeleteVenuePopover';
import VenueDropdown from './VenueDropdown';
import RefreshButton from 'components/Buttons/RefreshButton';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import { useGetVenue } from 'hooks/Network/Venues';

type Props = {
  id: string;
};

const VenuePageHeader = ({ id }: Props) => {
  const getVenue = useGetVenue({ id });

  return (
    <Card mb={4} p={2}>
      <CardHeader display="flex">
        <HStack spacing={2}>
          <Icon my="auto" as={Buildings} color="inherit" boxSize="24px" />
          <Heading my="auto" size="md">
            {getVenue.data?.name}
          </Heading>
          <VenueDropdown id={id} />
        </HStack>
        <Spacer />
        <HStack spacing={2}>
          <DeleteVenuePopover venue={getVenue.data} isDisabled={getVenue.isFetching || !getVenue.data} />
          <VenueActions isDisabled={!getVenue.data} venueId={id} />
          <RefreshButton onClick={getVenue.refetch} isFetching={getVenue.isFetching} isCompact />
        </HStack>
      </CardHeader>
    </Card>
  );
};

export default VenuePageHeader;
