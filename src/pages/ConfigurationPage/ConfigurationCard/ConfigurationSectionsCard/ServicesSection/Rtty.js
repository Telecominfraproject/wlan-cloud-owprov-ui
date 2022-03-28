import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { SimpleGrid } from '@chakra-ui/react';
import StringField from 'components/FormFields/StringField';
import NumberField from 'components/FormFields/NumberField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Rtty = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>Rtty</CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <StringField
          name="configuration.rtty.host"
          label="host"
          definitionKey="service.rtty.host"
          isDisabled={!editing}
          isRequired
        />
        <NumberField
          name="configuration.rtty.port"
          label="port"
          definitionKey="service.rtty.port"
          isDisabled={!editing}
          isRequired
          w={24}
        />
        <StringField
          name="configuration.rtty.token"
          label="token"
          definitionKey="service.rtty.token"
          isDisabled={!editing}
          isRequired
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

Rtty.propTypes = propTypes;
export default React.memo(Rtty);
