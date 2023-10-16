import * as React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import GoogleOrionCaCertificateField from './CaCertificateField';
import GoogleOrionCertificateField from './CertificateField';
import GoogleOrionPrivateKeyField from './PrivateKeyField';
import CreateButton from 'components/Buttons/CreateButton';
import SaveButton from 'components/Buttons/SaveButton';
import StringField from 'components/FormFields/StringField';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import { Modal } from 'components/Modals/Modal';
import { testPemCertificate, testPemPrivateKey } from 'constants/formTests';
import { CreateGoogleOrionAccountRequest, useCreateGoogleOrionAccount } from 'hooks/Network/GoogleOrion';
import useFormModal from 'hooks/useFormModal';
import useFormRef from 'hooks/useFormRef';
import { useNotification } from 'hooks/useNotification';

const CreateGoogleOrionAccountModal = () => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = React.useState(0);
  const { form, formRef } = useFormRef<
    CreateGoogleOrionAccountRequest & { temporaryCerts: { value: string; filename: string }[] }
  >();
  const modal = useFormModal({
    isDirty: form.dirty,
    onCloseSideEffect: () => {
      setFormKey((k) => k + 1);
    },
  });
  const { successToast, apiErrorToast } = useNotification();
  const create = useCreateGoogleOrionAccount();

  const onSubmit = async (
    data: CreateGoogleOrionAccountRequest & { temporaryCerts: { value: string; filename: string }[] },
    helpers: FormikHelpers<CreateGoogleOrionAccountRequest & { temporaryCerts: { value: string; filename: string }[] }>,
  ) => {
    helpers.setSubmitting(true);

    const finalData = data;
    finalData.cacerts = data.temporaryCerts.map((v) => v.value);

    await create.mutateAsync(finalData, {
      onSuccess: () => {
        successToast({
          description: t('roaming.account_created'),
        });
        modal.closeCancelAndForm();
        helpers.resetForm();
        helpers.setSubmitting(false);
      },
      onError: (error) => {
        apiErrorToast({ e: error });
        helpers.setSubmitting(false);
      },
    });
  };

  const FormSchema = React.useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t('form.required')),
        description: Yup.string(),
        notes: Yup.array().of(Yup.string()),
        privateKey: Yup.string()
          .test('test-key', t('roaming.invalid_key'), (v) => testPemPrivateKey(v, true))
          .required(t('form.required')),
        certificate: Yup.string()
          .test('test-certificate', t('roaming.invalid_certificate'), (v) => testPemCertificate(v, true))
          .required(t('form.required')),
        temporaryCerts: Yup.array().of(Yup.object()).min(1).required(t('form.required')),
      }),
    [t],
  );

  const isFieldDisabled = create.isLoading;

  return (
    <>
      <CreateButton onClick={modal.onOpen} />
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={`${t('common.create')} ${t('roaming.account_one')}`}
        topRightButtons={
          <SaveButton onClick={form.submitForm} isLoading={form.isSubmitting} isDisabled={!form.isValid} />
        }
      >
        <Box>
          <Formik
            key={formKey}
            innerRef={formRef}
            initialValues={
              {
                name: '',
                description: '',
                notes: [],
                privateKey: '',
                certificate: '',
                cacerts: [],
                temporaryCerts: [],
              } as CreateGoogleOrionAccountRequest & { temporaryCerts: { value: string; filename: string }[] }
            }
            validateOnMount
            validationSchema={FormSchema}
            onSubmit={onSubmit}
          >
            <Box>
              <Heading size="md" textDecoration="underline">
                {t('roaming.account_one')} {t('common.details')}
              </Heading>
              <Flex my={2}>
                <StringField name="name" label={t('common.name')} isRequired isDisabled={isFieldDisabled} w="300px" />
              </Flex>
              <StringField name="Description" isArea h="80px" isDisabled={isFieldDisabled} />
              <Heading size="md" textDecoration="underline" mt={2}>
                Google Orion
              </Heading>
              <Flex my={2}>
                <Box w="300px">
                  <GoogleOrionCertificateField isDisabled={isFieldDisabled} />
                </Box>
                <Box w="300px" ml={2}>
                  <GoogleOrionPrivateKeyField isDisabled={isFieldDisabled} />
                </Box>
              </Flex>
              <GoogleOrionCaCertificateField isDisabled={isFieldDisabled} />
            </Box>
          </Formik>
        </Box>
      </Modal>
      <ConfirmCloseAlert isOpen={modal.isConfirmOpen} confirm={modal.closeCancelAndForm} cancel={modal.closeConfirm} />
    </>
  );
};

export default CreateGoogleOrionAccountModal;
