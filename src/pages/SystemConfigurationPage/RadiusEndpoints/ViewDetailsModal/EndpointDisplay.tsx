import * as React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import GlobalReachEndpointDetails from './GlobalReachEndpointDetails';
import GoogleOrionEndpointDetails from './GoogleOrionEndpointDetails';
import RadiusEndpointDetails from './RadiusEndpointDetails';
import RadsecEndpointDetails from './RadsecEndpointDetails';
import { RadiusEndpoint } from 'hooks/Network/RadiusEndpoints';
import { uppercaseFirstLetter } from 'utils/stringHelper';

const firstColProps = {
  w: '160px',
  mr: 4,
} as const;
const secondColProps = {} as const;

const prettyTypes = {
  orion: 'Google Orion',
  globalreach: 'Global Reach',
  generic: 'Generic',
  radsec: 'RadSec',
} as const;

type Props = {
  endpoint: RadiusEndpoint;
};

const EndpointDisplay = ({ endpoint }: Props) => {
  const furtherDetails = () => {
    if (endpoint.Type === 'orion') return <GoogleOrionEndpointDetails endpoint={endpoint} />;
    if (endpoint.Type === 'generic') return <RadiusEndpointDetails endpoint={endpoint} />;
    if (endpoint.Type === 'radsec') return <RadsecEndpointDetails endpoint={endpoint} />;
    if (endpoint.Type === 'globalreach') return <GlobalReachEndpointDetails endpoint={endpoint} />;
    return null;
  };

  return (
    <Box mt={2}>
      <Heading mb={4} size="md" textDecoration="underline">
        Endpoint
      </Heading>
      <Flex>
        <Heading {...firstColProps} size="sm">
          Type:
        </Heading>
        <Text {...secondColProps}>{prettyTypes[endpoint.Type]}</Text>
      </Flex>
      <Flex>
        <Heading {...firstColProps} size="sm">
          IP Index:
        </Heading>
        <Text {...secondColProps}>{endpoint.Index}</Text>
      </Flex>
      <Flex>
        <Heading {...firstColProps} size="sm">
          Pool Strategy:
        </Heading>
        <Text {...secondColProps}>{uppercaseFirstLetter(endpoint.PoolStrategy)}</Text>
      </Flex>
      <Flex>
        <Heading {...firstColProps} size="sm">
          Gateway Proxy:
        </Heading>
        <Text {...secondColProps}>{endpoint.UseGWProxy ? 'On' : 'Off'}</Text>
      </Flex>
      <Flex>
        <Heading {...firstColProps} size="sm">
          NAS Identifier:
        </Heading>
        <Text {...secondColProps}>{endpoint.NasIdentifier}</Text>
      </Flex>
      <Flex>
        <Heading {...firstColProps} size="sm">
          Accounting Interval:
        </Heading>
        <Text {...secondColProps}>{endpoint.AccountingInterval}s</Text>
      </Flex>
      {furtherDetails()}
    </Box>
  );
};

export default EndpointDisplay;
