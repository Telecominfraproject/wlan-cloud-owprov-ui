import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import {
  useToast,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  SimpleGrid,
  FormControl,
  FormLabel,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import NotesTable from 'components/NotesTable';
import { EntityShape } from 'constants/propShapes';
import { EntitySchema } from 'constants/formSchemas';
import { useGetConfigurationInUse } from 'hooks/Network/Configurations';
import useGetDeviceTypes from 'hooks/Network/DeviceTypes';
import ToggleField from 'components/FormFields/ToggleField';
import ConfigurationInUseModal from 'components/Modals/ConfigurationInUseModal';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import MultiSelectField from 'components/FormFields/MultiSelectField';
import { useGetEntities } from 'hooks/Network/Entity';
import { useGetVenues } from 'hooks/Network/Venues';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  configuration: PropTypes.shape(EntityShape).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const EditConfigurationForm = ({ editing, configuration, formRef }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(uuid());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: entities } = useGetEntities({ t, toast });
  const { data: venues } = useGetVenues({ t, toast });
  const { data: deviceTypesList } = useGetDeviceTypes({ t, toast });
  const { data: inUse } = useGetConfigurationInUse({
    t,
    toast,
    id: configuration?.id,
    enabled: true,
  });

  const getEntity = () => {
    if (configuration.entity !== '') return `ent:${configuration.entity}`;
    if (configuration.venue !== '') return `ven:${configuration.venue}`;
    return `ent:0000-0000-0000`;
  };

  useEffect(() => {
    setFormKey(uuid());
  }, [editing]);

  return (
    <>
      <Formik
        innerRef={formRef}
        enableReinitialize
        key={formKey}
        initialValues={{
          ...configuration,
          entity: getEntity(),
          rrm: configuration.rrm !== '' ? configuration.rrm : 'inherit',
        }}
        validationSchema={EntitySchema(t)}
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
                      isRequired
                      isDisabled={!editing}
                    />
                    <MultiSelectField
                      name="deviceTypes"
                      label={t('configurations.device_types')}
                      errors={errors}
                      touched={touched}
                      options={
                        deviceTypesList
                          ? deviceTypesList.map((deviceType) => ({
                              value: deviceType,
                              label: deviceType,
                            }))
                          : []
                      }
                      isRequired
                      setFieldValue={setFieldValue}
                      canSelectAll
                      isDisabled={!editing}
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
                      isDisabled={!editing}
                      w={28}
                    />
                    <SelectField
                      name="firmwareUpgrade"
                      label={t('configurations.firmware_upgrade')}
                      errors={errors}
                      touched={touched}
                      options={[
                        { value: 'inherit', label: 'inherit' },
                        { value: 'yes', label: t('common.yes') },
                        { value: 'no', label: t('common.no') },
                      ]}
                      isRequired
                      isDisabled={!editing}
                    />
                    <ToggleField
                      name="firmwareRCOnly"
                      label={t('configurations.rc_only')}
                      errors={errors}
                      touched={touched}
                      isDisabled={!editing}
                    />
                    <StringField
                      name="description"
                      label={t('common.description')}
                      errors={errors}
                      touched={touched}
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
                    <FormControl>
                      <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                        In Use By
                      </FormLabel>
                      <Button variant="link" mt={2} onClick={onOpen}>
                        {`${inUse?.ent?.length ?? 0} ${t('entities.one')}, ${inUse?.ven?.length ?? 0} ${t(
                          'venues.one',
                        )}, ${inUse?.inv?.length ?? 0} ${t('devices.title')}`}
                      </Button>
                    </FormControl>
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
      <ConfigurationInUseModal isOpen={isOpen} onClose={onClose} config={configuration} />
    </>
  );
};

EditConfigurationForm.propTypes = propTypes;

export default React.memo(EditConfigurationForm);
