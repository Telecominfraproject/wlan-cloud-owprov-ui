import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@chakra-ui/react';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  field: PropTypes.instanceOf(Object).isRequired,
};

const PhoneInput = ({ editing, field }) => <Input borderRadius="15px" type="string" isDisabled={!editing} {...field} />;

PhoneInput.propTypes = propTypes;

export default PhoneInput;
