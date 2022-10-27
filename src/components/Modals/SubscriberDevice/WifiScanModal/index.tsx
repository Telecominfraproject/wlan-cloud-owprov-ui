import React, { useEffect, useMemo, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, Center, Spinner } from '@chakra-ui/react';
import { ArrowLeft, Download, Gauge } from 'phosphor-react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import WifiScanForm from './Form';
import WifiScanResultDisplay from './ResultDisplay';
import CloseButton from 'components/Buttons/CloseButton';
import ResponsiveButton from 'components/Buttons/ResponsiveButton';
import ConfirmIgnoreCommand from 'components/Modals/Actions/ConfirmIgnoreCommand';
import ModalHeader from 'components/Modals/ModalHeader';
import { useWifiScanDevice } from 'hooks/Network/GatewayDevices';
import useCommandModal from 'hooks/useCommandModal';
import useFormRef from 'hooks/useFormRef';
import { DeviceScanResult, WifiScanCommand } from 'models/Device';
import { ModalProps } from 'models/Modal';
import { dateForFilename } from 'utils/dateFormatting';

interface Props {
  modalProps: ModalProps;
  serialNumber: string;
}

const WifiScanModal: React.FC<Props> = ({ modalProps: { isOpen, onClose }, serialNumber }) => {
  const { t } = useTranslation();
  const { form, formRef } = useFormRef();
  const [csvData, setCsvData] = useState<DeviceScanResult[] | undefined>(undefined);
  const { data: scanResult, mutateAsync: scan, isLoading, reset } = useWifiScanDevice({ serialNumber });
  const { isConfirmOpen, closeConfirm, closeModal, closeCancelAndForm } = useCommandModal({
    isLoading,
    onModalClose: onClose,
  });

  const submit = (data: WifiScanCommand) => {
    scan(data);
  };

  const body = useMemo(() => {
    if (isLoading)
      return (
        <Center my={100}>
          <Spinner size="lg" />
        </Center>
      );
    if (scanResult) {
      return <WifiScanResultDisplay results={scanResult} setCsvData={setCsvData} />;
    }
    return <WifiScanForm modalProps={{ isOpen, onOpen: () => {}, onClose }} submit={submit} formRef={formRef} />;
  }, [scanResult, isLoading, formRef]);

  const resetData = () => {
    reset();
    setCsvData(undefined);
  };

  useEffect(() => {
    if (isOpen) resetData();
  }, [isOpen]);
  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={t('commands.wifiscan')}
          right={
            <>
              {csvData ? (
                <CSVLink
                  filename={`wifi_scan_${serialNumber}_${dateForFilename(new Date().getTime() / 1000)}.csv`}
                  data={csvData}
                >
                  <ResponsiveButton
                    color="gray"
                    icon={<Download size={20} />}
                    isCompact
                    label={t('common.download')}
                    onClick={() => {}}
                  />
                </CSVLink>
              ) : (
                <ResponsiveButton
                  color="gray"
                  isDisabled
                  icon={<Download size={20} />}
                  isCompact
                  label={t('common.download')}
                  onClick={() => {}}
                />
              )}
              {scanResult !== undefined ? (
                <ResponsiveButton
                  color="blue"
                  icon={<ArrowLeft size={20} />}
                  label={t('common.back')}
                  onClick={resetData}
                  isLoading={isLoading}
                  ml={2}
                />
              ) : (
                <ResponsiveButton
                  color="blue"
                  icon={<Gauge size={20} />}
                  label={t('commands.scan')}
                  onClick={form.submitForm}
                  isLoading={isLoading}
                  ml={2}
                />
              )}
              <CloseButton ml={2} onClick={closeModal} />
            </>
          }
        />
        <ModalBody>{body}</ModalBody>
      </ModalContent>
      <ConfirmIgnoreCommand
        modalProps={{ isOpen: isConfirmOpen, onOpen: () => {}, onClose: closeConfirm }}
        confirm={closeCancelAndForm}
        cancel={closeConfirm}
      />
    </Modal>
  );
};

export default WifiScanModal;
