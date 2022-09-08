import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { Button, useDisclosure, Modal, ModalBody, ModalContent, ModalOverlay, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'phosphor-react';
import ModalHeader from 'components/Modals/ModalHeader';
import CloseButton from 'components/Buttons/CloseButton';
import { SINGLE_RADIO_SCHEMA } from './radiosConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  radios: PropTypes.arrayOf(PropTypes.string).isRequired,
  arrayHelpers: PropTypes.shape({
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }).isRequired,
  setTabIndex: PropTypes.func.isRequired,
  arrLength: PropTypes.number.isRequired,
};

const RadioPicker = ({ editing, radios, arrayHelpers: { push: pushRadio }, setTabIndex, arrLength }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addRadio = (band) => {
    pushRadio(SINGLE_RADIO_SCHEMA(t, true, band).cast());
    setTabIndex(arrLength);
    onClose();
  };

  const canAddBand = (band) => !radios.find((radio) => radio === band);

  return (
    <>
      <Button
        colorScheme="blue"
        type="button"
        onClick={onOpen}
        rightIcon={<Plus size={20} />}
        hidden={!editing}
        borderRadius={0}
      >
        {t('configurations.add_radio')}
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} size="sm" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader title={t('configurations.add_radio')} right={<CloseButton ml={2} onClick={onClose} />} />
          <ModalBody>
            <Center my={2}>
              <Button
                colorScheme="blue"
                onClick={() => addRadio('2G')}
                rightIcon={<Plus size={20} />}
                isDisabled={!canAddBand('2G')}
              >
                2G
              </Button>
            </Center>
            <Center my={2}>
              <Button
                colorScheme="blue"
                onClick={() => addRadio('5G')}
                rightIcon={<Plus size={20} />}
                isDisabled={!canAddBand('5G')}
              >
                5G
              </Button>
            </Center>
            <Center my={2}>
              <Button
                colorScheme="blue"
                onClick={() => addRadio('5G-lower')}
                rightIcon={<Plus size={20} />}
                isDisabled={!canAddBand('5G-lower')}
              >
                5G-lower
              </Button>
            </Center>
            <Center my={2}>
              <Button
                colorScheme="blue"
                onClick={() => addRadio('5G-upper')}
                rightIcon={<Plus size={20} />}
                isDisabled={!canAddBand('5G-upper')}
              >
                5G-upper
              </Button>
            </Center>
            <Center my={2}>
              <Button
                colorScheme="blue"
                onClick={() => addRadio('6G')}
                rightIcon={<Plus size={20} />}
                isDisabled={!canAddBand('6G')}
              >
                6G
              </Button>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

RadioPicker.propTypes = propTypes;

export default React.memo(RadioPicker, isEqual);
