import React from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useBoolean } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface Props {
  label: string;
  value?: string;
  isRequired?: boolean;
  hideButton?: boolean;
}

const defaultProps = {
  value: '',
  isRequired: false,
  hideButton: false,
};

const DisplayStringField: React.FC<Props> = ({ label, value, isRequired, hideButton }) => {
  const { t } = useTranslation();
  const [show, setShow] = useBoolean();

  return (
    <FormControl isRequired={isRequired} isDisabled>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {label}
      </FormLabel>
      <InputGroup size="md">
        <Input
          value={value}
          borderRadius="15px"
          fontSize="sm"
          type={hideButton && !show ? 'password' : 'text'}
          autoComplete="off"
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        />
        {hideButton && (
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={setShow.toggle} _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}>
              {show ? t('common.hide') : t('common.show')}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};

DisplayStringField.defaultProps = defaultProps;
export default DisplayStringField;
