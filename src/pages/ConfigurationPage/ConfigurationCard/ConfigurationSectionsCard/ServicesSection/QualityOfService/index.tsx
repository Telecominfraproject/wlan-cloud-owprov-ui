import React from 'react';
import { Flex, Heading, SimpleGrid, Switch } from '@chakra-ui/react';
import ConfigurationSelectPortsField from 'components/CustomFields/ConfigurationSelectPortsField';
import useFastField from 'hooks/useFastField';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import NumberField from 'components/FormFields/NumberField';
import SelectField from 'components/FormFields/SelectField';
import Classifiers from './Classifiers';
import { DSCP_OPTIONS } from './ClassifierField';

const QualityOfService = ({ editing }: { editing: boolean }) => {
  const { value: bulk, onChange: onBulkChange } = useFastField({
    name: 'configuration.quality-of-service.bulk-detection',
  });

  const onBulkToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      onBulkChange(undefined);
    } else {
      onBulkChange({ dscp: 'CS0', 'packets-per-second': 0 });
    }
  };

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>
        <Heading size="md" borderBottom="1px solid">
          Quality of Service
        </Heading>
      </CardHeader>
      <CardBody pb={8} pt={2} display="block">
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={2} w="100%">
          <ConfigurationSelectPortsField name="configuration.quality-of-service.select-ports" isDisabled={!editing} />
          <NumberField
            name="configuration.quality-of-service.bandwidth-up"
            label="bandwidth-up"
            definitionKey="service.quality-of-service.bandwidth-up"
            isDisabled={!editing}
            isRequired
            w={24}
          />
          <NumberField
            name="configuration.quality-of-service.bandwidth-down"
            label="bandwidth-down"
            definitionKey="service.quality-of-service.bandwidth-down"
            isDisabled={!editing}
            isRequired
            w={24}
          />
        </SimpleGrid>
        <Flex>
          <Heading size="sm" mt={2}>
            Bulk Detection
          </Heading>
          <Switch
            pt={1}
            onChange={onBulkToggle}
            isChecked={bulk !== undefined}
            borderRadius="15px"
            size="lg"
            mx={2}
            isDisabled={!editing}
          />
        </Flex>
        {bulk !== undefined && (
          <SimpleGrid minChildWidth="100px" spacing="20px" mb={2} w="100%">
            <SelectField
              name="configuration.quality-of-service.bulk-detection.dscp"
              label="dscp"
              options={DSCP_OPTIONS}
              definitionKey="service.quality-of-service.bulk-detection.dscp"
              isDisabled={!editing}
              isRequired
              w="100px"
            />
            <NumberField
              name="configuration.quality-of-service.bulk-detection.packets-per-second"
              label="packets-per-second"
              definitionKey="service.quality-of-service.bulk-detection.packets-per-second"
              isDisabled={!editing}
              isRequired
              w={24}
            />
          </SimpleGrid>
        )}
        <Classifiers editing={editing} />
      </CardBody>
    </Card>
  );
};

export default React.memo(QualityOfService);
