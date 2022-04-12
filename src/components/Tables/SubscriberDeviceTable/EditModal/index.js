import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalOverlay, ModalContent, ModalBody, Spinner, Center, useBoolean } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import EditButton from 'components/Buttons/EditButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/ModalHeader';
import useFormRef from 'hooks/useFormRef';
import useFormModal from 'hooks/useFormModal';
import { useGetSubscriberDevice } from 'hooks/Network/SubscriberDevices';
import useOperatorChildren from 'hooks/useOperatorChildren';
import useNestedConfigurationForm from 'hooks/useNestedConfigurationForm';
import EditSubscriberDeviceForm from './Form';

const EditSubscriberDeviceModal = ({ isOpen, onClose, subscriberDevice, refresh, operatorId }) => {
  const { t } = useTranslation();
  const { form, formRef } = useFormRef();
  const [editing, setEditing] = useBoolean();
  const { isConfirmOpen, closeConfirm, closeModal, closeCancelAndForm } = useFormModal({
    isDirty: form?.dirty,
    onModalClose: onClose,
  });
  const { isLoaded, deviceTypes, contacts, locations, serviceClasses, subscribers } = useOperatorChildren({
    operatorId,
  });
  const { data: subscriberDeviceData, isLoading } = useGetSubscriberDevice({
    id: subscriberDevice?.id,
    enabled: subscriberDevice?.id !== '' && isOpen,
  });
  const {
    data: { configuration, isDirty: isConfigurationDirty, isValid: isConfigurationValid },
    onChange: onConfigurationChange,
  } = useNestedConfigurationForm({ defaultConfiguration: subscriberDeviceData?.configuration ?? null });

  useEffect(() => {
    if (isOpen) {
      onConfigurationChange(null);
      setEditing.off();
    }
  }, [isOpen]);

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={t('crud.edit_obj', { obj: t('certificates.device') })}
          right={
            <>
              <SaveButton
                onClick={form.submitForm}
                isLoading={form.isSubmitting}
                isDisabled={!form.isValid || !isConfigurationValid || (!form.dirty && !isConfigurationDirty)}
              />
              <EditButton ml={2} isDisabled={editing} onClick={setEditing.toggle} isCompact />
              <CloseButton ml={2} onClick={closeModal} />
            </>
          }
        />
        <ModalBody>
          {isLoaded && !isLoading && subscriberDeviceData !== undefined ? (
            <EditSubscriberDeviceForm
              editing={editing}
              subscriberDevice={subscriberDeviceData}
              externalData={{
                deviceTypes,
                contacts,
                locations,
                serviceClasses,
                subscribers,
              }}
              isOpen={isOpen}
              onClose={closeCancelAndForm}
              refresh={refresh}
              formRef={formRef}
              operatorId={operatorId}
              configuration={configuration}
              defaultConfiguration={subscriberDevice.configuration}
              onConfigurationChange={onConfigurationChange}
            />
          ) : (
            <Center>
              <Spinner />
            </Center>
          )}
        </ModalBody>
      </ModalContent>
      <ConfirmCloseAlert isOpen={isConfirmOpen} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </Modal>
  );
};

EditSubscriberDeviceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  subscriberDevice: PropTypes.instanceOf(Object),
  refresh: PropTypes.func.isRequired,
  operatorId: PropTypes.string.isRequired,
};
EditSubscriberDeviceModal.defaultProps = {
  subscriberDevice: null,
};

export default EditSubscriberDeviceModal;
