import * as React from 'react';
import { Alert, Box, Flex, FormControl, FormLabel, Link, Select, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { RrmAlgorithm } from 'hooks/Network/Rrm';
import { InfoPopover } from 'components/InfoPopover';

type Props = {
  algorithms?: RrmAlgorithm[];
  setValue: React.Dispatch<React.SetStateAction<RrmAlgorithm | undefined>>;
  value?: RrmAlgorithm;
  isDisabled?: boolean;
};
const AlgorithmPicker = ({ algorithms, value, setValue, isDisabled }: Props) => {
  const { t } = useTranslation();
  const options = algorithms?.map((p) => ({ label: p.name, value: p.shortName })) ?? [];

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const algo = algorithms?.find((p) => p.shortName === e.target.value);
    if (algo) setValue(algo);
  };

  if (!algorithms || algorithms.length === 0 || !value) {
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
    <FormControl isRequired w="unset">
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {t('rrm.algorithm')}
      </FormLabel>
      <Flex>
        <Select
          value={value?.shortName}
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
            title={value.name}
            popoverContentProps={{ w: '400px' }}
            buttonProps={{ 'aria-label': 'Info', mt: 1, ml: 2, colorScheme: 'gray' }}
          >
            <Box>
              <Text>{value.description}</Text>
              <Text display="flex">
                {t('common.details')}:
                <Link href={value.helper} isExternal ml={1}>
                  {value.helper}
                </Link>
              </Text>
            </Box>
          </InfoPopover>
        )}
      </Flex>
    </FormControl>
  );
};

export default AlgorithmPicker;
