import * as React from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  InputGroup,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  PopoverBody,
  PopoverFooter,
  Select,
  FormErrorMessage,
  Textarea,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ACCEPTED_CONFIGURATION_OVERRIDES, ConfigurationOverride } from 'hooks/Network/ConfigurationOverride';

type ConfigurationOverrideForm = {
  startName: 'radios';
  nameIndex: number;
  endName: 'tx-power' | 'channel';
  value: string | number | boolean;
  reason: string;
  source: string;
  parameterType: 'string' | 'integer' | 'boolean';
};

const DEFAULT_VALUE: (role: string) => ConfigurationOverrideForm = (role: string) => ({
  startName: 'radios',
  nameIndex: 0,
  endName: 'channel',
  parameterType: 'string',
  value: '1',
  reason: '',
  source: role,
});

const CreateConfigurationOverrideForm = ({
  userRole,
  onAdd,
  onClose,
  alreadyCreatedNames,
}: {
  userRole: string;
  onAdd: (newOverride: ConfigurationOverride) => void;
  onClose: () => void;
  alreadyCreatedNames: string[];
}) => {
  const { t } = useTranslation();
  const [form, setForm] = React.useState(DEFAULT_VALUE(userRole));

  // To change value, reason or index
  const onBaseChange = React.useCallback(
    (v: string | number | boolean, name: string) => {
      setForm({
        ...form,
        [name]: v,
      });
    },
    [form],
  );
  const onEndNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === 'channel') {
        setForm({
          ...form,
          endName: e.target.value,
          value: ACCEPTED_CONFIGURATION_OVERRIDES.radios.channel.defaultValue,
          parameterType: 'string',
        });
      } else if (e.target.value === 'tx-power') {
        setForm({
          ...form,
          endName: e.target.value,
          value: ACCEPTED_CONFIGURATION_OVERRIDES.radios['tx-power'].defaultValue,
          parameterType: 'integer',
        });
      }
    },
    [form],
  );

  const handleAddClick = () => {
    onAdd({
      source: userRole,
      reason: form.reason,
      parameterName: `${form.startName}.${form.nameIndex}.${form.endName}`,
      parameterType: form.parameterType,
      parameterValue: form.value.toString(),
    } as ConfigurationOverride);
  };

  const error = React.useMemo(() => {
    if (form.value !== undefined && form.startName && form.endName) {
      const test = ACCEPTED_CONFIGURATION_OVERRIDES[form.startName][form.endName]?.test;
      if (test !== undefined) {
        const res = test(form.value as number);
        return res ? t(res) : undefined;
      }
    }
    return undefined;
  }, [form.value]);
  const nameError = React.useMemo(() => {
    if (alreadyCreatedNames.includes(`${form.startName}.${form.nameIndex}.${form.endName}`)) {
      return t('overrides.name_error');
    }
    return undefined;
  }, [form, alreadyCreatedNames]);

  return (
    <>
      <PopoverBody>
        <Box>
          <FormControl isInvalid={nameError !== undefined}>
            <FormLabel>{t('overrides.parameter')}</FormLabel>
            <HStack spacing={1} mb={2}>
              <Select
                value={form.startName}
                name="startName"
                onChange={(e) => onBaseChange(e.target.value, e.target.name)}
                w="120px"
              >
                <option value="radios">radios</option>
              </Select>
              <Select
                value={form.nameIndex}
                name="nameIndex"
                onChange={(e) => onBaseChange(e.target.value, e.target.name)}
                w="80px"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
              <Select w="120px" value={form.endName} name="endName" onChange={onEndNameChange}>
                <option value="channel">channel</option>
                <option value="tx-power">tx-power</option>
              </Select>
            </HStack>
            <FormErrorMessage>{nameError}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={error !== undefined} mb={2}>
            <FormLabel>{t('overrides.value')}</FormLabel>
            {form.endName === 'channel' && (
              <Select
                name="value"
                value={form.value as string}
                onChange={(e) => onBaseChange(e.target.value, e.target.name)}
                w="100px"
              >
                {ACCEPTED_CONFIGURATION_OVERRIDES.radios.channel.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            )}
            {form.endName === 'tx-power' && (
              <InputGroup>
                <NumberInput
                  allowMouseWheel
                  value={form.value as string | number}
                  name="value"
                  onChange={(_, v) => onBaseChange(Number.isNaN(v) ? 0 : v, 'value')}
                  borderRadius="15px"
                  fontSize="sm"
                  w="80px"
                  _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
                >
                  <NumberInputField border="2px solid" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
            )}
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={form.reason.length > 64}>
            <FormLabel>{t('overrides.reason')}</FormLabel>
            <Textarea
              name="reason"
              value={form.reason}
              onChange={(e) => onBaseChange(e.target.value, e.target.name)}
              noOfLines={2}
            />
            <FormErrorMessage>{t('overrides.reason_error')}</FormErrorMessage>
          </FormControl>
        </Box>
      </PopoverBody>
      <PopoverFooter>
        <Center>
          <Button colorScheme="gray" mr="1" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            colorScheme="blue"
            ml="1"
            onClick={handleAddClick}
            isDisabled={nameError !== undefined || error !== undefined || form.reason.length > 64}
          >
            {t('common.save')}
          </Button>
        </Center>
      </PopoverFooter>
    </>
  );
};

export default CreateConfigurationOverrideForm;
