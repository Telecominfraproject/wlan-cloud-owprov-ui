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

const DeviceHealthCard = () => {
  const { t } = useTranslation();
  const { dashboard, handleDashboardModalOpen } = useVenueMonitoring();
  const { colorMode } = useColorMode();

  const getHealthColor = () => {
    if (dashboard.avgHealth >= 90)
      return colorMode === 'light' ? 'var(--chakra-colors-green-200)' : 'var(--chakra-colors-green-400)';
    if (dashboard.avgHealth >= 70)
      return colorMode === 'light' ? 'var(--chakra-colors-yellow-200)' : 'var(--chakra-colors-yellow-400)';
    return colorMode === 'light' ? 'var(--chakra-colors-red-200)' : 'var(--chakra-colors-red-400)';
  };

  const getHeartColor = () => {
    if (dashboard.avgHealth >= 90)
      return colorMode === 'light' ? 'var(--chakra-colors-green-400)' : 'var(--chakra-colors-green-200)';
    if (dashboard.avgHealth >= 70)
      return colorMode === 'light' ? 'var(--chakra-colors-yellow-400)' : 'var(--chakra-colors-yellow-200)';
    return colorMode === 'light' ? 'var(--chakra-colors-red-400)' : 'var(--chakra-colors-red-200)';
  };

  const devicesWithLowHealth = dashboard.devices.filter((device) => device.health < 90);

  return (
    <Card>
      <CardHeader>
        <Heading size="md" display="flex">
          {t('analytics.average_health')}
          <Tooltip hasArrow label={t('analytics.average_health_explanation')}>
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
                prioritizedColumns: ['lastHealth', 'health'],
                sortBy: [
                  {
                    id: 'health',
                    desc: false,
                  },
                ],
              })
            }
          />
        </Tooltip>
      </CardHeader>
      <CardBody bg={getHealthColor()}>
        <Box py={8} w="100%">
          <Center
            alignContent="center"
            justifyContent="center"
            justifyItems="center"
            alignItems="center"
            h={devicesWithLowHealth.length > 0 ? undefined : '100%'}
          >
            <Box>
              <Heading size="lg" display="flex">
                {dashboard.avgHealth <= 90 ? (
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
                <Text ml={1}>{`${dashboard.avgHealth}%`}</Text>
              </Heading>
            </Box>
          </Center>
          <Center hidden={devicesWithLowHealth.length === 0}>
            <Button
              variant="link"
              leftIcon={<MagnifyingGlass size={20} />}
              onClick={() =>
                handleDashboardModalOpen({
                  prioritizedColumns: ['lastHealth', 'health'],
                  sortBy: [
                    {
                      id: 'health',
                      desc: false,
                    },
                  ],
                })
              }
            >
              {devicesWithLowHealth.length} low-health{' '}
              {devicesWithLowHealth.length === 1
                ? lowercaseFirstLetter(t('devices.one'))
                : lowercaseFirstLetter(t('devices.title'))}
            </Button>
          </Center>
        </Box>
      </CardBody>
    </Card>
  );
};

export default DeviceHealthCard;
