import React, { useEffect } from 'react';
import { useField } from 'formik';
import PropTypes from 'prop-types';

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
