import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalOverlay, ModalContent, ModalBody, Alert, AlertIcon, Heading, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pushResult: PropTypes.instanceOf(Object),
};

const defaultProps = {
  pushResult: null,
};

const ConfigurationPushModal = ({ isOpen, onClose, pushResult }) => {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="xl">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={t('configurations.configuration_push_result')}
          right={<CloseButton ml={2} onClick={onClose} />}
        />
        <ModalBody>
          <Alert status={pushResult?.errorCode !== 0 ? 'error' : 'success'}>
            <AlertIcon />
            {pushResult?.errorCode !== 0
              ? t('configurations.push_configuration_explanation', {
                  code: pushResult?.errorCode ?? 0,
                })
              : t('configurations.push_success')}
          </Alert>
          {pushResult?.errorCode === 0 && (
            <>
              <Heading size="md" mt={4}>
                {t('configurations.applied_configuration')}
              </Heading>
              <Box border="1px" borderRadius="5px" h="calc(20vh)" overflowY="auto">
                <pre>{JSON.stringify(pushResult?.appliedConfiguration, null, 2)}</pre>
              </Box>
              <Heading size="md" mt={4}>
                {t('common.errors')}
              </Heading>
              <Box border="1px" borderRadius="5px" h="calc(20vh)" overflowY="auto">
                <pre>{JSON.stringify(pushResult?.errors, null, 2)}</pre>
              </Box>
              <Heading size="md" mt={4}>
                {t('common.warnings')}
              </Heading>
              <Box border="1px" borderRadius="5px" h="calc(20vh)" overflowY="auto">
                <pre>{JSON.stringify(pushResult?.warnings, null, 2)}</pre>
              </Box>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

ConfigurationPushModal.propTypes = propTypes;
ConfigurationPushModal.defaultProps = defaultProps;

export default ConfigurationPushModal;
