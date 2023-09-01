import * as React from 'react';
import { Box } from '@chakra-ui/react';
import Masonry from 'react-masonry-css';
import BusiestVenueDevicesCard from './BusiestDevicesCard';
import ClientLifecycleCard from './ClientLifecycleCard';
import VenueMonitoringTree from './MonitoringTree';
import VenueStatusBar from './StatusBar';
import { VenueMonitoringProvider } from './VenueMonitoringContext';

type Props = {
  venueId: string;
};

const VenueMonitoringTab = ({ venueId }: Props) => (
  <VenueMonitoringProvider venueId={venueId}>
    <>
      <VenueStatusBar />
      <Masonry
        breakpointCols={{
          default: 3,
          3000: 2,
          1100: 1,
        }}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <BusiestVenueDevicesCard />
        <VenueMonitoringTree />
        <Box />
        <ClientLifecycleCard venueId={venueId} />
      </Masonry>
    </>
  </VenueMonitoringProvider>
);

export default VenueMonitoringTab;
