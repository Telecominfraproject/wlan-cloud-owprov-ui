import { PageInfo } from 'models/Table';
import { useMemo, useState } from 'react';
import { UseQueryResult } from 'react-query';

interface Props {
  useCount: (props: unknown) => UseQueryResult;
  useGet: (props: unknown) => UseQueryResult;
  countParams?: Record<string, unknown>;
  getParams?: Record<string, unknown>;
}
const useControlledTable = ({ useCount, useGet, countParams = {}, getParams = {} }: Props) => {
  const [pageInfo, setPageInfo] = useState<PageInfo | undefined>(undefined);

  const { data: count, isFetching: isFetchingCount, refetch: refetchCount } = useCount(countParams);
  const {
    data,
    isFetching: isFetchingData,
    refetch: refetchData,
  } = useGet({
    pageInfo,
    enabled: pageInfo !== null,
    count,
    ...getParams,
  });

  const toReturn = useMemo(
    () =>
      ({
        count,
        data,
        isFetching: isFetchingCount || isFetchingData,
        refetchCount,
        refetchData,
        pageInfo,
        setPageInfo,
      } as {
        count: number;
        data: Record<string, unknown>[];
        isFetching: boolean;
        setPageInfo: React.Dispatch<React.SetStateAction<PageInfo | undefined>>;
        refetchCount: () => void;
      }),
    [count, data, isFetchingCount, isFetchingData],
  );

  return toReturn;
};

export default useControlledTable;
