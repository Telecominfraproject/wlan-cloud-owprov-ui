import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { FormControl, FormErrorMessage, FormLabel, useToast } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useGetAvailableConfigurations } from 'hooks/Network/Configurations';

const propTypes = {
  tagId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

const ConfigurationPicker = ({ tagId, name, isDisabled }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(name);
  const { data: configurations } = useGetAvailableConfigurations({ t, toast, tagId });

  const onChange = (opt) => {
    setValue(opt.value);
    setTouched(true);
  };
  const onBlur = () => setTouched(true);
  const options = configurations?.map((opt) => ({ value: opt.id, label: opt.name })) ?? [];

  return (
    <FormControl isInvalid={error && touched} isDisabled={isDisabled}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal">
        {t('configurations.one')}
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
        classNamePrefix="chakra-react-select"
        menuPortalTarget={document.body}
        options={[{ value: '', label: t('common.none') }, ...options]}
        value={[{ value: '', label: t('common.none') }, ...options].find(
          (opt) => opt.value === value,
        )}
        onChange={onChange}
        onBlur={onBlur}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

ConfigurationPicker.propTypes = propTypes;
export default ConfigurationPicker;
