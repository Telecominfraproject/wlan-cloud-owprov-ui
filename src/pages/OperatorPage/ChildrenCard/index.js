import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import { Center, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LoadingOverlay from 'components/LoadingOverlay';
import CardBody from 'components/Card/CardBody';
import { useGetOperator } from 'hooks/Network/Operators';
import ServiceClassTab from './ServiceClassTab';
import OperatorDevicesTab from './DevicesTab';
import SubscriberTab from './SubscriberTab';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const OperatorChildrenCard = ({ id }) => {
  const { t } = useTranslation();
  const { data: operator, isFetching, refetch } = useGetOperator({ id });

  return (
    <Card>
      <CardBody>
        <Tabs isLazy variant="enclosed" w="100%">
          <TabList>
            <Tab>{t('devices.title')}</Tab>
            <Tab>{t('subscribers.other')}</Tab>
            <Tab>{t('service.other')}</Tab>
          </TabList>
          {!operator && isFetching ? (
            <Center w="100%">
              <Spinner size="xl" />
            </Center>
          ) : (
            <LoadingOverlay isLoading={isFetching}>
              <TabPanels>
                <TabPanel overflowX="auto">
                  <OperatorDevicesTab operatorId={id} />
                </TabPanel>
                <TabPanel overflowX="auto">
                  <SubscriberTab operatorId={id} refreshOperator={refetch} />
                </TabPanel>
                <TabPanel overflowX="auto">
                  <ServiceClassTab operatorId={id} />
                </TabPanel>
              </TabPanels>
            </LoadingOverlay>
          )}
        </Tabs>
      </CardBody>
    </Card>
  );
};

OperatorChildrenCard.propTypes = propTypes;
export default OperatorChildrenCard;
