import * as React from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import SelectField from 'components/FormFields/SelectField';
import useSelectList from 'hooks/useSelectList';
import { Location } from 'models/Location';

interface Props {
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  finishStep: (v: Record<string, unknown>) => void;
  locations: Location[];
}

const CreateSubscriberDeviceStep2: React.FC<Props> = ({ formRef, finishStep, locations }) => {
  const { t } = useTranslation();
  const locationOptions = useSelectList({ values: locations, hasEmpty: true, valueKey: 'id', labelKey: 'name' });

  return (
    <Formik innerRef={formRef} initialValues={{ location: '' }} onSubmit={(data) => finishStep(data)}>
      <Form>
        <Heading size="md" mb={2}>
          {t('locations.one')}
        </Heading>
        <SelectField name="location" label={t('locations.one')} options={locationOptions} isLabelHidden w="300px" />
      </Form>
    </Formik>
  );
};

export default CreateSubscriberDeviceStep2;
