import * as React from 'react';
import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { ArrowLeft } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import CreateRadiusEndpointDetailsStep from './DetailsStep';
import CreateRadiusEndpointGlobalReachStep from './GlobalReach/GlobalReachStep';
import CreateRadiusEndpointOrionStep from './GoogleOrion/OrionStep';
import CreateRadiusEndpointRadiusStep from './Radius/RadiusStep';
import CreateRadiusEndpointRadsecStep from './Radsec/RadiusStep';
import CreateButton from 'components/Buttons/CreateButton';
import StepButton from 'components/Buttons/StepButton';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import { Modal } from 'components/Modals/Modal';
import { GlobalReachAccount } from 'hooks/Network/GlobalReach';
import { GoogleOrionAccount } from 'hooks/Network/GoogleOrion';
import { RadiusEndpoint, useCreateRadiusEndpoint } from 'hooks/Network/RadiusEndpoints';
import useFormModal from 'hooks/useFormModal';
import useFormRef from 'hooks/useFormRef';
import { useNotification } from 'hooks/useNotification';

const DEFAULT_DATA = {
  data: {},
  step: 0,
} as const;

type Props = {
  orionAccounts: GoogleOrionAccount[];
  globalReachAccounts: GlobalReachAccount[];
};

const CreateRadiusEndpointModal = ({ orionAccounts, globalReachAccounts }: Props) => {
  const { t } = useTranslation();
  const [data, setData] = React.useState<{
    data: Partial<RadiusEndpoint>;
    step: 0 | 1;
  }>(DEFAULT_DATA);
  const { form, formRef } = useFormRef();
  const onReset = () => {
    setData({ ...DEFAULT_DATA });
  };
  const modal = useFormModal({
    isDirty: form.dirty || Object.keys(data).length > 0,
    onCloseSideEffect() {
      onReset();
    },
  });
  const create = useCreateRadiusEndpoint();
  const { successToast, apiErrorToast } = useNotification();

  const handleNextStep = React.useCallback(
    async (newData: Partial<RadiusEndpoint>) => {
      if (data.step === 0) {
        setData({
          data: {
            ...data.data,
            ...newData,
          },
          step: 1,
        });
      }

      if (data.step === 1) {
        await create.mutateAsync(
          // @ts-ignore
          { ...data.data, ...newData },
          {
            onSuccess: () => {
              successToast({
                description: 'Radius Endpoint created',
              });
              modal.closeCancelAndForm();
            },
            onError: (error) => {
              apiErrorToast({ e: error });
            },
          },
        );
      }
    },
    [data],
  );

  const body = () => {
    if (data.step === 0) {
      return (
        <CreateRadiusEndpointDetailsStep
          formRef={formRef}
          finishStep={handleNextStep}
          orionAccounts={orionAccounts}
          globalReachAccounts={globalReachAccounts}
        />
      );
    }

    const type = data.data.Type ?? 'generic';

    if (type === 'orion') {
      return <CreateRadiusEndpointOrionStep accounts={orionAccounts} formRef={formRef} finishStep={handleNextStep} />;
    }
    if (type === 'globalreach') {
      return (
        <CreateRadiusEndpointGlobalReachStep
          accounts={globalReachAccounts}
          formRef={formRef}
          finishStep={handleNextStep}
        />
      );
    }
    if (type === 'generic') {
      return <CreateRadiusEndpointRadiusStep formRef={formRef} finishStep={handleNextStep} />;
    }

    return <CreateRadiusEndpointRadsecStep formRef={formRef} finishStep={handleNextStep} />;
  };

  return (
    <>
      <CreateButton onClick={modal.onOpen} />
      <Modal
        title="Create Radius Endpoint"
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        topRightButtons={
          <>
            <Tooltip label={t('common.reset')}>
              <IconButton
                aria-label={t('common.reset')}
                onClick={onReset}
                icon={<ArrowLeft size={20} />}
                isDisabled={data.step === 0}
              />
            </Tooltip>
            <StepButton
              onNext={form.submitForm}
              currentStep={data.step}
              lastStep={1}
              isLoading={create.isLoading}
              isDisabled={!form.isValid}
            />
          </>
        }
      >
        <Box>{body()}</Box>
      </Modal>
      <ConfirmCloseAlert isOpen={modal.isConfirmOpen} confirm={modal.closeCancelAndForm} cancel={modal.closeConfirm} />
    </>
  );
};

export default CreateRadiusEndpointModal;
