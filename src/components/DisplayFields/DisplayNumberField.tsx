import React from 'react';
import { FormControl, FormLabel, LayoutProps, NumberInput, NumberInputField, SpaceProps } from '@chakra-ui/react';

interface Props extends LayoutProps, SpaceProps {
  label: string;
  value: string | number;
  isRequired?: boolean;
}

const defaultProps = {
  isRequired: false,
};

const DisplayNumberField: React.FC<Props> = ({ label, value, isRequired, ...props }) => (
  <FormControl isRequired={isRequired} isDisabled>
    <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
      {label}
    </FormLabel>
    <NumberInput allowMouseWheel value={value} borderRadius="15px" fontSize="sm" {...props}>
      <NumberInputField />
    </NumberInput>
  </FormControl>
);

DisplayNumberField.defaultProps = defaultProps;
export default DisplayNumberField;
