import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import DeviceConfigurationsModal from './Modal';

const propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
};

const defaultProps = {
  isRequired: false,
  isDisabled: false,
};

const DeviceConfigurationsModalField = ({ name, label, setFieldValue, errors, isDisabled, isRequired }) => {
  const setValue = (value) => setFieldValue(name, value);

  return (
    <Field name={name}>
      {({ field }) => (
        <DeviceConfigurationsModal
          initialValue={field.value}
          name={name}
          label={label}
          setValue={setValue}
          errors={errors}
          isDisabled={isDisabled}
          isRequired={isRequired}
        />
      )}
    </Field>
  );
};

DeviceConfigurationsModalField.propTypes = propTypes;
DeviceConfigurationsModalField.defaultProps = defaultProps;

export default DeviceConfigurationsModalField;
