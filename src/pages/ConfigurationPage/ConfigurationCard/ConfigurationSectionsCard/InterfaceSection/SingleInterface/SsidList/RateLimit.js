import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useFormikContext, getIn } from 'formik';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import NumberField from 'components/FormFields/NumberField';
import { INTERFACE_SSID_RATE_LIMIT_SCHEMA } from '../../interfacesConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  namePrefix: PropTypes.string.isRequired,
};

const RateLimit = ({ editing, namePrefix }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onEnabledChange = (e) => {
    if (e.target.checked) {
      setFieldValue(`${namePrefix}`, INTERFACE_SSID_RATE_LIMIT_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`${namePrefix}`, undefined);
    }
  };

  const isEnabled = useMemo(() => getIn(values, `${namePrefix}`) !== undefined, [getIn(values, `${namePrefix}`)]);

  return (
    <>
      <Heading size="md" display="flex" mt={6}>
        <Text mr={2}>Rate Limit</Text>
        <Switch
          onChange={onEnabledChange}
          isChecked={isEnabled}
          borderRadius="15px"
          size="lg"
          isDisabled={!editing}
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        />
      </Heading>
      {isEnabled && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <NumberField
            name={`${namePrefix}.ingress-rate`}
            label="ingress-rate"
            definitionKey="interface.ssid.rate-limit.ingress-rate"
            isDisabled={!editing}
            unit="MB/s"
            isRequired
          />
          <NumberField
            name={`${namePrefix}.egress-rate`}
            label="egress-rate"
            definitionKey="interface.ssid.rate-limit.egress-rate"
            isDisabled={!editing}
            unit="MB/s"
            isRequired
          />
        </SimpleGrid>
      )}
    </>
  );
};

RateLimit.propTypes = propTypes;
export default React.memo(RateLimit);
