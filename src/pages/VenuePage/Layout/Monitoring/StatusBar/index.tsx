import * as React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import DeviceHealthCard from './DeviceHealthCard';
import DeviceMemoryCard from './DeviceMemoryCard';
import DeviceStatusCard from './DeviceStatusCard';
import TotalAssociationsCard from './TotalAssociationsCard';

const VenueStatusBar = () => (
  <SimpleGrid minChildWidth="200px" spacing={4} mb={4}>
    <DeviceStatusCard />
    <DeviceHealthCard />
    <DeviceMemoryCard />
    <TotalAssociationsCard />
  </SimpleGrid>
);

export default VenueStatusBar;
