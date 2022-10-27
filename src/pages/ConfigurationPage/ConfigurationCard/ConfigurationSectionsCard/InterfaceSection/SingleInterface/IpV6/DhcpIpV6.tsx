import React, { useMemo } from 'react';
import { FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { getIn, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { INTERFACE_IPV6_DHCP_SCHEMA } from '../../interfacesConstants';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';

const DhcpIpV6 = (
  {
    editing,
    index
  }: {
    editing: boolean
    index: number
  }
) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFieldValue(`configuration[${index}].ipv6.dhcpv6`, INTERFACE_IPV6_DHCP_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`configuration[${index}].ipv6.dhcpv6`, undefined);
    }
  };

  const isEnabled = useMemo(
    () => getIn(values, `configuration[${index}].ipv6.dhcpv6`) !== undefined,
    [getIn(values, `configuration[${index}].ipv6.dhcpv6`)],
  );

  return (
    <>
      <FormControl isDisabled={!editing}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          Enable DHCPv6
        </FormLabel>
        <Switch onChange={onEnabledChange} isChecked={isEnabled} borderRadius="15px" size="lg" isDisabled={!editing} />
      </FormControl>
      {isEnabled && (
        <>
          <SelectField
            name={`configuration[${index}].ipv6.dhcpv6.mode`}
            label="dhcpv6.mode"
            definitionKey="interface.ipv6.dhcpv6.mode"
            options={[
              { value: 'hybrid', label: 'hybrid' },
              { value: 'stateless', label: 'stateless' },
              { value: 'stateful', label: 'stateful' },
              { value: 'relay', label: 'relay' },
            ]}
            isDisabled={!editing}
            emptyIsUndefined
          />
          <CreatableSelectField
            name={`configuration[${index}].ipv6.dhcpv6.announce-dns`}
            label="dhcpv6.announce-dns"
            definitionKey="interface.ipv6.dhcpv6.announce-dns"
            emptyIsUndefined
          />
          <StringField
            name={`configuration[${index}].ipv6.dhcpv6.filter-prefix`}
            label="dhcpv6.filter-prefix"
            definitionKey="interface.ipv6.dhcpv6.filter-prefix"
            isDisabled={!editing}
            emptyIsUndefined
          />
        </>
      )}
    </>
  );
};

export default React.memo(DhcpIpV6);
