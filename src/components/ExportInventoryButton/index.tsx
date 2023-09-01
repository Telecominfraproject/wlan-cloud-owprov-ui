import * as React from 'react';
import { Box, Center, Heading, IconButton, Progress, Tooltip, useDisclosure } from '@chakra-ui/react';
import { Download, Export } from '@phosphor-icons/react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { ExportedDeviceInfo, getAllExportedDevicesInfo, getSelectExportedDevicesInfo } from './utils';
import ResponsiveButton from 'components/Buttons/ResponsiveButton';
import { Modal } from 'components/Modals/Modal';
import { dateForFilename } from 'utils/dateFormatting';

const HEADER_MAPPING: { key: keyof ExportedDeviceInfo; label: string }[] = [
  { key: 'serialNumber', label: 'Serial Number' },
  { key: 'deviceType', label: 'Device Type' },
  { key: 'name', label: 'Name' },
  { key: 'entity', label: 'Entity' },
  { key: 'venue', label: 'Venue' },
  { key: 'created', label: 'Created' },
  { key: 'modified', label: 'Modified' },
  { key: 'description', label: 'Description' },
  { key: 'devClass', label: 'Device Class' },
  { key: 'firmwareUpgrade', label: 'Firmware Upgrade' },
  { key: 'rcOnly', label: 'Release Candidates Only' },
  { key: 'rrm', label: 'RRM' },
  { key: 'id', label: 'ID' },
  { key: 'locale', label: 'Locale' },
];
type Status = {
  progress: number;
  status: 'loading-all' | 'loading-select' | 'success' | 'error' | 'idle';
  error?: string;
  lastResults?: ExportedDeviceInfo[];
};

type Props = {
  serialNumbers?: string[];
};

const ExportDevicesTableButton = ({ serialNumbers }: Props) => {
  const { t } = useTranslation();
  const modalProps = useDisclosure();
  const [status, setStatus] = React.useState<Status>({
    progress: 0,
    status: 'idle',
  });

  const setProgress = (progress: number) => {
    setStatus((prev) => ({ ...prev, progress }));
  };

  const onOpen = () => {
    if (!serialNumbers) {
      setStatus((prev) => ({ ...prev, error: undefined, lastResults: undefined, status: 'loading-all', progress: 0 }));
      getAllExportedDevicesInfo(setProgress)
        .then((result) => {
          setStatus((prev) => ({ ...prev, status: 'success', lastResults: result }));
        })
        .catch((error) => {
          setStatus((prev) => ({ ...prev, status: 'error', error }));
        });
    } else {
      setStatus((prev) => ({
        ...prev,
        error: undefined,
        lastResults: undefined,
        status: 'loading-select',
        progress: 0,
      }));
      getSelectExportedDevicesInfo(serialNumbers, setProgress)
        .then((result) => {
          setStatus((prev) => ({ ...prev, status: 'success', lastResults: result }));
        })
        .catch((error) => {
          setStatus((prev) => ({ ...prev, status: 'error', error }));
        });
    }
    modalProps.onOpen();
  };

  return (
    <>
      <Tooltip label={t('common.export')}>
        <IconButton aria-label={t('common.export')} icon={<Export size={20} />} colorScheme="purple" onClick={onOpen} />
      </Tooltip>
      <Modal {...modalProps} title={t('common.export')}>
        <Box>
          {status.status.includes('loading') || status.status === 'success' ? (
            <Box>
              <Center>
                <Heading size="sm">{Math.round(status.progress)}%</Heading>
              </Center>
              <Box px={8}>
                <Progress
                  isIndeterminate={status.progress === 0}
                  value={status.progress}
                  colorScheme={status.progress !== 100 ? 'blue' : 'green'}
                  hasStripe={status.progress !== 100}
                  isAnimated={status.progress !== 100}
                />
              </Box>
              <Center my={8} hidden={!status.lastResults}>
                <CSVLink
                  filename={`devices_export_${dateForFilename(new Date().getTime() / 1000)}.csv`}
                  data={status.lastResults ?? []}
                  headers={HEADER_MAPPING}
                >
                  <ResponsiveButton
                    color="blue"
                    icon={<Download size={20} />}
                    isCompact={false}
                    label={t('common.download')}
                    onClick={() => {}}
                  />
                </CSVLink>
              </Center>
            </Box>
          ) : null}
          {status.status.includes('error') ? (
            <Center my={12}>
              <Heading size="sm">{JSON.stringify(status.error, null, 2)}</Heading>
            </Center>
          ) : null}
        </Box>
      </Modal>
    </>
  );
};

export default ExportDevicesTableButton;
