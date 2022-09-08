import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import ObjectArrayFieldModal from 'components/FormFields/ObjectArrayFieldModal';
import StringField from 'components/FormFields/StringField';
import { SERVICES_INGRESS_FILTER_SCHEMA } from './servicesConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const DataPlane = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        Data Plane
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <ObjectArrayFieldModal
          name="configuration.data-plane.ingress-filters"
          label="ingress-filters"
          fields={
            <SimpleGrid minChildWidth="300px" gap={4}>
              <StringField name="name" label="name" isRequired />
              <StringField name="program" label="program" isRequired />
            </SimpleGrid>
          }
          columns={[
            {
              id: 'name',
              Header: 'name',
              Footer: '',
              accessor: 'name',
              customWidth: '150px',
            },
            {
              id: 'program',
              Header: 'program',
              Footer: '',
              accessor: 'program',
            },
          ]}
          schema={SERVICES_INGRESS_FILTER_SCHEMA}
          isDisabled={!editing}
          isRequired
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

DataPlane.propTypes = propTypes;
export default React.memo(DataPlane);
