import React from 'react';
import Card from 'components/Card';
import { Box, Center, Spinner } from '@chakra-ui/react';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetSubscriber } from 'hooks/Network/Subscribers';
import CardBody from 'components/Card/CardBody';
import DevicesTab from './DevicesTab';

interface Props {
  id: string;
}

const SubscriberChildrenCard: React.FC<Props> = ({ id }) => {
  const { data: subscriber, isFetching } = useGetSubscriber({ id });

  return (
    <Card>
      <CardBody>
        {!subscriber ? (
          <Center w="100%">
            <Spinner size="xl" />
          </Center>
        ) : (
          <LoadingOverlay isLoading={isFetching}>
            <Box display="unset" w="100%">
              <DevicesTab subscriberId={id} operatorId={subscriber?.owner} />
            </Box>
          </LoadingOverlay>
        )}
      </CardBody>
    </Card>
  );
};

export default SubscriberChildrenCard;
