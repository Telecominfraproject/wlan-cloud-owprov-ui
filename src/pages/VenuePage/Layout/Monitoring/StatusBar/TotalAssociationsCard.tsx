import * as React from 'react';
import { InfoIcon } from '@chakra-ui/icons';
import { Box, Center, Heading, IconButton, Spacer, Text, Tooltip } from '@chakra-ui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';

const TotalAssociationsCard = () => {
  const { t } = useTranslation();
  const { dashboard, handleDashboardModalOpen } = useVenueMonitoring();

  return (
    <Card>
      <CardHeader>
        <Heading size="md" display="flex">
          {t('analytics.associations')}
          <Tooltip hasArrow label={t('analytics.associations_explanation')}>
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
                prioritizedColumns: ['6g', '5g', '2g'],
                sortBy: [
                  {
                    id: '2g',
                    desc: true,
                  },
                  {
                    id: '5g',
                    desc: true,
                  },
                  {
                    id: '6g',
                    desc: true,
                  },
                ],
              })
            }
          />
        </Tooltip>
      </CardHeader>
      <CardBody>
        <Box my={6} w="100%">
          <Center>
            <Heading size="md" display="flex" w="100px">
              <Text ml={1}>2G - {dashboard.twoGAssociations}</Text>
            </Heading>
          </Center>
          <Center>
            <Heading size="md" display="flex" w="100px">
              <Text ml={1}>5G - {dashboard.fiveGAssociations}</Text>
            </Heading>
          </Center>
          <Center>
            <Heading size="md" display="flex" w="100px">
              <Text ml={1}>6G - {dashboard.sixGAssociations}</Text>
            </Heading>
          </Center>
        </Box>
      </CardBody>
    </Card>
  );
};

export default TotalAssociationsCard;
