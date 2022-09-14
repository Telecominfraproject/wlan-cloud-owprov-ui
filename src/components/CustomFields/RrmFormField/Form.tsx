import * as React from 'react';
import { Alert, Box, Flex, FormControl, FormLabel, Select, UseDisclosureReturn } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { RrmAlgorithm, RrmProvider } from 'hooks/Network/Rrm';
import SaveButton from 'components/Buttons/SaveButton';
import { Modal } from 'components/Modals/Modal';
import DeviceRulesAlgorithms from './Algorithms';
import { CUSTOM_RRM, DEFAULT_RRM_CRON, isCustomRrm, isValidCustomRrm, RRM_VALUE } from './helper';
import RrmProviderPicker from './ProviderPicker';
import RrmScheduler from './Scheduler';

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
  algorithms?: RrmAlgorithm[];
  provider?: RrmProvider;
  isDisabled?: boolean;
};

const EditRrmForm = ({ value, modalProps, onChange, algorithms, provider, isDisabled }: Props) => {
  const { t } = useTranslation();
  const [newValue, setNewValue] = React.useState<RRM_VALUE>(extractValueFromProps(value));

  const options = [
    { label: t('common.custom'), value: 'custom' },
    { label: t('common.no'), value: 'no' },
    { label: t('common.inherit'), value: 'inherit' },
  ];

  const isCustom = isCustomRrm(newValue);

  const onVendorChange = (vendor: string) => {
    if (isCustomRrm(newValue)) setNewValue({ ...newValue, vendor });
  };
  const onAlgoChange = (v: { name: string; parameters: string }[]) => {
    if (isCustomRrm(newValue)) setNewValue({ ...newValue, algorithms: v });
  };
  const onScheduleChange = (schedule: string) => {
    if (isCustomRrm(newValue)) setNewValue({ ...newValue, schedule });
  };

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'custom') {
      setNewValue({
        vendor: provider?.vendorShortname ?? '',
        schedule: DEFAULT_RRM_CRON,
        algorithms: [
          {
            name: algorithms?.[0]?.shortName ?? '',
            parameters: '',
          },
        ],
      });
    } else if (e.target.value === 'no' || e.target.value === 'inherit') {
      setNewValue(e.target.value);
    }
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
          <SaveButton
            isCompact
            onClick={onSave}
            isDisabled={isDisabled || !isValid || (isCustom && (!provider || !algorithms))}
          />
        </Box>
      }
      options={{
        modalSize: 'sm',
      }}
    >
      <Box>
        {isCustom && (!provider || !algorithms) && <Alert status="error">{t('rrm.cant_save_custom')}</Alert>}
        <Flex mb={2}>
          <FormControl isRequired w="unset" mr={2}>
            <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
              {t('common.mode')}
            </FormLabel>
            <Select
              value={isCustom ? 'custom' : newValue}
              onChange={onSelectChange}
              borderRadius="15px"
              fontSize="sm"
              _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
              border="2px solid"
              isDisabled={isDisabled}
            >
              {options.map((option) => (
                <option value={option.value} key={uuid()}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </Flex>
        {isCustomRrm(newValue) && (
          <>
            <Flex my={1}>
              <RrmProviderPicker
                providers={provider ? [provider] : []}
                value={newValue.vendor}
                setValue={onVendorChange}
                isDisabled={isDisabled}
              />
            </Flex>
            <Box my={1}>
              <DeviceRulesAlgorithms
                algorithms={algorithms}
                value={newValue.algorithms}
                setValue={onAlgoChange}
                isDisabled={isDisabled || !provider}
              />
            </Box>
            <Flex my={1}>
              <RrmScheduler
                value={newValue.schedule}
                setValue={onScheduleChange}
                isDisabled={isDisabled || !provider}
              />
            </Flex>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default EditRrmForm;
