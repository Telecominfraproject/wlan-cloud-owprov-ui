/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { animated } from '@react-spring/web';
import {
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
  useColorMode,
} from '@chakra-ui/react';
import { errorColor, successColor, warningColor } from 'utils/colors';
import { bytesString, uppercaseFirstLetter } from 'utils/stringHelper';
import { t } from 'i18next';
import { useGetGatewayUi } from 'hooks/Network/Endpoints';
import { ArrowSquareOut } from 'phosphor-react';

const CircleComponent = ({ node, style, onClick }) => {
  const { data: gwUi } = useGetGatewayUi();
  const { colorMode } = useColorMode();

  const handleClicks = useMemo(
    () => ({
      onClick: (e) => {
        onClick(node, e);
      },
    }),
    [onClick, node],
  );

  const color = useMemo(() => {
    switch (node?.data?.type) {
      case 'venue':
        if (node.data.details.avgHealth >= 90) return successColor(colorMode);
        if (node.data.details.avgHealth >= 70) return warningColor(colorMode);
        return errorColor(colorMode);
      case 'device':
        if (node.data.details.deviceInfo.health >= 90) return successColor(colorMode);
        if (node.data.details.deviceInfo.health >= 70) return warningColor(colorMode);
        return errorColor(colorMode);
      case 'ssid': {
        if (node.data.children.length === 0)
          return colorMode === 'light' ? 'var(--chakra-colors-orange-200)' : 'var(--chakra-colors-orange-400)';
        if (node.data.details.avgRssi >= -45) return successColor(colorMode);
        if (node.data.details.avgRssi >= -60) return warningColor(colorMode);
        return errorColor(colorMode);
      }
      case 'association':
        if (node.data.details.rssi >= -45) return successColor(colorMode);
        if (node.data.details.rssi >= -60) return warningColor(colorMode);
        return errorColor(colorMode);
      default:
        return colorMode === 'light' ? 'var(--chakra-colors-teal-200)' : 'var(--chakra-colors-teal-400)';
    }
  }, [node]);

  const popoverContent = useMemo(() => {
    switch (node?.data?.type) {
      case 'venue':
        return (
          <>
            <Heading size="sm">
              {node.data.children.length} {t('devices.title')}
            </Heading>
            <Heading size="sm">
              {node.data.details.avgHealth}% {t('analytics.average_health')}
            </Heading>
          </>
        );
      case 'device':
        return (
          <>
            <Heading size="sm">{node.data.children.length} BSSIDs</Heading>
            <Heading size="sm">
              {node.data.details.deviceInfo.health}% {t('analytics.health')}
            </Heading>
          </>
        );
      case 'ssid':
        return (
          <>
            <Heading size="sm">
              {node.data.children.length} {t('analytics.associations')}
            </Heading>
            <Heading size="sm">RSSI {node.data.details.avgRssi}</Heading>
          </>
        );
      case 'association':
        return (
          <>
            <Heading size="sm">RSSI {node.data.details.rssi}</Heading>
            <Heading size="sm">TX {bytesString(node.data.details.tx_bytes)}</Heading>
            <Heading size="sm">RX {bytesString(node.data.details.rx_bytes)}</Heading>
          </>
        );
      default:
        return <Text>test</Text>;
    }
  }, [node]);

  const header = useMemo(() => {
    switch (node?.data?.type) {
      case 'device': {
        const handleOpenInGateway = () =>
          window.open(`${gwUi}/#/devices/${node.data.details.deviceInfo.serialNumber}`, '_blank');
        return (
          <>
            <PopoverCloseButton alignContent="center" mt={2} />
            <PopoverHeader>
              {uppercaseFirstLetter(node?.data?.type ?? '')}: {node?.data?.name.split('/')[0]}
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
          </>
        );
      }
      default:
        return (
          <>
            <PopoverCloseButton alignContent="center" mt={1} />
            <PopoverHeader>
              {uppercaseFirstLetter(node?.data?.type ?? '')}: {node?.data?.name.split('/')[0]}
            </PopoverHeader>
          </>
        );
    }
  }, [node, gwUi]);

  return (
    <Popover isLazy trigger="hover" placement="top">
      <PopoverTrigger>
        <animated.circle
          key={node.id}
          cx={style.x}
          cy={style.y}
          r={style.radius}
          fill={color}
          stroke="black"
          strokeWidth="1px"
          opacity={style.opacity}
          onClick={handleClicks.onClick}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          {header}
          <PopoverBody>{popoverContent}</PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default CircleComponent;
