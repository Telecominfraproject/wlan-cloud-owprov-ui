import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Center, Text } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';

const propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

const GoogleAuthenticatorIntro = ({ setCurrentStep }) => {
  const { t } = useTranslation();

  const handleClick = () => setCurrentStep('qr-code');

  return (
    <>
      <Text my={4}>
        <b>{t('account.google_authenticator_intro')}</b>
      </Text>
      <Text mb={4}>{t('account.google_authenticator_ready')}</Text>
      <Center>
        <Button mb={6} colorScheme="blue" onClick={handleClick} rightIcon={<ArrowRightIcon />}>
          {t('account.proceed_to_activation')}
        </Button>
      </Center>
    </>
  );
};

GoogleAuthenticatorIntro.propTypes = propTypes;
export default GoogleAuthenticatorIntro;
