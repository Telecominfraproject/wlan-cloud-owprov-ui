import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useUpdateResource } from 'hooks/Network/Resources';
import StringField from 'components/FormFields/StringField';
import NotesTable from 'components/CustomFields/NotesTable';
import InterfaceSsidForm from './Form';
import { INTERFACE_SSID_SCHEMA } from './schemas';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  resource: PropTypes.instanceOf(Object).isRequired,
  editing: PropTypes.bool.isRequired,
};

const InterfaceSsid = ({ isOpen, onClose, refresh, formRef, resource, editing }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(uuid());

  const update = useUpdateResource(resource.id);

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={{
        ...JSON.parse(resource.variables[0].value),
        _unused_name: resource.name,
        _unused_description: resource.description,
        entity: resource.entity !== '' ? `ent:${resource.entity}` : `ven:${resource.venue}`,
        _unused_notes: resource.notes,
      }}
      validationSchema={INTERFACE_SSID_SCHEMA(t)}
      onSubmit={async (formData, { setSubmitting, resetForm }) =>
        update.mutateAsync(
          {
            variables: [
              {
                type: 'json',
                weight: 0,
                prefix: 'interface.ssid',
                value: {
                  ...formData,
                  _unused_name: undefined,
                  _unused_description: undefined,
                  _unused_notes: undefined,
                  entity: undefined,
                },
              },
            ],
            name: formData._unused_name,
            description: formData._unused_description,
            entity:
              formData.entity === '' || formData.entity.split(':')[0] !== 'ent' ? '' : formData.entity.split(':')[1],
            venue:
              formData.entity === '' || formData.entity.split(':')[0] !== 'ven' ? '' : formData.entity.split(':')[1],
            notes: formData._unused_notes.filter((note) => note.isNew),
          },
          {
            onSuccess: async () => {
              toast({
                id: 'resource-update-success',
                title: t('common.success'),
                description: t('crud.success_update_obj', {
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
                id: uuid(),
                title: t('common.error'),
                description: t('crud.error_update_obj', {
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
      <Tabs variant="enclosed">
        <TabList>
          <Tab>{t('common.main')}</Tab>
          <Tab>{t('common.notes')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleGrid minChildWidth="300px" spacing="20px" mt={4}>
              <StringField name="_unused_name" label={t('common.name')} isRequired isDisabled={!editing} />
              <StringField name="_unused_description" label={t('common.description')} isDisabled={!editing} />
            </SimpleGrid>
            <InterfaceSsidForm editing={editing} />
          </TabPanel>
          <TabPanel>
            <NotesTable name="_unused_notes" isDisabled={!editing} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Formik>
  );
};

InterfaceSsid.propTypes = propTypes;

export default InterfaceSsid;
