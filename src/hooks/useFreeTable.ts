import { useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const useFreeTable = ({
  useGet,
  params,
}: {
  useGet: (props: unknown) => UseQueryResult;
  params: Record<string, unknown>;
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data, isFetching, refetch } = useGet({
    t,
    toast,
    ...params,
  });

  const toReturn = useMemo(
    () => ({
      data,
      isFetching,
      refetch,
    }),
    [data, isFetching],
  );

  return toReturn;
};

export default useFreeTable;
