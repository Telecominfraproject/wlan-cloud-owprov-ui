import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import {
  Button,
  IconButton,
  Tooltip,
  useBreakpoint,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, WarningOctagon } from 'phosphor-react';
import ModalHeader from 'components/Modals/ModalHeader';
import CloseButton from 'components/Buttons/CloseButton';

const propTypes = {
  errors: PropTypes.instanceOf(Object).isRequired,
  activeConfigurations: PropTypes.arrayOf(PropTypes.string).isRequired,
  isDisabled: PropTypes.bool,
};

const defaultProps = {
  isDisabled: false,
};

const ViewConfigErrorsModal = ({ errors, activeConfigurations, isDisabled }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const breakpoint = useBreakpoint();
  const errorAmount =
    errors.globals.length +
    errors.unit.length +
    errors.metrics.length +
    errors.services.length +
    errors.radios.length +
    errors.interfaces.length +
    errors['third-party'].length;

  return (
    <>
      {breakpoint !== 'base' && breakpoint !== 'sm' ? (
        <Button
          colorScheme={errorAmount === 0 ? 'green' : 'red'}
          type="button"
          onClick={onOpen}
          ml={2}
          rightIcon={errorAmount === 0 ? <CheckCircle size={20} /> : <WarningOctagon size={20} />}
          isDisabled={isDisabled || errorAmount === 0}
        >
          {errorAmount} {errorAmount === 1 ? t('common.error') : t('common.errors')}
        </Button>
      ) : (
        <Tooltip label={`${errorAmount} ${errorAmount === 1 ? t('common.error') : t('common.errors')}`}>
          <IconButton
            colorScheme={errorAmount === 0 ? 'green' : 'red'}
            type="button"
            onClick={onOpen}
            icon={errorAmount === 0 ? <CheckCircle size={20} /> : <WarningOctagon size={20} />}
            isDisabled={isDisabled || errorAmount === 0}
          />
        </Tooltip>
      )}
      <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={`${errorAmount} ${errorAmount === 1 ? t('common.error') : t('common.errors')}`}
            right={<CloseButton ml={2} onClick={onClose} />}
          />
          <ModalBody>
            <pre>
              {JSON.stringify(
                {
                  globals: activeConfigurations.includes('globals') ? errors.globals : undefined,
                  unit: activeConfigurations.includes('unit') ? errors.unit : undefined,
                  metrics: activeConfigurations.includes('metrics') ? errors.metrics : undefined,
                  services: activeConfigurations.includes('services') ? errors.services : undefined,
                  radios: activeConfigurations.includes('radios') ? errors.radios : undefined,
                  interfaces: activeConfigurations.includes('interfaces') ? errors.interfaces : undefined,
                  'third-party': activeConfigurations.includes('third-party') ? errors['third-party'] : undefined,
                },
                null,
                2,
              )}
            </pre>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

ViewConfigErrorsModal.propTypes = propTypes;
ViewConfigErrorsModal.defaultProps = defaultProps;

export default React.memo(ViewConfigErrorsModal, isEqual);
