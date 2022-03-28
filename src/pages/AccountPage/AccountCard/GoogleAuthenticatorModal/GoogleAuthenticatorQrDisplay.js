import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Center, Text, useToast } from '@chakra-ui/react';
import { useGetGoogleAuthenticatorQrCode } from 'hooks/Network/GoogleAuthenticator';
import { ArrowRightIcon } from '@chakra-ui/icons';
import QrCodeDisplay from 'components/QrCodeDisplay';

const propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

const GoogleAuthenticatorQrDisplay = ({ setCurrentStep }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: qrSvg } = useGetGoogleAuthenticatorQrCode({ t, toast });

  const handleClick = () => setCurrentStep('tests');

  return (
    <>
      <Text my={4}>
        <b>{t('account.google_authenticator_scan_qr_code_explanation')}</b>
      </Text>
      <Text mb={4}>{t('account.google_authenticator_scanned_qr_code')}</Text>
      {qrSvg && <QrCodeDisplay path={qrSvg.split('path d="')[1].split('" fill="#000000"')[0]} />}
      <Center>
        <Button my={6} colorScheme="blue" onClick={handleClick} rightIcon={<ArrowRightIcon />}>
          {t('common.next')}
        </Button>
      </Center>
    </>
  );
};

GoogleAuthenticatorQrDisplay.propTypes = propTypes;
export default GoogleAuthenticatorQrDisplay;
