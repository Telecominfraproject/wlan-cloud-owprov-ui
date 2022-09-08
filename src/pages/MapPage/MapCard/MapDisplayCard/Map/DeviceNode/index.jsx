import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Handle } from 'react-flow-renderer';
import {
  Box,
  Center,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import isEqual from 'react-fast-compare';
import { ArrowSquareOut, Circle, Heart } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { useGetGatewayUi } from 'hooks/Network/Endpoints';
import AssociationsTable from './AssociationsTable';

const propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    tag: PropTypes.shape({
      description: PropTypes.string.isRequired,
    }).isRequired,
    device: PropTypes.shape({
      connectionInfo: PropTypes.shape({
        connected: PropTypes.bool.isRequired,
      }),
      healthCheckInfo: PropTypes.shape({
        UUID: PropTypes.number.isRequired,
        sanity: PropTypes.number.isRequired,
      }),
      statsInfo: PropTypes.instanceOf(Object),
    }),
  }).isRequired,
  isConnectable: PropTypes.bool.isRequired,
};

const DeviceNode = ({ data, isConnectable }) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('blue.200', 'blue.200');
  const { data: gwUi } = useGetGatewayUi();

  const getConnection = () => {
    if (data.device?.connectionInfo) {
      return data.device?.connectionInfo?.connected
        ? { color: 'var(--chakra-colors-green-500)', value: t('devices.connected') }
        : { color: 'var(--chakra-colors-red-500)', value: t('devices.not_connected') };
    }

    return { color: 'var(--chakra-colors-gray-300)', value: t('common.unknown') };
  };
  const getHealth = () => {
    if (data.device?.healthCheckInfo && data.device?.healthCheckInfo.UUID !== 0) {
      const sanity = data.device?.healthCheckInfo.sanity;
      if (sanity >= 90) return { color: 'var(--chakra-colors-green-500)', value: `${sanity}%` };
      return sanity >= 60
        ? { color: 'var(--chakra-colors-yellow-500)', value: `${sanity}%` }
        : { color: 'var(--chakra-colors-red-500)', value: `${sanity}%` };
    }

    return { color: 'var(--chakra-colors-gray-300)', value: t('common.unknown') };
  };

  const handleOpenInGateway = () => window.open(`${gwUi}/#/devices/${data.label}`, '_blank');

  return (
    <>
      <Handle type="target" position="top" style={{ background: '#555' }} isConnectable={isConnectable} />
      <Popover isLazy trigger="hover">
        <PopoverTrigger>
          <Box width="200px" bgColor={bgColor} p="4px" borderRadius={4} pointerEvents="all">
            <Center>
              <Heading size="md" id={uuid()}>
                {data.label}
              </Heading>
            </Center>
            <Center>
              <Circle weight="fill" color={getConnection().color} />
              <Heart weight="fill" color={getHealth().color} />
            </Center>
          </Box>
        </PopoverTrigger>
        <Portal>
          <PopoverContent w="400px">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>
              {data.label}
              <Tooltip hasArrow label={t('common.view_in_gateway')} placement="top">
                <IconButton
                  ml={2}
                  colorScheme="blue"
                  icon={<ArrowSquareOut size={20} />}
                  size="sm"
                  onClick={handleOpenInGateway}
                />
              </Tooltip>
            </PopoverHeader>
            <PopoverBody>
              {data.tag.description !== '' && <Text fontStyle="italic">{data.tag.description}</Text>}
              <Text>
                {t('devices.sanity')}: {getHealth().value}
              </Text>
              <Text>
                {t('common.status')}: {getConnection().value}
              </Text>
              <AssociationsTable statsInfo={data?.device?.statsInfo} />
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
};

DeviceNode.propTypes = propTypes;

export default React.memo(DeviceNode, isEqual);
