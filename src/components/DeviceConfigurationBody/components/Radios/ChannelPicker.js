import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ConfigurationSelect } from 'ucentral-libs';
import CHANNELS from './CHANNELS';

const ChannelPicker = ({ id, label, band, field, updateField, disabled }) => {
  const [channelOptions, setChannelOptions] = useState([]);

  useEffect(() => {
    let options = ['auto'];

    if (band === '2G') {
      options = [...options, ...CHANNELS['2G']];
    } else if (band === '5G-lower') {
      options = [
        ...options,
        ...CHANNELS['5G-lower'][20],
        ...CHANNELS['5G-lower'][40],
        ...CHANNELS['5G-lower'][80],
        ...CHANNELS['5G-lower'][160],
      ];
    } else if (band === '5G-upper') {
      options = [
        ...options,
        ...CHANNELS['5G-upper'][20],
        ...CHANNELS['5G-upper'][40],
        ...CHANNELS['5G-upper'][80],
      ];
    } else if (band === '5G') {
      options = [
        ...options,
        ...CHANNELS['5G-lower'][20],
        ...CHANNELS['5G-lower'][40],
        ...CHANNELS['5G-lower'][80],
        ...CHANNELS['5G-lower'][160],
      ];
      options = [
        ...options,
        ...CHANNELS['5G-upper'][20],
        ...CHANNELS['5G-upper'][40],
        ...CHANNELS['5G-upper'][80],
      ];
    } else if (band === '6G') {
      options = [
        ...options,
        ...CHANNELS['6G'][20],
        ...CHANNELS['6G'][40],
        ...CHANNELS['6G'][80],
        ...CHANNELS['6G'][160],
      ];
    }

    options.sort((a, b) => a - b);

    if (!options.includes(field.value)) updateField(id, { value: options[0] });

    const finalOptions = options.map((opt) => ({ value: opt, label: opt }));
    setChannelOptions(finalOptions);
  }, [band]);

  return (
    <ConfigurationSelect
      id={id}
      label={label}
      field={field}
      updateField={updateField}
      firstCol="4"
      secondCol="8"
      disabled={disabled}
      options={channelOptions}
      width="100px"
    />
  );
};

ChannelPicker.propTypes = {
  band: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  field: PropTypes.instanceOf(Object).isRequired,
  label: PropTypes.string.isRequired,
  updateField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default ChannelPicker;
