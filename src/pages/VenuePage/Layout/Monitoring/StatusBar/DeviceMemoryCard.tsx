import * as React from 'react';
import { InfoIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Heading, IconButton, Spacer, Text, Tooltip, useColorMode } from '@chakra-ui/react';
import { Heart, HeartBreak, MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { lowercaseFirstLetter } from 'utils/stringHelper';

const DeviceMemoryCard = () => {
  const { t } = useTranslation();
  const { dashboard, handleDashboardModalOpen } = useVenueMonitoring();
  const { colorMode } = useColorMode();

  const getMemoryColor = () => {
    if (dashboard.avgMemoryUsed < 65)
      return colorMode === 'light' ? 'var(--chakra-colors-green-200)' : 'var(--chakra-colors-green-400)';
    if (dashboard.avgMemoryUsed < 80)
      return colorMode === 'light' ? 'var(--chakra-colors-yellow-200)' : 'var(--chakra-colors-yellow-400)';
    return colorMode === 'light' ? 'var(--chakra-colors-red-200)' : 'var(--chakra-colors-red-400)';
  };
  const getHeartColor = () => {
    if (dashboard.avgMemoryUsed < 65)
      return colorMode === 'light' ? 'var(--chakra-colors-green-400)' : 'var(--chakra-colors-green-200)';
    if (dashboard.avgMemoryUsed < 80)
      return colorMode === 'light' ? 'var(--chakra-colors-yellow-400)' : 'var(--chakra-colors-yellow-200)';
    return colorMode === 'light' ? 'var(--chakra-colors-red-400)' : 'var(--chakra-colors-red-200)';
  };

  const devicesWithHighMemory = dashboard.devices.filter((device) => device.memory > 65);

  return (
    <Card>
      <CardHeader>
        <Heading size="md" display="flex">
          {t('analytics.average_memory')}
          <Tooltip hasArrow label={t('analytics.average_memory_explanation')}>
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
                prioritizedColumns: ['lastPing', 'memory'],
                sortBy: [
                  {
                    id: 'memory',
                    desc: true,
                  },
                ],
              })
            }
          />
        </Tooltip>
      </CardHeader>
      <CardBody bg={getMemoryColor()}>
        <Box py={8} w="100%">
          <Center
            alignContent="center"
            justifyContent="center"
            justifyItems="center"
            alignItems="center"
            h={devicesWithHighMemory.length > 0 ? undefined : '100%'}
          >
            <Box>
              <Heading size="lg" display="flex">
                {dashboard.avgMemoryUsed > 80 ? (
                  <HeartBreak
                    size={32}
                    color={getHeartColor()}
                    weight="fill"
                    style={{
                      marginTop: '0.20rem',
                    }}
                  />
                ) : (
                  <Heart
                    size={32}
                    color={getHeartColor()}
                    weight="fill"
                    style={{
                      marginTop: '0.20rem',
                    }}
                  />
                )}
                <Text ml={1}>{`${dashboard.avgMemoryUsed}%`}</Text>
              </Heading>
            </Box>
          </Center>
          <Center hidden={devicesWithHighMemory.length === 0}>
            <Button
              variant="link"
              leftIcon={<MagnifyingGlass size={20} />}
              onClick={() =>
                handleDashboardModalOpen({
                  prioritizedColumns: ['lastPing', 'memory'],
                  sortBy: [
                    {
                      id: 'memory',
                      desc: true,
                    },
                  ],
                })
              }
            >
              {devicesWithHighMemory.length} high-memory use{' '}
              {devicesWithHighMemory.length === 1
                ? lowercaseFirstLetter(t('devices.one'))
                : lowercaseFirstLetter(t('devices.title'))}
            </Button>
          </Center>
        </Box>
      </CardBody>
    </Card>
  );
};

export default DeviceMemoryCard;
