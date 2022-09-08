import React from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  useBoolean,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FieldInputProps } from 'models/Form';
import ConfigurationFieldExplanation from '../ConfigurationFieldExplanation';

interface Props extends FieldInputProps<string | undefined | string[]> {
  isError: boolean;
  hideButton: boolean;
  isArea: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

const StringInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  onBlur,
  isError,
  error,
  hideButton,
  isRequired,
  element,
  isArea,
  isDisabled,
  definitionKey,
  ...props
}) => {
  const { t } = useTranslation();
  const [show, setShow] = useBoolean();

  if (isArea) {
    return (
      <FormControl isInvalid={isError} isRequired={isRequired} isDisabled={isDisabled}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
          {label}
        </FormLabel>
        {element ?? (
          <InputGroup size="md">
            <Textarea
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              borderRadius="15px"
              fontSize="sm"
              h="360px"
              _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
            />
          </InputGroup>
        )}
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    );
  }

  return (
    <FormControl isInvalid={isError} isRequired={isRequired} isDisabled={isDisabled} {...props}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {label}
        <ConfigurationFieldExplanation definitionKey={definitionKey} />
      </FormLabel>
      {element ?? (
        <InputGroup size="md">
          <Input
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            borderRadius="15px"
            fontSize="sm"
            type={hideButton && !show ? 'password' : 'text'}
            autoComplete="off"
            border="2px solid"
            _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          />
          {hideButton && (
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={setShow.toggle}
                _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
              >
                {show ? t('common.hide') : t('common.show')}
              </Button>
            </InputRightElement>
          )}
        </InputGroup>
      )}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default React.memo(StringInput);
