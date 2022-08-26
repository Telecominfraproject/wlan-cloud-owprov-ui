import * as React from 'react';
import { Alert, Box, Flex, FormControl, FormLabel, Link, Select, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { RrmProvider } from 'hooks/Network/Rrm';
import { InfoPopover } from 'components/InfoPopover';

type Props = {
  providers: RrmProvider[];
  setValue: React.Dispatch<React.SetStateAction<RrmProvider | undefined>>;
  value?: RrmProvider;
  isDisabled?: boolean;
};
const RrmProviderPicker = ({ providers, value, setValue, isDisabled }: Props) => {
  const { t } = useTranslation();
  const options = providers.map((p) => ({ label: p.vendor, value: p.vendorShortname }));

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = providers.find((p) => p.vendorShortname === e.target.value);
    if (provider) setValue(provider);
  };

  if (providers.length === 0 || !value) {
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
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {t('rrm.vendor')}
      </FormLabel>
      <Flex>
        <Select
          value={value?.vendorShortname}
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
            title={value.vendor}
            popoverContentProps={{ w: '400px' }}
            buttonProps={{ 'aria-label': 'Info', mt: 1, ml: 2, colorScheme: 'gray' }}
          >
            <Box>
              <Text display="flex">
                {t('rrm.version')}: {value.version}
              </Text>
              <Text display="flex">
                {t('common.details')}:
                <Link href={value.about} isExternal ml={1}>
                  {value.about}
                </Link>
              </Text>
            </Box>
          </InfoPopover>
        )}
      </Flex>
    </FormControl>
  );
};

export default RrmProviderPicker;
