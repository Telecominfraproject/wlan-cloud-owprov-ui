import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { ModalProps } from 'models/Modal';
import { Modal, ModalOverlay, ModalContent, ModalBody, Center, useToast, Spinner } from '@chakra-ui/react';
import ModalHeader from 'components/ModalHeader';
import CloseButton from 'components/Buttons/CloseButton';
import ConfirmIgnoreCommand from 'components/Modals/Actions/ConfirmIgnoreCommand';
import useCommandModal from 'hooks/useCommandModal';
import { useWifiScanDevice } from 'hooks/Network/GatewayDevices';
import { ArrowLeft, Download, Gauge } from 'phosphor-react';
import { ScanChannel, WifiScanCommand } from 'models/Device';
import useFormRef from 'hooks/useFormRef';
import ResponsiveButton from 'components/Buttons/ResponsiveButton';
import { CSVLink } from 'react-csv';
import { dateForFilename } from 'utils/dateFormatting';
import { Data } from 'react-csv/components/CommonPropTypes';
import WifiScanForm from './Form';
import WifiScanResultDisplay from './ResultDisplay';

interface Props {
  modalProps: ModalProps;
  serialNumber: string;
}

const WifiScanModal: React.FC<Props> = ({ modalProps: { isOpen, onClose }, serialNumber }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { form, formRef } = useFormRef();
  const [csvData, setCsvData] = useState<ScanChannel[] | undefined>(undefined);
  const { data: scanResult, mutateAsync: scan, isLoading, reset } = useWifiScanDevice({ serialNumber });
  const { isConfirmOpen, closeConfirm, closeModal, closeCancelAndForm } = useCommandModal({
    isLoading,
    onModalClose: onClose,
  });

  const submit = (data: WifiScanCommand) => {
    scan(data, {
      onSuccess: () => {},
      onError: (e: any) => {
        toast({
          id: uuid(),
          title: t('common.error'),
          description: t('commands.wifiscan_error', {
            e: e?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
    });
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
                  data={csvData as Data}
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
