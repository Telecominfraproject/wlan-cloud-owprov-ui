import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as createUuid } from 'uuid';
import { useToast, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { CreateTagSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';
import { useGetEntities } from 'hooks/Network/Entity';
import { useGetVenues } from 'hooks/Network/Venues';
import SpecialConfigurationManager from '../EditTagModal/SpecialConfigurationManager';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  create: PropTypes.instanceOf(Object).isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  onConfigurationChange: PropTypes.func.isRequired,
  configuration: PropTypes.instanceOf(Object),
  deviceTypesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  entityId: PropTypes.string.isRequired,
  subId: PropTypes.string.isRequired,
};

const defaultProps = {
  configuration: null,
};

const CreateTagForm = ({
  isOpen,
  onClose,
  create,
  refresh,
  formRef,
  deviceTypesList,
  entityId,
  onConfigurationChange,
  configuration,
  subId,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(createUuid());
  const { data: entities } = useGetEntities({ t, toast });
  const { data: venues } = useGetVenues({ t, toast });

  const getEntityId = () => {
    if (entityId === '') return '';
    const splitEntity = entityId.split(':');
    if (splitEntity[0] === 'entity') return `ent:${splitEntity[1]}`;
    return `ven:${splitEntity[1]}`;
  };

  const createParameters = ({
    serialNumber,
    name,
    description,
    note,
    deviceType,
    devClass,
    rrm,
    entity,
  }) => ({
    serialNumber,
    name,
    rrm,
    deviceType,
    devClass,
    description: description.length > 0 ? description : undefined,
    notes: note.length > 0 ? [{ note }] : undefined,
    entity: entity === '' || entity.split(':')[0] !== 'ent' ? '' : entity.split(':')[1],
    venue: entity === '' || entity.split(':')[0] !== 'ven' ? '' : entity.split(':')[1],
    subscriber: subId !== '' ? subId : '',
  });

  useEffect(() => {
    setFormKey(createUuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={{
        serialNumber: '',
        name: '',
        description: '',
        deviceType: deviceTypesList[0],
        rrm: 'inherit',
        devClass: 'any',
        note: '',
        entity: getEntityId(),
      }}
      validationSchema={CreateTagSchema(t)}
      onSubmit={(formData, { setSubmitting, resetForm }) => {
        const params = createParameters(formData);

        if (configuration !== null) {
          params.__newConfig = {
            ...configuration.data,
            name: `device:${formData.serialNumber}`,
            description: 'Created from the Edit Tag menu',
            deviceTypes: [formData.deviceType],
          };
        }
        create.mutateAsync(params, {
          onSuccess: () => {
            setSubmitting(false);
            resetForm();
            toast({
              id: 'tag-creation-success',
              title: t('common.success'),
              description: t('crud.success_create_obj', {
                obj: t('certificates.device'),
              }),
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            refresh();
            onClose();
          },
          onError: (e) => {
            toast({
              id: createUuid(),
              title: t('common.error'),
              description: t('crud.error_create_obj', {
                obj: t('certificates.device'),
                e: e?.response?.data?.ErrorDescription,
              }),
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            setSubmitting(false);
          },
        });
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form>
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={6}>
            <StringField
              name="serialNumber"
              label={t('inventory.serial_number')}
              errors={errors}
              touched={touched}
              isRequired
            />
            <StringField
              name="name"
              label={t('common.name')}
              errors={errors}
              touched={touched}
              isRequired
            />
            <SelectField
              name="deviceType"
              label={t('inventory.device_type')}
              errors={errors}
              touched={touched}
              options={deviceTypesList.map((deviceType) => ({
                value: deviceType,
                label: deviceType,
              }))}
              isRequired
            />
            <SelectWithSearchField
              name="entity"
              label={t('inventory.parent')}
              errors={errors}
              touched={touched}
              options={[
                { label: t('common.none'), value: '' },
                {
                  label: t('entities.title'),
                  options:
                    entities?.map((ent) => ({
                      value: `ent:${ent.id}`,
                      label: `${ent.name}${ent.description ? `: ${ent.description}` : ''}`,
                    })) ?? [],
                },
                {
                  label: t('venues.title'),
                  options:
                    venues?.map((ven) => ({
                      value: `ven:${ven.id}`,
                      label: `${ven.name}${ven.description ? `: ${ven.description}` : ''}`,
                    })) ?? [],
                },
              ]}
              setFieldValue={setFieldValue}
              isHidden={entityId !== '' || subId !== ''}
            />
            <SelectField
              name="rrm"
              label="RRM"
              errors={errors}
              touched={touched}
              options={[
                { value: 'inherit', label: 'inherit' },
                { value: 'on', label: 'on' },
                { value: 'off', label: 'off' },
              ]}
              isRequired
              w={28}
            />
            <SelectField
              name="devClass"
              label={t('inventory.dev_class')}
              errors={errors}
              touched={touched}
              options={[
                { value: 'any', label: 'any' },
                { value: 'entity', label: 'entity' },
                { value: 'venue', label: 'venue' },
                { value: 'subscriber', label: 'subscriber' },
              ]}
              isRequired
            />
            <StringField
              name="description"
              label={t('common.description')}
              errors={errors}
              touched={touched}
            />
            <StringField name="note" label={t('common.note')} errors={errors} touched={touched} />
          </SimpleGrid>
          <SpecialConfigurationManager editing onChange={onConfigurationChange} />
        </Form>
      )}
    </Formik>
  );
};

CreateTagForm.propTypes = propTypes;
CreateTagForm.defaultProps = defaultProps;

export default CreateTagForm;
