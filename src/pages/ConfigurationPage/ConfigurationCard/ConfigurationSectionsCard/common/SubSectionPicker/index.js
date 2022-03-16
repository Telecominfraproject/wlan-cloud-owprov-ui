import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { Field } from 'formik';
import { Select } from 'chakra-react-select';

const name = 'configuration.__selected_subcategories';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  subsections: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubsectionsChange: PropTypes.func.isRequired,
};

const SubSectionPicker = ({ editing, subsections, onSubsectionsChange }) => {
  const onChange = (option) => {
    onSubsectionsChange(option.map((val) => val.value));
  };

  return (
    <Field name={name}>
      {({ field, form: { setFieldTouched }, meta: { touched, error } }) => (
        <FormControl isInvalid={error && touched} isDisabled={!editing}>
          <FormLabel ms="4px" fontSize="md" fontWeight="normal">
            Subsections
          </FormLabel>
          <Select
            {...field}
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
            options={subsections.map((sub) => ({ value: sub, label: sub }))}
            value={field.value.map((val) =>
              subsections.map((sub) => ({ value: sub, label: sub })).find((opt) => opt.value === val),
            )}
            onChange={(option) => onChange(option, field.value)}
            onBlur={() => setFieldTouched(name)}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

SubSectionPicker.propTypes = propTypes;

export default SubSectionPicker;
