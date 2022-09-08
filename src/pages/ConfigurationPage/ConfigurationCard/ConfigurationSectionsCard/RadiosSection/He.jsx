import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ToggleField from 'components/FormFields/ToggleField';
import NumberField from 'components/FormFields/NumberField';
import useFastField from 'hooks/useFastField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

const He = ({ editing, index }) => {
  const { value, onChange } = useFastField({ name: `configuration[${index}].he` });

  useEffect(() => {
    if (value && Object.keys(value).length === 0) {
      onChange(undefined);
    }
  }, [value]);

  return (
    <>
      <ToggleField
        name={`configuration[${index}].he.ema`}
        label="ema"
        definitionKey="radio.he.ema"
        isDisabled={!editing}
        falseIsUndefined
      />
      <NumberField
        name={`configuration[${index}].he.bss-color`}
        label="bss-color"
        definitionKey="radio.he.bss-color"
        isDisabled={!editing}
        w={24}
        acceptEmptyValue
      />
    </>
  );
};

He.propTypes = propTypes;
export default React.memo(He);
