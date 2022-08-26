import * as React from 'react';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Textarea } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RrmAlgorithm } from 'hooks/Network/Rrm';
import { areRrmParamsValid } from './helper';

type Props = {
  algorithm?: RrmAlgorithm;
  value?: string;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  isDisabled?: boolean;
};
const RrmParameters = ({ algorithm, value, setValue, isDisabled }: Props) => {
  const { t } = useTranslation();
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <FormControl w="unset" isInvalid={!areRrmParamsValid(value, algorithm?.parameterFormat)}>
      <FormLabel ms="4px" mb={0} fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {t('rrm.parameters')}
      </FormLabel>
      <FormHelperText ms="4px" mt={1}>
        Examples: {algorithm?.parameterSamples}
      </FormHelperText>
      <Textarea value={value} onChange={onChange} isDisabled={isDisabled} />
      <FormErrorMessage>{t('rrm.param_error')}</FormErrorMessage>
    </FormControl>
  );
};

export default RrmParameters;
