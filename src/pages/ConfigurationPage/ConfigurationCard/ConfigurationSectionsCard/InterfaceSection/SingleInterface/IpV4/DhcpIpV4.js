import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import StringField from 'components/FormFields/StringField';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import NumberField from 'components/FormFields/NumberField';
import { FormControl, FormLabel, Switch } from '@chakra-ui/react';
import CustomNumberAsStringField from 'components/CustomFields/CustomNumberAsStringField';
import { INTERFACE_IPV4_DHCP_SCHEMA } from '../../interfacesConstants';
import DhcpLeaseIpV4 from './DhcpLeaseIpV4';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

const DhcpIpV4 = ({ editing, index }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onEnabledChange = (e) => {
    if (e.target.checked) {
      setFieldValue(`configuration[${index}].ipv4.dhcp`, INTERFACE_IPV4_DHCP_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`configuration[${index}].ipv4.dhcp`, undefined);
      setFieldValue(`configuration[${index}].ipv4.dhcp-lease`, undefined);
    }
  };

  const isEnabled = useMemo(
    () => values.configuration[index].ipv4.dhcp !== undefined,
    [values.configuration[index].ipv4.dhcp],
  );

  return (
    <>
      <FormControl isDisabled={!editing}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          Enable DHCP
        </FormLabel>
        <Switch onChange={onEnabledChange} isChecked={isEnabled} borderRadius="15px" size="lg" isDisabled={!editing} />
      </FormControl>
      {isEnabled && (
        <>
          <NumberField
            name={`configuration[${index}].ipv4.dhcp.lease-first`}
            label="dhcp.lease-first"
            definitionKey="interface.ipv4.dhcp.lease-first"
            isDisabled={!editing}
            isRequired
          />
          <NumberField
            name={`configuration[${index}].ipv4.dhcp.lease-count`}
            label="dhcp.lease-count"
            definitionKey="interface.ipv4.dhcp.lease-count"
            isDisabled={!editing}
            isRequired
          />
          <CustomNumberAsStringField
            name={`configuration[${index}].ipv4.dhcp.lease-time`}
            label="dhcp.lease-time"
            definitionKey="interface.ipv4.dhcp.lease-time"
            isDisabled={!editing}
            unit="days"
            unitSaved="d"
            isRequired
          />
          <StringField
            name={`configuration[${index}].ipv4.dhcp.relay-server`}
            label="dhcp.relay-server"
            definitionKey="interface.ipv4.dhcp.relay-server"
            isDisabled={!editing}
            emptyIsUndefined
          />
          <DhcpLeaseIpV4 editing={editing} index={index} />
        </>
      )}
    </>
  );
};

DhcpIpV4.propTypes = propTypes;
export default React.memo(DhcpIpV4);
