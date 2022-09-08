import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { Field, useFormikContext } from 'formik';
import { Select } from 'chakra-react-select';

const propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.instanceOf(Object).isRequired,
  isDisabled: PropTypes.bool,
  hideButton: PropTypes.bool,
  isRequired: PropTypes.bool,
  isHidden: PropTypes.bool,
  isPortal: PropTypes.bool,
};

const defaultProps = {
  isRequired: false,
  isDisabled: false,
  hideButton: false,
  isPortal: false,
  isHidden: false,
};

const SelectWithSearchField = ({ options, name, isDisabled, label, isRequired, isHidden, isPortal }) => {
  const { errors, touched, setFieldValue } = useFormikContext();
  const onChange = (ent) => {
    setFieldValue(name, ent.value);
  };

  const findValueFromOptions = (v) => {
    for (const opt of options) {
      if (opt.options) {
        for (const nestedOpt of opt.options) {
          if (nestedOpt.value === v) return nestedOpt;
        }
      } else if (v === opt.value) return opt;
    }
    return null;
  };

  return (
    <Field name={name}>
      {({ field, form: { setFieldTouched } }) => (
        <FormControl
          isInvalid={errors[name] && touched[name]}
          isRequired={isRequired}
          isDisabled={isDisabled}
          hidden={isHidden}
        >
          <FormLabel ms="4px" fontSize="md" fontWeight="normal">
            {label}
          </FormLabel>
          <Select
            {...field}
            chakraStyles={{
              control: (provided) => ({
                ...provided,
                borderRadius: '15px',
                border: '2px solid',
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                backgroundColor: 'unset',
                border: 'unset',
              }),
            }}
            classNamePrefix={isPortal ? 'chakra-react-select' : ''}
            menuPortalTarget={isPortal ? document.body : undefined}
            options={options}
            value={findValueFromOptions(field.value)}
            onChange={(option) => onChange(option, field.value)}
            onBlur={() => setFieldTouched(name)}
          />
          <FormErrorMessage>{errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

SelectWithSearchField.propTypes = propTypes;
SelectWithSearchField.defaultProps = defaultProps;

export default React.memo(SelectWithSearchField);
