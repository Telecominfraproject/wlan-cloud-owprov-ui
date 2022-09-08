import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useBreakpoint,
  Button,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import { UploadSimple } from 'phosphor-react';
import ImportDeviceFile from './ImportDeviceFile';
import ImportDeviceTests from './ImportDeviceTests';
import ImportDevicePush from './ImportDevicePush';

const propTypes = {
  refresh: PropTypes.func.isRequired,
  deviceClass: PropTypes.string.isRequired,
  parent: PropTypes.shape({
    entity: PropTypes.string,
    venue: PropTypes.string,
  }),
};

const defaultProps = {
  parent: {},
};

const ImportDeviceCsvModal = ({ refresh, deviceClass, parent }) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const [refreshId, setRefreshId] = useState(uuid());
  // 0: explanation, file import and file analysis
  // 1: testing the serial number list with the API
  // 2: do the POSTs and PUTs necessary, show the results
  const [phase, setPhase] = useState(0);
  const [isCloseable, setIsCloseable] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const [devicesToTest, setDevicesToTest] = useState([]);
  const [devicesToImport, setDevicesToImport] = useState({});

  const getPhase = () => {
    switch (phase) {
      case 0:
        return (
          <ImportDeviceFile
            setPhase={setPhase}
            setDevices={setDevicesToTest}
            setIsCloseable={setIsCloseable}
            refreshId={refreshId}
          />
        );
      case 1:
        return (
          <ImportDeviceTests
            setPhase={setPhase}
            devicesToTest={devicesToTest}
            setDevicesToImport={setDevicesToImport}
          />
        );
      case 2:
        return (
          <ImportDevicePush
            devices={devicesToImport}
            refresh={refresh}
            deviceClass={deviceClass}
            parent={parent}
            setIsCloseable={setIsCloseable}
          />
        );
      default:
        return null;
    }
  };

  const openModal = () => {
    setPhase(0);
    setRefreshId(uuid());
    setIsCloseable(true);
    setDevicesToTest([]);
    setDevicesToImport([]);
    onOpen();
  };

  const getButton = () => {
    if (breakpoint !== 'base' && breakpoint !== 'sm') {
      return (
        <Button ml={2} colorScheme="blue" onClick={openModal} rightIcon={<UploadSimple size={20} />}>
          {t('devices.import_batch_tags')}
        </Button>
      );
    }

    return (
      <Tooltip label={t('devices.import_batch_tags')}>
        <IconButton ml={2} colorScheme="blue" onClick={openModal} icon={<UploadSimple size={20} />} />
      </Tooltip>
    );
  };

  const closeModal = () => (isCloseable ? onClose() : openConfirm());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  return (
    <>
      {getButton()}
      <Modal onClose={closeModal} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader title={t('devices.import_batch_tags')} right={<CloseButton ml={2} onClick={closeModal} />} />
          <ModalBody>{getPhase()}</ModalBody>
        </ModalContent>
        <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </Modal>
    </>
  );
};

ImportDeviceCsvModal.propTypes = propTypes;
ImportDeviceCsvModal.defaultProps = defaultProps;
export default ImportDeviceCsvModal;
