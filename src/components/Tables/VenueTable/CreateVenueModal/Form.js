import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useToast, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { EntitySchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { useCreateVenue } from 'hooks/Network/Venues';
import LocationPickerCreator from 'components/CreateObjectsForms/LocationPickerCreator';
import DeviceRulesField from 'components/CustomFields/DeviceRulesField';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  parentId: PropTypes.string.isRequired,
  entityId: PropTypes.string.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const CreateVenueForm = ({ isOpen, onClose, formRef, parentId, entityId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formKey, setFormKey] = useState(uuid());
  const create = useCreateVenue();

  const createParameters = ({ name, description, note, deviceRules, location }) => ({
    name,
    deviceRules,
    description,
    notes: note.length > 0 ? [{ note }] : undefined,
    parent: parentId,
    entity: entityId,
    location: location === 'CREATE_NEW' ? undefined : location,
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
        deviceRules: {
          rrm: 'inherit',
          rcOnly: 'inherit',
          firmwareUpgrade: 'inherit',
        },
        note: '',
        location: '',
      }}
      validationSchema={EntitySchema(t)}
      onSubmit={(formData, { setSubmitting, resetForm }) =>
        create.mutateAsync(
          {
            params: createParameters(formData),
            createObjects: formData.__createLocation
              ? { objects: [{ location: formData.__createLocation }] }
              : undefined,
          },
          {
            onSuccess: ({ data }) => {
              queryClient.invalidateQueries(['get-entity-tree']);
              queryClient.invalidateQueries(['get-all-locations']);
              setSubmitting(false);
              resetForm();
              toast({
                id: 'venue-creation-success',
                title: t('common.success'),
                description: t('crud.success_create_obj', {
                  obj: t('venues.one'),
                }),
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              if (parentId !== '') {
                navigate(`/venue/${data.id}`);
              } else {
                queryClient.invalidateQueries(['get-entity', entityId]);
              }
              onClose();
            },
            onError: (e) => {
              toast({
                id: uuid(),
                title: t('common.error'),
                description: t('crud.error_create_obj', {
                  obj: t('venues.one'),
                  e: e?.response?.data?.ErrorDescription,
                }),
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              setSubmitting(false);
            },
          },
        )
      }
    >
      <Form>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={6}>
          <StringField name="name" label={t('common.name')} isRequired />
          <DeviceRulesField />
          <StringField name="description" label={t('common.description')} />
          <StringField name="note" label={t('common.note')} />
        </SimpleGrid>
        <LocationPickerCreator
          locationName="location"
          createLocationName="__createLocation"
          editing
          venueId={parentId !== '' ? parentId : null}
          entityId={entityId !== '' ? entityId : null}
        />
      </Form>
    </Formik>
  );
};

CreateVenueForm.propTypes = propTypes;

export default CreateVenueForm;
