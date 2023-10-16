import * as React from 'react';
import { Alert, AlertDescription, AlertIcon, Box, Flex, Heading, Text } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { useGetSelectedGlobalReachCertificates } from 'hooks/Network/GlobalReach';
import { RadiusEndpoint } from 'hooks/Network/RadiusEndpoints';
import CopyCell from 'pages/OpenRoamingPage/GlobalReachPage/DetailsModal/CopyCell';

const copyCell = (value: string) => <CopyCell value={value} key={uuid()} isCompact />;

type Props = {
  endpoint: RadiusEndpoint;
};

const GlobalReachEndpointDetails = ({ endpoint }: Props) => {
  const getCertificates = useGetSelectedGlobalReachCertificates({
    certIds: endpoint.RadsecServers.map((v) => v.UseOpenRoamingAccount),
  });

  const certificate = getCertificates.data?.[0];

  return (
    <Box mt={2}>
      <Heading size="md" textDecoration="underline">
        Global Reach Certificate
      </Heading>{' '}
      {certificate ? (
        <Box>
          <Flex my={2} alignItems="center">
            <Heading size="sm" mr={2}>
              Name:{' '}
            </Heading>
            <Text>{certificate.name}</Text>
          </Flex>
          <Flex my={2} alignItems="center">
            <Heading size="sm" mr={2}>
              Created:{' '}
            </Heading>
            <FormattedDate date={certificate.created} />
          </Flex>
          <Flex my={2} alignItems="center">
            <Heading size="sm" mr={2}>
              Expiry:{' '}
            </Heading>
            <FormattedDate date={certificate.expiresAt} />
          </Flex>
          <Flex my={2} alignItems="center">
            <Heading size="sm" mr={2}>
              Certificate:{' '}
            </Heading>
            {copyCell(certificate.certificate)}
          </Flex>
          <Flex my={2} alignItems="center">
            <Heading size="sm" mr={2}>
              Cert. Chain:{' '}
            </Heading>
            {copyCell(certificate.certificateChain)}
          </Flex>
          <Flex my={2} alignItems="center">
            <Heading size="sm" mr={2}>
              CSR:{' '}
            </Heading>
            {copyCell(certificate.csr)}
          </Flex>
        </Box>
      ) : (
        <Alert status="warning" mt={4}>
          <AlertIcon /> <AlertDescription>Cannot retrieve certificate information for now</AlertDescription>
        </Alert>
      )}
    </Box>
  );
};

export default GlobalReachEndpointDetails;
