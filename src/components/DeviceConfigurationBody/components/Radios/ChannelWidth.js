import React, { useEffect, useState } from 'react';
import PropTypes, { oneOfType } from 'prop-types';
import { ConfigurationSelect } from 'ucentral-libs';
import CHANNELS from './CHANNELS';

const ChannelPicker = ({ id, label, band, channel, field, updateField, disabled }) => {
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
    }
    if (band === '5G-lower') {
      setOptions(null);
      for (const [width, array] of Object.entries(CHANNELS['5G-lower'])) {
        if (array.includes(channel)) {
          value = width;
          break;
        }
      }
    } else if (band === '5G-upper') {
      setOptions(null);
      for (const [width, array] of Object.entries(CHANNELS['5G-upper'])) {
        if (array.includes(channel)) {
          value = width;
          break;
        }
      }
    } else if (band === '5G') {
      setOptions(null);
      let found = false;

      for (const [width, array] of Object.entries(CHANNELS['5G-lower'])) {
        if (array.includes(channel)) {
          value = width;
          found = true;
          break;
        }
      }

      if (!found) {
        setOptions(null);
        for (const [width, array] of Object.entries(CHANNELS['5G-upper'])) {
          if (array.includes(channel)) {
            value = width;
            break;
          }
        }
      }
    } else if (band === '6G') {
      setOptions(null);
      for (const [width, array] of Object.entries(CHANNELS['6G'])) {
        if (array.includes(channel)) {
          value = width;
          break;
        }
      }
    }

    if (value !== field.value) updateField(id, { value: parseInt(value, 10) });
  }, [channel]);

  return (
    <div>
      <ConfigurationSelect
        id={id}
        label={label}
        field={field}
        updateField={updateField}
        firstCol="4"
        secondCol="8"
        disabled={!(channel === 'auto' || band === '2G') || disabled}
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
  channel: oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  updateField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default ChannelPicker;
