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
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Formik, Field, Form } from 'formik';
import { useAuth } from 'contexts/AuthProvider';
import NotesTable from 'components/NotesTable';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import { RequirementsShape } from 'constants/propShapes';
import { secUrl } from 'utils/axiosInstances';

const CreateUserSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  name: Yup.string().required('Required'),
  description: Yup.string(),
  currentPassword: Yup.string().notRequired().min(8, 'Minimum Length of 8'),
  userRole: Yup.string(),
});
const propTypes = {
  editing: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateUser: PropTypes.instanceOf(Object).isRequired,
  requirements: PropTypes.shape(RequirementsShape),
  refreshUsers: PropTypes.func.isRequired,
  userToUpdate: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    currentPassword: PropTypes.string.isRequired,
    userRole: PropTypes.string.isRequired,
  }).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const defaultProps = {
  requirements: {
    accessPolicy: '',
    passwordPolicy: '',
  },
};

const UpdateUserForm = ({
  editing,
  isOpen,
  onClose,
  updateUser,
  requirements,
  refreshUsers,
  userToUpdate,
  formRef,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { user } = useAuth();
  const [formKey, setFormKey] = useState(createUuid());
  const textColor = useColorModeValue('gray.400', 'white');

  const formIsDisabled = () => {
    if (!editing) return true;
    if (user?.userRole === 'root') return false;
    if (user?.userRole === 'partner') return false;
    if (user?.userRole === 'admin') {
      if (userToUpdate.userRole === 'partner' || userToUpdate.userRole === 'admin') return true;
      return false;
    }
    return true;
  };

  useEffect(() => {
    setFormKey(createUuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={userToUpdate}
      validationSchema={CreateUserSchema}
      onSubmit={(
        { name, description, currentPassword, userRole, notes },
        { setSubmitting, resetForm },
      ) =>
        updateUser.mutateAsync(
          {
            name,
            currentPassword: currentPassword.length > 0 ? currentPassword : undefined,
            userRole,
            description,
            notes: notes.filter((note) => note.isNew),
          },
          {
            onSuccess: () => {
              setSubmitting(false);
              resetForm();
              toast({
                id: 'user-creation-success',
                title: t('common.success'),
                description: t('crud.success_update_obj', {
                  obj: t('user.title'),
                }),
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              refreshUsers();
              onClose();
            },
            onError: (e) => {
              toast({
                id: createUuid(),
                title: t('common.error'),
                description: t('crud.error_update_obj', {
                  obj: t('user.title'),
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
        <>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>{t('common.main')}</Tab>
              <Tab>{t('common.notes')}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Form>
                  <SimpleGrid minChildWidth="300px" spacing="20px">
                    <StringField
                      name="email"
                      label={t('common.email')}
                      errors={errors}
                      touched={touched}
                      isDisabled
                      isRequired
                    />
                    <SelectField
                      name="userRole"
                      label={t('user.role')}
                      errors={errors}
                      touched={touched}
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
                    <StringField
                      name="name"
                      label={t('common.name')}
                      errors={errors}
                      touched={touched}
                      isDisabled
                      isRequired
                    />
                    <StringField
                      name="currentPassword"
                      label={t('user.password')}
                      errors={errors}
                      touched={touched}
                      isDisabled={formIsDisabled()}
                      hideButton
                    />
                    <StringField
                      name="description"
                      label={t('common.description')}
                      errors={errors}
                      touched={touched}
                      isDisabled={formIsDisabled()}
                    />
                  </SimpleGrid>
                </Form>
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
                href={`${secUrl}${requirements?.passwordPolicy}`}
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

UpdateUserForm.propTypes = propTypes;
UpdateUserForm.defaultProps = defaultProps;

export default UpdateUserForm;
