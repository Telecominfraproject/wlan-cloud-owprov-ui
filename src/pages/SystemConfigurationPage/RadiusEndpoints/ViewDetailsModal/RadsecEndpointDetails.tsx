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
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { RadiusEndpoint } from 'hooks/Network/RadiusEndpoints';
import CopyCell from 'pages/OpenRoamingPage/GlobalReachPage/DetailsModal/CopyCell';

type Props = {
  endpoint: RadiusEndpoint;
};

const RadsecEndpointDetails = ({ endpoint }: Props) => (
  <Box mt={2}>
    <Heading size="md" textDecoration="underline">
      RadSec Servers
    </Heading>
    <Accordion allowToggle defaultIndex={[0]} mt={2}>
      {endpoint.RadsecServers.map((server) => (
        <AccordionItem key={uuid()}>
          <AccordionButton>
            <Heading size="sm">{server.Hostname}</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Flex my={2} alignItems="center">
              <Heading size="sm" mr={2}>
                IP Address:{' '}
              </Heading>
              <Text>{server.IP}</Text>
            </Flex>
            <Flex my={2} alignItems="center">
              <Heading size="sm" mr={2}>
                Port:{' '}
              </Heading>
              <Text>{server.Port}</Text>
            </Flex>
            <Flex my={2} alignItems="center">
              <Heading size="sm" mr={2}>
                Secret:{' '}
              </Heading>
              <Text>{server.Secret}</Text>
            </Flex>
            <Flex my={2} alignItems="center">
              <Heading size="sm" mr={2}>
                Allow Self-Signed:{' '}
              </Heading>
              <Text>{server.AllowSelfSigned ? 'Yes' : 'No'}</Text>
            </Flex>
            <Flex my={2} alignItems="center">
              <Heading size="sm" mr={2}>
                Certificate:{' '}
              </Heading>
              <CopyCell value={server.Certificate} />
            </Flex>
            <Flex my={2} alignItems="center">
              <Heading size="sm" mr={2}>
                Private Key:{' '}
              </Heading>
              <CopyCell value={server.PrivateKey} />
            </Flex>
            <Heading size="sm">CA Certificates ({server.CaCerts.length}):</Heading>
            <UnorderedList>
              {server.CaCerts.map((v, i) => (
                <ListItem key={uuid()} display="flex" alignItems="center">
                  <Text mr={2} my={2}>
                    Certificate #{i}:
                  </Text>
                  <CopyCell key={uuid()} value={v} />
                </ListItem>
              ))}
            </UnorderedList>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  </Box>
);

export default RadsecEndpointDetails;
