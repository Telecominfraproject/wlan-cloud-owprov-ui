import * as React from 'react';
import { Button, FormControl, FormErrorMessage, FormLabel, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import useFastField from 'hooks/useFastField';
import { useGetRrmAlgorithms, useGetRrmProvider } from 'hooks/Network/Rrm';
import EditRrmForm from './Form';

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
    if (!value || value === 'inherit') return t('common.inherit');
    if (value === 'no') return t('common.none');
    const [, algo] = value.split(':');

    return algo ?? 'Unrecognized RRM';
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
