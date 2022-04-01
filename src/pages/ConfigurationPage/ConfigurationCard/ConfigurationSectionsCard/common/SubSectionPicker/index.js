import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { useField } from 'formik';
import { Select } from 'chakra-react-select';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  subsections: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubsectionsChange: PropTypes.func.isRequired,
};

const SubSectionPicker = ({ editing, subsections, onSubsectionsChange }) => {
  const [{ value }, , { setTouched }] = useField('configuration');
  const onChange = (option) => {
    onSubsectionsChange(option.map((val) => val.value));
  };
  const activeSubsections = useMemo(
    () => subsections.map((sub) => ({ value: sub, label: sub })).filter((opt) => value[opt.value] !== undefined),
    [value],
  );
  const options = useMemo(() => subsections.map((sub) => ({ value: sub, label: sub })), []);

  return (
    <FormControl isDisabled={!editing}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal">
        Subsections
      </FormLabel>
      <Select
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
        value={activeSubsections}
        onChange={(option) => onChange(option, value)}
        onBlur={() => setTouched('configuration')}
      />
    </FormControl>
  );
};

SubSectionPicker.propTypes = propTypes;

export default SubSectionPicker;
