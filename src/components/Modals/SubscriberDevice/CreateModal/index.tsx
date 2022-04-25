import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, Center, Spinner } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import { useAuth } from 'contexts/AuthProvider';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import useFormRef from 'hooks/useFormRef';
import useFormModal from 'hooks/useFormModal';
import useOperatorChildren from 'hooks/useOperatorChildren';
import useNestedConfigurationForm from 'hooks/useNestedConfigurationForm';
import { Configuration } from 'models/Configuration';
import { Device, EditDevice } from 'models/Device';
import useMutationResult from 'hooks/useMutationResult';
import { useCreateSubscriberDevice } from 'hooks/Network/SubscriberDevices';
import StepButton from 'components/Buttons/StepButton';
import CreateSubscriberDeviceStep0 from './MultiStepForm/Step0';
import CreateSubscriberDeviceStep1 from './MultiStepForm/Step1';
import CreateSubscriberDeviceStep2 from './MultiStepForm/Step2';
import CreateSubscriberDeviceStep3 from './MultiStepForm/Step3';

const defaultConfiguration: Configuration[] = [];

interface Props {
  refresh: () => void;
  operatorId: string;
  subscriberId?: string;
  devices: Device[];
}
const defaultProps = {
  subscriberId: '',
};

const CreateSubscriberDeviceModal: React.FC<Props> = ({ refresh, operatorId, subscriberId, devices }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isLoaded, deviceTypes, serviceClasses, subscribers } = useOperatorChildren({
    operatorId,
  });
  const { form, formRef } = useFormRef();
  const { isOpen, isConfirmOpen, onOpen, closeConfirm, closeModal, closeCancelAndForm } = useFormModal({
    isDirty: form?.dirty,
  });
  const {
    data: { configuration, isValid: isConfigurationValid },
    onChange: onConfigurationChange,
  } = useNestedConfigurationForm({ defaultConfiguration });
  const { onSuccess, onError } = useMutationResult({
    objName: t('devices.one'),
    operationType: 'create',
    refresh,
    onClose: closeCancelAndForm,
  });
  const create = useCreateSubscriberDevice();
  const [step, setStep] = useState<number>(0);
  const [data, setData] = useState<Record<string, unknown>>({ operatorId });

  const submit = (finalData: Record<string, unknown>) => {
    create.mutateAsync(
      {
        ...finalData,
        configuration: configuration ?? [],
      } as EditDevice,
      {
        onSuccess: () => {
          onSuccess({});
        },
        onError: (e) => {
          onError(e, {});
        },
      },
    );
  };

  const finishStep = (newData: Record<string, unknown>) => {
    const finalData = { ...data, ...newData };
    setData(finalData);
    if (step === 3) {
      submit(finalData);
    }
    setStep(step + 1);
  };

  const resetStep = () => {
    setData({ operatorId });
    setStep(0);
  };

  const contactSuggestions = useMemo(
    () => devices.map(({ serialNumber, contact }) => ({ serialNumber, contact })),
    [devices],
  );
  const locationSuggestions = useMemo(
    () => devices.map(({ serialNumber, location }) => ({ serialNumber, location })),
    [devices],
  );

  useEffect(() => {
    if (!isOpen) resetStep();
  }, [isOpen]);

  const formStep = useMemo(() => {
    if (step === 0)
      return (
        <CreateSubscriberDeviceStep0
          formRef={formRef}
          finishStep={finishStep}
          serviceClasses={serviceClasses}
          subscribers={subscribers ?? []}
          subscriberId={subscriberId}
        />
      );
    if (step === 1)
      return (
        <CreateSubscriberDeviceStep1
          formRef={formRef}
          finishStep={finishStep}
          deviceTypes={deviceTypes}
          onConfigurationChange={onConfigurationChange}
        />
      );
    if (step === 2)
      return (
        <CreateSubscriberDeviceStep2
          formRef={formRef}
          finishStep={finishStep}
          locationSuggestions={locationSuggestions}
        />
      );
    if (step === 3)
      return (
        <CreateSubscriberDeviceStep3
          formRef={formRef}
          finishStep={finishStep}
          contactSuggestions={contactSuggestions}
        />
      );
    return null;
  }, [data, step, subscribers, serviceClasses, deviceTypes]);

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
                <StepButton
                  onNext={form.submitForm}
                  currentStep={step}
                  lastStep={3}
                  isLoading={form.isSubmitting || create.isLoading}
                  isDisabled={!form.isValid || !isConfigurationValid}
                />
                <CloseButton ml={2} onClick={closeModal} />
              </>
            }
          />
          <ModalBody>
            {isLoaded ? (
              formStep
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
