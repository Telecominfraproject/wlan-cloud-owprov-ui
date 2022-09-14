import * as React from 'react';
import {
  Alert,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Link,
  Select,
  Text,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { Trash } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { RrmAlgorithm } from 'hooks/Network/Rrm';
import { InfoPopover } from 'components/InfoPopover';
import { areRrmParamsValid } from './helper';

type Props = {
  algorithms?: RrmAlgorithm[];
  value: { name: string; parameters: string };
  onChange: (v: { name: string; parameters: string }) => void;
  onRemove: () => void;
  isDisabled?: boolean;
  options: {
    label: string;
    value: string;
  }[];
};

const AlgorithmPicker = ({ algorithms, value, onChange, onRemove, isDisabled, options }: Props) => {
  const { t } = useTranslation();
  const details = algorithms?.find((a) => a.shortName === value.name);

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ name: e.target.value, parameters: value.parameters });
  };
  const onAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ name: value.name, parameters: e.target.value });
  };

  if (!algorithms || algorithms.length === 0 || !details) {
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
      <Flex>
        <Select
          value={value.name}
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
        {details && (
          <InfoPopover
            title={details.name ?? ''}
            popoverContentProps={{ w: '400px' }}
            buttonProps={{ 'aria-label': 'Info', mt: 1, ml: 2, colorScheme: 'gray' }}
          >
            <Box>
              <Text>{details.description}</Text>
              <Text display="flex">
                {t('common.details')}:
                <Link href={details.helper} isExternal ml={1}>
                  {details.helper}
                </Link>
              </Text>
            </Box>
          </InfoPopover>
        )}
        <Tooltip label={t('crud.delete')}>
          <IconButton
            aria-label={t('crud.delete')}
            ml={2}
            size="sm"
            colorScheme="red"
            onClick={onRemove}
            icon={<Trash size={20} />}
            mt={1}
          />
        </Tooltip>
      </Flex>
      <Box mt={2} mb={4}>
        <FormControl w="unset" isInvalid={!areRrmParamsValid(value.parameters, details?.parameterFormat)}>
          <FormLabel ms="4px" mb={0} fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
            {t('rrm.parameters')}
          </FormLabel>
          <FormHelperText ms="4px" mt={1}>
            Examples: {details?.parameterSamples}
          </FormHelperText>
          <Textarea value={value.parameters} onChange={onAreaChange} isDisabled={isDisabled} />
          <FormErrorMessage>{t('rrm.param_error')}</FormErrorMessage>
        </FormControl>
      </Box>
    </>
  );
};

export default AlgorithmPicker;
