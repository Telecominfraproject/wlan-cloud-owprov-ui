import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useToast, Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid, Box } from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import NotesTable from 'components/CustomFields/NotesTable';
import StringField from 'components/FormFields/StringField';
import { EntityShape } from 'constants/propShapes';
import { EntitySchema } from 'constants/formSchemas';
import { useUpdateEntity } from 'hooks/Network/Entity';
import FormattedDate from 'components/FormattedDate';
import { useQueryClient } from 'react-query';
import IpDetectionModalField from 'components/CustomFields/IpDetectionModalField';
import DeviceRulesField from 'components/CustomFields/DeviceRulesField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  entity: PropTypes.shape(EntityShape).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  stopEditing: PropTypes.func.isRequired,
};

const EditEntityForm = ({ editing, entity, formRef, stopEditing }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(uuid());
  const queryClient = useQueryClient();
  const updateEntity = useUpdateEntity({ id: entity.id });

  useEffect(() => {
    setFormKey(uuid());
  }, [editing]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={{ ...entity, rrm: entity.rrm !== '' ? entity.rrm : 'inherit' }}
      validationSchema={EntitySchema(t)}
      onSubmit={({ name, description, sourceIP, notes, deviceRules }, { setSubmitting, resetForm }) =>
        updateEntity.mutateAsync(
          {
            name,
            description,
            deviceRules,
            sourceIP,
            notes: notes.filter((note) => note.isNew),
          },
          {
            onSuccess: ({ data }) => {
              setSubmitting(false);
              toast({
                id: 'entity-update-success',
                title: t('common.success'),
                description: t('crud.success_update_obj', {
                  obj: t('entities.one'),
                }),
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              queryClient.setQueryData(['get-entity', entity.id], data);
              queryClient.invalidateQueries(['get-entity-tree']);
              resetForm();
              stopEditing();
            },
            onError: (e) => {
              toast({
                id: uuid(),
                title: t('common.error'),
                description: t('crud.error_update_obj', {
                  obj: t('entities.one'),
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
      {({ errors, touched, setFieldValue }) => (
        <Tabs variant="enclosed" w="100%">
          <TabList>
            <Tab>{t('common.main')}</Tab>
            <Tab>{t('common.notes')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Form>
                <SimpleGrid minChildWidth="300px" spacing="20px">
                  <StringField
                    name="name"
                    label={t('common.name')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                    isRequired
                  />
                  <StringField
                    name="description"
                    label={t('common.description')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                  />
                  <DeviceRulesField isDisabled={!editing} />
                  <IpDetectionModalField
                    name="sourceIP"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    isDisabled={!editing}
                  />
                  <StringField
                    name="created"
                    label={t('common.created')}
                    errors={errors}
                    touched={touched}
                    element={
                      <Box pl={1} pt={2}>
                        <FormattedDate date={entity.created} />
                      </Box>
                    }
                  />
                  <StringField
                    name="modified"
                    label={t('common.modified')}
                    errors={errors}
                    touched={touched}
                    element={
                      <Box pl={1} pt={2}>
                        <FormattedDate date={entity.modified} />
                      </Box>
                    }
                  />
                </SimpleGrid>
              </Form>
            </TabPanel>
            <TabPanel>
              <Field name="notes">
                {({ field }) => <NotesTable notes={field.value} setNotes={setFieldValue} isDisabled={!editing} />}
              </Field>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Formik>
  );
};

EditEntityForm.propTypes = propTypes;

export default EditEntityForm;
