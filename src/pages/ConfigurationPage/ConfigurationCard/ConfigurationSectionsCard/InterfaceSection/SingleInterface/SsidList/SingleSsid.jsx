import React, { useMemo } from 'react';
import { Box, Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import { getIn, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ConfigurationResourcePicker from 'components/CustomFields/ConfigurationResourcePicker';
import MultiSelectField from 'components/FormFields/MultiSelectField';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import DeleteButton from 'components/Buttons/DeleteButton';
import CardBody from 'components/Card/CardBody';
import { INTERFACE_SSID_SCHEMA } from '../../interfacesConstants';
import AdvancedSettings from './AdvancedSettings';
import Encryption from './Encryption';
import LockedSsid from './LockedSsid';
import PassPoint from './PassPoint';

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
  const isPasspoint = useMemo(() => {
    const v = getIn(values, `${namePrefix}`);
    return v !== undefined && v['pass-point'] !== undefined;
  }, [getIn(values, `${namePrefix}`)]);

  return (
    <Card mb={4} borderRadius={0}>
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
            <SimpleGrid minChildWidth="300px" spacing="20px" mt={2}>
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
                  { value: '6G', label: '6G' },
                ]}
                isRequired
              />
            </SimpleGrid>
            <Encryption
              editing={editing}
              ssidName={namePrefix}
              namePrefix={`${namePrefix}.encryption`}
              radiusPrefix={`${namePrefix}.radius`}
              isPasspoint={isPasspoint}
            />
            <Box my={2}>
              <PassPoint
                isDisabled={!editing}
                namePrefix={`${namePrefix}.pass-point`}
                radiusPrefix={`${namePrefix}.radius`}
              />
            </Box>
            <AdvancedSettings editing={editing} namePrefix={namePrefix} />
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
