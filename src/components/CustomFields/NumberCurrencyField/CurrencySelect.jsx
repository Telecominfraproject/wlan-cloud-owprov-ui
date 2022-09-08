import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import useCurrency from 'hooks/useCurrency';
import useSelectOptions from 'hooks/useSelectOptions';
import { Select } from '@chakra-ui/react';
import { useField } from 'formik';

const propTypes = {
  name: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

const CurrencySelect = ({ name, isDisabled }) => {
  const { selectOptions } = useCurrency();
  const [{ value }, , { setValue, setTouched }] = useField(name);
  const options = useSelectOptions({ values: selectOptions, selected: value });

  const onChange = useCallback((e) => {
    setValue(e.target.value);
    setTouched(true);
  }, []);

  const onFieldBlur = useCallback(() => {
    setTouched(true);
  }, []);

  return (
    <Select value={value} onChange={onChange} onBlur={onFieldBlur} isDisabled={isDisabled}>
      {options}
    </Select>
  );
};

CurrencySelect.propTypes = propTypes;
export default CurrencySelect;
