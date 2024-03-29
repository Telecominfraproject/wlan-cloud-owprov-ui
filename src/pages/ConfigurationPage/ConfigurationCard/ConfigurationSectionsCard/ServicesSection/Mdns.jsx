import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import ToggleField from 'components/FormFields/ToggleField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Mdns = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        Mdns
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <ToggleField
          name="configuration.mdns.enable"
          label="enable"
          definitionKey="service.mdns.enable"
          isDisabled={!editing}
          isRequired
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

Mdns.propTypes = propTypes;
export default React.memo(Mdns);
