import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import isEqual from 'react-fast-compare';
import { Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const propTypes = {
  value: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ResourcePicker = ({ value, resources, isDisabled, onChange }) => {
  const { t } = useTranslation();

  return (
    <Select value={value} isDisabled={isDisabled} maxW={72} onChange={onChange}>
      <option value="">{t('configurations.no_resource_selected')}</option>
      {resources.map((res) => (
        <option key={uuid()} value={res.value}>
          {res.label}
        </option>
      ))}
      {value !== '' && !resources.find(({ value: resource }) => resource === value) && (
        <option value={value}>{t('configurations.invalid_resource')}</option>
      )}
    </Select>
  );
};

ResourcePicker.propTypes = propTypes;
export default React.memo(ResourcePicker, isEqual);
