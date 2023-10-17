import * as React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { RadiusEndpoint } from 'hooks/Network/RadiusEndpoints';

const prettyTypes = {
  orion: 'Google Orion',
  globalreach: 'GlobalReach',
  generic: 'Generic',
  radsec: 'RadSec',
} as const;

type Props = {
  endpoint?: RadiusEndpoint;
};

const RadiusEndpointSummary = ({ endpoint }: Props) =>
  !endpoint ? null : (
    <Box borderWidth={1} borderRadius="15px" p={4} my={2}>
      <Flex alignItems="center">
        <Heading w="100px" size="sm">
          Name:
        </Heading>
        <Box>{endpoint.name}</Box>
      </Flex>
      <Flex alignItems="center">
        <Heading w="100px" size="sm">
          Description:
        </Heading>
        <Box>{endpoint.description}</Box>
      </Flex>
      <Flex alignItems="center">
        <Heading w="100px" size="sm">
          Type:
        </Heading>
        <Box>{prettyTypes[endpoint.Type]}</Box>
      </Flex>
    </Box>
  );

export default RadiusEndpointSummary;
