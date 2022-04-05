import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';

const propTypes = {
  index: PropTypes.number.isRequired,
};

const Rates = ({ index }) => {
  const [{ value }, , { setValue }] = useField(`configuration[${index}].rates`);

  useEffect(() => {
    if (value && Object.keys(value).length === 0) {
      setValue(undefined);
    }
  }, [value]);

  return null;
};

Rates.propTypes = propTypes;
export default React.memo(Rates);
