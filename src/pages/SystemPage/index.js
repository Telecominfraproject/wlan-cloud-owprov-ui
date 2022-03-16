import React from 'react';
import { Flex, SimpleGrid } from '@chakra-ui/react';
import { axiosAnalytics, axiosFms, axiosGw, axiosOwls, axiosProv, axiosSec, axiosSub } from 'utils/axiosInstances';
import SystemTile from './SystemTile';

const SystemPage = () => (
  <Flex flexDirection="column" pt="75px">
    <SimpleGrid minChildWidth="500px" spacing="20px">
      <SystemTile axiosInstance={axiosSec} name="owsec" />
      <SystemTile axiosInstance={axiosGw} name="owgw" />
      <SystemTile axiosInstance={axiosProv} name="owprov" />
      <SystemTile axiosInstance={axiosFms} name="owfms" />
      <SystemTile axiosInstance={axiosSub} name="owsub" />
      <SystemTile axiosInstance={axiosOwls} name="owls" />
      <SystemTile axiosInstance={axiosAnalytics} name="owanalytics" />
    </SimpleGrid>
  </Flex>
);

export default SystemPage;
