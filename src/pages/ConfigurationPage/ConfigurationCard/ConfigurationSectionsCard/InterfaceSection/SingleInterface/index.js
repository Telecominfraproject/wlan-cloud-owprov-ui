import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import DeleteButton from 'components/Buttons/DeleteButton';
import { useTranslation } from 'react-i18next';
import { FieldArray, useFormikContext } from 'formik';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import MultiSelectField from 'components/FormFields/MultiSelectField';
import ToggleField from 'components/FormFields/ToggleField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import IpV4 from './IpV4';
import IpV6 from './IpV6';
import Vlan from './Vlan';
import SsidList from './SsidList';
import Tunnel from './Tunnel';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
};

const SingleInterface = ({ editing, index, remove }) => {
  const { t } = useTranslation();
  const { values } = useFormikContext();
  const removeRadio = () => remove(index);

  return (
    <Card variant="widget" mb={4}>
      <CardHeader flex="auto">
        <Heading size="lg">{values.configuration[index].name}</Heading>
        <Spacer />
        <DeleteButton
          isDisabled={!editing}
          onClick={removeRadio}
          label={t('configurations.delete_interface')}
        />
      </CardHeader>
      <CardBody display="unset">
        <Heading size="md">General</Heading>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <StringField
            name={`configuration[${index}].name`}
            label="name"
            definitionKey="interface.name"
            isDisabled={!editing}
            isRequired
          />
          <SelectField
            name={`configuration[${index}].role`}
            label="role"
            definitionKey="interface.role"
            isDisabled
            isRequired
            options={[
              { value: 'upstream', label: 'upstream' },
              { value: 'downstream', label: 'downstream' },
            ]}
          />
          <MultiSelectField
            name={`configuration[${index}].ethernet[0].select-ports`}
            label="select-ports"
            definitionKey="interface.ethernet.select-ports"
            options={[
              {
                value: 'WAN*',
                label: 'WAN*',
              },
              {
                value: 'LAN*',
                label: 'LAN*',
              },
            ]}
            isDisabled={!editing}
            emptyIsUndefined
          />
          <ToggleField
            name={`configuration[${index}].isolate-hosts`}
            label="isolate-hosts"
            definitionKey="interface.isolate-hosts"
            isDisabled={!editing}
            falseIsUndefined
          />
          <MultiSelectField
            name={`configuration[${index}].services`}
            label="services"
            definitionKey="interface.services"
            options={[
              {
                value: 'airtime-policies',
                label: 'airtime-policies',
              },
              {
                value: 'data-plane',
                label: 'data-plane',
              },
              {
                value: 'http',
                label: 'http',
              },
              {
                value: 'ieee8021x',
                label: 'ieee8021x',
              },
              {
                value: 'igmp',
                label: 'igmp',
              },
              {
                value: 'http',
                label: 'http',
              },
              {
                value: 'lldp',
                label: 'lldp',
              },
              {
                value: 'log',
                label: 'log',
              },
              {
                value: 'mdns',
                label: 'mdns',
              },
              {
                value: 'ntp',
                label: 'ntp',
              },
              {
                value: 'online-check',
                label: 'online-check',
              },
              {
                value: 'open-flow',
                label: 'open-flow',
              },
              {
                value: 'quality-of-service',
                label: 'quality-of-service',
              },
              {
                value: 'radius-proxy',
                label: 'radius-proxy',
              },
              {
                value: 'rtty',
                label: 'rtty',
              },
              {
                value: 'ssh',
                label: 'ssh',
              },
              {
                value: 'wifi-steering',
                label: 'wifi-steering',
              },
            ]}
            isDisabled={!editing}
            emptyIsUndefined
          />
          <CreatableSelectField
            name={`configuration[${index}].hostapd-bss-raw`}
            label="hostapd-bss-raw"
            definitionKey="interface.hostapd-bss-raw"
            isDisabled={!editing}
            emptyIsUndefined
          />
        </SimpleGrid>
        <Vlan editing={editing} index={index} />
        <IpV4 editing={editing} index={index} />
        <IpV6 editing={editing} index={index} />
        <Tunnel editing={editing} index={index} />
        <FieldArray name={`configuration[${index}].ssids`}>
          {(arrayHelpers) => (
            <SsidList
              index={index}
              editing={editing}
              arrayHelpers={arrayHelpers}
              ssidsLength={
                values.configuration[index].ssids !== undefined
                  ? values.configuration[index].ssids.length
                  : 0
              }
            />
          )}
        </FieldArray>
      </CardBody>
    </Card>
  );
};

SingleInterface.propTypes = propTypes;
export default React.memo(SingleInterface);
