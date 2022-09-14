import * as React from 'react';
import { Alert, Box, Button, Center, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RrmAlgorithm } from 'hooks/Network/Rrm';
import AlgorithmPicker from './AlgorithmPicker';

type Props = {
  algorithms?: RrmAlgorithm[];
  setValue: (v: { name: string; parameters: string }[]) => void;
  value?: { name: string; parameters: string }[];
  isDisabled?: boolean;
};

const DeviceRulesAlgorithms = ({ algorithms, value, setValue, isDisabled }: Props) => {
  const { t } = useTranslation();
  const options = algorithms?.map((p) => ({ label: p.name, value: p.shortName })) ?? [];

  const onAlgoChange = (index: number) => (newAlgo: { name: string; parameters: string }) => {
    const newValues = value ? [...value] : [];
    if (newValues[index]) {
      newValues[index] = newAlgo;
      setValue(newValues);
    }
  };
  const onAdd = () => {
    if (algorithms?.[0]) {
      const newValues = value ? [...value] : [];
      newValues.push({ name: algorithms[0].shortName, parameters: '' });
      setValue([...newValues]);
    }
  };
  const onRemoveAlgo = (index: number) => () => {
    const newValues = value ? [...value] : [];
    newValues.splice(index, 1);
    setValue(newValues);
  };

  if (!algorithms || algorithms.length === 0 || !value) {
    return (
      <>
        <Heading size="sm">{t('rrm.algorithm_other')}</Heading>
        <Alert status="error">{t('rrm.no_algos')}</Alert>
      </>
    );
  }

  return (
    <Box>
      <Heading size="sm" mb={2}>
        {t('rrm.algorithm_other')}
      </Heading>
      {value?.map((algo, index) => (
        <AlgorithmPicker
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          algorithms={algorithms}
          value={algo}
          onChange={onAlgoChange(index)}
          onRemove={onRemoveAlgo(index)}
          isDisabled={isDisabled}
          options={options}
        />
      ))}
      <Center>
        <Button onClick={onAdd} mb={2}>
          {t('crud.add')} {t('rrm.algorithm')}
        </Button>
      </Center>
    </Box>
  );
};

export default DeviceRulesAlgorithms;
