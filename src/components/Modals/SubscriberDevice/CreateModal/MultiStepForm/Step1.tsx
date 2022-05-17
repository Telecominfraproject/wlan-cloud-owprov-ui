import * as React from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import useSelectList from 'hooks/useSelectList';
import * as Yup from 'yup';
import SubscriberDeviceConfigurationManager from 'components/CustomFields/SubscriberDeviceConfigurationManager';
import { Configuration } from 'models/Configuration';
import DeviceRulesField from 'components/CustomFields/DeviceRulesField';
import { DeviceRulesSchema } from 'constants/formSchemas';

const defaultConfiguration: Record<string, unknown>[] = [];

const Schema = (t: (str: string) => string) =>
  Yup.object().shape({
    serialNumber: Yup.string()
      .required(t('form.required'))
      .test('test-serial-regex', t('inventory.invalid_serial_number'), (v) => {
        if (v) {
          if (v.length !== 12) return false;
          if (!v.match('^[a-fA-F0-9]+$')) return false;
        }
        return true;
      })
      .default(''),
    deviceRules: DeviceRulesSchema(t).required('form.required').default({
      rrm: 'inherit',
      rcOnly: 'inherit',
      firmwareUpgrade: 'inherit',
    }),
    deviceType: Yup.string().required(t('form.required')).default(''),
  });

interface Props {
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  finishStep: (v: Record<string, unknown>) => void;
  deviceTypes: string[];
  onConfigurationChange: (conf: Configuration) => void;
}

const CreateSubscriberDeviceStep1: React.FC<Props> = ({ formRef, finishStep, deviceTypes, onConfigurationChange }) => {
  const { t } = useTranslation();
  const deviceTypeOptions = useSelectList({ values: deviceTypes, hasEmpty: true });

  return (
    <Formik
      validateOnMount
      innerRef={formRef}
      initialValues={{ ...Schema(t).cast(undefined) }}
      validationSchema={Schema(t)}
      onSubmit={(data) => finishStep(data)}
    >
      <Form>
        <Heading size="md" mb={2}>
          {t('common.device_details')}
        </Heading>
        <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
          <StringField name="serialNumber" label={t('inventory.serial_number')} isRequired />
          <SelectField name="deviceType" label={t('inventory.device_type')} options={deviceTypeOptions} isRequired />
          <DeviceRulesField />
        </SimpleGrid>
        <SubscriberDeviceConfigurationManager
          editing
          onChange={onConfigurationChange}
          configuration={defaultConfiguration}
        />
      </Form>
    </Formik>
  );
};

export default CreateSubscriberDeviceStep1;
