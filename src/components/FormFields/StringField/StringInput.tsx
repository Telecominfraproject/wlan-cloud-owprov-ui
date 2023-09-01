import React from 'react';
import { InfoIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  LayoutProps,
  Textarea,
  Tooltip,
  useBoolean,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ConfigurationFieldExplanation from '../ConfigurationFieldExplanation';
import { FieldInputProps } from 'models/Form';

interface StringInputProps extends FieldInputProps<string | undefined | string[]>, LayoutProps {
  isError: boolean;
  hideButton: boolean;
  isArea: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  explanation?: string;
}

const StringInput: React.FC<StringInputProps> = ({
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
  explanation,
  h,
  ...props
}) => {
  const { t } = useTranslation();
  const [show, setShow] = useBoolean();

  if (isArea) {
    return (
      <FormControl isInvalid={isError} isRequired={isRequired} isDisabled={isDisabled}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
          {label}
          {explanation ? (
            <Tooltip hasArrow label={explanation}>
              <InfoIcon ml={2} mb="2px" />
            </Tooltip>
          ) : null}
        </FormLabel>
        {element ?? (
          <InputGroup size="md">
            <Textarea
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              borderRadius="15px"
              fontSize="sm"
              h={h ?? '360px'}
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
        {explanation ? (
          <Tooltip hasArrow label={explanation}>
            <InfoIcon ml={2} mb="2px" />
          </Tooltip>
        ) : null}
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
