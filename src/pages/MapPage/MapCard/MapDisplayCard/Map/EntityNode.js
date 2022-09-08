import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Handle } from 'react-flow-renderer';
import {
  Box,
  Center,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import isEqual from 'react-fast-compare';
import { WifiHigh } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

const propTypes = {
  data: PropTypes.shape({
    details: PropTypes.instanceOf(Object).isRequired,
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isRoot: PropTypes.bool.isRequired,
  }).isRequired,
  isConnectable: PropTypes.bool.isRequired,
};

const EntityNode = ({ data, isConnectable }) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('teal.200', 'teal.400');

  if (data?.id === '0000-0000-0000') {
    return (
      <>
        <Box width="200px" bgColor="black" p="4px" borderRadius={4} textColor="white">
          <Center>
            <Heading size="md" id={uuid()}>
              {data.label}
            </Heading>
          </Center>
          <Center>
            <WifiHigh size={20} />
            <Heading size="sm" ml={1}>
              {data.details.cumulativeDevices}
            </Heading>
          </Center>
        </Box>
        <Handle type="source" position="bottom" id="a" style={{ background: '#555' }} isConnectable={isConnectable} />
      </>
    );
  }

  const hasLowerHandle = useCallback(
    () => data.details.children.length > 0 || data.details.venues.length > 0 || data.details.devices.length > 0,
    [],
  );

  return (
    <>
      <Handle type="target" position="top" style={{ background: '#555' }} isConnectable={isConnectable} />
      <Popover isLazy trigger="hover">
        <PopoverTrigger>
          <Box
            width="200px"
            bgColor={data?.isRoot ? 'black' : bgColor}
            p="4px"
            borderRadius={4}
            pointerEvents="all"
            textColor={data?.isRoot ? 'white' : undefined}
          >
            <Center>
              <Heading size="md" id={uuid()}>
                {data.label}
              </Heading>
            </Center>
            <Center>
              <WifiHigh size={20} />
              <Heading size="sm" ml={1} textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                {data.details.cumulativeDevices}
              </Heading>
            </Center>
          </Box>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{data.label}</PopoverHeader>
            <PopoverBody>
              {data.details.description !== '' && <Text fontStyle="italic">{data.details.description}</Text>}
              <Text>
                {data.details.cumulativeDevices} {t('map.cumulative_devices')}
              </Text>
              <Text>
                {data.details.devices.length} {t('devices.title')}
              </Text>
              <Text>
                {data.details.contacts.length} {t('contacts.other')}
              </Text>
              <Text>
                {data.details.locations.length} {t('locations.other')}
              </Text>
              <Text>RRM {data.details.rrm}</Text>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
      {hasLowerHandle() && (
        <Handle type="source" position="bottom" id="a" style={{ background: '#555' }} isConnectable={isConnectable} />
      )}
    </>
  );
};

EntityNode.propTypes = propTypes;

export default React.memo(EntityNode, isEqual);
