import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import LoadingOverlay from 'components/LoadingOverlay';
import { getAllClients } from 'hooks/Network/Analytics';
import useDatePickers from 'hooks/useDatePickers';
import { getHoursAgo } from 'utils/dateFormatting';
import ClientLifecyleTable from './Table';
import MacSearchBar from './MacSearchBar';

interface Props {
  venueId: string;
}

const VenueClientLifecycle: React.FC<Props> = ({ venueId }) => {
  const [macs, setMacs] = useState<string[] | undefined>();
  const [mac, setMac] = useState<string | undefined>();
  const { start, end, timepickers, refreshId } = useDatePickers({ defaultStart: getHoursAgo(5 * 24) });

  const getMacs = React.useCallback(async () => {
    try {
      const newMacs = await getAllClients(venueId);
      return newMacs;
    } catch (e) {
      return undefined;
    }
  }, [venueId]);

  React.useEffect(() => {
    getMacs().then((res) => setMacs(res));
  }, [getMacs]);

  return (
    <LoadingOverlay isLoading={!macs}>
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
