import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { SimpleGrid } from '@chakra-ui/react';
import ToggleField from 'components/FormFields/ToggleField';
import NumberField from 'components/FormFields/NumberField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import { useField } from 'formik';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Ssh = ({ editing }) => {
  const [{ value: isPasswordAuth }] = useField('configuration.ssh.password-authentication');
  const [, , { setValue: setAuthKeys, setTouched: setAuthKeysTouched }] = useField('configuration.ssh.authorized-keys');

  const onPasswordAuthenticationChange = useCallback((isChecked) => {
    if (isChecked) setAuthKeys(undefined);
    else setAuthKeys([]);
    setTimeout(() => {
      setAuthKeysTouched(true);
    }, 200);
  }, []);

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>SSH</CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <NumberField
            name="configuration.ssh.port"
            label="port"
            definitionKey="service.ssh.port"
            isDisabled={!editing}
            isRequired
            w={24}
          />
          <ToggleField
            name="configuration.ssh.password-authentication"
            label="password-authentication"
            definitionKey="service.ssh.password-authentication"
            isDisabled={!editing}
            onChangeCallback={onPasswordAuthenticationChange}
            isRequired
          />
          {!isPasswordAuth && (
            <CreatableSelectField
              name="configuration.ssh.authorized-keys"
              label="authorized-keys"
              definitionKey="service.ssh.authorized-keys"
              isDisabled={!editing}
              isRequired
            />
          )}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

Ssh.propTypes = propTypes;
export default React.memo(Ssh);
