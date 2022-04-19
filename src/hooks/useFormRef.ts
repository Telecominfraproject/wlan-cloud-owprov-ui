import { FormType } from 'models/Form';
import { useCallback, useMemo, useState } from 'react';

const useFormRef = () => {
  const [form, setForm] = useState<FormType>({
    submitForm: () => {},
    isSubmitting: false,
    isValid: true,
    dirty: false,
  });
  const formRef = useCallback(
    (node: any) => {
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
