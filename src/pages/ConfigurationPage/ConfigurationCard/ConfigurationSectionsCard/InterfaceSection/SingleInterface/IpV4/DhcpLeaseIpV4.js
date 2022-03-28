import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { FormControl, FormLabel, Switch } from '@chakra-ui/react';
import ToggleField from 'components/FormFields/ToggleField';
import NumberField from 'components/FormFields/NumberField';
import StringField from 'components/FormFields/StringField';
import CustomNumberAsStringField from 'components/CustomFields/CustomNumberAsStringField';
import { INTERFACE_IPV4_DHCP_LEASE_SCHEMA } from '../../interfacesConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

const DhcpLeaseIpV4 = ({ editing, index }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onEnabledChange = (e) => {
    if (e.target.checked) {
      setFieldValue(`configuration[${index}].ipv4.dhcp-lease`, INTERFACE_IPV4_DHCP_LEASE_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`configuration[${index}].ipv4.dhcp-lease`, undefined);
    }
  };

  const isEnabled = useMemo(
    () => values.configuration[index].ipv4['dhcp-lease'] !== undefined,
    [values.configuration[index].ipv4['dhcp-lease']],
  );

  return (
    <>
      <FormControl isDisabled={!editing}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          Enable DHCP-LEASE
        </FormLabel>
        <Switch onChange={onEnabledChange} isChecked={isEnabled} borderRadius="15px" size="lg" isDisabled={!editing} />
      </FormControl>
      {isEnabled && (
        <>
          <StringField
            name={`configuration[${index}].ipv4.dhcp-lease.macaddr`}
            label="dhcp-lease.macaddr"
            definitionKey="interface.ipv4.dhcp-lease.macaddr"
            isDisabled={!editing}
            isRequired
          />
          <CustomNumberAsStringField
            name={`configuration[${index}].ipv4.dhcp-lease.lease-time`}
            label="dhcp-lease.lease-time"
            definitionKey="interface.ipv4.dhcp-lease.lease-time"
            isDisabled={!editing}
            unit="days"
            unitSaved="d"
            isRequired
          />
          <NumberField
            name={`configuration[${index}].ipv4.dhcp-lease.static-lease-offset`}
            label="dhcp-lease.static-lease-offset"
            definitionKey="interface.ipv4.dhcp-lease.static-lease-offset"
            isDisabled={!editing}
            isRequired
          />
          <ToggleField
            name={`configuration[${index}].ipv4.dhcp-lease.publish-hostname`}
            label="dhcp-lease.publish-hostname"
            definitionKey="interface.ipv4.dhcp-lease.publish-hostname"
            isDisabled={!editing}
          />
        </>
      )}
    </>
  );
};

DhcpLeaseIpV4.propTypes = propTypes;
export default React.memo(DhcpLeaseIpV4);
