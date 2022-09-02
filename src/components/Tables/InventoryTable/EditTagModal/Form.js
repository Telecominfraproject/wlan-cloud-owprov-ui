import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useToast, Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid, Textarea } from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import NotesTable from 'components/CustomFields/NotesTable';
import StringField from 'components/FormFields/StringField';
import { TagShape } from 'constants/propShapes';
import { UpdateTagSchema } from 'constants/formSchemas';
import { useGetEntities } from 'hooks/Network/Entity';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';
import SelectField from 'components/FormFields/SelectField';
import { useGetVenues } from 'hooks/Network/Venues';
import { useUpdateConfiguration } from 'hooks/Network/Configurations';
import { useQueryClient } from 'react-query';
import DeviceRulesField from 'components/CustomFields/DeviceRulesField';
import ComputedConfigurationDisplay from './ComputedConfigurationDisplay';
import SpecialConfigurationManager from '../../../CustomFields/SpecialConfigurationManager';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateTag: PropTypes.instanceOf(Object).isRequired,
  refresh: PropTypes.func.isRequired,
  tag: PropTypes.shape(TagShape).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  deviceTypesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  onConfigurationChange: PropTypes.func.isRequired,
  configuration: PropTypes.instanceOf(Object),
};

const defaultProps = {
  configuration: null,
};

const EditTagForm = ({
  editing,
  isOpen,
  onClose,
  updateTag,
  refresh,
  tag,
  formRef,
  deviceTypesList,
  onConfigurationChange,
  configuration,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(uuid());
  const { data: entities } = useGetEntities({ t, toast });
  const { data: venues } = useGetVenues({ t, toast });
  const updateConfiguration = useUpdateConfiguration({ id: tag.deviceConfiguration });
  const [isDeleted, setIsDeleted] = useState(false);
  const queryClient = useQueryClient();

  const getEntityFromData = (data) => {
    if (data.entity !== '') return `ent:${data.entity}`;
    if (data.venue !== '') return `ven:${data.venue}`;
    return '';
  };

  useEffect(() => {
    setFormKey(uuid());
    setIsDeleted(false);
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={{
        ...tag,
        entity: getEntityFromData(tag),
        devClass: tag.devClass !== '' ? tag.devClass : 'any',
      }}
      validationSchema={UpdateTagSchema(t)}
      onSubmit={async (
        { name, description, notes, entity, deviceType, deviceRules, devClass, state },
        { setSubmitting, resetForm },
      ) => {
        const params = {
          name,
          description,
          notes: notes.filter((note) => note.isNew),
          deviceType,
          deviceRules,
          devClass,
          entity: entity === '' || entity.split(':')[0] !== 'ent' ? '' : entity.split(':')[1],
          venue: entity === '' || entity.split(':')[0] !== 'ven' ? '' : entity.split(':')[1],
          state,
        };
        let configUpdateSuccess = true;
        // We need to attach configuration to update so it gets created
        if (configuration !== null) {
          const configToPush = {
            ...configuration.data,
            name: `device:${tag.serialNumber}`,
            description: 'Created from the Edit Tag menu',
            deviceTypes: [deviceType],
          };

          if (tag.deviceConfiguration === '') params.__newConfig = configToPush;
          else
            updateConfiguration.mutateAsync(configToPush, {
              onSuccess: ({ data }) => {
                toast({
                  id: 'configuration-update-success',
                  title: t('common.success'),
                  description: t('crud.success_update_obj', {
                    obj: t('configurations.one'),
                  }),
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                  position: 'top-right',
                });
                queryClient.setQueryData(['get-configuration', configuration.id], data);
                queryClient.invalidateQueries(['get-configurations']);
              },
              onError: (e) => {
                toast({
                  id: uuid(),
                  title: t('common.error'),
                  description: t('crud.error_update_obj', {
                    obj: t('configurations.one'),
                    e: e?.response?.data?.ErrorDescription,
                  }),
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: 'top-right',
                });
                configUpdateSuccess = false;
                setSubmitting(false);
                resetForm();
              },
            });
        } else params.deviceConfiguration = '';

        if (configUpdateSuccess) {
          updateTag.mutateAsync(params, {
            onSuccess: async () => {
              toast({
                id: 'tag-update-success',
                title: t('common.success'),
                description: t('crud.success_update_obj', {
                  obj: t('inventory.tag_one'),
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
                  obj: t('inventory.tag_one'),
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
        }
      }}
    >
      {({ setFieldValue }) => (
        <Tabs variant="enclosed">
          <TabList>
            <Tab>{t('common.main')}</Tab>
            <Tab>{t('configurations.special_configuration')}</Tab>
            <Tab>{t('inventory.computed_configuration')}</Tab>
            <Tab>{t('common.notes')}</Tab>
            <Tab>{t('common.state')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Form>
                <SimpleGrid minChildWidth="300px" spacing="20px">
                  <StringField name="serialNumber" label={t('inventory.serial_number')} isDisabled isRequired />
                  <StringField name="name" label={t('common.name')} isDisabled={!editing} isRequired />
                  <StringField name="description" label={t('common.description')} isDisabled={!editing} />
                  <SelectField
                    name="deviceType"
                    label={t('inventory.device_type')}
                    options={deviceTypesList.map((deviceType) => ({
                      value: deviceType,
                      label: deviceType,
                    }))}
                    isRequired
                    isDisabled={!editing}
                  />
                  <SelectWithSearchField
                    name="entity"
                    label={t('inventory.parent')}
                    isDisabled={!editing}
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
                  />
                  <DeviceRulesField isDisabled={!editing} />
                  <SelectField
                    name="devClass"
                    label={t('inventory.dev_class')}
                    options={[
                      { value: 'any', label: 'any' },
                      { value: 'entity', label: 'entity' },
                      { value: 'venue', label: 'venue' },
                      { value: 'subscriber', label: 'subscriber' },
                    ]}
                    isRequired
                    isDisabled={!editing}
                  />
                </SimpleGrid>
              </Form>
            </TabPanel>
            <TabPanel>
              <SpecialConfigurationManager
                configId={isDeleted ? '' : tag.deviceConfiguration}
                editing={editing}
                onChange={onConfigurationChange}
                onDelete={() => setIsDeleted(true)}
              />
            </TabPanel>
            <TabPanel>
              <ComputedConfigurationDisplay computedConfig={tag.computedConfig} />
            </TabPanel>
            <TabPanel>
              <Field name="notes">
                {({ field }) => <NotesTable notes={field.value} setNotes={setFieldValue} isDisabled={!editing} />}
              </Field>
            </TabPanel>
            <TabPanel>
              <Field name="state">{({ field }) => <Textarea {...field} isDisabled={!editing} />}</Field>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Formik>
  );
};

EditTagForm.propTypes = propTypes;
EditTagForm.defaultProps = defaultProps;

export default EditTagForm;
