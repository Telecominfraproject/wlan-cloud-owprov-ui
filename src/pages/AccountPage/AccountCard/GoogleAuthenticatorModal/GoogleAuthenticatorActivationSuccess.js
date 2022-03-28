import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Center } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';

const propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

const GoogleAuthenticatorActivationSuccess = ({ onSuccess }) => {
  const { t } = useTranslation();

  const handleClick = () => onSuccess();

  return (
    <>
      <Alert colorScheme="green" my={4}>
        {t('account.google_authenticator_success_explanation')}
      </Alert>
      <Center>
        <Button mb={6} colorScheme="blue" onClick={handleClick} rightIcon={<ArrowRightIcon />}>
          {t('common.next')}
        </Button>
      </Center>
    </>
  );
};

GoogleAuthenticatorActivationSuccess.propTypes = propTypes;
export default GoogleAuthenticatorActivationSuccess;
