import * as React from 'react';
import { InfoIcon } from '@chakra-ui/icons';
import { Box, Center, Heading, IconButton, Spacer, Text, Tooltip } from '@chakra-ui/react';
import { Circle, MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';

const DeviceStatusCard = () => {
  const { t } = useTranslation();
  const { dashboard, handleDashboardModalOpen } = useVenueMonitoring();

  return (
    <Card>
      <CardHeader>
        <Heading size="md" display="flex">
          {t('common.status')}
          <Tooltip
            hasArrow
            label={t('analytics.total_devices_explanation', {
              connectedCount: dashboard.connectedDevices,
              disconnectedCount: dashboard.disconnectedDevices,
            })}
          >
            <InfoIcon ml={2} mt="0.20rem" />
          </Tooltip>
        </Heading>
        <Spacer />
        <Tooltip label={t('common.view_details')}>
          <IconButton
            aria-label={t('common.view_details')}
            icon={<MagnifyingGlass height={20} width={20} />}
            onClick={() =>
              handleDashboardModalOpen({
                prioritizedColumns: ['connected'],
                sortBy: [
                  {
                    id: 'connected',
                    desc: true,
                  },
                ],
              })
            }
          />
        </Tooltip>
      </CardHeader>
      <CardBody>
        <Box py={8} w="100%">
          <Center>
            <Heading size="md" display="flex" w="200px">
              <Circle size={24} color="var(--chakra-colors-green-400)" weight="fill" />
              <Text ml={1}>{`${dashboard.connectedDevices} ${t('analytics.connected')}`}</Text>
            </Heading>
          </Center>
          <Center>
            <Heading size="md" display="flex" w="200px">
              <Circle size={24} color="var(--chakra-colors-red-400)" weight="fill" />
              <Text ml={1}>
                {dashboard.disconnectedDevices} {t('analytics.disconnected')}
              </Text>
            </Heading>
          </Center>
        </Box>
      </CardBody>
    </Card>
  );
};

export default DeviceStatusCard;
