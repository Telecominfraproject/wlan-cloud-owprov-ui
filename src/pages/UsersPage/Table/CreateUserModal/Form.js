import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as createUuid } from 'uuid';
import { Box, Flex, useColorModeValue, Link, useToast, SimpleGrid } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Formik, Form } from 'formik';
import { useAuth } from 'contexts/AuthProvider';
import { CreateUserNonRootSchema, CreateUserSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import { RequirementsShape } from 'constants/propShapes';
import { secUrl } from 'utils/axiosInstances';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  createUser: PropTypes.instanceOf(Object).isRequired,
  requirements: PropTypes.shape(RequirementsShape),
  refreshUsers: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const defaultProps = {
  requirements: {
    accessPolicy: '',
    passwordPolicy: '',
  },
};

const CreateUserForm = ({ isOpen, onClose, createUser, requirements, refreshUsers, formRef }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { user } = useAuth();
  const [formKey, setFormKey] = useState(createUuid());
  const textColor = useColorModeValue('gray.400', 'white');

  const createParameters = ({ name, description, email, currentPassword, note, userRole }) => {
    if (userRole === 'root') {
      return {
        name,
        email,
        currentPassword,
        userRole,
        description: description.length > 0 ? description : undefined,
        notes: note.length > 0 ? [{ note }] : undefined,
      };
    }
    return {
      name,
      email,
      currentPassword,
      userRole,
      description: description.length > 0 ? description : undefined,
      notes: note.length > 0 ? [{ note }] : undefined,
    };
  };

  useEffect(() => {
    setFormKey(createUuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={{
        name: '',
        description: '',
        email: '',
        currentPassword: '',
        note: '',
        userRole: user.userRole === 'admin' ? 'csr' : user.userRole,
      }}
      validationSchema={user?.userRole === 'root' ? CreateUserSchema : CreateUserNonRootSchema}
      onSubmit={(formData, { setSubmitting, resetForm }) =>
        createUser.mutateAsync(createParameters(formData), {
          onSuccess: () => {
            setSubmitting(false);
            resetForm();
            toast({
              id: 'user-creation-success',
              title: t('common.success'),
              description: t('crud.success_create_obj', {
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
              description: t('crud.error_create_obj', {
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
        })
      }
    >
      {({ errors, touched }) => (
        <Form>
          <SimpleGrid minChildWidth="300px" spacing="20px">
            <StringField
              name="email"
              label={t('common.email')}
              errors={errors}
              touched={touched}
              isRequired
            />
            <StringField
              name="name"
              label={t('common.name')}
              errors={errors}
              touched={touched}
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
            />
            <StringField
              name="currentPassword"
              label={t('user.password')}
              errors={errors}
              touched={touched}
              isRequired
              hideButton
            />
            <StringField
              name="description"
              label={t('common.description')}
              errors={errors}
              touched={touched}
            />
            <StringField name="note" label={t('common.note')} errors={errors} touched={touched} />
          </SimpleGrid>
          <Flex justifyContent="center" alignItems="center" maxW="100%" mt="50px" mb={6}>
            <Box w="100%">
              <Link
                href={`${secUrl}${requirements?.passwordPolicy}`}
                isExternal
                textColor={textColor}
              >
                {t('login.password_policy')}
                <ExternalLinkIcon mx="2px" />
              </Link>
            </Box>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

CreateUserForm.propTypes = propTypes;
CreateUserForm.defaultProps = defaultProps;

export default CreateUserForm;
