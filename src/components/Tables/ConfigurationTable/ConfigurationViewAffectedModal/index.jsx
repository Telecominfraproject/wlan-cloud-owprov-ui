import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Center,
  Spinner,
  UnorderedList,
  ListItem,
  Heading,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import { useGetConfigurationAffected } from 'hooks/Network/Configurations';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }),
};
const defaultProps = {
  config: null,
};

const ConfigurationViewAffectedModal = ({ isOpen, onClose, config }) => {
  const { t } = useTranslation();
  const { data: affected, isLoading } = useGetConfigurationAffected({
    id: config?.id,
    enabled: isOpen && config && config.id !== '',
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader title={config?.name ?? ''} right={<CloseButton ml={2} onClick={onClose} />} />
        <ModalBody>
          {isLoading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <>
              <Heading size="sm">
                {t('configurations.affected_explanation', {
                  count: affected?.length ?? 0,
                })}
              </Heading>
              <UnorderedList maxH="800px" overflowY="auto">
                {affected?.map((dev) => (
                  <ListItem ml={4} key={uuid()}>
                    {dev}
                  </ListItem>
                ))}
              </UnorderedList>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

ConfigurationViewAffectedModal.propTypes = propTypes;
ConfigurationViewAffectedModal.defaultProps = defaultProps;

export default ConfigurationViewAffectedModal;
