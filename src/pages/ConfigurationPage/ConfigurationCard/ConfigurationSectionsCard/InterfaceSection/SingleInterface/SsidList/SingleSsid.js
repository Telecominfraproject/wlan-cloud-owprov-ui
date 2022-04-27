import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import StringField from 'components/FormFields/StringField';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import DeleteButton from 'components/Buttons/DeleteButton';
import CardBody from 'components/Card/CardBody';
import { useTranslation } from 'react-i18next';
import SelectField from 'components/FormFields/SelectField';
import MultiSelectField from 'components/FormFields/MultiSelectField';
import ToggleField from 'components/FormFields/ToggleField';
import NumberField from 'components/FormFields/NumberField';
import { getIn, useFormikContext } from 'formik';
import ConfigurationResourcePicker from 'components/CustomFields/ConfigurationResourcePicker';
import Rrm from './Rrm';
import Roaming from './Roaming';
import Encryption from './Encryption';
import Radius from './Radius';
import RateLimit from './RateLimit';
import { INTERFACE_SSID_SCHEMA } from '../../interfacesConstants';
import LockedSsid from './LockedSsid';

const propTypes = {
  index: PropTypes.number.isRequired,
  editing: PropTypes.bool.isRequired,
  namePrefix: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
};

const SingleSsid = ({ editing, index, namePrefix, remove }) => {
  const { t } = useTranslation();
  const removeSsid = () => remove(index);
  const { values } = useFormikContext();

  const isUsingCustomRadius = useMemo(() => {
    const v = getIn(values, `${namePrefix}`);
    return v !== undefined && v.__variableBlock === undefined;
  }, [getIn(values, `${namePrefix}`)]);

  return (
    <Card mb={4}>
      <CardHeader flex="auto">
        <Heading size="md" mr={2} pt={2}>
          #{index}
        </Heading>
        <ConfigurationResourcePicker
          name={namePrefix}
          prefix="interface.ssid"
          isDisabled={!editing}
          defaultValue={INTERFACE_SSID_SCHEMA}
        />
        <Spacer />
        <DeleteButton isDisabled={!editing} onClick={removeSsid} label={t('configurations.delete_ssid')} />
      </CardHeader>
      <CardBody display="unset">
        {isUsingCustomRadius ? (
          <>
            <SimpleGrid minChildWidth="300px" spacing="20px">
              <StringField
                name={`${namePrefix}.name`}
                label="name"
                definitionKey="interface.ssid.name"
                isDisabled={!editing}
                isRequired
              />
              <SelectField
                name={`${namePrefix}.bss-mode`}
                label="bss-mode"
                definitionKey="interface.ssid.bss-mode"
                isDisabled={!editing}
                options={[
                  { value: 'ap', label: 'ap' },
                  { value: 'sta', label: 'sta' },
                  { value: 'mesh', label: 'mesh' },
                  { value: 'wds-ap', label: 'wds-ap' },
                  { value: 'wds-sta', label: 'wds-sta' },
                ]}
                isRequired
              />
              <MultiSelectField
                name={`${namePrefix}.wifi-bands`}
                label="wifi-bands"
                definitionKey="interface.ssid.wifi-bands"
                isDisabled={!editing}
                options={[
                  { value: '2G', label: '2G' },
                  { value: '5G', label: '5G' },
                ]}
                isRequired
              />
              <ToggleField
                name={`${namePrefix}.hidden-ssid`}
                label="hidden-ssid"
                definitionKey="interface.ssid.hidden-ssid"
                isDisabled={!editing}
                isRequired
              />
              <MultiSelectField
                name={`${namePrefix}.services`}
                label="services"
                definitionKey="interface.ssid.services"
                isDisabled={!editing}
                options={[
                  { value: 'wifi-steering', label: 'wifi-steering' },
                  { value: 'dhcp-snooping', label: 'dhcp-snooping' },
                ]}
              />
              <NumberField
                name={`${namePrefix}.maximum-clients`}
                label="maximum-clients"
                definitionKey="interface.ssid.maximum-clients"
                isDisabled={!editing}
                isRequired
              />
              <SelectField
                name={`${namePrefix}.purpose`}
                label="purpose"
                definitionKey="interface.ssid.purpose"
                isDisabled={!editing}
                options={[
                  { value: '', label: t('common.default') },
                  { value: 'user-defined', label: 'user-defined' },
                  { value: 'onboarding-ap', label: 'onboarding-ap' },
                  { value: 'onboarding-sta', label: 'onboarding-sta' },
                ]}
                emptyIsUndefined
              />
              <ToggleField
                name={`${namePrefix}.isolate-clients`}
                label="isolate-clients"
                definitionKey="interface.ssid.isolate-clients"
                isDisabled={!editing}
                isRequired
                falseIsUndefined
              />
              <ToggleField
                name={`${namePrefix}.power-save`}
                label="power-save"
                definitionKey="interface.ssid.power-save"
                isDisabled={!editing}
                falseIsUndefined
              />
              <ToggleField
                name={`${namePrefix}.broadcast-time`}
                label="broadcast-time"
                definitionKey="interface.ssid.broadcast-time"
                isDisabled={!editing}
                falseIsUndefined
              />
              <ToggleField
                name={`${namePrefix}.unicast-conversion`}
                label="unicast-conversion"
                definitionKey="interface.ssid.unicast-conversion"
                isDisabled={!editing}
                falseIsUndefined
              />
              <ToggleField
                name={`${namePrefix}.proxy-arp`}
                label="proxy-arp"
                definitionKey="interface.ssid.proxy-arp"
                isDisabled={!editing}
                falseIsUndefined
              />
              <ToggleField
                name={`${namePrefix}.disassoc-low-ack`}
                label="disassoc-low-ack"
                definitionKey="interface.ssid.disassoc-low-ack"
                isDisabled={!editing}
                falseIsUndefined
              />
              <StringField
                name={`${namePrefix}.vendor-elements`}
                label="vendor-elements"
                definitionKey="interface.ssid.vendor-elements"
                isDisabled={!editing}
                emptyIsUndefined
              />
            </SimpleGrid>
            <Encryption
              editing={editing}
              namePrefix={`${namePrefix}.encryption`}
              radiusPrefix={`${namePrefix}.radius`}
            />
            <Radius
              editing={editing}
              namePrefix={`${namePrefix}.radius`}
              encryptionKeyName={`${namePrefix}.encryption.key`}
            />
            <RateLimit editing={editing} namePrefix={`${namePrefix}.rate-limit`} />
            <Rrm editing={editing} namePrefix={`${namePrefix}.rrm`} />
            <Roaming editing={editing} namePrefix={`${namePrefix}.roaming`} />
          </>
        ) : (
          <LockedSsid variableBlockId={getIn(values, `${namePrefix}.__variableBlock`)[0]} />
        )}
      </CardBody>
    </Card>
  );
};

SingleSsid.propTypes = propTypes;
export default React.memo(SingleSsid);
