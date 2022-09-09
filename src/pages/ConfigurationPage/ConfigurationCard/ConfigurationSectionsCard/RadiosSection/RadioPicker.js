import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import {
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'phosphor-react';
import ModalHeader from 'components/Modals/ModalHeader';
import CloseButton from 'components/Buttons/CloseButton';
import { useFormikContext } from 'formik';
import { useGetAllResources } from 'hooks/Network/Resources';
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
  const { values } = useFormikContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: resources } = useGetAllResources();

  const createdBands = React.useMemo(() => {
    if (!resources) return [];

    const allUsedIds = values.configuration
      ?.map((radio) => radio.__variableBlock?.[0])
      .filter((id) => id !== undefined);

    return resources
      .map(({ id, variables }) => {
        try {
          if (allUsedIds.includes(id)) {
            const { band } = JSON.parse(variables[0].value);
            return band;
          }
        } catch {
          return null;
        }
        return null;
      })
      .filter((band) => band !== null && band !== undefined);
  }, [resources, values]);

  const addRadio = (band) => {
    pushRadio(SINGLE_RADIO_SCHEMA(t, true, band).cast());
    setTabIndex(arrLength);
    onClose();
  };

  const canAddBand = (band) =>
    radios.length < 5 &&
    !radios.find((radio) => radio === band) &&
    !createdBands.find((createdBand) => createdBand === band);

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
            <Center mb={4}>
              {radios.length >= 5 && (
                <Alert status="error" borderRadius={12}>
                  <AlertIcon />
                  {t('configurations.radio_limit')}
                </Alert>
              )}
            </Center>
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
