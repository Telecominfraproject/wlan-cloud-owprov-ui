import * as React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { RadiusEndpoint, RadiusServer } from 'hooks/Network/RadiusEndpoints';

const SectionDisplay = ({ Hostname, IP, Port, Secret }: RadiusServer) => (
  <Box>
    <Flex my={2} alignItems="center">
      <Heading size="sm" mr={2}>
        Hostname:
      </Heading>
      <Text>{Hostname}</Text>
    </Flex>
    <Flex my={2} alignItems="center">
      <Heading size="sm" mr={2}>
        IP:
      </Heading>
      <Text>{IP}</Text>
    </Flex>
    <Flex my={2} alignItems="center">
      <Heading size="sm" mr={2}>
        Port:
      </Heading>
      <Text>{Port}</Text>
    </Flex>
    <Flex my={2} alignItems="center">
      <Heading size="sm" mr={2}>
        Secret:
      </Heading>
      <Text>{Secret}</Text>
    </Flex>
  </Box>
);

type Props = {
  endpoint: RadiusEndpoint;
};

const RadiusEndpointDetails = ({ endpoint }: Props) => (
  <Box mt={2}>
    <Heading size="md" textDecoration="underline">
      Servers
    </Heading>
    <Accordion allowToggle defaultIndex={[0]} mt={2}>
      {endpoint.RadiusServers.map((server) => (
        <AccordionItem key={uuid()}>
          <AccordionButton>
            <Heading size="sm">{server.Authentication.map((data) => data.Hostname).join(', ')}</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Flex my={2} alignItems="center">
              <Heading size="sm" mr={2}>
                Accounting Interval:{' '}
              </Heading>
              <Text>{server.AccountingInterval}s</Text>
            </Flex>
            <Heading size="md" my={2} textDecoration="underline">
              Authentication
            </Heading>
            {server.Authentication.map((data) => (
              <SectionDisplay {...data} />
            ))}
            <Heading size="md" my={2} textDecoration="underline">
              Accounting
            </Heading>
            {server.Accounting.map((data) => (
              <SectionDisplay {...data} />
            ))}
            <Heading size="md" my={2} textDecoration="underline">
              Change of Authorization (CoA)
            </Heading>
            {server.CoA.map((data) => (
              <SectionDisplay {...data} />
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  </Box>
);

export default RadiusEndpointDetails;
