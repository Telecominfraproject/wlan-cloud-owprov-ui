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
import { ArrowsOut } from 'phosphor-react';
import ModalHeader from 'components/ModalHeader';
import CloseButton from 'components/Buttons/CloseButton';

const propTypes = {
  configurations: PropTypes.instanceOf(Object).isRequired,
  activeConfigurations: PropTypes.arrayOf(PropTypes.string).isRequired,
  isDisabled: PropTypes.bool,
};

const defaultProps = {
  isDisabled: false,
};

const tryParseInter = (inter) => {
  const obj = inter;
  try {
    const res = JSON.parse(inter.configuration);
    return (obj.interfaces = res);
  } catch {
    return { ...obj };
  }
};

const ViewJsonConfigModal = ({ configurations, activeConfigurations, isDisabled }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const breakpoint = useBreakpoint();

  return (
    <>
      {breakpoint !== 'base' && breakpoint !== 'sm' ? (
        <Button
          colorScheme="gray"
          type="submit"
          onClick={onOpen}
          rightIcon={<ArrowsOut size={20} />}
          isDisabled={isDisabled}
          ml={2}
        >
          {t('common.view_json')}
        </Button>
      ) : (
        <Tooltip label={t('common.view_json')}>
          <IconButton
            colorScheme="gray"
            type="submit"
            onClick={onOpen}
            icon={<ArrowsOut size={20} />}
            isDisabled={isDisabled}
            ml={2}
          />
        </Tooltip>
      )}
      <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={t('configurations.configuration_json')}
            right={<CloseButton ml={2} onClick={onClose} />}
          />
          <ModalBody>
            <pre>
              {JSON.stringify(
                {
                  globals: activeConfigurations.includes('globals') ? configurations.globals : undefined,
                  unit: activeConfigurations.includes('unit') ? configurations.unit : undefined,
                  metrics: activeConfigurations.includes('metrics') ? configurations.metrics : undefined,
                  services: activeConfigurations.includes('services') ? configurations.services : undefined,
                  radios: activeConfigurations.includes('radios') ? configurations.radios : undefined,
                  interfaces: activeConfigurations.includes('interfaces')
                    ? tryParseInter(configurations.interfaces)
                    : undefined,
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

ViewJsonConfigModal.propTypes = propTypes;
ViewJsonConfigModal.defaultProps = defaultProps;

export default React.memo(ViewJsonConfigModal, isEqual);
