import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Heading, Select, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { INTERFACE_IPV4_SCHEMA } from '../../interfacesConstants';
import StaticIpV4 from './StaticIpV4';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

const IpV4 = ({ editing, index }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const getIpv4Value = () => {
    if (values.configuration[index].ipv4 === undefined) return '';
    if (values.configuration[index].ipv4.addressing === 'dynamic') return 'dynamic';
    return 'static';
  };

  const onIpv4Change = (e) => {
    if (e.target.value === '') {
      setFieldValue(`configuration[${index}].ipv4`, undefined);
    } else if (e.target.value === 'dynamic')
      setFieldValue(`configuration[${index}].ipv4`, { addressing: 'dynamic' });
    else {
      setFieldValue(`configuration[${index}].ipv4`, {
        ...INTERFACE_IPV4_SCHEMA(t, true).cast(),
        addressing: 'static',
      });
    }
  };

  const onIpv4Toggle = (e) => {
    if (!e.target.checked) {
      setFieldValue(`configuration[${index}].ipv4`, undefined);
    } else {
      setFieldValue(`configuration[${index}].ipv4`, { addressing: 'dynamic' });
    }
  };

  return (
    <>
      <Heading size="md" display="flex">
        <Text pt={1}>IpV4</Text>
        <Switch
          onChange={onIpv4Toggle}
          isChecked={getIpv4Value() !== ''}
          borderRadius="15px"
          size="lg"
          isDisabled={!editing}
          pt={1}
          mx={2}
        />
        <FormControl isDisabled={!editing} hidden={getIpv4Value() === ''}>
          <Select
            value={getIpv4Value()}
            onChange={onIpv4Change}
            borderRadius="15px"
            fontSize="sm"
            w="120px"
          >
            <option value="dynamic">dynamic</option>
            <option value="static">static</option>
          </Select>
        </FormControl>
      </Heading>
      <SimpleGrid
        minChildWidth="300px"
        spacing="20px"
        mb={getIpv4Value() === 'static' ? 8 : undefined}
        mt={2}
        w="100%"
      >
        <StaticIpV4 index={index} isEnabled={getIpv4Value() === 'static'} editing={editing} />
      </SimpleGrid>
    </>
  );
};
IpV4.propTypes = propTypes;
export default React.memo(IpV4);
