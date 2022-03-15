import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Heading, Select, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import TunnelValues from './TunnelValues';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

const Tunnel = ({ editing, index }) => {
  const { values, setFieldValue } = useFormikContext();

  const getTunnelProto = () => {
    if (values.configuration[index].tunnel === undefined) return '';
    return values.configuration[index].tunnel.proto ?? '';
  };

  const onChange = (e) => {
    if (e.target.value === 'mesh')
      setFieldValue(`configuration[${index}].tunnel`, { proto: 'mesh' });
    else if (e.target.value === 'vxlan') {
      setFieldValue(`configuration[${index}].tunnel`, {
        proto: 'vxlan',
        'peer-address': '192.168.0.1',
        'peer-port': 4700,
      });
    } else if (e.target.value === 'l2tp') {
      setFieldValue(`configuration[${index}].tunnel`, {
        proto: 'l2tp',
        server: '192.168.0.1',
        password: 'YOUR_PASSWORD',
      });
    } else {
      setFieldValue(`configuration[${index}].tunnel`, {
        proto: 'gre',
        'peer-address': '192.168.0.1',
      });
    }
  };

  const onToggle = (e) => {
    if (!e.target.checked) {
      setFieldValue(`configuration[${index}].tunnel`, undefined);
    } else {
      setFieldValue(`configuration[${index}].tunnel`, { proto: 'mesh' });
    }
  };

  return (
    <>
      <Heading size="md" display="flex">
        <Text pt={1}>Tunnel</Text>
        <Switch
          onChange={onToggle}
          isChecked={getTunnelProto() !== ''}
          borderRadius="15px"
          size="lg"
          isDisabled={!editing}
          pt={1}
          mx={2}
        />
        <FormControl isDisabled={!editing} hidden={getTunnelProto() === ''}>
          <Select
            value={getTunnelProto()}
            onChange={onChange}
            borderRadius="15px"
            fontSize="sm"
            w="120px"
          >
            <option value="mesh">mesh</option>
            <option value="vxlan">vxlan</option>
            <option value="l2tp">l2tp</option>
            <option value="gre">gre</option>
          </Select>
        </FormControl>
      </Heading>
      <SimpleGrid
        minChildWidth="300px"
        spacing="20px"
        mb={getTunnelProto() !== '' ? 8 : undefined}
        mt={2}
        w="100%"
      >
        <TunnelValues index={index} type={getTunnelProto()} editing={editing} />
      </SimpleGrid>
    </>
  );
};
Tunnel.propTypes = propTypes;
export default React.memo(Tunnel);
