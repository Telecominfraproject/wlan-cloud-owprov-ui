import React, { useState } from 'react';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, Tooltip, IconButton } from '@chakra-ui/react';
import { UploadSimple } from 'phosphor-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import ImportDeviceFile from './ImportDeviceFile';
import ImportDevicePush from './ImportDevicePush';
import ImportDeviceTests from './ImportDeviceTests';
import CloseButton from 'components/Buttons/CloseButton';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import ModalHeader from 'components/Modals/ModalHeader';

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

  const closeModal = () => (isCloseable ? onClose() : openConfirm());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  return (
    <>
      <Tooltip label={t('devices.import_batch_tags')}>
        <IconButton ml={2} colorScheme="teal" onClick={openModal} icon={<UploadSimple size={20} />} />
      </Tooltip>
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
