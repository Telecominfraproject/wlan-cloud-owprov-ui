import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid, Heading } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import NotesTable from 'components/CustomFields/NotesTable';
import StringField from 'components/FormFields/StringField';
import { SubscriberDeviceSchema } from 'constants/formSchemas';
import SelectField from 'components/FormFields/SelectField';
import useMutationResult from 'hooks/useMutationResult';
import useSelectList from 'hooks/useSelectList.js';
import { useUpdateSubscriberDevice } from 'hooks/Network/SubscriberDevices';
import SubscriberDeviceConfigurationManager from 'components/CustomFields/SubscriberDeviceConfigurationManager';

const EditSubscriberDeviceForm = ({
  editing,
  isOpen,
  onClose,
  refresh,
  subscriberDevice,
  externalData,
  formRef,
  configuration,
  onConfigurationChange,
  defaultConfiguration,
}) => {
  const { t } = useTranslation();
  const { onSuccess, onError } = useMutationResult({
    objName: t('devices.one'),
    operationType: 'update',
    refresh,
    onClose,
  });
  const [formKey, setFormKey] = useState(uuid());
  const updateSubscriberDevice = useUpdateSubscriberDevice({ id: subscriberDevice.id });

  const deviceTypeOptions = useSelectList({ values: externalData.deviceTypes, hasEmpty: true });
  const contactOptions = useSelectList({
    values: externalData.contacts,
    hasEmpty: true,
    valueKey: 'id',
    labelKey: 'name',
  });
  const locationOptions = useSelectList({
    values: externalData.locations,
    hasEmpty: true,
    valueKey: 'id',
    labelKey: 'name',
  });
  const serviceClassesOptions = useSelectList({
    values: externalData.serviceClasses,
    hasEmpty: true,
    valueKey: 'id',
    labelKey: 'name',
  });
  const subscriberOptions = useSelectList({
    values: externalData.subscribers,
    hasEmpty: true,
    valueKey: 'id',
    labelKey: 'name',
  });

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={subscriberDevice}
      validationSchema={SubscriberDeviceSchema(t)}
      onSubmit={(data, { setSubmitting, resetForm }) =>
        updateSubscriberDevice.mutateAsync(
          {
            ...data,
            configuration: configuration ?? undefined,
            notes: data.note.length > 0 ? [{ note: data.note }] : undefined,
          },
          {
            onSuccess: () => {
              onSuccess(setSubmitting, resetForm);
            },
            onError: (e) => {
              onError(e, { resetForm });
            },
          },
        )
      }
    >
      <Tabs variant="enclosed">
        <TabList>
          <Tab>{t('common.main')}</Tab>
          <Tab>{t('common.notes')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Form>
              <Heading size="md" mb={2}>
                {t('common.identification')}
              </Heading>
              <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
                <StringField name="name" label={t('common.name')} isRequired />
                <SelectField name="subscriberId" label={t('subscribers.one')} options={subscriberOptions} isRequired />
                <StringField name="description" label={t('common.description')} />
                <StringField name="note" label={t('common.note')} />
              </SimpleGrid>
              <Heading size="md" mb={2}>
                {t('common.device_details')}
              </Heading>
              <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
                <StringField name="serialNumber" label={t('inventory.serial_number')} isRequired />
                <SelectField
                  name="deviceType"
                  label={t('inventory.device_type')}
                  options={deviceTypeOptions}
                  isRequired
                />
                <SelectField
                  name="rrm"
                  label="RRM"
                  options={[
                    { value: 'inherit', label: 'inherit' },
                    { value: 'on', label: 'on' },
                    { value: 'off', label: 'off' },
                  ]}
                  isRequired
                  w={28}
                />
              </SimpleGrid>
              <Heading size="md" mb={2}>
                {t('subscribers.billing_contact_info')}
              </Heading>
              <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
                <SelectField name="serviceClass" label={t('service.one')} options={serviceClassesOptions} isRequired />
                <StringField name="billingCode" label={t('service.billing_code')} />
                <SelectField name="contact" label={t('contacts.one')} options={contactOptions} />
                <SelectField name="location" label={t('locations.one')} options={locationOptions} />
              </SimpleGrid>
              <SubscriberDeviceConfigurationManager
                editing
                onChange={onConfigurationChange}
                configuration={defaultConfiguration}
              />
            </Form>
          </TabPanel>
          <TabPanel>
            <NotesTable name="notes" isDisabled={!editing} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Formik>
  );
};

EditSubscriberDeviceForm.propTypes = {
  editing: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  subscriberDevice: PropTypes.instanceOf(Object).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  externalData: PropTypes.shape({
    deviceTypes: PropTypes.instanceOf(Object).isRequired,
    contacts: PropTypes.instanceOf(Object).isRequired,
    locations: PropTypes.instanceOf(Object).isRequired,
    serviceClasses: PropTypes.instanceOf(Object).isRequired,
    subscribers: PropTypes.instanceOf(Object).isRequired,
  }).isRequired,
  configuration: PropTypes.instanceOf(Object),
  defaultConfiguration: PropTypes.instanceOf(Object),
  onConfigurationChange: PropTypes.func.isRequired,
};

EditSubscriberDeviceForm.defaultProps = {
  configuration: null,
  defaultConfiguration: null,
};

export default EditSubscriberDeviceForm;
