import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ConfigurationSelect } from 'ucentral-libs';
// import CHANNELS from './CHANNELS';

const ChannelPicker = ({ id, label, band, field, updateField, disabled }) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    let { value } = field;

    if (band === '2G') {
      const newOptions = [
        { value: 20, label: '20 MHz' },
        { value: 40, label: '40 MHz' },
      ];
      if (!newOptions.find((opt) => opt.value === value)) value = 20;
      setOptions(newOptions);
    } else if (band === '5G') {
      const newOptions = [
        { value: 20, label: '20 MHz' },
        { value: 40, label: '40 MHz' },
        { value: 80, label: '80 MHz' },
        { value: 160, label: '160 MHz' },
      ];
      if (!newOptions.find((opt) => opt.value === value)) value = 20;
      setOptions(newOptions);
    } else if (band === '5G-lower') {
      const newOptions = [
        { value: 20, label: '20 MHz' },
        { value: 40, label: '40 MHz' },
        { value: 80, label: '80 MHz' },
        { value: 160, label: '160 MHz' },
      ];
      if (!newOptions.find((opt) => opt.value === value)) value = 20;
      setOptions(newOptions);
    } else if (band === '5G-upper') {
      const newOptions = [
        { value: 20, label: '20 MHz' },
        { value: 40, label: '40 MHz' },
        { value: 80, label: '80 MHz' },
      ];
      if (!newOptions.find((opt) => opt.value === value)) value = 20;
      setOptions(newOptions);
    } else if (band === '6G') {
      const newOptions = [
        { value: 20, label: '20 MHz' },
        { value: 40, label: '40 MHz' },
        { value: 80, label: '80 MHz' },
        { value: 160, label: '160 MHz' },
      ];
      if (!newOptions.find((opt) => opt.value === value)) value = 20;
      setOptions(newOptions);
    }
  }, [band]);

  return (
    <div>
      <ConfigurationSelect
        id={id}
        label={label}
        field={field}
        updateField={updateField}
        firstCol="4"
        secondCol="8"
        disabled={disabled}
        width="120px"
        options={options}
      />
    </div>
  );
};

ChannelPicker.propTypes = {
  id: PropTypes.string.isRequired,
  field: PropTypes.instanceOf(Object).isRequired,
  label: PropTypes.string.isRequired,
  band: PropTypes.string.isRequired,
  updateField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default ChannelPicker;
