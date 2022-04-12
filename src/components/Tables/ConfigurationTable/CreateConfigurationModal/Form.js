import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useToast, SimpleGrid } from '@chakra-ui/react';
import { Formik } from 'formik';
import { CreateConfigurationSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import MultiSelectField from 'components/FormFields/MultiSelectField';
import { useGetEntities } from 'hooks/Network/Entity';
import { useGetVenues } from 'hooks/Network/Venues';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';
import SpecialConfigurationManager from 'components/CustomFields/SpecialConfigurationManager';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  create: PropTypes.instanceOf(Object).isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  deviceTypesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  onConfigurationChange: PropTypes.func.isRequired,
  entityId: PropTypes.string,
};
const defaultProps = {
  entityId: null,
};

const CreateConfigurationForm = ({
  isOpen,
  onClose,
  create,
  refresh,
  formRef,
  deviceTypesList,
  entityId,
  onConfigurationChange,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(uuid());
  const { data: entities } = useGetEntities({ t, toast });
  const { data: venues } = useGetVenues({ t, toast });

  const getEntityId = () => {
    if (!entityId) return 'ent:0000-0000-0000';
    const splitEntity = entityId.split(':');
    if (splitEntity[0] === 'entity') return `ent:${splitEntity[1]}`;
    return `ven:${splitEntity[1]}`;
  };

  const createParameters = ({ name, description, note, deviceTypes, entity, rrm, __CREATE_CONFIG }) => ({
    name,
    rrm,
    deviceTypes,
    description: description.length > 0 ? description : undefined,
    notes: note.length > 0 ? [{ note }] : undefined,
    entity: entity === '' || entity.split(':')[0] !== 'ent' ? '' : entity.split(':')[1],
    venue: entity === '' || entity.split(':')[0] !== 'ven' ? '' : entity.split(':')[1],
    configuration: __CREATE_CONFIG ?? undefined,
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
        deviceTypes: [],
        rrm: 'inherit',
        note: '',
        entity: getEntityId(),
        __CREATE_CONFIG: null,
      }}
      validationSchema={CreateConfigurationSchema(t)}
      onSubmit={(formData, { setSubmitting, resetForm }) =>
        create.mutateAsync(createParameters(formData), {
          onSuccess: () => {
            setSubmitting(false);
            resetForm();
            toast({
              id: 'configuration-creation-success',
              title: t('common.success'),
              description: t('crud.success_create_obj', {
                obj: t('configurations.one'),
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
              id: uuid(),
              title: t('common.error'),
              description: t('crud.error_create_obj', {
                obj: t('configurations.one'),
                e: e?.response?.data?.ErrorDescription,
              }),
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            setSubmitting(false);
          },
        })
      }
    >
      {({ errors, touched, setFieldValue }) => (
        <>
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={6}>
            <StringField name="name" label={t('common.name')} errors={errors} touched={touched} isRequired />
            <MultiSelectField
              name="deviceTypes"
              label={t('configurations.device_types')}
              errors={errors}
              touched={touched}
              options={deviceTypesList.map((deviceType) => ({
                value: deviceType,
                label: deviceType,
              }))}
              isRequired
              setFieldValue={setFieldValue}
              canSelectAll
              isPortal
            />
            <SelectWithSearchField
              name="entity"
              label={t('inventory.parent')}
              errors={errors}
              touched={touched}
              isRequired
              options={[
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
              isHidden={entityId !== null}
              isPortal
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
            <StringField name="description" label={t('common.description')} errors={errors} touched={touched} />
            <StringField name="note" label={t('common.note')} errors={errors} touched={touched} />
          </SimpleGrid>
          <SpecialConfigurationManager editing isEnabledByDefault isOnlySections onChange={onConfigurationChange} />
        </>
      )}
    </Formik>
  );
};

CreateConfigurationForm.propTypes = propTypes;
CreateConfigurationForm.defaultProps = defaultProps;

export default CreateConfigurationForm;
