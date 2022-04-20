import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { SubscriberDeviceSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import useMutationResult from 'hooks/useMutationResult';
import { useCreateSubscriberDevice } from 'hooks/Network/SubscriberDevices';
import useSelectList from 'hooks/useSelectList';
import SubscriberDeviceConfigurationManager from 'components/CustomFields/SubscriberDeviceConfigurationManager';
import { ModalProps } from 'models/Modal';
import { Contact } from 'models/Contact';
import { Location } from 'models/Location';
import { ServiceClass } from 'models/ServiceClass';
import { Subscriber } from 'models/Subscriber';
import { Configuration } from 'models/Configuration';

const defaultConfiguration: Object[] = [];

interface Props {
  modalProps: ModalProps;
  refresh: () => void;
  formRef: (node: any) => void;
  operatorId: string;
  subscriberId?: string;
  deviceTypes: string[];
  contacts: Contact[];
  locations: Location[];
  serviceClasses: ServiceClass[];
  subscribers: Subscriber[];
  configuration?: Configuration[] | undefined;
  onConfigurationChange: (conf: Configuration) => void;
}

const defaultProps = {
  configuration: undefined,
  subscriberId: undefined,
};

const CreateSubscriberDeviceForm: React.FC<Props> = ({
  modalProps: { onClose, isOpen },
  refresh,
  formRef,
  operatorId,
  subscriberId,
  deviceTypes,
  contacts,
  locations,
  serviceClasses,
  subscribers,
  configuration,
  onConfigurationChange,
}) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const { onSuccess, onError } = useMutationResult({
    objName: t('devices.one'),
    operationType: 'create',
    refresh,
    onClose,
  });
  const deviceTypeOptions = useSelectList({ values: deviceTypes, hasEmpty: true });
  const contactOptions = useSelectList({ values: contacts, hasEmpty: true, valueKey: 'id', labelKey: 'name' });
  const locationOptions = useSelectList({ values: locations, hasEmpty: true, valueKey: 'id', labelKey: 'name' });
  const serviceClassesOptions = useSelectList({
    values: serviceClasses,
    hasEmpty: true,
    valueKey: 'id',
    labelKey: 'name',
  });
  const subscriberOptions = useSelectList({ values: subscribers, hasEmpty: true, valueKey: 'id', labelKey: 'name' });

  const create = useCreateSubscriberDevice();

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={{ ...SubscriberDeviceSchema(t).cast(undefined), deviceType: deviceTypes[0], subscriberId }}
      validationSchema={SubscriberDeviceSchema(t)}
      onSubmit={(data, { setSubmitting, resetForm }) =>
        create.mutateAsync(
          {
            ...data,
            operatorId,
            configuration: configuration ?? undefined,
            notes: data.note.length > 0 ? [{ note: data.note }] : undefined,
          },
          {
            onSuccess: () => {
              onSuccess({ setSubmitting, resetForm });
            },
            onError: (e) => {
              onError(e, { resetForm });
            },
          },
        )
      }
    >
      <Form>
        <Heading size="md" mb={2}>
          {t('common.identification')}
        </Heading>
        <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
          <StringField name="name" label={t('common.name')} isRequired />
          {!subscriberId && (
            <SelectField name="subscriberId" label={t('subscribers.one')} options={subscriberOptions} isRequired />
          )}
          <StringField name="description" label={t('common.description')} />
          <StringField name="note" label={t('common.note')} />
        </SimpleGrid>
        <Heading size="md" mb={2}>
          {t('common.device_details')}
        </Heading>
        <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
          <StringField name="serialNumber" label={t('inventory.serial_number')} isRequired />
          <SelectField name="deviceType" label={t('inventory.device_type')} options={deviceTypeOptions} isRequired />
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
          <SelectField name="serviceClass" label={t('service.one')} options={serviceClassesOptions} />
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
    </Formik>
  );
};

CreateSubscriberDeviceForm.defaultProps = defaultProps;

export default CreateSubscriberDeviceForm;
