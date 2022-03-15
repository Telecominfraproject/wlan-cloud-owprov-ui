import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';

const propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const MultiSelect = ({ options, onChange, value, ...props }) => {
  const { t } = useTranslation();

  return (
    <Select
      {...props}
      chakraStyles={{
        control: (provided) => ({
          ...provided,
          borderRadius: '15px',
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          backgroundColor: 'unset',
          border: 'unset',
        }),
      }}
      isMulti
      closeMenuOnSelect={false}
      options={options}
      onChange={onChange}
      value={value}
      placeholder={t('system.systems_to_reload')}
    />
  );
};

MultiSelect.propTypes = propTypes;

export default MultiSelect;
