import React, { useMemo } from 'react';
import { SimpleGrid, useToast } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DisplayMultiSelectField from 'components/DisplayFields/DisplayMultiSelectField';
import DisplaySelectField from 'components/DisplayFields/DisplaySelectField';
import DisplayStringField from 'components/DisplayFields/DisplayStringField';
import { useGetResource } from 'hooks/Network/Resources';
import LockedPasspoint from './LockedPasspoint';
import LockedEncryption from './LockedEncryption';
import LockedAdvanced from './LockedAdvanced';

const propTypes = {
  variableBlockId: PropTypes.string.isRequired,
};

const LockedSsid = ({ variableBlockId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: resource } = useGetResource({
    t,
    toast,
    id: variableBlockId,
    enabled: true,
  });

  const data = useMemo(() => {
    if (resource && resource.variables[0]) {
      return JSON.parse(resource.variables[0].value);
    }
    return null;
  }, [resource]);

  if (!data) return null;

  return (
    <>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <DisplayStringField value={data.name} label="name" definitionKey="interface.ssid.name" isRequired />
        <DisplaySelectField
          value={data['bss-mode']}
          label="bss-mode"
          definitionKey="interface.ssid.bss-mode"
          options={[
            { value: 'ap', label: 'ap' },
            { value: 'sta', label: 'sta' },
            { value: 'mesh', label: 'mesh' },
            { value: 'wds-ap', label: 'wds-ap' },
            { value: 'wds-sta', label: 'wds-sta' },
          ]}
          isRequired
        />
        <DisplayMultiSelectField
          value={data['wifi-bands']}
          label="wifi-bands"
          definitionKey="interface.ssid.wifi-bands"
          options={[
            { value: '2G', label: '2G' },
            { value: '5G', label: '5G' },
            { value: '6G', label: '6G' },
          ]}
          isRequired
        />
      </SimpleGrid>
      <LockedEncryption data={data} />
      <LockedPasspoint data={data} />
      <LockedAdvanced data={data} />
    </>
  );
};

LockedSsid.propTypes = propTypes;
export default React.memo(LockedSsid);
