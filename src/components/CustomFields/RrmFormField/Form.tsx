import * as React from 'react';
import { Alert, Box, Flex, UseDisclosureReturn } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import DeviceRulesAlgorithms from './Algorithms';
import { CUSTOM_RRM, isCustomRrm, isValidCustomRrm, RRM_VALUE } from './helper';
import RrmProviderPicker from './ProviderPicker';
import RrmScheduler from './Scheduler';
import RrmTypePicker from './TypePicker';
import SaveButton from 'components/Buttons/SaveButton';
import { Modal } from 'components/Modals/Modal';
import { RrmProviderCompleteInformation } from 'hooks/Network/Rrm';

const extractValueFromProps: (value: unknown) => RRM_VALUE = (value: unknown) => {
  try {
    const json = typeof value === 'string' ? JSON.parse(value) : value;
    if (json) {
      // @ts-ignore
      if (json.algorithms && json.algorithms.length > 0 && json.vendor && json.schedule) {
        const val = json as CUSTOM_RRM;
        const splitSchedule = val.schedule.split(' ');
        return { ...val, schedule: splitSchedule.splice(1, 5).join(' ') } as CUSTOM_RRM;
      }
    }

    if (value === 'inherit') return 'inherit';

    return 'no';
  } catch (e) {
    if (value === 'inherit') return 'inherit';

    return 'no';
  }
};

type Props = {
  modalProps: UseDisclosureReturn;
  value: unknown;
  onChange: (v: RRM_VALUE) => void;
  providers?: RrmProviderCompleteInformation[];
  isDisabled?: boolean;
};

const EditRrmForm = ({ value, modalProps, onChange, providers, isDisabled }: Props) => {
  const { t } = useTranslation();
  const [newValue, setNewValue] = React.useState<RRM_VALUE>(extractValueFromProps(value));

  const isCustom = isCustomRrm(newValue);

  const onAlgoChange = (v: { name: string; parameters: string }[]) => {
    if (isCustomRrm(newValue)) setNewValue({ ...newValue, algorithms: v });
  };
  const onScheduleChange = (schedule: string) => {
    if (isCustomRrm(newValue)) setNewValue({ ...newValue, schedule });
  };

  const onSave = () => {
    if (isCustomRrm(newValue)) {
      onChange({ ...newValue, schedule: `0 ${newValue.schedule}` });
    } else {
      onChange(newValue);
    }
    modalProps.onClose();
  };

  const isValid = React.useMemo(() => {
    if (newValue === 'no' || newValue === 'inherit') {
      return true;
    }
    return isValidCustomRrm(newValue);
  }, [newValue]);

  React.useEffect(() => {
    if (modalProps.isOpen) {
      setNewValue(extractValueFromProps(value));
    }
  }, [modalProps.isOpen]);

  return (
    <Modal
      title="RRM"
      isOpen={modalProps.isOpen}
      onClose={modalProps.onClose}
      topRightButtons={
        <Box mr={2}>
          <SaveButton isCompact onClick={onSave} isDisabled={isDisabled || !isValid || (isCustom && !providers)} />
        </Box>
      }
      options={{
        modalSize: 'sm',
      }}
    >
      <Box>
        {isCustom && !providers && <Alert status="error">{t('rrm.cant_save_custom')}</Alert>}
        <Flex mb={2}>
          <RrmTypePicker
            value={isCustom ? 'custom' : newValue}
            onChange={setNewValue}
            providers={providers}
            isDisabled={isDisabled}
          />
        </Flex>
        {isCustomRrm(newValue) && (
          <>
            <Flex my={1}>
              <RrmProviderPicker
                providers={providers ?? []}
                value={newValue.vendor}
                setValue={setNewValue}
                isDisabled={isDisabled}
              />
            </Flex>
            <Box my={1}>
              <DeviceRulesAlgorithms
                algorithms={providers?.find((p) => p.rrm.vendorShortname === newValue.vendor)?.algorithms ?? []}
                value={newValue.algorithms}
                setValue={onAlgoChange}
                isDisabled={isDisabled || !providers}
              />
            </Box>
            <Flex my={1}>
              <RrmScheduler
                value={newValue.schedule}
                setValue={onScheduleChange}
                isDisabled={isDisabled || !providers}
              />
            </Flex>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default EditRrmForm;
