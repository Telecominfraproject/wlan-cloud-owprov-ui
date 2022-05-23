import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Input, Select as ChakraSelect } from '@chakra-ui/react';
import { Subscriber } from 'models/Subscriber';
import useSubscriberSearch from 'contexts/WebSocketProvider/hooks/Commands/useSubscriberSearch';

interface Props {
  operatorId: string;
  setResults: Dispatch<SetStateAction<Subscriber[]>>;
}

const SubscriberSearch: React.FC<Props> = ({ operatorId, setResults }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'emailSearch' | 'nameSearch'>('emailSearch');
  const { results, onInputChange, isOpen, resetSearch } = useSubscriberSearch({
    minLength: 2,
    mode,
    operatorId,
  });

  const onParamKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetSearch();
    if (e) setMode(e.target.value as 'emailSearch' | 'nameSearch');
  };

  const onChange = (v: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(v.target.value);
  };

  useEffect(() => {
    setResults(results as Subscriber[]);
  }, [results]);

  return (
    <Flex>
      <Input type="text" onChange={onChange} isDisabled={!isOpen} borderRadius={0} />
      <ChakraSelect value={mode} onChange={onParamKeyChange} w="140px" background="gray" borderRadius={0}>
        <option value="emailSearch">{t('common.email')}</option>
        <option value="nameSearch">{t('common.name')}</option>
      </ChakraSelect>
    </Flex>
  );
};

export default React.memo(SubscriberSearch);
