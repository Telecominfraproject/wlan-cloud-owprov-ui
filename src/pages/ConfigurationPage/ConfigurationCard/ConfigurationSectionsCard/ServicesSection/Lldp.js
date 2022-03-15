import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { SimpleGrid } from '@chakra-ui/react';
import StringField from 'components/FormFields/StringField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Lldp = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>Lldp</CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <StringField
          name="configuration.lldp.describe"
          label="describe"
          definitionKey="service.lldp.describe"
          isDisabled={!editing}
          isRequired
        />
        <StringField
          name="configuration.lldp.location"
          label="location"
          definitionKey="service.lldp.location"
          isDisabled={!editing}
          isRequired
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

Lldp.propTypes = propTypes;
export default React.memo(Lldp);
