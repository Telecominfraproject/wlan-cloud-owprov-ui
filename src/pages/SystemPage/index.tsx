import React from 'react';
import { Flex, SimpleGrid } from '@chakra-ui/react';
import {
  axiosAnalytics,
  axiosFms,
  axiosGw,
  axiosInstaller,
  axiosOwls,
  axiosProv,
  axiosSec,
  axiosSub,
} from 'utils/axiosInstances';
import SystemTile from './SystemTile';

const SystemPage: React.FC = () => (
  <Flex flexDirection="column" pt="75px">
    <SimpleGrid minChildWidth="500px" spacing="20px">
      <SystemTile axiosInstance={axiosAnalytics} name="owanalytics" />
      <SystemTile axiosInstance={axiosFms} name="owfms" />
      <SystemTile axiosInstance={axiosGw} name="owgw" />
      <SystemTile axiosInstance={axiosInstaller} name="owinstaller" />
      <SystemTile axiosInstance={axiosOwls} name="owls" />
      <SystemTile axiosInstance={axiosProv} name="owprov" />
      <SystemTile axiosInstance={axiosSec} name="owsec" />
      <SystemTile axiosInstance={axiosSub} name="owsub" />
    </SimpleGrid>
  </Flex>
);

export default SystemPage;
