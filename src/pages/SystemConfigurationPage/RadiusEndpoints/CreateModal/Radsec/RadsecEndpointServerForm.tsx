import * as React from 'react';
import { Box, Button, Center, Flex, Heading } from '@chakra-ui/react';
import { Plus } from '@phosphor-icons/react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import NumberField from 'components/FormFields/NumberField';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';
import { testPemCertificate, testPemPrivateKey } from 'constants/formTests';
import useFormRef from 'hooks/useFormRef';
import GoogleOrionCaCertificateField from 'pages/OpenRoamingPage/GoogleOrionPage/CaCertificateField';
import GoogleOrionCertificateField from 'pages/OpenRoamingPage/GoogleOrionPage/CertificateField';
import GoogleOrionPrivateKeyField from 'pages/OpenRoamingPage/GoogleOrionPage/PrivateKeyField';

type Props = {
  setValue: (field: string, value: object, shouldValidate?: boolean | undefined) => void;
  value: object[];
};

const RadsecEndpointServerForm = ({ setValue, value }: Props) => {
  const { t } = useTranslation();
  const { form, formRef } = useFormRef();
  const [key, setFormKey] = React.useState(uuid());
  const onAdd = (v: object) => {
    setValue('RadsecServers', [...value, v]);
  };

  const resetForm = () => {
    setFormKey(uuid());
  };

  const RadiusEndpointServerSchema = React.useMemo(
    () =>
      Yup.object()
        .shape({
          Weight: Yup.number().required(t('form.required')).min(1).max(100).default(1),
          Hostname: Yup.string().required(t('form.required')),
          IP: Yup.string(),
          Port: Yup.number().required(t('form.required')).min(1).max(65535).default(2083),
          Secret: Yup.string().required(t('form.required')),
          PrivateKey: Yup.string()
            .test('test-key', t('roaming.invalid_key'), (v) => testPemPrivateKey(v, true))
            .required(t('form.required'))
            .default(''),
          Certificate: Yup.string()
            .test('test-certificate', t('roaming.invalid_certificate'), (v) => testPemCertificate(v, true))
            .required(t('form.required'))
            .default(''),
          CaCerts: Yup.array().of(Yup.object()).min(1).required(t('form.required')).default([]),
          AllowSelfSigned: Yup.boolean().required(t('form.required')).default(false),
        })
        .default({
          Weight: 1,
          Hostname: '',
          IP: '',
          Port: 2083,
          Secret: 'radsec',
          Certificate: '',
          PrivateKey: '',
          CaCerts: [],
          AllowSelfSigned: false,
        }),
    [t],
  );

  return (
    <Formik
      key={key}
      innerRef={formRef}
      initialValues={RadiusEndpointServerSchema.cast({})}
      validateOnMount
      validationSchema={RadiusEndpointServerSchema}
      onSubmit={async (values) => {
        const cleanedCaCerts = values.CaCerts.map((cert: { value: string }) => cert.value);
        onAdd({
          ...values,
          CaCerts: cleanedCaCerts,
        });
        resetForm();
      }}
    >
      <Box>
        <Heading mb={4} size="sm">
          Radsec Server
        </Heading>
        <Flex mb={4}>
          <Box w="300px">
            <StringField name="Hostname" label="Hostname" isRequired />
          </Box>
          <Box w="240px" mx={4}>
            <StringField name="IP" label="IP" />
          </Box>
          <Box>
            <NumberField name="Port" label="Port" w="120px" isRequired />
          </Box>
        </Flex>
        <Flex mb={4}>
          <Box>
            <StringField name="Secret" label="Secret" hideButton w="300px" isRequired />
          </Box>
          <Box ml={4}>
            <ToggleField name="AllowSelfSigned" label="Allow Self Signed" />
          </Box>
        </Flex>
        <Heading mb={4} size="sm">
          Certificates
        </Heading>
        <Flex mb={2}>
          <Box w="300px">
            <GoogleOrionCertificateField name="Certificate" />
          </Box>
          <Box w="300px" ml={2}>
            {' '}
            <GoogleOrionPrivateKeyField name="PrivateKey" />
          </Box>
        </Flex>
        <GoogleOrionCaCertificateField name="CaCerts" />
        <Center mt={4} mb={8}>
          <Button
            onClick={form.submitForm}
            isDisabled={!form.isValid}
            colorScheme="blue"
            rightIcon={<Plus size={20} />}
          >
            Add Server
          </Button>
        </Center>
      </Box>
    </Formik>
  );
};

export default RadsecEndpointServerForm;
