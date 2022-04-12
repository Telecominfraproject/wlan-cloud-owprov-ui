import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import { Box, Center, Spinner } from '@chakra-ui/react';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetSubscriber } from 'hooks/Network/Subscribers';
import CardBody from 'components/Card/CardBody';
import SubscriberDeviceTableWrapper from './SubscriberDeviceTableWrapper';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const SubscriberChildrenCard = ({ id }) => {
  const { data: subscriber, isFetching } = useGetSubscriber({ id });

  return (
    <Card>
      <CardBody>
        {!subscriber && isFetching ? (
          <Center w="100%">
            <Spinner size="xl" />
          </Center>
        ) : (
          <LoadingOverlay isLoading={isFetching}>
            <Box display="unset" w="100%">
              <SubscriberDeviceTableWrapper subscriber={subscriber} />
            </Box>
          </LoadingOverlay>
        )}
      </CardBody>
    </Card>
  );
};

SubscriberChildrenCard.propTypes = propTypes;
export default SubscriberChildrenCard;
