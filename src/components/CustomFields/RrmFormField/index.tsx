import * as React from 'react';
import { Button, FormControl, FormErrorMessage, FormLabel, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useGetRrmAlgorithms, useGetRrmProvider } from 'hooks/Network/Rrm';
import useFastField from 'hooks/useFastField';
import EditRrmForm from './Form';
import { isCustomRrm } from './helper';

type Props = {
  namePrefix?: string;
  isDisabled?: boolean;
};

const RrmFormField = ({ namePrefix = 'deviceRules', isDisabled }: Props) => {
  const { t } = useTranslation();
  const name = `${namePrefix}.rrm`;
  const { value, isError, error, onChange } = useFastField({ name });
  const modalProps = useDisclosure();
  const { data: provider, isLoading: isLoadingProvider } = useGetRrmProvider();
  const { data: algos, isLoading: isLoadingAlgos } = useGetRrmAlgorithms();

  const displayedValue = React.useMemo(() => {
    try {
      if (!value || value === 'inherit') return t('common.inherit');
      if (value === 'no' || value === 'off') return t('common.none');

      const val = typeof value === 'string' ? JSON.parse(value) : value;
      if (isCustomRrm(val) && val.algorithms[0]) {
        return val.algorithms[0].name;
      }

      return 'Unrecognized RRM';
    } catch {
      return 'Unrecognized RRM';
    }
  }, [value]);

  return (
    <FormControl isInvalid={isError} isRequired isDisabled={isDisabled}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        RRM
      </FormLabel>
      <Button
        variant="link"
        onClick={modalProps.onOpen}
        colorScheme="blue"
        mt={2}
        isLoading={isLoadingProvider || isLoadingAlgos}
      >
        {displayedValue}
      </Button>
      <FormErrorMessage>{error}</FormErrorMessage>
      <EditRrmForm
        value={value}
        modalProps={modalProps}
        onChange={onChange}
        algorithms={algos}
        provider={provider}
        isDisabled={isDisabled}
      />
    </FormControl>
  );
};

export default React.memo(RrmFormField);
