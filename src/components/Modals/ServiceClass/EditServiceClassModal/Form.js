import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { ServiceClassSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import useMutationResult from 'hooks/useMutationResult';
import { useUpdateServiceClass } from 'hooks/Network/ServiceClasses';
import NumberCurrencyField from 'components/CustomFields/NumberCurrencyField';
import NotesTable from 'components/CustomFields/NotesTable';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  editing: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  serviceClass: PropTypes.instanceOf(Object).isRequired,
};

const EditServiceClassForm = ({ serviceClass, editing, isOpen, onClose, refresh, formRef }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const { onSuccess, onError } = useMutationResult({
    objName: t('service.one'),
    operationType: 'update',
    refresh,
    onClose,
  });
  const update = useUpdateServiceClass({ id: serviceClass?.id });

  const createParameters = ({ name, description, billingCode, period, cost, currency, notes }) => ({
    name,
    billingCode,
    description,
    period,
    cost,
    currency,
    notes: notes.filter((note) => note.isNew),
  });

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={serviceClass}
      validationSchema={ServiceClassSchema(t)}
      onSubmit={(formData, { setSubmitting, resetForm }) =>
        update.mutateAsync(createParameters(formData), {
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
        <Tabs variant="enclosed">
          <TabList>
            <Tab>{t('common.main')}</Tab>
            <Tab>{t('common.notes')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SimpleGrid minChildWidth="300px" spacing="20px" mb={6}>
                <StringField name="name" label={t('common.name')} isRequired isDisabled={!editing} />
                <StringField name="description" label={t('common.description')} isDisabled={!editing} />
                <StringField name="billingCode" label={t('service.billing_code')} isDisabled={!editing} isRequired />
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
                  isDisabled={!editing}
                />
                <NumberCurrencyField
                  name="cost"
                  label={t('service.cost')}
                  currencyName="currency"
                  isDisabled={!editing}
                />
              </SimpleGrid>
            </TabPanel>
            <TabPanel>
              <NotesTable name="notes" isDisabled={!editing} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Form>
    </Formik>
  );
};

EditServiceClassForm.propTypes = propTypes;

export default EditServiceClassForm;
