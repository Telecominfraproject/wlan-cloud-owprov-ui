import React from 'react';
import PropTypes from 'prop-types';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import NumberField from 'components/FormFields/NumberField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

const Vlan = ({ editing, index }) => {
  const { values, setFieldValue } = useFormikContext();

  const isActive = () => values.configuration[index].vlan !== undefined;

  const onToggle = (e) => {
    if (!e.target.checked) {
      setFieldValue(`configuration[${index}].vlan`, undefined);
    } else {
      setFieldValue(`configuration[${index}].vlan`, { id: 1 });
    }
  };

  return (
    <>
      <Heading size="md" display="flex">
        <Text>Vlan</Text>
        <Switch
          onChange={onToggle}
          isChecked={isActive()}
          borderRadius="15px"
          size="lg"
          mx={2}
          isDisabled={!editing}
        />
      </Heading>
      {isActive() && (
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <NumberField
            name={`configuration[${index}].vlan.id`}
            label="id"
            isDisabled={!editing}
            isRequired
            w={36}
          />
        </SimpleGrid>
      )}
    </>
  );
};
Vlan.propTypes = propTypes;
export default React.memo(Vlan);
