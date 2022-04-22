import * as React from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import SelectField from 'components/FormFields/SelectField';
import useSelectList from 'hooks/useSelectList';
import { Contact } from 'models/Contact';

interface Props {
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  finishStep: (v: Record<string, unknown>) => void;
  contacts: Contact[];
}

const CreateSubscriberDeviceStep3: React.FC<Props> = ({ formRef, finishStep, contacts }) => {
  const { t } = useTranslation();
  const contactOptions = useSelectList({ values: contacts, hasEmpty: true, valueKey: 'id', labelKey: 'name' });

  return (
    <Formik innerRef={formRef} initialValues={{ contact: '' }} onSubmit={(data) => finishStep(data)}>
      <Form>
        <Heading size="md" mb={2}>
          {t('contacts.one')}
        </Heading>
        <SelectField name="contact" label={t('contacts.one')} options={contactOptions} isLabelHidden w="300px" />
      </Form>
    </Formik>
  );
};

export default CreateSubscriberDeviceStep3;
