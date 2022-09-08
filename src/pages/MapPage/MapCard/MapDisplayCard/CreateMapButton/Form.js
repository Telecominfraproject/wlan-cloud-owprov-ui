import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useToast, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { CreateMapSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import { useQueryClient } from 'react-query';
import { useGetEntities } from 'hooks/Network/Entity';
import { useGetVenues } from 'hooks/Network/Venues';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  create: PropTypes.instanceOf(Object).isRequired,
  setMapId: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  currentMapInformation: PropTypes.shape({
    rootNode: PropTypes.string.isRequired,
    zoom: PropTypes.number.isRequired,
    position: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    elements: PropTypes.instanceOf(Array).isRequired,
  }).isRequired,
  isDuplicating: PropTypes.bool.isRequired,
};

const CreateMapForm = ({ isOpen, onClose, create, formRef, setMapId, currentMapInformation, isDuplicating }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(uuid());
  const { data: entities } = useGetEntities({ t, toast });
  const { data: venues } = useGetVenues({ t, toast });
  const queryClient = useQueryClient();

  const createParameters = ({ name, description, visibility, note, rootNode }) => ({
    name,
    visibility,
    description: description.length > 0 ? description : undefined,
    notes: note.length > 0 ? [{ note }] : undefined,
    data: JSON.stringify({ ...currentMapInformation, rootNode }),
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
        visibility: 'public',
        rootNode: currentMapInformation.rootNode,
        note: '',
      }}
      validationSchema={CreateMapSchema(t)}
      onSubmit={(formData, { setSubmitting, resetForm }) =>
        create.mutateAsync(createParameters(formData), {
          onSuccess: ({ data }) => {
            queryClient.invalidateQueries(['get-maps']);
            setSubmitting(false);
            resetForm();
            toast({
              id: 'map-creation-success',
              title: t('common.success'),
              description: t('crud.success_create_obj', {
                obj: t('map.title'),
              }),
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            setMapId(data.id);
            onClose();
          },
          onError: (e) => {
            toast({
              id: uuid(),
              title: t('common.error'),
              description: t('crud.error_create_obj', {
                obj: t('map.title'),
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
      {({ setFieldValue, errors, touched }) => (
        <Form>
          <SimpleGrid minChildWidth="300px" spacing="20px">
            <StringField name="name" label={t('common.name')} isRequired />
            <SelectField
              name="visibility"
              label={t('map.visibility')}
              options={[
                { value: 'public', label: 'public' },
                { value: 'private', label: 'private' },
              ]}
              isRequired
            />
            <StringField name="description" label={t('common.description')} />
            <StringField name="note" label={t('common.note')} />
            {!isDuplicating && (
              <SelectWithSearchField
                name="rootNode"
                label={t('map.root_node')}
                errors={errors}
                touched={touched}
                isRequired
                isPortal
                options={[
                  {
                    label: t('entities.title'),
                    options:
                      entities?.map((ent) => ({
                        value: `entity/${ent.id}`,
                        label: `${ent.name}${ent.description ? `: ${ent.description}` : ''}`,
                      })) ?? [],
                  },
                  {
                    label: t('venues.title'),
                    options:
                      venues?.map((ven) => ({
                        value: `venue/${ven.id}`,
                        label: `${ven.name}${ven.description ? `: ${ven.description}` : ''}`,
                      })) ?? [],
                  },
                ]}
                setFieldValue={setFieldValue}
              />
            )}
          </SimpleGrid>
        </Form>
      )}
    </Formik>
  );
};

CreateMapForm.propTypes = propTypes;

export default CreateMapForm;
