import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid, Box } from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import NotesTable from 'components/CustomFields/NotesTable';
import StringField from 'components/FormFields/StringField';
import { EntityShape } from 'constants/propShapes';
import { EntitySchema } from 'constants/formSchemas';
import SelectField from 'components/FormFields/SelectField';
import FormattedDate from 'components/FormattedDate';
import IpDetectionModalField from 'components/CustomFields/IpDetectionModalField';
import { useUpdateOperator } from 'hooks/Network/Operators';
import useMutationResult from 'hooks/useMutationResult';
import ToggleField from 'components/FormFields/ToggleField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  operator: PropTypes.shape(EntityShape).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  stopEditing: PropTypes.func.isRequired,
};

const EditOperatorForm = ({ editing, operator, formRef, stopEditing }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const updateOperator = useUpdateOperator({ id: operator.id });
  const { onSuccess, onError } = useMutationResult({
    objName: t('operator.one'),
    operationType: 'create',
    onClose: stopEditing,
    queryToInvalidate: ['get-operator', operator.id],
  });

  useEffect(() => {
    setFormKey(uuid());
  }, [editing]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={operator}
      validationSchema={EntitySchema(t)}
      onSubmit={({ name, description, rrm, sourceIP, firmwareRCOnly, notes }, { setSubmitting, resetForm }) =>
        updateOperator.mutateAsync(
          {
            name,
            description,
            rrm,
            sourceIP,
            firmwareRCOnly,
            notes: notes.filter((note) => note.isNew),
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
                  <StringField name="name" label={t('common.name')} isDisabled={!editing} isRequired />
                  <StringField name="description" label={t('common.description')} isDisabled={!editing} />
                  <SelectField
                    name="rrm"
                    label="RRM"
                    options={[
                      { label: 'inherit', value: 'inherit' },
                      { label: 'on', value: 'on' },
                      { label: 'off', value: 'off' },
                    ]}
                    isDisabled={!editing}
                    w={28}
                  />
                  <ToggleField name="firmwareRCOnly" label={t('configurations.rc_only')} isDisabled={!editing} />
                  <IpDetectionModalField name="sourceIP" setFieldValue={setFieldValue} isDisabled={!editing} />
                  <StringField
                    name="created"
                    label={t('common.created')}
                    element={
                      <Box pl={1} pt={2}>
                        <FormattedDate date={operator.created} />
                      </Box>
                    }
                  />
                  <StringField
                    name="modified"
                    label={t('common.modified')}
                    element={
                      <Box pl={1} pt={2}>
                        <FormattedDate date={operator.modified} />
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

EditOperatorForm.propTypes = propTypes;

export default EditOperatorForm;
