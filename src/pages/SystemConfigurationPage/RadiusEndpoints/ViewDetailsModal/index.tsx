import * as React from 'react';
import { Box, Flex, Heading, UseDisclosureReturn, useBoolean } from '@chakra-ui/react';
import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import EndpointDisplay from './EndpointDisplay';
import SaveButton from 'components/Buttons/SaveButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import StringField from 'components/FormFields/StringField';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import { Modal } from 'components/Modals/Modal';
import { RadiusEndpoint, useUpdateRadiusEndpoint } from 'hooks/Network/RadiusEndpoints';
import useFormModal from 'hooks/useFormModal';
import useFormRef from 'hooks/useFormRef';
import { useNotification } from 'hooks/useNotification';
import { AtLeast } from 'models/General';

type Props = {
  endpoint: RadiusEndpoint;
  modalProps: UseDisclosureReturn;
  hideEdit?: boolean;
};

const ViewDetailsModal = ({ endpoint, modalProps, hideEdit }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useBoolean();
  const [formKey, setFormKey] = React.useState(uuid());
  const { form, formRef } = useFormRef<AtLeast<RadiusEndpoint, 'id'>>();
  const modal = useFormModal({
    isDirty: form.dirty || isEditing,
    onCloseSideEffect: () => {
      setFormKey(uuid());
      setIsEditing.off();
      modalProps.onClose();
    },
  });
  const { successToast, apiErrorToast } = useNotification();
  const update = useUpdateRadiusEndpoint();

  const onSubmit = async (
    data: AtLeast<RadiusEndpoint, 'id'>,
    helpers: FormikHelpers<AtLeast<RadiusEndpoint, 'id'>>,
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
        title={endpoint.name}
        topRightButtons={
          <>
            <SaveButton
              onClick={form.submitForm}
              isLoading={form.isSubmitting}
              isDisabled={!form.isValid}
              hidden={!isEditing}
            />
            {!hideEdit ? (
              <ToggleEditButton toggleEdit={setIsEditing.toggle} isEditing={isEditing} isDirty={form.dirty} />
            ) : null}
          </>
        }
      >
        <Box>
          <Formik
            key={formKey}
            innerRef={formRef}
            initialValues={{
              id: endpoint.id,
              name: endpoint.name,
              description: endpoint.description,
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
              <StringField
                name="description"
                label={t('common.description')}
                isArea
                h="80px"
                isDisabled={isFieldDisabled}
              />
            </Box>
          </Formik>
          <EndpointDisplay endpoint={endpoint} />
        </Box>
      </Modal>
      <ConfirmCloseAlert isOpen={modal.isConfirmOpen} confirm={modal.closeCancelAndForm} cancel={modal.closeConfirm} />
    </>
  );
};

export default ViewDetailsModal;
