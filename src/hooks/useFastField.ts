import { useField, useFormikContext } from 'formik';
import { useCallback, useMemo } from 'react';

interface UseFastFieldProps {
  name: string;
}

const useFastField = <Type>({ name }: UseFastFieldProps) => {
  const { setFieldValue } = useFormikContext();
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(name);

  const onChange = useCallback((newValue: Type) => {
    setValue(newValue, true);
    setTimeout(() => {
      setTouched(true, false);
    }, 200);
  }, []);

  const onBlur = useCallback(() => {
    setTouched(true);
  }, []);

  const toReturn = useMemo(
    () => ({
      value,
      touched,
      error,
      isError: error !== undefined && touched,
      setFieldValue,
      onChange,
      onBlur,
    }),
    [value, touched, error, onChange],
  );

  return toReturn;
};

export default useFastField;
