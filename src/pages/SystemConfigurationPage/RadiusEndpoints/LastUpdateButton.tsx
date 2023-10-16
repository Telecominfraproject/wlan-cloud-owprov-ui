/* eslint-disable max-len */
import * as React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Heading,
  IconButton,
  Tag,
  TagLeftIcon,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { CloudArrowUp, Warning } from '@phosphor-icons/react';
import RefreshButton from 'components/Buttons/RefreshButton';
import FormattedDate from 'components/FormattedDate';
import { Modal } from 'components/Modals/Modal';
import { useGetRadiusEndpointLastGwUpdate, useUpdateRadiusEndpointsOnGateway } from 'hooks/Network/RadiusEndpoints';
import { useNotification } from 'hooks/useNotification';

const LastRadiusEndpointUpdateButton = () => {
  const getLastUpdate = useGetRadiusEndpointLastGwUpdate();
  const triggerUpdate = useUpdateRadiusEndpointsOnGateway();
  const { apiErrorToast, successToast } = useNotification();
  const modalProps = useDisclosure();

  const lastUpdateInfo = React.useMemo(() => {
    if (getLastUpdate.data) {
      const lastUpdate =
        getLastUpdate.data.lastUpdate === 0 ? 'Never' : <FormattedDate date={getLastUpdate.data.lastUpdate} />;
      const lastConfigurationChange =
        getLastUpdate.data.lastConfigurationChange === 0 ? (
          'Never'
        ) : (
          <FormattedDate date={getLastUpdate.data.lastConfigurationChange} />
        );

      const isUpToDate =
        getLastUpdate.data.lastUpdate !== 0 &&
        getLastUpdate.data.lastConfigurationChange === getLastUpdate.data.lastUpdate;

      return {
        lastUpdate,
        lastConfigurationChange,
        isUpToDate,
      };
    }

    return {
      lastUpdate: '-',
      lastConfigurationChange: '-',
      isUpToDate: true,
    };
  }, [getLastUpdate.data]);

  const onTrigger = async () => {
    await triggerUpdate.mutateAsync(undefined, {
      onSuccess: () => {
        successToast({
          description: 'Initiated update of all Radius Endpoints on the gateway',
        });
        modalProps.onClose();
      },
      onError: (e) => {
        apiErrorToast({ e });
      },
    });
  };

  const onOpen = () => {
    getLastUpdate.refetch();
    modalProps.onOpen();
  };

  return (
    <>
      <Tooltip
        label={
          lastUpdateInfo.isUpToDate
            ? 'The RADIUS configuration of your controller matches your RADIUS endpoints'
            : 'The RADIUS configuration of your controller does not match your RADIUS endpoints. This means your RADIUS configurations on your controller might not work as expected'
        }
      >
        <Tag colorScheme={lastUpdateInfo.isUpToDate ? 'green' : 'yellow'} size="lg">
          <TagLeftIcon as={Warning} hidden={lastUpdateInfo.isUpToDate} />
          <Text mr={2}>Last Update:</Text>
          {lastUpdateInfo.lastUpdate}
        </Tag>
      </Tooltip>
      <Tooltip label="Update Controller" closeOnClick={false}>
        <IconButton aria-label="Update" onClick={onOpen} colorScheme="purple" icon={<CloudArrowUp size={20} />} />
      </Tooltip>
      <Modal
        {...modalProps}
        title="Update Endpoints"
        options={
          {
            // modalSize: 'sm',
          }
        }
        topRightButtons={<RefreshButton onClick={getLastUpdate.refetch} isFetching={getLastUpdate.isFetching} />}
      >
        <Box>
          {!lastUpdateInfo.isUpToDate ? (
            <Alert status="warning" mb={4}>
              <AlertIcon />
              <Box>
                <AlertDescription>
                  The RADIUS configuration of your controller does not match your RADIUS endpoints. This means your
                  RADIUS configurations on your controller might not work as expected
                </AlertDescription>
              </Box>
            </Alert>
          ) : null}
          <Heading size="sm">Last Provisioning change: {lastUpdateInfo.lastConfigurationChange}</Heading>
          <Heading size="sm">Last Controller update: {lastUpdateInfo.lastUpdate}</Heading>
          <Alert status="error" mt={4}>
            <AlertIcon />
            <Box>
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Updating the Controller with the latest RADIUS endpoint values may cause some RADIUS disruption for 1-2
                minutes
              </AlertDescription>
            </Box>
          </Alert>
          <Center mt={4}>
            <Button onClick={modalProps.onClose} ml={-2} mr={2}>
              Cancel
            </Button>
            <Button ml={2} colorScheme="red" onClick={onTrigger} isLoading={triggerUpdate.isLoading}>
              Proceed
            </Button>
          </Center>
        </Box>
      </Modal>
    </>
  );
};

export default LastRadiusEndpointUpdateButton;
