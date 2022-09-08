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
import { useGetConfigurationInUse } from 'hooks/Network/Configurations';
import EntityCell from 'components/TableCells/EntityCell';
import VenueCell from 'components/TableCells/VenueCell';

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

const ConfigurationInUseModal = ({ isOpen, onClose, config }) => {
  const { t } = useTranslation();
  const { data: inUse, isLoading } = useGetConfigurationInUse({
    id: config?.id,
    enabled: isOpen && config !== null && config.id !== '',
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={t('configurations.in_use_title', { name: config?.name })}
          right={<CloseButton ml={2} onClick={onClose} />}
        />
        <ModalBody>
          {isLoading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <>
              <Heading size="sm">
                {t('entities.entity')} ({inUse?.ent?.length ?? 0})
              </Heading>
              <UnorderedList>
                {inUse?.ent?.map((ent) => (
                  <ListItem ml={4} key={uuid()}>
                    <EntityCell entityName={ent.name} entityId={ent.uuid} />
                  </ListItem>
                ))}
              </UnorderedList>
              <Heading size="sm">
                {t('venues.title')} ({inUse?.ven?.length ?? 0})
              </Heading>
              <UnorderedList>
                {inUse?.ven?.map((ven) => (
                  <ListItem ml={4} key={uuid()}>
                    <VenueCell venueName={ven.name} venueId={ven.uuid} />
                  </ListItem>
                ))}
              </UnorderedList>
              <Heading size="sm">
                {t('devices.title')} ({inUse?.inv?.length ?? 0})
              </Heading>
              <UnorderedList>
                {inUse?.inv?.map((dev) => (
                  <ListItem ml={4} key={uuid()}>
                    {dev.name}
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

ConfigurationInUseModal.propTypes = propTypes;
ConfigurationInUseModal.defaultProps = defaultProps;

export default ConfigurationInUseModal;
