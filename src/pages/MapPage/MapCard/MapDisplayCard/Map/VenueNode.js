import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Handle } from 'react-flow-renderer';
import {
  Box,
  Center,
  Heading,
  useColorModeValue,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
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

const VenueNode = ({ data, isConnectable }) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('cyan.200', 'cyan.400');

  const hasLowerHandle = useCallback(() => data.details.children.length > 0 || data.details.devices.length > 0, []);

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
              <Heading size="md" id={uuid()} textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
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
                {t('contacts.one')}: {data?.details?.extendedInfo?.contact?.name ?? t('common.none')}
              </Text>
              <Text>
                {t('locations.one')}: {data?.details?.extendedInfo?.location?.name ?? t('common.none')}
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

VenueNode.propTypes = propTypes;

export default React.memo(VenueNode, isEqual);
