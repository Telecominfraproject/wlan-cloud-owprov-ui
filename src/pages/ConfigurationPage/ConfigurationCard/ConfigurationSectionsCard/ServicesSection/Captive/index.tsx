import * as React from 'react';
import { Box, Heading, Select, SimpleGrid, Spacer, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import FileInputFieldModal from 'components/FormFields/FileInputFieldModal';
import NumberField from 'components/FormFields/NumberField';
import ObjectArrayFieldModal from 'components/FormFields/ObjectArrayFieldModal';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import useFastField from 'hooks/useFastField';

const CREDENTIALS_SCHEMA = (t: (str: string) => string, useDefault = false) => {
  const shape = object().shape({
    username: string().required(t('form.required')).default(''),
    password: string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
const namePrefix = 'configuration.captive';

const CaptiveConfiguration = ({ editing }: { editing: boolean }) => {
  const { t } = useTranslation();
  const name = React.useCallback((suffix: string) => `${namePrefix}.${suffix}`, []);
  const { value: captive, onChange } = useFastField({
    name: namePrefix,
  });

  const handleAuthModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'radius') {
      onChange({
        'idle-timeout': 600,
        'auth-mode': e.target.value,
        'auth-server': '192.168.1.10',
        'auth-secret': 'secret',
        'aut-port': 1812,
      });
    } else if (e.target.value === 'uam') {
      onChange({
        'walled-garden-fqdn': [],
        'idle-timeout': 600,
        'auth-mode': e.target.value,
        'auth-server': '192.168.1.10',
        'auth-secret': 'secret',
        'aut-port': 1812,
        'uam-port': 3990,
        'uam-secret': 'secret',
        'uam-server': 'https://YOUR-LOGIN-ADDRESS.YOURS',
        nasid: 'TestLab',
      });
    } else {
      onChange({ 'idle-timeout': 600, 'auth-mode': e.target.value });
    }
  };

  const fieldProps = (suffix: string) => ({
    name: name(suffix),
    label: suffix,
    definitionKey: `interface.ssid.pass-point.${suffix}`,
    isDisabled: !editing,
  });

  const mode = captive?.['auth-mode'] as string | undefined;

  const credFields = React.useMemo(
    () => (
      <SimpleGrid minChildWidth="300px" gap={4}>
        <StringField name="username" label="username" isRequired />
        <StringField name="password" label="password" isRequired />
      </SimpleGrid>
    ),
    [],
  );
  const credCols = React.useMemo(
    () => [
      {
        id: 'username',
        Header: 'username',
        Footer: '',
        accessor: 'username',
      },
      {
        id: 'password',
        Header: 'password',
        Footer: '',
        accessor: 'password',
      },
    ],
    [],
  );

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>
        <Heading my="auto" size="md" textDecor="underline">
          Captive
        </Heading>
        <Spacer />
        <Box>
          <Select value={captive['auth-mode']} onChange={handleAuthModeChange} isDisabled={!editing}>
            <option value="click">Click</option>
            <option value="radius">Radius</option>
            <option value="credentials">Credentials</option>
            <option value="uam">UAM</option>
          </Select>
        </Box>
      </CardHeader>
      <CardBody pb={8} pt={2} display="block">
        {
          // Basic Fields
        }
        <VStack spacing={2}>
          <CreatableSelectField
            {...fieldProps('walled-garden-fqdn')}
            placeholder="Example: *.google.com"
            emptyIsUndefined={mode !== 'uam'}
            isRequired={mode === 'uam'}
          />
          <FileInputFieldModal
            {...fieldProps('web-root')}
            fileName="configuration.captive.web-root-filename"
            definitionKey="service.captive.web-root"
            explanation={t('form.captive_web_root_explanation')}
            test={() => true}
            acceptedFileTypes=".tar"
            isDisabled={!editing}
            canDelete
            isRequired
            wantBase64
          />
          <NumberField {...fieldProps('idle-timeout')} isRequired w="100px" />
          <NumberField {...fieldProps('session-timeout')} emptyIsUndefined acceptEmptyValue w="100px" />
          {mode === 'credentials' && (
            <ObjectArrayFieldModal
              {...fieldProps('credentials')}
              fields={credFields}
              columns={credCols}
              schema={CREDENTIALS_SCHEMA}
              isDisabled={!editing}
              isRequired
            />
          )}
        </VStack>
        {mode === 'uam' && (
          <VStack spacing={2}>
            <StringField {...fieldProps('uam-server')} isRequired />
            <StringField {...fieldProps('uam-secret')} isRequired hideButton />
            <NumberField {...fieldProps('uam-port')} isRequired />
            <StringField {...fieldProps('nasid')} isRequired />
            <StringField {...fieldProps('nasmac')} emptyIsUndefined />
            <SelectField
              {...fieldProps('mac-format')}
              options={[
                { value: 'aabbccddeeff', label: 'aabbccddeeff' },
                { value: 'aa-bb-cc-dd-ee-ff', label: 'aa-bb-cc-dd-ee-ff' },
                { value: 'aa:bb:cc:dd:ee:ff', label: 'aa:bb:cc:dd:ee:ff' },
                { value: 'AABBCCDDEEFF', label: 'AABBCCDDEEFF' },
                { value: 'AA:BB:CC:DD:EE:FF', label: 'AA:BB:CC:DD:EE:FF' },
                { value: 'AA-BB-CC-DD-EE-FF', label: 'AA-BB-CC-DD-EE-FF' },
              ]}
              isRequired
            />
            <StringField {...fieldProps('ssid')} emptyIsUndefined />
          </VStack>
        )}
        {(mode === 'radius' || mode === 'uam') && (
          <VStack spacing={2}>
            <StringField {...fieldProps('auth-server')} isRequired />
            <StringField {...fieldProps('auth-secret')} isRequired hideButton />
            <NumberField {...fieldProps('auth-port')} isRequired />
            <StringField {...fieldProps('acct-server')} emptyIsUndefined />
            <StringField {...fieldProps('acct-secret')} emptyIsUndefined hideButton />
            <NumberField {...fieldProps('acct-port')} emptyIsUndefined acceptEmptyValue />
            <NumberField {...fieldProps('acct-interval')} emptyIsUndefined acceptEmptyValue />
          </VStack>
        )}
      </CardBody>
    </Card>
  );
};

export default React.memo(CaptiveConfiguration);
