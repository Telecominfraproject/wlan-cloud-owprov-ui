import * as React from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import useSelectList from 'hooks/useSelectList';
import { ServiceClass } from 'models/ServiceClass';
import { Subscriber } from 'models/Subscriber';
import * as Yup from 'yup';
import { testObjectName } from 'constants/formTests';

const Schema = (t: (str: string) => string) =>
  Yup.object().shape({
    name: Yup.string()
      .required(t('form.required'))
      .test('name_test', t('common.name_error'), testObjectName)
      .default(''),
    subscriberId: Yup.string().required(t('form.required')).default(''),
    description: Yup.string().default(''),
    note: Yup.string().default(''),
    serviceClass: Yup.string().default(''),
    billingCode: Yup.string().default(''),
  });

interface Props {
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  finishStep: (v: Record<string, unknown>) => void;
  serviceClasses: ServiceClass[];
  subscribers: Subscriber[];
  subscriberId?: string;
}

const defaultProps = {
  subscriberId: undefined,
};

const CreateSubscriberDeviceStep0: React.FC<Props> = ({
  formRef,
  finishStep,
  serviceClasses,
  subscribers,
  subscriberId,
}) => {
  const { t } = useTranslation();
  const subscriberOptions = useSelectList({ values: subscribers, hasEmpty: true, valueKey: 'id', labelKey: 'name' });
  const serviceClassesOptions = useSelectList({
    values: serviceClasses,
    hasEmpty: true,
    valueKey: 'id',
    labelKey: 'name',
  });

  return (
    <Formik
      validateOnMount
      innerRef={formRef}
      initialValues={{ ...Schema(t).cast(undefined), subscriberId }}
      validationSchema={Schema(t)}
      // @ts-ignore
      onSubmit={(data) => finishStep({ ...data, notes: data.note.length > 0 ? [{ note: data.note }] : undefined })}
    >
      <Form>
        <Heading size="md" mb={2}>
          {t('common.identification')}
        </Heading>
        <SimpleGrid minChildWidth="300px" spacing="10px" mb={4}>
          <StringField name="name" label={t('common.name')} isRequired />
          <SelectField name="serviceClass" label={t('service.one')} options={serviceClassesOptions} />
          <StringField name="billingCode" label={t('service.billing_code')} />
          <StringField name="description" label={t('common.description')} />
          <StringField name="note" label={t('common.note')} />
          {!subscriberId && (
            <SelectField name="subscriberId" label={t('subscribers.one')} options={subscriberOptions} isRequired />
          )}
        </SimpleGrid>
      </Form>
    </Formik>
  );
};

CreateSubscriberDeviceStep0.defaultProps = defaultProps;
export default CreateSubscriberDeviceStep0;
