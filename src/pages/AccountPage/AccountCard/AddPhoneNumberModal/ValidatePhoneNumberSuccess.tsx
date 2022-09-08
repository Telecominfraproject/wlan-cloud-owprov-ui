import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Center } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';

const ValidatePhoneNumberSuccess: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const { t } = useTranslation();

  const handleClick = () => nextStep();

  return (
    <>
      <Alert colorScheme="green" my={4}>
        {t('account.phone_validation_success_explanation')}
      </Alert>
      <Center>
        <Button mb={6} colorScheme="blue" onClick={handleClick} rightIcon={<ArrowRightIcon />}>
          {t('common.save')}
        </Button>
      </Center>
    </>
  );
};

export default ValidatePhoneNumberSuccess;
