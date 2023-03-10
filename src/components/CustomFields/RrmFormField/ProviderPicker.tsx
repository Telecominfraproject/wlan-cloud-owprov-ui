import * as React from 'react';
import { Alert, Box, Flex, FormControl, FormLabel, Link, Select, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { DEFAULT_RRM_CRON, RRM_VALUE } from './helper';
import { InfoPopover } from 'components/InfoPopover';
import { RrmProviderCompleteInformation } from 'hooks/Network/Rrm';

type Props = {
  setValue: (v: RRM_VALUE) => void;
  value?: string;
  isDisabled?: boolean;
  providers?: RrmProviderCompleteInformation[];
};

const RrmProviderPicker = ({ providers, value, setValue, isDisabled }: Props) => {
  const { t } = useTranslation();
  const options = providers?.map((p) => ({ label: p.rrm.vendor, value: p.rrm.vendorShortname })) ?? [];

  const provider = providers?.find((p) => p.rrm.vendorShortname === value);

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = providers?.find((p) => p.rrm.vendorShortname === e.target.value);
    if (found) {
      setValue({
        vendor: found.rrm.vendorShortname ?? '',
        schedule: DEFAULT_RRM_CRON,
        algorithms: [
          {
            name: found.algorithms?.[0]?.shortName ?? '',
            parameters: '',
          },
        ],
      });
    }
  };

  if (providers?.length === 0 || !value || !providers) {
    return (
      <FormControl isRequired w="unset" mr={2}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
          {t('rrm.vendor')}
        </FormLabel>
        <Alert status="error">{t('rrm.no_providers')}</Alert>
      </FormControl>
    );
  }

  return (
    <FormControl isRequired w="unset" mr={2}>
      <FormLabel ms="4px" fontSize="md" fontWeight="bold" _disabled={{ opacity: 0.8 }}>
        {t('rrm.vendor')}
      </FormLabel>
      <Flex>
        <Select
          value={value}
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
            title={provider?.vendor ?? ''}
            popoverContentProps={{ w: '400px' }}
            buttonProps={{ 'aria-label': 'Info', mt: 1, ml: 2, colorScheme: 'gray' }}
          >
            <Box>
              <Text display="flex">
                {t('rrm.version')}: {provider?.rrm.version}
              </Text>
              <Text display="flex">
                {t('common.details')}:
                {provider?.rrm.about.includes('http') ? (
                  <Link href={provider?.rrm.about} isExternal ml={1}>
                    {provider?.rrm.about}
                  </Link>
                ) : (
                  <Text ml={1} fontWeight="bold">
                    {provider?.rrm.about}
                  </Text>
                )}
              </Text>
            </Box>
          </InfoPopover>
        )}
      </Flex>
    </FormControl>
  );
};

export default RrmProviderPicker;
