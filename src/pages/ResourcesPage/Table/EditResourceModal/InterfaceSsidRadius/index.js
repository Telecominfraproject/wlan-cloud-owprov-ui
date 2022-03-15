import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as createUuid } from 'uuid';
import { SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import { useUpdateResource } from 'hooks/Network/Resources';
import StringField from 'components/FormFields/StringField';
import NotesTable from 'components/NotesTable';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';
import { useGetEntities } from 'hooks/Network/Entity';
import { useGetVenues } from 'hooks/Network/Venues';
import InterfaceSsidRadiusForm from './Form';
import { EDIT_SCHEMA } from './schemas';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  resource: PropTypes.instanceOf(Object).isRequired,
  editing: PropTypes.bool.isRequired,
};

const InterfaceSsidRadius = ({ isOpen, onClose, refresh, formRef, resource, editing }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: entities } = useGetEntities({ t, toast });
  const { data: venues } = useGetVenues({ t, toast });
  const [formKey, setFormKey] = useState(createUuid());

  const update = useUpdateResource(resource.id);

  useEffect(() => {
    setFormKey(createUuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={{
        ...JSON.parse(resource.variables[0].value),
        name: resource.name,
        description: resource.description,
        entity: resource.entity !== '' ? `ent:${resource.entity}` : `ven:${resource.venue}`,
        notes: resource.notes,
      }}
      validationSchema={EDIT_SCHEMA(t)}
      onSubmit={async (formData, { setSubmitting, resetForm }) =>
        update.mutateAsync(
          {
            variables: [
              {
                type: 'json',
                weight: 0,
                prefix: 'interface.ssid.radius',
                value: {
                  ...formData,
                  name: undefined,
                  description: undefined,
                  notes: undefined,
                  entity: undefined,
                },
              },
            ],
            name: formData.name,
            description: formData.description,
            entity:
              formData.entity === '' || formData.entity.split(':')[0] !== 'ent'
                ? ''
                : formData.entity.split(':')[1],
            venue:
              formData.entity === '' || formData.entity.split(':')[0] !== 'ven'
                ? ''
                : formData.entity.split(':')[1],
            notes: formData.notes.filter((note) => note.isNew),
          },
          {
            onSuccess: async () => {
              toast({
                id: 'resource-update-success',
                title: t('common.success'),
                description: t('crud.success_create_obj', {
                  obj: t('resources.configuration_resource'),
                }),
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });

              setSubmitting(false);
              resetForm();
              refresh();
              onClose();
            },
            onError: (e) => {
              toast({
                id: createUuid(),
                title: t('common.error'),
                description: t('crud.error_create_obj', {
                  obj: t('resources.configuration_resource'),
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
      {({ setFieldValue, errors, touched }) => (
        <Tabs variant="enclosed">
          <TabList>
            <Tab>{t('common.main')}</Tab>
            <Tab>{t('common.notes')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SimpleGrid minChildWidth="300px" spacing="20px" mt={4}>
                <StringField
                  name="name"
                  label={t('common.name')}
                  isRequired
                  isDisabled={!editing}
                />
                <StringField
                  name="description"
                  label={t('common.description')}
                  isDisabled={!editing}
                />
                <SelectWithSearchField
                  name="entity"
                  label={t('inventory.parent')}
                  errors={errors}
                  touched={touched}
                  isRequired
                  isDisabled={!editing}
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
                />
              </SimpleGrid>
              <InterfaceSsidRadiusForm editing={editing} />
            </TabPanel>
            <TabPanel>
              <Field name="notes">
                {({ field }) => (
                  <NotesTable notes={field.value} setNotes={setFieldValue} isDisabled={!editing} />
                )}
              </Field>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Formik>
  );
};

InterfaceSsidRadius.propTypes = propTypes;

export default InterfaceSsidRadius;
