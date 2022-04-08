import React, { useMemo } from 'react';
import { v4 as uuid } from 'uuid';

const useSelectOptions = ({ values, selected }) => {
  const toReturn = useMemo(
    () =>
      values.map((v) =>
        v.value !== selected ? (
          <option key={uuid()} value={v.value}>
            {v.label}
          </option>
        ) : (
          <option key={uuid()} value={v.value}>
            {v.value}
          </option>
        ),
      ),
    [values, selected],
  );

  return toReturn;
};

export default useSelectOptions;
