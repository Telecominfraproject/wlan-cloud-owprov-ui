import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { SimpleGrid } from '@chakra-ui/react';
import ToggleField from 'components/FormFields/ToggleField';
import SelectField from 'components/FormFields/SelectField';
import NumberField from 'components/FormFields/NumberField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const WifiSteering = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>Wifi Steering</CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <SelectField
          name="configuration.wifi-steering.mode"
          label="mode"
          definitionKey="service.wifi-steering.mode"
          isDisabled={!editing}
          isRequired
          options={[
            { value: 'local', label: 'local' },
            {
              value: 'cloud',
              label: 'cloud',
            },
          ]}
        />
        <ToggleField
          name="configuration.wifi-steering.assoc-steering"
          label="assoc-steering"
          definitionKey="service.wifi-steering.assoc-steering"
          isDisabled={!editing}
          isRequired
        />
        <ToggleField
          name="configuration.wifi-steering.auto-channel"
          label="auto-channel"
          definitionKey="service.wifi-steering.auto-channel"
          isDisabled={!editing}
          isRequired
        />
        <NumberField
          name="configuration.wifi-steering.required-probe-snr"
          label="required-probe-snr"
          definitionKey="service.wifi-steering.required-probe-snr"
          isDisabled={!editing}
          isRequired
          w={24}
        />
        <NumberField
          name="configuration.wifi-steering.required-roam-snr"
          label="required-roam-snr"
          definitionKey="service.wifi-steering.required-roam-snr"
          isDisabled={!editing}
          isRequired
          w={24}
        />
        <NumberField
          name="configuration.wifi-steering.load-kick-threshold"
          label="load-kick-threshold"
          definitionKey="service.wifi-steering.load-kick-threshold"
          isDisabled={!editing}
          isRequired
          w={24}
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

WifiSteering.propTypes = propTypes;
export default React.memo(WifiSteering);
