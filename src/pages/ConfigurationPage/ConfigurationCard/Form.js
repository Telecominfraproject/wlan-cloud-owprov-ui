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
import { Formik, Form } from 'formik';
import NotesTable from 'components/CustomFields/NotesTable';
import { EntityShape } from 'constants/propShapes';
import { EntitySchema } from 'constants/formSchemas';
import { useGetConfigurationInUse } from 'hooks/Network/Configurations';
import useGetDeviceTypes from 'hooks/Network/DeviceTypes';
import ConfigurationInUseModal from 'components/Modals/Configuration/ConfigurationInUseModal';
import StringField from 'components/FormFields/StringField';
import MultiSelectField from 'components/FormFields/MultiSelectField';
import { useGetEntities } from 'hooks/Network/Entity';
import { useGetVenues } from 'hooks/Network/Venues';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';
import DeviceRulesField from 'components/CustomFields/DeviceRulesField';

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
  const { data: deviceTypesList } = useGetDeviceTypes();
  const { data: inUse } = useGetConfigurationInUse({
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
        }}
        validationSchema={EntitySchema(t)}
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
                  <StringField name="name" label={t('common.name')} isRequired isDisabled={!editing} />
                  <MultiSelectField
                    name="deviceTypes"
                    label={t('configurations.device_types')}
                    options={
                      deviceTypesList
                        ? deviceTypesList.map((deviceType) => ({
                            value: deviceType,
                            label: deviceType,
                          }))
                        : []
                    }
                    isRequired
                    canSelectAll
                    isDisabled={!editing}
                  />
                  <DeviceRulesField isDisabled={!editing} />
                  <StringField name="description" label={t('common.description')} isDisabled={!editing} />
                  <SelectWithSearchField
                    name="entity"
                    label={t('inventory.parent')}
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
              <NotesTable isDisabled={!editing} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Formik>
      <ConfigurationInUseModal isOpen={isOpen} onClose={onClose} config={configuration} />
    </>
  );
};

EditConfigurationForm.propTypes = propTypes;

export default React.memo(EditConfigurationForm);
