import React from 'react';
import NumberField from 'components/FormFields/NumberField';
import { Heading, SimpleGrid } from '@chakra-ui/react';

const InterfaceVlanForm = () => (
  <>
    <Heading size="md" mt={6} mb={2} textDecoration="underline">
      interface.ssid.radius
    </Heading>
    <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
      <NumberField name="id" label="id" isRequired w={36} />
    </SimpleGrid>
  </>
);

export default React.memo(InterfaceVlanForm);
