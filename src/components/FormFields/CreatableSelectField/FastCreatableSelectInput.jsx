import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { CreatableSelect } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';
import ConfigurationFieldExplanation from '../ConfigurationFieldExplanation';

const propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  touched: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isHidden: PropTypes.bool,
  definitionKey: PropTypes.string,
  placeholder: PropTypes.string,
};

const defaultProps = {
  value: [],
  error: false,
  touched: false,
  isRequired: false,
  isDisabled: false,
  isHidden: false,
  definitionKey: null,
  placeholder: '',
};

const FastCreatableSelectInput = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  isRequired,
  isDisabled,
  isHidden,
  definitionKey,
  placeholder,
}) => {
  const { t } = useTranslation();
  const NoOptionsMessage = useCallback(() => <h6 className="text-center pt-2">{t('common.type_for_options')}</h6>, []);

  return (
    <FormControl isInvalid={error && touched} isRequired={isRequired} hidden={isHidden}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {label}
        <ConfigurationFieldExplanation definitionKey={definitionKey} />
      </FormLabel>
      <CreatableSelect
        value={value.map((val) => ({ value: val, label: val }))}
        onChange={onChange}
        onBlur={onBlur}
        chakraStyles={{
          control: (provided, { isControlDisabled }) => ({
            ...provided,
            borderRadius: '15px',
            opacity: isControlDisabled ? '0.8 !important' : '1',
            border: '2px solid',
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            backgroundColor: 'unset',
            border: 'unset',
          }),
        }}
        isMulti
        components={{ NoOptionsMessage }}
        options={[]}
        placeholder={placeholder}
        isDisabled={isDisabled}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

FastCreatableSelectInput.propTypes = propTypes;
FastCreatableSelectInput.defaultProps = defaultProps;

export default React.memo(FastCreatableSelectInput);
