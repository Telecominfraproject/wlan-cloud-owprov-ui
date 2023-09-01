import React from 'react';
import { Center, Spinner, useDisclosure } from '@chakra-ui/react';
import VenueDashboardTableModal from '../StatusBar/TableModal';
import {
  ParsedDashboardData,
  parseDashboardData,
  parseTimepointsData,
  ParsedTimepointsData,
  parseTimepointsToMonitoringData,
  ApMonitoringData,
  SsidMonitoringData,
  UeMonitoringData,
  RadioMonitoringData,
} from '../utils';
import { useGetAnalyticsBoardDevices, useGetAnalyticsBoardTimepoints } from 'hooks/Network/Analytics';
import { useGetVenue } from 'hooks/Network/Venues';

const tenMinutesAgo = () => {
  const newDate = new Date();
  newDate.setMinutes(newDate.getMinutes() - 10);
  return newDate;
};

type SelectedItem =
  | {
      type: 'AP';
      data: ApMonitoringData;
    }
  | {
      type: 'SSID';
      data: SsidMonitoringData;
    }
  | {
      type: 'UE';
      data: UeMonitoringData;
    }
  | {
      type: 'RADIO';
      serialNumber: string;
      data: RadioMonitoringData;
    };

type DashboardModalOpenOptions = {
  prioritizedColumns?: string[];
  sortBy?: { id: string; desc: boolean }[];
};

type UseVenueMonitoringReturn = {
  venueId: string;
  dashboard: ParsedDashboardData;
  timepoints: ParsedTimepointsData;
  monitoring: ApMonitoringData[];
  handleDashboardModalOpen: (options: DashboardModalOpenOptions) => void;
  selectedItem: SelectedItem | undefined;
  onSelectItem: (item: SelectedItem) => void;
  onUnselectItem: () => void;
};

const VenueMonitoringContext = React.createContext<UseVenueMonitoringReturn>({
  venueId: '',
} as UseVenueMonitoringReturn);

export const VenueMonitoringProvider = ({ venueId, children }: { venueId: string; children: React.ReactElement }) => {
  const dashboardModalProps = useDisclosure();
  const [dashboardTableOptions, setDashboardTableOptions] = React.useState<DashboardModalOpenOptions>();
  const getVenue = useGetVenue({ id: venueId });
  const boardId = getVenue.data?.boards[0];
  const getDashboard = useGetAnalyticsBoardDevices({ id: boardId });
  const [startTimepointTime] = React.useState(tenMinutesAgo());
  const getTimepoints = useGetAnalyticsBoardTimepoints({ id: boardId, startTime: startTimepointTime });
  const [selectedItem, setSelectedItem] = React.useState<SelectedItem>();

  const onSelectItem = React.useCallback((item: SelectedItem) => {
    setSelectedItem(item);
  }, []);

  const onUnselectItem = React.useCallback(() => {
    setSelectedItem(undefined);
  }, []);

  const handleDashboardModalOpen = React.useCallback((tableOptions: DashboardModalOpenOptions) => {
    setDashboardTableOptions(tableOptions);
    dashboardModalProps.onOpen();
  }, []);

  const parsedDashboardData = React.useMemo(() => {
    if (!getDashboard.data) return undefined;

    return parseDashboardData(getDashboard.data);
  }, [getDashboard.data]);

  const parsedClientTimepoints = React.useMemo(() => {
    if (!getTimepoints.data) return undefined;

    return parseTimepointsData(getTimepoints.data);
  }, [getTimepoints.data]);

  const monitoringData = React.useMemo(() => {
    if (!parsedClientTimepoints || !parsedDashboardData) return undefined;

    return parseTimepointsToMonitoringData(parsedClientTimepoints, parsedDashboardData.devices);
  }, [parsedClientTimepoints, parsedDashboardData]);

  const value = React.useMemo(
    () => ({
      venueId,
      dashboard: parsedDashboardData as ParsedDashboardData,
      timepoints: parsedClientTimepoints as ParsedTimepointsData,
      monitoring: monitoringData as ApMonitoringData[],
      handleDashboardModalOpen,
      selectedItem,
      onSelectItem,
      onUnselectItem,
    }),
    [venueId, parsedDashboardData, parsedClientTimepoints, monitoringData, handleDashboardModalOpen, selectedItem],
  );

  return (
    <VenueMonitoringContext.Provider value={value}>
      {!value.dashboard || !value.timepoints || !value.monitoring ? (
        <Center my={8}>
          <Spinner size="xl" />
        </Center>
      ) : (
        <>
          {children}
          <VenueDashboardTableModal
            data={value.dashboard}
            tableOptions={dashboardTableOptions}
            {...dashboardModalProps}
          />
        </>
      )}
    </VenueMonitoringContext.Provider>
  );
};

export const useVenueMonitoring = () => React.useContext(VenueMonitoringContext);
