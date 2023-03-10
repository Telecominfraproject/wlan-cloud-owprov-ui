import * as React from 'react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { DEFAULT_RRM_CRON, RRM_VALUE } from './helper';
import { RrmProviderCompleteInformation } from 'hooks/Network/Rrm';

type Props = {
  value: 'custom' | 'no' | 'inherit';
  onChange: (v: RRM_VALUE) => void;
  providers?: RrmProviderCompleteInformation[];
  isDisabled?: boolean;
};

const RrmTypePicker = ({ value, onChange, providers, isDisabled }: Props) => {
  const { t } = useTranslation();

  const options = [
    { label: t('common.custom'), value: 'custom' },
    { label: t('common.no'), value: 'no' },
    { label: t('common.inherit'), value: 'inherit' },
  ];

  const onRrmTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'custom' && providers?.[0]) {
      onChange({
        vendor: providers?.[0]?.rrm.vendorShortname ?? '',
        schedule: DEFAULT_RRM_CRON,
        algorithms: [
          {
            name: providers?.[0]?.algorithms?.[0]?.shortName ?? '',
            parameters: '',
          },
        ],
      });
    } else if (e.target.value === 'no' || e.target.value === 'inherit') {
      onChange(e.target.value);
    } else {
      onChange('no');
    }
  };

  return (
    <FormControl isRequired w="unset" mr={2}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {t('common.mode')}
      </FormLabel>
      <Select
        value={value}
        onChange={onRrmTypeChange}
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
  );
};

export default RrmTypePicker;
