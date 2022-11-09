import * as React from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { Pen } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { ACCEPTED_CONFIGURATION_OVERRIDES, ConfigurationOverride } from 'hooks/Network/ConfigurationOverride';
import useFastField from 'hooks/useFastField';

type Props = {
  override: ConfigurationOverride;
  isDisabled?: boolean;
};

const EditOverrideForm = ({ override, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newReason, setNewReason] = React.useState(override.reason);
  const [newValue, setNewValue] = React.useState(override.parameterValue);
  const { value, onChange } = useFastField<ConfigurationOverride[] | undefined>({ name: 'overrides' });

  const overrides: ConfigurationOverride[] = value || [];

  const handleReasonChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReason(e.target.value);
  }, []);

  const handleValueChange = React.useCallback((v: string | number) => {
    setNewValue(v as string);
  }, []);

  const endName = override.parameterName.split('.').pop();

  const error = React.useMemo(() => {
    if (endName) {
      let test;
      if (endName === 'channel') {
        test = ACCEPTED_CONFIGURATION_OVERRIDES.radios.channel.test;
      } else if (endName === 'tx-power') {
        test = ACCEPTED_CONFIGURATION_OVERRIDES.radios['tx-power'].test;
      }
      // @ts-ignore
      const res = test ? test(newValue as number) : undefined;
      return res ? t(res) : undefined;
    }
    return undefined;
  }, [newValue, endName]);

  const onUpdateOverride = React.useCallback(() => {
    const newOverrides = overrides.map((curr) => {
      if (curr.parameterName !== override.parameterName || curr.source !== override.source) return curr;
      return {
        ...curr,
        reason: newReason,
        parameterValue: newValue.toString(),
      } as ConfigurationOverride;
    });

    onChange(newOverrides);
    onClose();
  }, [overrides, newReason, newValue]);

  React.useEffect(() => {
    setNewValue(override.parameterValue);
    setNewReason(override.reason);
  }, [override]);

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <Tooltip hasArrow label={t('crud.edit')} placement="top" isDisabled={isOpen}>
        <Box>
          <PopoverTrigger>
            <IconButton
              aria-label="edit-device"
              colorScheme="blue"
              icon={<Pen size={20} />}
              size="sm"
              isDisabled={isDisabled}
            />
          </PopoverTrigger>
        </Box>
      </Tooltip>
      <PopoverContent w="340px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          {t('crud.edit')} {override.parameterName}
        </PopoverHeader>
        <PopoverBody>
          <Box>
            <FormControl mb={2}>
              <FormLabel mb={0}>{t('overrides.parameter')}</FormLabel>
              <Heading size="sm" mt={0} mb={0}>
                {override.parameterName}
              </Heading>
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>{t('overrides.value')}</FormLabel>
              {endName === 'channel' && (
                <Select
                  name="value"
                  value={newValue as string}
                  onChange={(e) => handleValueChange(e.target.value)}
                  w="100px"
                >
                  {ACCEPTED_CONFIGURATION_OVERRIDES.radios.channel.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              )}
              {endName === 'tx-power' && (
                <InputGroup>
                  <NumberInput
                    allowMouseWheel
                    value={newValue as string | number}
                    name="value"
                    onChange={(_, v) => handleValueChange(Number.isNaN(v) ? 0 : v)}
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
            <FormControl isInvalid={newReason.length > 64}>
              <FormLabel>{t('overrides.reason')}</FormLabel>
              <Textarea name="reason" value={newReason} onChange={handleReasonChange} noOfLines={2} />
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
              onClick={onUpdateOverride}
              isDisabled={error !== undefined || newReason.length > 64}
            >
              {t('common.save')}
            </Button>
          </Center>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default EditOverrideForm;
