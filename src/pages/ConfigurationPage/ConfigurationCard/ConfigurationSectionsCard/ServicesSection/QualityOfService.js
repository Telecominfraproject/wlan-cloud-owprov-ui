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

const QualityOfService = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>Quality of Service</CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <NumberField
          name="configuration.quality-of-service.upload-rate"
          label="upload-rate"
          definitionKey="service.quality-of-service.upload-rate"
          isDisabled={!editing}
          isRequired
          w={24}
        />
        <NumberField
          name="configuration.quality-of-service.download-rate"
          label="download-rate"
          definitionKey="service.quality-of-service.download-rate"
          isDisabled={!editing}
          isRequired
          w={24}
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

QualityOfService.propTypes = propTypes;
export default React.memo(QualityOfService);
