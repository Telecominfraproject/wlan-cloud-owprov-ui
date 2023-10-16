import * as React from 'react';
import { Box, Flex, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { useGetGoogleOrionAccounts } from 'hooks/Network/GoogleOrion';
import { RadiusEndpoint } from 'hooks/Network/RadiusEndpoints';
import CopyCell from 'pages/OpenRoamingPage/GlobalReachPage/DetailsModal/CopyCell';

type Props = {
  endpoint: RadiusEndpoint;
};

const GoogleOrionEndpointDetails = ({ endpoint }: Props) => {
  const getAccounts = useGetGoogleOrionAccounts();

  const account = getAccounts.data?.find(
    ({ id }) => endpoint.RadsecServers.find((server) => server.UseOpenRoamingAccount === id) !== undefined,
  );

  return (
    <Box mt={2}>
      <Heading size="md" textDecoration="underline">
        Google Orion Account
      </Heading>
      {account ? (
        <Box mt={2}>
          <Flex my={2} alignItems="center">
            <Heading size="sm" mr={2}>
              Certificate:{' '}
            </Heading>
            <CopyCell value={account.certificate} />
          </Flex>
          <Flex my={2} alignItems="center">
            <Heading size="sm" mr={2}>
              Private Key:{' '}
            </Heading>
            <CopyCell value={account.privateKey} />
          </Flex>
          <Heading size="sm">CA Certificates ({account.cacerts.length}):</Heading>
          <UnorderedList>
            {account.cacerts.map((v, i) => (
              <ListItem key={uuid()} display="flex" alignItems="center">
                <Text mr={2} my={2}>
                  Certificate #{i}:
                </Text>
                <CopyCell key={uuid()} value={v} />
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      ) : (
        'No account found'
      )}
    </Box>
  );
};

export default GoogleOrionEndpointDetails;
