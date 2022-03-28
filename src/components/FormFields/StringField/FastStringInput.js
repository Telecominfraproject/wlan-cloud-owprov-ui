import React from 'react';
import PropTypes from 'prop-types';
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
import ConfigurationFieldExplanation from '../ConfigurationFieldExplanation';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  touched: PropTypes.bool,
  hideButton: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isArea: PropTypes.bool,
  isRequired: PropTypes.bool,
  element: PropTypes.node,
  definitionKey: PropTypes.string,
};

const defaultProps = {
  value: '',
  error: false,
  touched: false,
  hideButton: false,
  isRequired: false,
  isArea: false,
  isDisabled: false,
  element: null,
  definitionKey: null,
};

const FastStringInput = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  hideButton,
  isRequired,
  element,
  isArea,
  isDisabled,
  definitionKey,
}) => {
  const { t } = useTranslation();
  const [show, setShow] = useBoolean();

  if (isArea) {
    return (
      <FormControl isInvalid={error && touched} isRequired={isRequired} isDisabled={isDisabled}>
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
              type="text"
              _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
            />
          </InputGroup>
        )}
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    );
  }

  return (
    <FormControl isInvalid={error && touched} isRequired={isRequired} isDisabled={isDisabled}>
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

FastStringInput.propTypes = propTypes;
FastStringInput.defaultProps = defaultProps;

export default React.memo(FastStringInput);
