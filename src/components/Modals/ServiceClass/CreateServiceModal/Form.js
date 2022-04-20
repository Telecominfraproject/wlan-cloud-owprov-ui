import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { ServiceClassSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import useMutationResult from 'hooks/useMutationResult';
import SelectField from 'components/FormFields/SelectField';
import { useCreateServiceClass } from 'hooks/Network/ServiceClasses';
import NumberCurrencyField from 'components/CustomFields/NumberCurrencyField';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  operatorId: PropTypes.string.isRequired,
};

const CreateServiceClassForm = ({ isOpen, onClose, refresh, formRef, operatorId }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const { onSuccess, onError } = useMutationResult({
    objName: t('service.one'),
    operationType: 'create',
    refresh,
    onClose,
  });
  const create = useCreateServiceClass();

  const createParameters = ({ name, description, note, billingCode, period, cost, currency }) => ({
    name,
    billingCode,
    description,
    period,
    cost,
    currency,
    notes: note.length > 0 ? [{ note }] : undefined,
    operatorId,
  });

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={{
        name: '',
        description: '',
        billingCode: '',
        period: 'monthly',
        cost: 0.0,
        currency: 'USD',
        note: '',
      }}
      validationSchema={ServiceClassSchema(t)}
      onSubmit={(formData, { setSubmitting, resetForm }) =>
        create.mutateAsync(createParameters(formData), {
          onSuccess: () => {
            onSuccess({ setSubmitting, resetForm });
          },
          onError: (e) => {
            onError(e, { resetForm });
          },
        })
      }
    >
      <Form>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={6}>
          <StringField name="name" label={t('common.name')} isRequired />
          <StringField name="description" label={t('common.description')} />
          <StringField name="billingCode" label={t('service.billing_code')} isRequired />
          <SelectField
            name="period"
            label={t('service.billing_frequency')}
            options={[
              { value: 'hourly', label: t('common.hourly') },
              { value: 'daily', label: t('common.daily') },
              { value: 'monthly', label: t('common.monthly') },
              { value: 'quarterly', label: t('common.quarterly') },
              { value: 'yearly', label: t('common.yearly') },
              { value: 'lifetime', label: t('common.lifetime') },
            ]}
            w="140px"
            isRequired
          />
          <NumberCurrencyField name="cost" label={t('service.cost')} currencyName="currency" />
          <StringField name="note" label={t('common.note')} />
        </SimpleGrid>
      </Form>
    </Formik>
  );
};

CreateServiceClassForm.propTypes = propTypes;

export default CreateServiceClassForm;
