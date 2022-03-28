import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { SimpleGrid } from '@chakra-ui/react';
import NumberField from 'components/FormFields/NumberField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import MultiSelectField from 'components/FormFields/MultiSelectField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const OnlineCheck = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>Online Check</CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <MultiSelectField
          name="configuration.online-check.action"
          label="action"
          definitionKey="service.online-check.action"
          isDisabled={!editing}
          isRequired
          options={[
            { value: 'wifi', label: 'wifi' },
            {
              value: 'leds',
              label: 'leds',
            },
          ]}
        />
        <CreatableSelectField
          name="configuration.online-check.ping-hosts"
          label="ping-hosts"
          definitionKey="service.online-check.ping-hosts"
          isDisabled={!editing}
          isRequired
        />
        <CreatableSelectField
          name="configuration.online-check.download-hosts"
          label="download-hosts"
          definitionKey="service.online-check.download-hosts"
          isDisabled={!editing}
          isRequired
        />
        <NumberField
          name="configuration.online-check.check-interval"
          label="check-interval"
          definitionKey="service.online-check.check-interval"
          isDisabled={!editing}
          isRequired
          w={24}
        />
        <NumberField
          name="configuration.online-check.check-threshold"
          label="check-threshold"
          definitionKey="service.online-check.check-threshold"
          isDisabled={!editing}
          isRequired
          w={24}
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

OnlineCheck.propTypes = propTypes;
export default React.memo(OnlineCheck);
