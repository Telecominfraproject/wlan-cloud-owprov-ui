import { Box } from '@chakra-ui/react';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetAnalyticsClients } from 'hooks/Network/Analytics';
import useDatePickers from 'hooks/useDatePickers';
import React, { useState } from 'react';
import { getHoursAgo } from 'utils/dateFormatting';
import MacSearchBar from './MacSearchBar';
import ClientLifecyleTable from './Table';

interface Props {
  venueId: string;
}

const VenueClientLifecycle: React.FC<Props> = ({ venueId }) => {
  const [mac, setMac] = useState<string | undefined>();
  const { data: macs, isFetching } = useGetAnalyticsClients({ venueId });
  const { start, end, timepickers, refreshId } = useDatePickers({ defaultStart: getHoursAgo(5 * 24) });

  return (
    <LoadingOverlay isLoading={isFetching}>
      <Box minHeight="200px">
        <ClientLifecyleTable
          fromDate={Math.floor(start.getTime() / 1000)}
          endDate={Math.floor(end.getTime() / 1000)}
          refreshId={refreshId}
          venueId={venueId}
          mac={mac}
          timePickers={timepickers}
          searchBar={<MacSearchBar macs={macs} setMac={setMac} />}
        />
      </Box>
    </LoadingOverlay>
  );
};

export default VenueClientLifecycle;
