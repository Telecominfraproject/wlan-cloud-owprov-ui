import * as React from 'react';
import { Box, Button, Center } from '@chakra-ui/react';
import { Plus } from '@phosphor-icons/react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import RadiusServerForm from './RadiusServerForm';
import NumberField from 'components/FormFields/NumberField';
import { testIpv4, testIpv6 } from 'constants/formTests';
import useFormRef from 'hooks/useFormRef';

type Props = {
  setValue: (field: string, value: object, shouldValidate?: boolean | undefined) => void;
  value: object[];
};

const RadiusEndpointServerForm = ({ setValue, value }: Props) => {
  const { t } = useTranslation();
  const { form, formRef } = useFormRef();
  const [key, setFormKey] = React.useState(uuid());
  const onAdd = (v: object) => {
    setValue('RadiusServers', [...value, v]);
  };

  const resetForm = () => {
    setFormKey(uuid());
  };

  const RadiusServerSchema = React.useMemo(
    () =>
      Yup.object().shape({
        Hostname: Yup.string()
          .required(t('form.required'))
          .matches(
            /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])$/,
            'Invalid hostname, please check the format (ex.: example.com)',
          ),
        IP: Yup.string()
          .required(t('form.required'))
          .test(
            'test-ipv4-ipv6',
            'Invalid IP address, needs to be either IPv4 or IPv6',
            (v) => testIpv4(v) || testIpv6(v),
          ),
        Port: Yup.number().required(t('form.required')).min(1).max(65535).default(1812),
        Secret: Yup.string().required(t('form.required')),
      }),
    [t],
  );

  const RadiusEndpointServerSchema = React.useMemo(
    () =>
      Yup.object()
        .shape({
          Authentication: Yup.array().of(RadiusServerSchema).min(1).required(t('form.required')),
          Accounting: Yup.array().of(RadiusServerSchema).min(1).required(t('form.required')),
          CoA: Yup.array().of(RadiusServerSchema).min(1).required(t('form.required')),
          AccountingInterval: Yup.number().required(t('form.required')).min(10).max(500).default(60),
        })
        .default({
          Authentication: [
            {
              Hostname: '',
              IP: '',
              Port: 1812,
              Secret: '',
            },
          ],
          Accounting: [
            {
              Hostname: '',
              IP: '',
              Port: 1813,
              Secret: '',
            },
          ],
          CoA: [
            {
              Hostname: '',
              IP: '',
              Port: 1814,
              Secret: '',
            },
          ],
          AccountingInterval: 60,
        }),
    [t],
  );

  return (
    <Formik
      key={key}
      innerRef={formRef}
      initialValues={{
        Authentication: [
          {
            Hostname: '',
            IP: '',
            Port: 1812,
            Secret: '',
          },
        ],
        Accounting: [
          {
            Hostname: '',
            IP: '',
            Port: 1813,
            Secret: '',
          },
        ],
        CoA: [
          {
            Hostname: '',
            IP: '',
            Port: 1814,
            Secret: '',
          },
        ],
        AccountingInterval: 60,
      }}
      validateOnMount
      validationSchema={RadiusEndpointServerSchema}
      onSubmit={async (values) => {
        onAdd(values);
        resetForm();
      }}
    >
      <Box>
        <NumberField name="AccountingInterval" label="Accounting Interval" isRequired w="120px" />
        <RadiusServerForm label="Authentication" namePrefix="Authentication" />
        <RadiusServerForm label="Accounting" namePrefix="Accounting" />
        <RadiusServerForm label="Change of Authorization" namePrefix="CoA" />
        <Center my={8}>
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

export default RadiusEndpointServerForm;
