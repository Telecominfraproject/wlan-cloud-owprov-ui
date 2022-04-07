import { useCallback, useMemo, useState } from 'react';

const useFormRef = () => {
  const [form, setForm] = useState({});
  const formRef = useCallback(
    (node) => {
      if (
        node !== null &&
        (form.submitForm !== node.submitForm ||
          form.isSubmitting !== node.isSubmitting ||
          form.isValid !== node.isValid ||
          form.dirty !== node.dirty)
      ) {
        setForm(node);
      }
    },
    [form],
  );

  const toReturn = useMemo(() => ({ form, formRef }), [form]);

  return toReturn;
};

export default useFormRef;
