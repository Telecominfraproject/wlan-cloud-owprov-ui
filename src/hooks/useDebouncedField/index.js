import { useCallback, useEffect, useState } from 'react';

const useDebouncedField = ({
  value,
  delay = 300,
  setValue,
  emptyIsUndefined = false,
  valueOnly = false,
  isInt = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [t, setT] = useState(null);

  const onChange = useCallback(
    (e) => {
      if (valueOnly || e?.target?.value !== undefined) {
        let newValue = valueOnly ? e : e.target.value;
        if (emptyIsUndefined && newValue === '') newValue = undefined;
        setLocalValue(isInt ? parseInt(newValue, 10) : newValue);
        if (t) clearTimeout(t);
        setT(setTimeout(() => setValue(isInt ? parseInt(newValue, 10) : newValue), delay));
      }
    },
    [localValue, setValue],
  );

  useEffect(() => {
    if (value !== localValue && !t) {
      setLocalValue(value);
    }
  }, [value, localValue, t]);

  return [localValue, onChange];
};

export default useDebouncedField;
