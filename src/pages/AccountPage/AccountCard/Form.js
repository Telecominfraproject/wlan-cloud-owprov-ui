import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import {
  Box,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  SimpleGrid,
  useDisclosure,
  Center,
  Grid,
  GridItem,
  Avatar,
  Link,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useAuth } from 'contexts/AuthProvider';
import useApiRequirements from 'hooks/useApiRequirements';
import { UpdateUserSchema } from 'constants/formSchemas';
import FileInputButton from 'components/Buttons/FileInputButton';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import VerifyNumberModal from 'components/VerifyNumberModal';
import { NotesField } from 'components/FormFields/NotesField';
import MfaSelectField from './MfaSelectField';

const propTypes = {
  updateUser: PropTypes.instanceOf(Object).isRequired,
  finishUpdate: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  updateAvatar: PropTypes.instanceOf(Object).isRequired,
  deleteAvatar: PropTypes.instanceOf(Object).isRequired,
};

const UpdateAccountForm = ({ updateUser, deleteAvatar, updateAvatar, finishUpdate, editing, formRef }) => {
  const { t } = useTranslation();
  const [verifNumber, setVerifNumber] = useState('');
  const { avatar: savedAvatar } = useAuth();
  const [isValidated, setValidated] = useState(false);
  const [currentAvatarLink, setCurrentAvatarLink] = useState(savedAvatar ?? '');
  const [currentAvatarFile, setCurrentAvatarFile] = useState(null);
  const { isOpen: showVerify, onOpen: openVerify, onClose: closeVerify } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();
  const [formKey, setFormKey] = useState(uuid());
  const { passwordPolicyLink, passwordPattern } = useApiRequirements();

  const toggleVerifyNumber = (params) => {
    setVerifNumber(params.userTypeProprietaryInfo.mobiles[0].number);
    openVerify();
  };

  const updateCurrentAvatar = (uri, file) => {
    setCurrentAvatarLink(uri);
    setCurrentAvatarFile(file);
  };

  const resetAvatar = () => {
    setCurrentAvatarFile(null);
    setCurrentAvatarLink('');
  };

  useEffect(() => {
    setCurrentAvatarLink(savedAvatar ?? '');
    setCurrentAvatarFile(null);
    setFormKey(uuid());
  }, [editing, savedAvatar]);

  return (
    <>
      <Formik
        innerRef={formRef}
        enableReinitialize
        key={formKey}
        initialValues={{
          ...user,
          mfa: user.userTypeProprietaryInfo.mfa.enabled ? user.userTypeProprietaryInfo.mfa.method : '',
          phoneNumber:
            user.userTypeProprietaryInfo.mobiles.length > 0 ? user.userTypeProprietaryInfo.mobiles[0].number : '',
        }}
        validationSchema={UpdateUserSchema(t, { passRegex: passwordPattern })}
        onSubmit={({ description, name, currentPassword, phoneNumber, mfa, notes }, { setSubmitting }) => {
          const onSuccess = () => {
            finishUpdate();
            setSubmitting(false);
            toast({
              id: 'account-update-success',
              title: t('common.success'),
              description: t('crud.success_update_obj', {
                obj: t('account.account'),
              }),
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
          };

          const newUserTypeInfo = {
            ...user.userTypeProprietaryInfo,
            mfa: mfa !== '' ? { enabled: true, method: mfa } : undefined,
          };

          if (
            phoneNumber &&
            phoneNumber.length > 0 &&
            (user.userTypeProprietaryInfo.mobiles.length === 0 ||
              phoneNumber !== user.userTypeProprietaryInfo.mobiles[0].number)
          ) {
            newUserTypeInfo.mobiles[0] = { number: phoneNumber };
          }

          if (currentAvatarLink === '' && savedAvatar !== '') deleteAvatar.mutateAsync();
          else if (currentAvatarFile !== null) updateAvatar.mutateAsync(currentAvatarFile);
          const params = {
            description,
            name,
            currentPassword: currentPassword.length > 0 ? currentPassword : undefined,
            userTypeProprietaryInfo: newUserTypeInfo,
            notes: notes.filter((note) => note.isNew),
          };

          const save = () =>
            updateUser.mutateAsync(params, {
              onSuccess,
              onError: (e) => {
                if (e?.response?.data?.ErrorDescription === 'You must provide at least one validated phone number.') {
                  toggleVerifyNumber(params, onSuccess);
                } else {
                  toast({
                    id: uuid(),
                    title: t('common.error'),
                    description: t('crud.error_update_obj', {
                      obj: t('account.account'),
                      e: e?.response?.data?.ErrorDescription,
                    }),
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                  });
                }
                setSubmitting(false);
              },
            });

          if (
            !isValidated &&
            ((phoneNumber && phoneNumber.length > 0) || user.userTypeProprietaryInfo.mobiles.length > 0)
          ) {
            setSubmitting(false);
            toggleVerifyNumber(params);
          } else {
            save();
          }
        }}
      >
        {({ values }) => (
          <Box w="100%">
            <Tabs variant="enclosed">
              <TabList>
                <Tab>{t('common.main')}</Tab>
                <Tab>{t('common.notes')}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 5, sm: 5, md: 1 }}>
                      <Center>
                        <Avatar size="2xl" name={values.name} src={currentAvatarLink} />
                      </Center>
                      <Center pt={2}>
                        <FileInputButton
                          value={currentAvatarLink}
                          setValue={updateCurrentAvatar}
                          refreshId={formKey}
                          accept="image/*"
                          isHidden={!editing}
                        />
                      </Center>
                      <Center pt={2} hidden={currentAvatarLink === '' || !editing}>
                        <Button onClick={resetAvatar}>Delete Avatar</Button>
                      </Center>
                    </GridItem>
                    <GridItem colSpan={{ base: 5, sm: 5, md: 4 }}>
                      <Box>
                        <Form>
                          <SimpleGrid minChildWidth="250px" spacing="20px">
                            <StringField name="email" label={t('common.email')} isDisabled />
                            <SelectField
                              name="userRole"
                              label={t('users.role')}
                              options={[
                                { value: 'accounting', label: 'Accounting' },
                                { value: 'admin', label: 'Admin' },
                                { value: 'csr', label: 'CSR' },
                                { value: 'installer', label: 'Installer' },
                                { value: 'noc', label: 'NOC' },
                                { value: 'root', label: 'Root' },
                                { value: 'system', label: 'System' },
                              ]}
                              isRequired
                              isDisabled
                            />
                            <StringField name="name" label={t('common.name')} isDisabled={!editing} />
                            <StringField
                              name="currentPassword"
                              label={t('user.password')}
                              isDisabled={!editing}
                              hideButton
                            />
                            <StringField name="description" label={t('common.description')} isDisabled={!editing} />
                            <MfaSelectField
                              name="mfa"
                              phoneName="phoneNumber"
                              label={t('account.mfa')}
                              isDisabled={!editing}
                              setValidated={setValidated}
                            />
                          </SimpleGrid>
                        </Form>
                      </Box>
                    </GridItem>
                  </Grid>
                </TabPanel>
                <TabPanel>
                  <NotesField name="notes" isDisabled={!editing} />
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Box w="100%" mt={4} textAlign="right">
              <Link href={passwordPolicyLink} isExternal>
                {t('login.password_policy')}
                <ExternalLinkIcon mx="2px" />
              </Link>
            </Box>
          </Box>
        )}
      </Formik>
      <VerifyNumberModal
        isOpen={showVerify && verifNumber.length > 0}
        phoneNumber={verifNumber}
        cancel={closeVerify}
        updateUser={updateUser}
        setValidated={setValidated}
      />
    </>
  );
};

UpdateAccountForm.propTypes = propTypes;

export default UpdateAccountForm;
