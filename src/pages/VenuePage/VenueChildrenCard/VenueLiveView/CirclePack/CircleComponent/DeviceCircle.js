import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
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
} from '@chakra-ui/react';
import { t } from 'i18next';
import { ArrowSquareOut, Tag } from 'phosphor-react';
import { useGetGatewayUi } from 'hooks/Network/Endpoints';

const propTypes = {
  node: PropTypes.instanceOf(Object).isRequired,
  handleClicks: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.instanceOf(Object).isRequired,
};

const DeviceCircle = ({ node, style, handleClicks }) => {
  const { data: gwUi } = useGetGatewayUi();

  const handleOpenInGateway = useMemo(
    () => () => window.open(`${gwUi}/#/devices/${node.data.details.deviceInfo.serialNumber}`, '_blank'),
    [gwUi],
  );

  return (
    <Popover isLazy trigger="hover" placement="top">
      <PopoverTrigger>
        <animated.circle
          key={node.id}
          cx={style.x}
          cy={style.y}
          r={style.radius}
          fill={node.data.details.color}
          stroke="black"
          strokeWidth="1px"
          opacity={style.opacity}
          onClick={handleClicks.onClick}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton alignContent="center" mt={1} />
          <PopoverHeader display="flex">
            <Tag size={24} weight="fill" />
            <Text ml={2}>{node?.data?.name.split('/')[0]}</Text>
            <Tooltip hasArrow label={t('common.view_in_gateway')} placement="top">
              <IconButton
                ml={2}
                colorScheme="blue"
                icon={<ArrowSquareOut size={20} />}
                size="xs"
                onClick={handleOpenInGateway}
              />
            </Tooltip>
          </PopoverHeader>
          <PopoverBody>
            <Heading size="sm">{node.data.children.length} BSSIDs</Heading>
            <Heading size="sm">
              {node.data.details.deviceInfo.health}% {t('analytics.health')}
            </Heading>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

DeviceCircle.propTypes = propTypes;
export default React.memo(DeviceCircle);
