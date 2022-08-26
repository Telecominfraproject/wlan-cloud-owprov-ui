import * as React from 'react';
import { Alert, Box, Flex, FormControl, FormLabel, Select, UseDisclosureReturn } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Modal } from 'components/Modals/Modal';
import SaveButton from 'components/Buttons/SaveButton';
import { RrmAlgorithm, RrmProvider } from 'hooks/Network/Rrm';
import AlgorithmPicker from './AlgorithmPicker';
import { DEFAULT_RRM_CRON, isValidRrm, parseRrmToParts } from './helper';
import RrmParameters from './Parameters';
import RrmProviderPicker from './ProviderPicker';
import RrmScheduler from './Scheduler';

type Props = {
  modalProps: UseDisclosureReturn;
  value: string;
  onChange: (v: string) => void;
  algorithms?: RrmAlgorithm[];
  provider?: RrmProvider;
  isDisabled?: boolean;
};

const EditRrmForm = ({ value, modalProps, onChange, algorithms, provider, isDisabled }: Props) => {
  const { t } = useTranslation();
  const [newValue, setNewValue] = React.useState(value);
  const [newAlgo, setNewAlgo] = React.useState<RrmAlgorithm | undefined>(undefined);
  const [newProvider, setNewProvider] = React.useState<RrmProvider | undefined>(undefined);
  const [newParams, setNewParams] = React.useState<string | undefined>(undefined);
  const [newSchedule, setNewSchedule] = React.useState<string | undefined>(undefined);

  const options = [
    { label: t('common.custom'), value: 'custom' },
    { label: t('common.no'), value: 'no' },
    { label: t('common.inherit'), value: 'inherit' },
  ];

  const isCustom = newValue !== 'no' && newValue !== 'inherit';

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'custom') {
      setNewValue('custom');
      setNewAlgo(algorithms?.[0] ?? undefined);
      setNewProvider(provider);
      setNewParams('');
      setNewSchedule(DEFAULT_RRM_CRON);
    } else {
      setNewValue(e.target.value);
    }
  };

  const onSave = () => {
    if (newValue === 'no' || newValue === 'inherit') {
      onChange(newValue);
      modalProps.onClose();
    } else {
      const customVal = `${newProvider?.vendorShortname}:${newAlgo?.shortName}:0 ${newSchedule}:${newParams}`;
      onChange(customVal);
      modalProps.onClose();
    }
  };

  const reset = () => {
    setNewAlgo(undefined);
    setNewProvider(undefined);
    setNewParams(undefined);
    setNewSchedule(undefined);
  };

  const isValid = React.useMemo(() => {
    if (newValue === 'no' || newValue === 'inherit') {
      return true;
    }
    return isValidRrm(
      `${newProvider?.vendorShortname}:${newAlgo?.shortName}:0 ${newSchedule}:${newParams}`,
      newAlgo?.parameterFormat,
    );
  }, [newValue, newProvider, newAlgo, newSchedule, newParams]);

  React.useEffect(() => {
    if (modalProps.isOpen) {
      if (value === 'no' || value === 'inherit') {
        setNewValue(value);
        reset();
      } else {
        setNewValue(value);
        const parts = parseRrmToParts(value);
        if (parts) {
          setNewProvider(provider);
          setNewAlgo(algorithms?.find((a) => a.shortName === parts.algorithmShortName));
          setNewParams(parts.parameters);
          setNewSchedule(parts.schedule);
        } else {
          setNewValue('inherit');
        }
      }
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
        {isCustom && (
          <>
            <Flex my={1}>
              <RrmProviderPicker
                providers={provider ? [provider] : []}
                value={newProvider}
                setValue={setNewProvider}
                isDisabled={isDisabled}
              />
            </Flex>
            <Flex my={1}>
              <AlgorithmPicker
                algorithms={algorithms}
                value={newAlgo}
                setValue={setNewAlgo}
                isDisabled={isDisabled || !provider}
              />
            </Flex>
            <Flex my={1}>
              <RrmParameters
                algorithm={newAlgo}
                value={newParams}
                setValue={setNewParams}
                isDisabled={isDisabled || !algorithms}
              />
            </Flex>
            <Flex my={1}>
              <RrmScheduler value={newSchedule} setValue={setNewSchedule} isDisabled={isDisabled || !provider} />
            </Flex>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default EditRrmForm;
