import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useToast, Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid } from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import NotesTable from 'components/NotesTable';
import StringField from 'components/FormFields/StringField';
import { EntityShape } from 'constants/propShapes';
import { UpdateSubscriberSchema } from 'constants/formSchemas';
import { useMutation, useQueryClient } from 'react-query';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';
import { useGetEntities } from 'hooks/Network/Entity';
import { axiosSec } from 'utils/axiosInstances';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  subscriber: PropTypes.shape(EntityShape).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  stopEditing: PropTypes.func.isRequired,
};

const EditSubscriberForm = ({ editing, subscriber, formRef, stopEditing }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: entities } = useGetEntities({ t, toast });
  const [formKey, setFormKey] = useState(uuid());
  const queryClient = useQueryClient();
  const updateSubscriber = useMutation((subInfo) => axiosSec.put(`subuser/${subscriber?.id}`, subInfo));

  useEffect(() => {
    setFormKey(uuid());
  }, [editing]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={{ ...subscriber }}
      validationSchema={UpdateSubscriberSchema(t)}
      onSubmit={({ name, description, currentPassword, notes, owner }, { setSubmitting, resetForm }) =>
        updateSubscriber.mutateAsync(
          {
            name,
            currentPassword: currentPassword.length > 0 ? currentPassword : undefined,
            description,
            notes: notes.filter((note) => note.isNew),
            owner,
          },
          {
            onSuccess: ({ data }) => {
              setSubmitting(false);
              toast({
                id: 'subscriber-update-success',
                title: t('common.success'),
                description: t('crud.success_update_obj', {
                  obj: t('subscribers.one'),
                }),
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });

              setSubmitting(false);
              resetForm();
              queryClient.setQueryData(['get-subscriber', subscriber.id], data);
              resetForm();
              stopEditing();
            },
            onError: (e) => {
              toast({
                id: uuid(),
                title: t('common.error'),
                description: t('crud.error_update_obj', {
                  obj: t('subscribers.one'),
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
      {({ setFieldValue }) => (
        <Tabs variant="enclosed" w="100%">
          <TabList>
            <Tab>{t('common.main')}</Tab>
            <Tab>{t('common.notes')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Form>
                <SimpleGrid minChildWidth="300px" spacing="20px">
                  <StringField name="email" label={t('common.email')} isDisabled isRequired />
                  <StringField name="name" label={t('common.name')} isDisabled={!editing} isRequired />
                  <StringField name="currentPassword" label={t('user.password')} isDisabled={!editing} hideButton />
                  <StringField name="description" label={t('common.description')} isDisabled={!editing} />
                  <SelectWithSearchField
                    name="owner"
                    label={t('entities.one')}
                    isRequired
                    isDisabled={!editing}
                    options={
                      entities?.map((ent) => ({
                        value: ent.id,
                        label: `${ent.name}${ent.description ? `: ${ent.description}` : ''}`,
                      })) ?? []
                    }
                    isPortal
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

EditSubscriberForm.propTypes = propTypes;

export default EditSubscriberForm;
