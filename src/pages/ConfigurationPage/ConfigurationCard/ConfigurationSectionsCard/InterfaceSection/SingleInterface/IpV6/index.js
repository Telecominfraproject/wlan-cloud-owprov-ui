import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Heading, Select, Switch, Text } from '@chakra-ui/react';
import { useFormikContext } from 'formik';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

const IpV6 = ({ editing, index }) => {
  const { values, setFieldValue } = useFormikContext();

  const getIpv6Value = () => {
    if (values.configuration[index].ipv6 === undefined) return '';
    return 'dynamic';
  };

  const onIpv6Change = (e) => {
    if (e.target.value === '') {
      setFieldValue(`configuration[${index}].ipv6`, undefined);
    } else setFieldValue(`configuration[${index}].ipv6`, { addressing: 'dynamic' });
  };

  const onIpv6Toggle = (e) => {
    if (!e.target.checked) {
      setFieldValue(`configuration[${index}].ipv6`, undefined);
    } else {
      setFieldValue(`configuration[${index}].ipv6`, { addressing: 'dynamic' });
    }
  };

  return (
    <Heading size="md" display="flex">
      <Text pt={1}>IpV6</Text>
      <Switch
        onChange={onIpv6Toggle}
        isChecked={getIpv6Value() !== ''}
        borderRadius="15px"
        size="lg"
        isDisabled={!editing}
        pt={1}
        mx={2}
      />
      <FormControl isDisabled hidden={getIpv6Value() === ''}>
        <Select
          value={getIpv6Value()}
          onChange={onIpv6Change}
          borderRadius="15px"
          fontSize="sm"
          w="120px"
        >
          <option value="dynamic">dynamic</option>
        </Select>
      </FormControl>
    </Heading>
  );
};
IpV6.propTypes = propTypes;
export default React.memo(IpV6);
