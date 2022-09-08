import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';

const propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {
  value: '',
  onClick: () => {},
};

const DatePickerInput = forwardRef(({ value, onClick }, ref) => (
  <Button colorScheme="gray" onClick={onClick} ref={ref}>
    {value}
  </Button>
));

DatePickerInput.propTypes = propTypes;
DatePickerInput.defaultProps = defaultProps;
export default DatePickerInput;
