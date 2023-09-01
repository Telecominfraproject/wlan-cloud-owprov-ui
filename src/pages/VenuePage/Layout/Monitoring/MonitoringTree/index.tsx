import * as React from 'react';
import { Box, HStack, Heading } from '@chakra-ui/react';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import ApMonitoringNode from './ApMonitoringNode';
import SelectedMonitoringDisplay from './SelectedMonitoringDisplay';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';

const VenueMonitoringTree = () => {
  const context = useVenueMonitoring();
  const [expandedIds, setExpandedIds] = React.useState<{
    [key: string]: boolean;
  }>({});

  const onExpand = React.useCallback(
    (id: string) => {
      const newExpandedIds = { ...expandedIds };
      newExpandedIds[id] = true;
      setExpandedIds(newExpandedIds);
    },
    [expandedIds],
  );

  const onCollapse = React.useCallback(
    (id: string) => {
      const newExpandedIds = { ...expandedIds };
      newExpandedIds[id] = false;
      setExpandedIds(newExpandedIds);
    },
    [expandedIds],
  );

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Live Data</Heading>
      </CardHeader>
      <CardBody>
        <Box w="100%">
          <HStack alignItems="start">
            <Box>
              {context.monitoring.map((data) => (
                <ApMonitoringNode
                  key={data.serialNumber}
                  data={data}
                  expandedIds={expandedIds}
                  onCollapse={onCollapse}
                  onExpand={onExpand}
                  level={0}
                />
              ))}
            </Box>
            <Box>
              <SelectedMonitoringDisplay />
            </Box>
          </HStack>
        </Box>
      </CardBody>
    </Card>
  );
};

export default VenueMonitoringTree;
