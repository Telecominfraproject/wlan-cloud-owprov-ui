import * as React from 'react';
import { Box, Flex, Heading, ListItem, Text, UnorderedList, UseDisclosureReturn, useBoolean } from '@chakra-ui/react';
import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import SaveButton from 'components/Buttons/SaveButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import StringField from 'components/FormFields/StringField';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import { Modal } from 'components/Modals/Modal';
import {
  GoogleOrionAccount,
  UpdateGoogleOrionAccountRequest,
  useUpdateGoogleOrionAccount,
} from 'hooks/Network/GoogleOrion';
import useFormModal from 'hooks/useFormModal';
import useFormRef from 'hooks/useFormRef';
import { useNotification } from 'hooks/useNotification';
import CopyCell from 'pages/OpenRoamingPage/GlobalReachPage/DetailsModal/CopyCell';

type Props = {
  modalProps: UseDisclosureReturn;
  account: GoogleOrionAccount;
};
const GoogleOrionAccountEditModal = ({ modalProps, account }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useBoolean();
  const [formKey, setFormKey] = React.useState(uuid());
  const { form, formRef } = useFormRef<UpdateGoogleOrionAccountRequest>();
  const modal = useFormModal({
    isDirty: form.dirty || isEditing,
    onCloseSideEffect: () => {
      setFormKey(uuid());
      setIsEditing.off();
      modalProps.onClose();
    },
  });
  const { successToast, apiErrorToast } = useNotification();
  const update = useUpdateGoogleOrionAccount();

  const onSubmit = async (
    data: UpdateGoogleOrionAccountRequest,
    helpers: FormikHelpers<UpdateGoogleOrionAccountRequest>,
  ) => {
    helpers.setSubmitting(true);

    await update.mutateAsync(data, {
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
      }),
    [t],
  );

  const isFieldDisabled = update.isLoading || !isEditing;

  React.useEffect(() => {
    if (!modalProps.isOpen) return;

    modal.onOpen();
  }, [modalProps.isOpen]);

  React.useEffect(() => {
    setFormKey(uuid());
  }, [isEditing]);

  return (
    <>
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={account.name}
        topRightButtons={
          <>
            <SaveButton
              onClick={form.submitForm}
              isLoading={form.isSubmitting}
              isDisabled={!form.isValid}
              hidden={!isEditing}
            />
            <ToggleEditButton toggleEdit={setIsEditing.toggle} isEditing={isEditing} isDirty={form.dirty} />
          </>
        }
      >
        <Box>
          <Formik
            key={formKey}
            innerRef={formRef}
            initialValues={{
              id: account.id,
              name: account.name,
              description: account.description,
              // notes: account.notes,
            }}
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
              <StringField name="description" isArea h="80px" isDisabled={isFieldDisabled} />
              <Heading size="md" textDecoration="underline" mt={2}>
                Google Orion
              </Heading>
              <Flex my={2} alignItems="center">
                <Heading size="sm" mr={2}>
                  Certificate:{' '}
                </Heading>
                <CopyCell value={account.certificate} />
              </Flex>
              <Flex my={2} alignItems="center">
                <Heading size="sm" mr={2}>
                  Private Key:{' '}
                </Heading>
                <CopyCell value={account.privateKey} />
              </Flex>
              <Heading size="sm">CA Certificates ({account.cacerts.length}):</Heading>
              <UnorderedList>
                {account.cacerts.map((v, i) => (
                  <ListItem key={uuid()} display="flex" alignItems="center">
                    <Text mr={2} my={2}>
                      Certificate #{i}:
                    </Text>
                    <CopyCell key={uuid()} value={v} />
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
          </Formik>
        </Box>
      </Modal>
      <ConfirmCloseAlert isOpen={modal.isConfirmOpen} confirm={modal.closeCancelAndForm} cancel={modal.closeConfirm} />
    </>
  );
};

export default GoogleOrionAccountEditModal;
