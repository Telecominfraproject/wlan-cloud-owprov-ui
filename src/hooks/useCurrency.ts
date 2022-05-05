import { useMemo } from 'react';
// @ts-ignore
import currencies from 'currency-codes/data';

const useCurrency = () => {
  const toReturn = useMemo(
    () => ({
      currencies,
      selectOptions: currencies.map(({ code }: { code: string }) => ({
        value: code,
        label: code,
      })),
    }),
    [],
  );

  return toReturn;
};

export default useCurrency;
