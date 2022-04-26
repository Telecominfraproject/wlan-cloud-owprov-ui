import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { getIn, useFormikContext } from 'formik';
import NumberField from 'components/FormFields/NumberField';
import ConfigurationResourcePicker from 'components/CustomFields/ConfigurationResourcePicker';
import * as Yup from 'yup';
import LockedVlan from './LockedVlan';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

const Vlan = ({ editing, index }) => {
  const { values, setFieldValue } = useFormikContext();

  const isActive = () => values.configuration[index].vlan !== undefined;

  const isUsingCustom = useMemo(() => {
    const v = getIn(values, `configuration[${index}].vlan`);
    return v !== undefined && v.__variableBlock === undefined;
  }, [getIn(values, `configuration[${index}].vlan`)]);

  const onToggle = (e) => {
    if (!e.target.checked) {
      setFieldValue(`configuration[${index}].vlan`, undefined);
    } else {
      setFieldValue(`configuration[${index}].vlan`, { id: 1 });
    }
  };

  const basicSchema = (t) =>
    Yup.object()
      .shape({
        id: Yup.number().required(t('form.required')).moreThan(0).lessThan(4051).default(1080),
      })
      .default({
        id: 1080,
      });

  return (
    <>
      <Heading size="md" display="flex">
        <Text>Vlan</Text>
        <Switch onChange={onToggle} isChecked={isActive()} borderRadius="15px" size="lg" mx={2} isDisabled={!editing} />
        {isActive && (
          <ConfigurationResourcePicker
            name={`configuration[${index}].vlan`}
            prefix="interface.vlan"
            isDisabled={!editing}
            defaultValue={basicSchema}
          />
        )}
      </Heading>
      {isActive() && isUsingCustom && (
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <NumberField name={`configuration[${index}].vlan.id`} label="id" isDisabled={!editing} isRequired w={36} />
        </SimpleGrid>
      )}
      {isActive() && !isUsingCustom && (
        <LockedVlan variableBlockId={getIn(values, `configuration[${index}].vlan.__variableBlock`)[0]} />
      )}
    </>
  );
};
Vlan.propTypes = propTypes;
export default React.memo(Vlan);
