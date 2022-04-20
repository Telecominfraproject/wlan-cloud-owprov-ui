import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, Center, Spinner } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import { useAuth } from 'contexts/AuthProvider';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/ModalHeader';
import useFormRef from 'hooks/useFormRef';
import useFormModal from 'hooks/useFormModal';
import useOperatorChildren from 'hooks/useOperatorChildren';
import useNestedConfigurationForm from 'hooks/useNestedConfigurationForm';
import { Configuration } from 'models/Configuration';
import CreateSubscriberDeviceForm from './Form';

const defaultConfiguration: Configuration[] = [];

interface Props {
  refresh: () => void;
  operatorId: string;
  subscriberId?: string;
}
const defaultProps = {
  subscriberId: '',
};

const CreateSubscriberDeviceModal: React.FC<Props> = ({ refresh, operatorId, subscriberId }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isLoaded, deviceTypes, contacts, locations, serviceClasses, subscribers } = useOperatorChildren({
    operatorId,
  });
  const { form, formRef } = useFormRef();
  const { isOpen, isConfirmOpen, onOpen, closeConfirm, closeModal, closeCancelAndForm } = useFormModal({
    isDirty: form?.dirty,
  });
  const {
    data: { configuration, isDirty: isConfigurationDirty, isValid: isConfigurationValid },
    onChange: onConfigurationChange,
  } = useNestedConfigurationForm({ defaultConfiguration });

  return (
    <>
      <Button
        hidden={user?.userRole === 'CSR'}
        alignItems="center"
        colorScheme="blue"
        rightIcon={<AddIcon />}
        onClick={onOpen}
        ml={2}
      >
        {t('crud.create')}
      </Button>
      <Modal onClose={closeModal} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
          <ModalHeader
            title={t('crud.create_object', { obj: t('certificates.device') })}
            right={
              <>
                <SaveButton
                  onClick={form.submitForm}
                  isLoading={form.isSubmitting}
                  isDisabled={!form.isValid || !isConfigurationValid || (!form.dirty && !isConfigurationDirty)}
                />
                <CloseButton ml={2} onClick={closeModal} />
              </>
            }
          />
          <ModalBody>
            {isLoaded ? (
              <CreateSubscriberDeviceForm
                modalProps={{
                  isOpen,
                  onOpen,
                  onClose: closeCancelAndForm,
                }}
                deviceTypes={deviceTypes}
                contacts={contacts}
                locations={locations}
                serviceClasses={serviceClasses}
                subscriberId={subscriberId}
                subscribers={subscribers}
                refresh={refresh}
                formRef={formRef}
                operatorId={operatorId}
                configuration={configuration ?? undefined}
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
    </>
  );
};

CreateSubscriberDeviceModal.defaultProps = defaultProps;

export default CreateSubscriberDeviceModal;
