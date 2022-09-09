import useFastField from 'hooks/useFastField';
import React, { useEffect } from 'react';

const Rates = ({ namePrefix }: { namePrefix: string }) => {
  const { value, onChange } = useFastField({ name: `${namePrefix}.rates` });

  useEffect(() => {
    if (value && Object.keys(value).length === 0) {
      onChange(undefined);
    }
  }, [value]);

  return null;
};

export default React.memo(Rates);
