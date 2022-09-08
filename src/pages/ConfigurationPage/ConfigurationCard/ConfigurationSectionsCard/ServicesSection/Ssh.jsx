import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import ToggleField from 'components/FormFields/ToggleField';
import NumberField from 'components/FormFields/NumberField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import useFastField from 'hooks/useFastField';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Ssh = ({ editing }) => {
  const { value: isUsingPasswordAuth } = useFastField({ name: 'configuration.ssh.password-authentication' });
  const { onChange: setAuthKeys, onBlur } = useFastField({ name: 'configuration.ssh.authorized-keys' });

  const onPasswordAuthenticationChange = useCallback((isChecked) => {
    if (isChecked) {
      setAuthKeys(undefined);
      setTimeout(() => {
        onBlur();
      }, 200);
    } else {
      setAuthKeys([]);
      setTimeout(() => {
        onBlur();
      }, 200);
    }
  }, []);

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>
        <Heading size="md" borderBottom="1px solid">
          SSH
        </Heading>
      </CardHeader>
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
            defaultValue
          />
          {isUsingPasswordAuth !== undefined && !isUsingPasswordAuth && (
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
