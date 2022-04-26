import { useToast } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const useControlledTable = ({ useCount, useGet, countParams = {}, getParams = {} }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [pageInfo, setPageInfo] = useState(null);

  const {
    data: count,
    isFetching: isFetchingCount,
    refetch: refetchCount,
  } = useCount({
    t,
    toast,
    ...countParams,
  });
  const {
    data,
    isFetching: isFetchingData,
    refetch: refetchData,
  } = useGet({
    t,
    toast,
    pageInfo,
    enabled: pageInfo !== null,
    count,
    ...getParams,
  });

  const toReturn = useMemo(
    () => ({
      count,
      data,
      isFetching: isFetchingCount || isFetchingData,
      refetchCount,
      refetchData,
      pageInfo,
      setPageInfo,
    }),
    [count, data, isFetchingCount, isFetchingData],
  );

  return toReturn;
};

export default useControlledTable;
