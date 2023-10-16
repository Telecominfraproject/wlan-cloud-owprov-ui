import * as React from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, HStack, Heading, Link, Spacer, Spinner } from '@chakra-ui/react';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import SaveButton from 'components/Buttons/SaveButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import StringField from 'components/FormFields/StringField';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import { testRegex } from 'constants/formTests';
import { useAuth } from 'contexts/AuthProvider';
import { useUpdateAccount } from 'hooks/Network/Account';
import useApiRequirements from 'hooks/useApiRequirements';
import useFormModal from 'hooks/useFormModal';
import useFormRef from 'hooks/useFormRef';
import { useNotification } from 'hooks/useNotification';

const FormSchema = (t: (str: string) => string, { passRegex }: { passRegex: string }) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    newPassword: Yup.string()
      .notRequired()
      .test('password', t('form.invalid_password'), (v) => testRegex(v, passRegex)),
    newPasswordConfirm: Yup.string()
      .notRequired()
      .test('password-confirm', t('form.invalid_password'), (v) => testRegex(v, passRegex))
      // @ts-ignore
      .test('password-match', 'Passwords must match', (value, { from }) => value === from[0].value.newPassword),
    description: Yup.string(),
  });

const GeneralInformationProfile = () => {
  const { t } = useTranslation();
  const { successToast, apiErrorToast } = useNotification();
  const { passwordPattern, passwordPolicyLink } = useApiRequirements();
  const { user } = useAuth();
  const updateUser = useUpdateAccount({});
  const { form, formRef } = useFormRef();
  const [formKey, setFormKey] = React.useState(uuid());
  const {
    isOpen: isEditing,
    isConfirmOpen,
    onOpen,
    closeConfirm,
    closeModal,
    closeCancelAndForm,
  } = useFormModal({
    isDirty: form?.dirty,
  });

  const toggleEditing = () => {
    if (!isEditing) {
      onOpen();
    } else {
      closeModal();
    }
  };

  React.useEffect(() => {
    setFormKey(uuid());
  }, [isEditing]);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{t('profile.your_profile')}</Heading>
        <Spacer />
        <HStack>
          <SaveButton
            onClick={form.submitForm}
            isLoading={form.isSubmitting}
            isDisabled={!form.isValid || !form.dirty}
            hidden={!isEditing}
          />
          <ToggleEditButton toggleEdit={toggleEditing} isEditing={isEditing} />
        </HStack>
      </CardHeader>
      <CardBody display="block">
        {!user ? (
          <Center>
            <Spinner size="lg" />
          </Center>
        ) : (
          <Formik<{
            description: string;
            name: string;
            newPassword?: string;
          }>
            key={formKey}
            initialValues={
              {
                email: user?.email,
                description: user?.description ?? '',
                name: user?.name ?? '',
              } as {
                description: string;
                name: string;
                newPassword?: string;
              }
            }
            innerRef={
              formRef as React.Ref<
                FormikProps<{
                  description: string;
                  name: string;
                  newPassword?: string;
                }>
              >
            }
            validationSchema={FormSchema(t, { passRegex: passwordPattern })}
            onSubmit={async ({ description, name, newPassword }, { setSubmitting }) => {
              await updateUser.mutateAsync(
                {
                  id: user?.id,
                  description,
                  name,
                  currentPassword: newPassword,
                },
                {
                  onSuccess: () => {
                    setSubmitting(false);
                    closeCancelAndForm();
                    successToast({
                      id: 'account-update-success',
                      description: t('crud.success_update_obj', {
                        obj: t('profile.your_profile'),
                      }),
                    });
                  },
                  onError: (e) => {
                    apiErrorToast({
                      id: 'account-update-error',
                      e,
                    });
                  },
                },
              );
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Flex>
                  <StringField name="email" label={t('common.email')} isDisabled />
                  <Box w={8} />
                  <StringField
                    name="name"
                    label={t('common.name')}
                    isDisabled={isSubmitting || !isEditing}
                    isRequired
                  />
                </Flex>
                <Flex my={4}>
                  <StringField
                    name="newPassword"
                    label={t('profile.new_password')}
                    isDisabled={isSubmitting || !isEditing}
                    emptyIsUndefined
                    hideButton
                  />
                  <Box w={8} />
                  <StringField
                    name="newPasswordConfirm"
                    label={t('profile.new_password_confirmation')}
                    isDisabled={isSubmitting || !isEditing}
                    emptyIsUndefined
                    hideButton
                  />
                </Flex>
                <StringField
                  h="100px"
                  name="description"
                  label={t('profile.about_me')}
                  isDisabled={isSubmitting || !isEditing}
                  isArea
                />
                <Box w="100%" mt={4} textAlign="right">
                  <Link href={passwordPolicyLink} isExternal>
                    {t('login.password_policy')}
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </CardBody>
      <ConfirmCloseAlert isOpen={isConfirmOpen} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </Card>
  );
};

export default GeneralInformationProfile;
