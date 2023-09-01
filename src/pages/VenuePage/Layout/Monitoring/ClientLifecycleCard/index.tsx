import React, { useState } from 'react';
import ClientLifecycleDatePickers from '../../DatePickers';
import MacSearchBar from './MacSearchBar';
import ClientLifecyleTable from './Table';
import { axiosAnalytics } from 'utils/axiosInstances';
import { getHoursAgo } from 'utils/dateFormatting';

const getPartialClients = async (venueId: string, offset: number) =>
  axiosAnalytics
    .get(`wifiClientHistory?macsOnly=true&venue=${venueId}&limit=500&offset=${offset}`)
    .then(({ data }) => data.entries as string[]);

const getAllClients = async (venueId: string) => {
  const allClients: string[] = [];
  let continueFirmware = true;
  let offset = 0;
  while (continueFirmware) {
    // eslint-disable-next-line no-await-in-loop
    const newClients = await getPartialClients(venueId, offset);
    if (newClients === null || newClients.length === 0 || newClients.length < 500 || offset >= 50000)
      continueFirmware = false;
    allClients.push(...newClients);
    offset += 500;
  }
  return allClients;
};

interface Props {
  venueId: string;
}

const ClientLifecycleCard = ({ venueId }: Props) => {
  const [macs, setMacs] = useState<string[] | undefined>();
  const [mac, setMac] = useState<string | undefined>();
  const [time, setTime] = React.useState<{ start: Date; end: Date }>({
    start: getHoursAgo(5 * 24),
    end: new Date(),
  });

  const onChange = (start: Date, end: Date) => {
    setTime({ start, end });
  };
  const onClear = () => {
    setTime({
      start: getHoursAgo(5 * 24),
      end: new Date(),
    });
  };

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
    <ClientLifecyleTable
      fromDate={Math.floor(time.start.getTime() / 1000)}
      endDate={Math.floor(time.end.getTime() / 1000)}
      venueId={venueId}
      mac={mac}
      timePickers={
        <ClientLifecycleDatePickers
          defaults={{ start: getHoursAgo(5 * 24), end: new Date() }}
          setTime={onChange}
          onClear={onClear}
        />
      }
      searchBar={<MacSearchBar macs={macs} setMac={setMac} />}
    />
  );
};

export default ClientLifecycleCard;
