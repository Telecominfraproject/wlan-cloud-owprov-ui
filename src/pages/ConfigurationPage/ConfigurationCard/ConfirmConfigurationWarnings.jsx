import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, CloseButton, Heading, Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ModalHeader from 'components/Modals/ModalHeader';
import SaveButton from 'components/Buttons/SaveButton';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  warnings: PropTypes.instanceOf(Object).isRequired,
  activeConfigurations: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const ConfirmConfigurationWarnings = ({ isOpen, onClose, submit, warnings, activeConfigurations }) => {
  const { t } = useTranslation();
  const warningsAmount = warnings?.interfaces?.length ?? 0;

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={`${warningsAmount} ${warningsAmount === 1 ? t('common.warning') : t('common.warnings')}`}
          right={
            <>
              <SaveButton onClick={submit} />
              <CloseButton ml={2} onClick={onClose} />
            </>
          }
        />
        <ModalBody>
          <Box>
            <Alert colorScheme="yellow" mb={4}>
              <Heading size="sm">{t('configurations.save_warnings')}</Heading>
            </Alert>
          </Box>
          <pre>
            {JSON.stringify(
              {
                interfaces: activeConfigurations.includes('interfaces') ? warnings.interfaces : undefined,
              },
              null,
              2,
            )}
          </pre>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

ConfirmConfigurationWarnings.propTypes = propTypes;

export default React.memo(ConfirmConfigurationWarnings);
