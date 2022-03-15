import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as createUuid } from 'uuid';
import {
  Box,
  Flex,
  useColorModeValue,
  Link,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  SimpleGrid,
  Heading,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Formik, Field, Form } from 'formik';
import NotesTable from 'components/NotesTable';
import StringField from 'components/FormFields/StringField';
import { DefaultRequirements, RequirementsShape, SubscriberShape } from 'constants/propShapes';
import { UpdateSubscriberSchema } from 'constants/formSchemas';
import { useGetEntities } from 'hooks/Network/Entity';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';
import InventoryTable from 'components/Tables/InventoryTable';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateSubscriber: PropTypes.instanceOf(Object).isRequired,
  requirements: PropTypes.shape(RequirementsShape),
  refresh: PropTypes.func.isRequired,
  subscriber: PropTypes.shape(SubscriberShape).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  deviceSerials: PropTypes.arrayOf(PropTypes.string).isRequired,
  addSerialNumber: PropTypes.func.isRequired,
  removeSerialNumber: PropTypes.func.isRequired,
  claimDevices: PropTypes.func.isRequired,
};

const defaultProps = {
  requirements: DefaultRequirements,
};

const EditSubscriberForm = ({
  editing,
  isOpen,
  onClose,
  updateSubscriber,
  requirements,
  refresh,
  subscriber,
  formRef,
  deviceSerials,
  addSerialNumber,
  removeSerialNumber,
  claimDevices,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(createUuid());
  const { data: entities } = useGetEntities({ t, toast });
  const textColor = useColorModeValue('gray.400', 'white');

  useEffect(() => {
    setFormKey(createUuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={subscriber}
      validationSchema={UpdateSubscriberSchema(t)}
      onSubmit={(
        { name, description, currentPassword, notes, owner },
        { setSubmitting, resetForm },
      ) =>
        updateSubscriber.mutateAsync(
          {
            name,
            currentPassword: currentPassword.length > 0 ? currentPassword : undefined,
            description,
            notes: notes.filter((note) => note.isNew),
            owner,
          },
          {
            onSuccess: async () => {
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

              const results = await claimDevices();
              if (results[0].length > 0) {
                toast({
                  id: createUuid(),
                  title: t('common.error'),
                  description: t('subscribers.error_removing_claim', {
                    serials: results[0].join(', '),
                  }),
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: 'top-right',
                });
              } else if (results[1].length > 0) {
                toast({
                  id: createUuid(),
                  title: t('common.error'),
                  description: t('subscribers.error_claiming', {
                    serials: results[1].join(', '),
                  }),
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: 'top-right',
                });
              } else {
                refresh();
                onClose();
              }
            },
            onError: (e) => {
              toast({
                id: createUuid(),
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
        <>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>{t('common.main')}</Tab>
              <Tab>{t('subscribers.devices_claimed', { count: deviceSerials.length })}</Tab>
              <Tab>{t('common.notes')}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Form>
                  <SimpleGrid minChildWidth="300px" spacing="20px">
                    <StringField name="email" label={t('common.email')} isDisabled isRequired />
                    <StringField
                      name="name"
                      label={t('common.name')}
                      isDisabled={!editing}
                      isRequired
                    />
                    <StringField
                      name="currentPassword"
                      label={t('user.password')}
                      isDisabled={!editing}
                      hideButton
                    />
                    <StringField
                      name="description"
                      label={t('common.description')}
                      isDisabled={!editing}
                    />
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
                <Box mt={2} h="280px" border="1px" overflowX="auto" borderRadius="8px">
                  <InventoryTable
                    removeAction={editing ? removeSerialNumber : null}
                    ignoredColumns={['name', 'configuration']}
                    tagSelect={deviceSerials}
                  />
                </Box>
                {editing && (
                  <>
                    <Heading mt={8} size="sm">
                      {t('subscribers.claim_device_explanation')}
                    </Heading>
                    <Box mt={2} h="460px" border="1px" overflowX="auto" borderRadius="8px">
                      <InventoryTable
                        addAction={addSerialNumber}
                        ignoredColumns={['name', 'configuration']}
                        serialsToDisable={deviceSerials}
                      />
                    </Box>
                  </>
                )}
              </TabPanel>
              <TabPanel>
                <Field name="notes">
                  {({ field }) => (
                    <NotesTable
                      notes={field.value}
                      setNotes={setFieldValue}
                      isDisabled={!editing}
                    />
                  )}
                </Field>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Flex justifyContent="center" alignItems="center" maxW="100%" mt="25px" mb={6} px={4}>
            <Box w="100%">
              <Link
                href={`https://ucentral.dpaas.arilia.com:16061${requirements?.data?.passwordPolicy}`}
                isExternal
                textColor={textColor}
                pb={2}
              >
                {t('login.password_policy')}
                <ExternalLinkIcon mx="2px" />
              </Link>
            </Box>
          </Flex>
        </>
      )}
    </Formik>
  );
};

EditSubscriberForm.propTypes = propTypes;
EditSubscriberForm.defaultProps = defaultProps;

export default EditSubscriberForm;
