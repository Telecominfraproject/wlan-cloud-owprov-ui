import { useToast } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useFreeTable = ({ useGet, params }) => {
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
