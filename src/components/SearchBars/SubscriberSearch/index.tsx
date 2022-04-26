import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Input, Select as ChakraSelect } from '@chakra-ui/react';
import useWebSocket from 'hooks/useWebSocket';
import { Subscriber } from 'models/Subscriber';

interface Props {
  operatorId: string;
  setResults: Dispatch<SetStateAction<Subscriber[]>>;
}

const SubscriberSearch: React.FC<Props> = ({ operatorId, setResults }) => {
  const { t } = useTranslation();
  const [paramKey, setParamKey] = useState<'emailSearch' | 'nameSearch'>('emailSearch');
  const { results, onInputChange, isConnected, resetSearch } = useWebSocket({
    command: 'subuser_search',
    operatorId,
    paramKey,
    minLength: 2,
  });
  const onParamKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetSearch();
    if (e) setParamKey(e.target.value as 'emailSearch' | 'nameSearch');
  };

  const onChange = (v: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(v.target.value);
  };

  useEffect(() => {
    setResults(results as Subscriber[]);
  }, [results]);

  return (
    <Flex>
      <Input type="text" onChange={onChange} isDisabled={!isConnected} borderRadius={0} />
      <ChakraSelect value={paramKey} onChange={onParamKeyChange} w="140px" background="gray" borderRadius={0}>
        <option value="emailSearch">{t('common.email')}</option>
        <option value="nameSearch">{t('common.name')}</option>
      </ChakraSelect>
    </Flex>
  );
};

export default React.memo(SubscriberSearch);
