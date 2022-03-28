import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { SimpleGrid } from '@chakra-ui/react';
import NumberField from 'components/FormFields/NumberField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Http = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>Http</CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <NumberField
          name="configuration.http.http-port"
          label="http-port"
          definitionKey="service.http.http-port"
          isDisabled={!editing}
          isRequired
          w={24}
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

Http.propTypes = propTypes;
export default React.memo(Http);
