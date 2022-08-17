import React from 'react';
import PropTypes from 'prop-types';
import CreateButton from 'components/Buttons/CreateButton';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  activeSubs: PropTypes.arrayOf(PropTypes.string).isRequired,
  addSub: PropTypes.func.isRequired,
};

const AddSubsectionModal = ({ editing, activeSubs, addSub }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const addNewSub = (sub) => {
    addSub(sub);
    onClose();
  };

  return (
    <>
      <CreateButton label={t('configurations.add_subsection')} onClick={onOpen} isDisabled={!editing} ml={2} />
      <Modal onClose={onClose} isOpen={isOpen} size="sm" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader title={t('configurations.add_subsection')} right={<CloseButton ml={2} onClick={onClose} />} />
          <ModalBody>
            <SimpleGrid minChildWidth="200px" spacing={4}>
              <Center>
                <Button
                  colorScheme="blue"
                  isDisabled={activeSubs.includes('globals')}
                  onClick={() => addNewSub('globals')}
                >
                  {t('configurations.globals')}
                </Button>
              </Center>
              <Center>
                <Button colorScheme="blue" isDisabled={activeSubs.includes('unit')} onClick={() => addNewSub('unit')}>
                  {t('configurations.unit')}
                </Button>
              </Center>
              <Center>
                <Button
                  colorScheme="blue"
                  isDisabled={activeSubs.includes('metrics')}
                  onClick={() => addNewSub('metrics')}
                >
                  {t('configurations.metrics')}
                </Button>
              </Center>
              <Center>
                <Button
                  colorScheme="blue"
                  isDisabled={activeSubs.includes('services')}
                  onClick={() => addNewSub('services')}
                >
                  {t('configurations.services')}
                </Button>
              </Center>
              <Center>
                <Button
                  colorScheme="blue"
                  isDisabled={activeSubs.includes('radios')}
                  onClick={() => addNewSub('radios')}
                >
                  {t('configurations.radios')}
                </Button>
              </Center>
              <Center>
                <Button
                  colorScheme="blue"
                  isDisabled={activeSubs.includes('interfaces')}
                  onClick={() => addNewSub('interfaces')}
                >
                  {t('configurations.interfaces')}
                </Button>
              </Center>
              <Center>
                <Button
                  colorScheme="blue"
                  isDisabled={activeSubs.includes('third-party')}
                  onClick={() => addNewSub('third-party')}
                >
                  {t('configurations.third_party')}
                </Button>
              </Center>
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

AddSubsectionModal.propTypes = propTypes;
export default React.memo(AddSubsectionModal);
