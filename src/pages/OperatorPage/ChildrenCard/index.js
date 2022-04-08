import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import { Center, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LoadingOverlay from 'components/LoadingOverlay';
import CardBody from 'components/Card/CardBody';
import { useGetOperator } from 'hooks/Network/Operators';
import ServiceClassTab from './ServiceClassTab';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const OperatorChildrenCard = ({ id }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: operator, isFetching } = useGetOperator({ t, toast, id });

  return (
    <Card>
      <CardBody>
        <Tabs isLazy variant="enclosed" w="100%">
          <TabList>
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
                  <ServiceClassTab operatorId={operator?.id} />
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
