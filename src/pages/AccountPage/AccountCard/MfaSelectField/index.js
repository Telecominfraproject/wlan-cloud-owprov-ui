import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormErrorMessage, FormLabel, Select, useDisclosure } from '@chakra-ui/react';
import { Field } from 'formik';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import GoogleAuthenticatorModal from '../GoogleAuthenticatorModal';

const propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  touched: PropTypes.instanceOf(Object).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isHidden: PropTypes.bool,
};

const defaultProps = {
  isRequired: false,
  isDisabled: false,
  isHidden: false,
};

const MfaSelectField = ({ name, errors, touched, isDisabled, label, isRequired, isHidden, setFieldValue }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onChange = (e) => {
    const newValue = e.target.value;

    if (newValue !== 'authenticator') setFieldValue(name, newValue);
    else {
      onOpen();
    }
    e.preventDefault();
  };

  const onSuccess = () => {
    setFieldValue(name, 'authenticator');
  };

  return (
    <>
      <Field name={name}>
        {({ field }) => (
          <FormControl
            isInvalid={errors[name] && touched[name]}
            isRequired={isRequired}
            isDisabled={isDisabled}
            hidden={isHidden}
          >
            <FormLabel ms="4px" fontSize="md" fontWeight="normal">
              {label}
            </FormLabel>
            <Select value={field.value} onChange={onChange} borderRadius="15px" fontSize="sm">
              <option key={uuid()} value="">
                {t('common.none')}
              </option>
              <option key={uuid()} value="email">
                {t('common.email')}
              </option>
              <option key={uuid()} value="sms">
                {t('account.sms')}
              </option>
              <option key={uuid()} value="authenticator">
                {t('account.google_authenticator')}
              </option>
            </Select>
            <FormErrorMessage>{errors[name]}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
      <GoogleAuthenticatorModal isOpen={isOpen} onClose={onClose} onSuccess={onSuccess} />
    </>
  );
};

MfaSelectField.propTypes = propTypes;
MfaSelectField.defaultProps = defaultProps;

export default MfaSelectField;
