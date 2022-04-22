import { FormikProps } from 'formik';
import { FormType } from 'models/Form';
import { Ref, useCallback, useMemo, useState } from 'react';

const useFormRef = () => {
  const [form, setForm] = useState<FormType>({
    submitForm: () => {},
    isSubmitting: false,
    isValid: true,
    dirty: false,
  });
  const formRef = useCallback(
    (node: FormikProps<Record<string, unknown>> | undefined) => {
      if (
        node !== undefined &&
        (form.submitForm !== node.submitForm ||
          form.isSubmitting !== node.isSubmitting ||
          form.isValid !== node.isValid ||
          form.dirty !== node.dirty)
      ) {
        setForm(node);
      }
    },
    [form],
  ) as Ref<FormikProps<Record<string, unknown>>> | undefined;

  const toReturn = useMemo(() => ({ form, formRef }), [form]);

  return toReturn;
};

export default useFormRef;
