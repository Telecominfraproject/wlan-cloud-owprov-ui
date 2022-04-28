import React from 'react';
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
import ModalHeader from 'components/Modals/ModalHeader';
import CloseButton from 'components/Buttons/CloseButton';
import { InterfaceProps } from 'models/ConfigurationSections/Interfaces';
import useInterfacesJsonDisplay from './useInterfacesJsonDisplay';

interface Props {
  configurations: {
    globals?: string;
    unit?: string;
    metrics?: string;
    services?: string;
    radios?: string;
    interfaces?: {
      configuration: InterfaceProps[];
    };
  };
  activeConfigurations: string[];
  isDisabled?: boolean;
}

const ViewJsonConfigModal: React.FC<Props> = ({ configurations, activeConfigurations, isDisabled }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const interfaces = useInterfacesJsonDisplay({ interfaces: configurations.interfaces?.configuration, isOpen });
  const breakpoint = useBreakpoint();

  return (
    <>
      {breakpoint !== 'base' && breakpoint !== 'sm' ? (
        <Button
          colorScheme="gray"
          type="button"
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
            aria-label="Show JSON Configuration"
            colorScheme="gray"
            type="button"
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
                  interfaces,
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

export default React.memo(ViewJsonConfigModal, isEqual);
