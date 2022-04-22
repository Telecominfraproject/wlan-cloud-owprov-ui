import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form, FormikProps } from 'formik';
import NotesTable from 'components/CustomFields/NotesTable';
import StringField from 'components/FormFields/StringField';
import { SubscriberSchema } from 'constants/formSchemas';
import { useUpdateSubscriber } from 'hooks/Network/Subscribers';
import useMutationResult from 'hooks/useMutationResult';
import useApiRequirements from 'hooks/useApiRequirements';
import { Subscriber } from 'models/Subscriber';

interface Props {
  editing: boolean;
  subscriber: Subscriber;
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  stopEditing: () => void;
}

const EditSubscriberForm: React.FC<Props> = ({ editing, subscriber, formRef, stopEditing }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const updateSubscriber = useUpdateSubscriber({ id: subscriber?.id });
  const { onSuccess, onError } = useMutationResult({
    objName: t('subscribers.one'),
    operationType: 'create',
    onClose: stopEditing,
    queryToInvalidate: ['get-subscriber', subscriber?.id],
  });
  const { passwordPattern } = useApiRequirements();

  useEffect(() => {
    setFormKey(uuid());
  }, [editing]);

  return (
    <Formik
      innerRef={formRef as React.Ref<FormikProps<Subscriber>>}
      enableReinitialize
      key={formKey}
      initialValues={{ ...subscriber }}
      validationSchema={SubscriberSchema(t, { needPassword: false, passRegex: passwordPattern })}
      onSubmit={({ name, description, currentPassword, notes, owner }, { setSubmitting, resetForm }) =>
        updateSubscriber.mutateAsync(
          {
            name,
            currentPassword: currentPassword && currentPassword.length > 0 ? currentPassword : undefined,
            description,
            notes: notes.filter((note) => note.isNew),
            owner,
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
                <StringField
                  name="currentPassword"
                  label={t('user.password')}
                  isDisabled={!editing}
                  hideButton
                  emptyIsUndefined
                />
                <StringField name="description" label={t('common.description')} isDisabled={!editing} />
              </SimpleGrid>
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

export default EditSubscriberForm;
