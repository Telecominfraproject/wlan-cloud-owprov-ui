import * as React from 'react';
import {
  Alert,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Link,
  Select,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { InfoPopover } from 'components/InfoPopover';
import { RrmAlgorithm } from 'hooks/Network/Rrm';
import { areRrmParamsValid } from './helper';

type Props = {
  algorithms?: RrmAlgorithm[];
  setValue: (v: string) => void;
  onParamsChange: (v: string) => void;
  value?: { name: string; parameters: string }[];
  isDisabled?: boolean;
};
const AlgorithmPicker = ({ algorithms, value, setValue, isDisabled, onParamsChange }: Props) => {
  const { t } = useTranslation();
  const options = algorithms?.map((p) => ({ label: p.name, value: p.shortName })) ?? [];
  const mainAlgorithm = value?.[0];
  const details = algorithms?.find((a) => a.shortName === mainAlgorithm?.name);

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };
  const onAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onParamsChange(e.target.value);
  };

  if (!algorithms || algorithms.length === 0 || !mainAlgorithm) {
    return (
      <FormControl isRequired w="unset" mr={2}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
          {t('rrm.algorithm')}
        </FormLabel>
        <Alert status="error">{t('rrm.no_algos')}</Alert>
      </FormControl>
    );
  }

  return (
    <>
      <FormControl isRequired w="unset">
        <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
          {t('rrm.algorithm')}
        </FormLabel>
        <Flex>
          <Select
            value={mainAlgorithm.name}
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
          {value && (
            <InfoPopover
              title={details?.name ?? ''}
              popoverContentProps={{ w: '400px' }}
              buttonProps={{ 'aria-label': 'Info', mt: 1, ml: 2, colorScheme: 'gray' }}
            >
              <Box>
                <Text>{details?.description}</Text>
                <Text display="flex">
                  {t('common.details')}:
                  <Link href={details?.helper} isExternal ml={1}>
                    {details?.helper}
                  </Link>
                </Text>
              </Box>
            </InfoPopover>
          )}
        </Flex>
      </FormControl>
      <Box mt={2}>
        <FormControl w="unset" isInvalid={!areRrmParamsValid(mainAlgorithm.parameters, details?.parameterFormat)}>
          <FormLabel ms="4px" mb={0} fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
            {t('rrm.parameters')}
          </FormLabel>
          <FormHelperText ms="4px" mt={1}>
            Examples: {details?.parameterSamples}
          </FormHelperText>
          <Textarea value={mainAlgorithm.parameters} onChange={onAreaChange} isDisabled={isDisabled} />
          <FormErrorMessage>{t('rrm.param_error')}</FormErrorMessage>
        </FormControl>
      </Box>
    </>
  );
};

export default AlgorithmPicker;
