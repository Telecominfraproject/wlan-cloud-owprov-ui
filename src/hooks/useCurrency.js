import { useMemo } from 'react';
import currencies from 'currency-codes/data';

const useCurrency = () => {
  const toReturn = useMemo(
    () => ({
      currencies,
      selectOptions: currencies.map(({ code }) => ({
        value: code,
        label: code,
      })),
    }),
    [],
  );

  return toReturn;
};

export default useCurrency;
