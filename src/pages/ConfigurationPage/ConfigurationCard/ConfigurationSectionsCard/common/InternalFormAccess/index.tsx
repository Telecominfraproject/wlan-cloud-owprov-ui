import { useFormikContext } from 'formik';
import * as React from 'react';

type Props = {
  shouldValidate: boolean;
};

const InternalFormAccess = ({ shouldValidate }: Props) => {
  const { submitForm } = useFormikContext();

  React.useEffect(() => {
    if (shouldValidate) {
      setTimeout(() => {
        submitForm();
      }, 1000);
    }
  }, [shouldValidate]);

  return null;
};

export default InternalFormAccess;
