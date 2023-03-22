import * as React from 'react';
import { Box, Flex, HStack, IconButton, Spacer, Table, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { Download } from 'phosphor-react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import ReactVirtualizedAutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { ShownLogsDropdown } from 'components/ShownLogsDropdown';
import { useProvisioningStore } from 'contexts/ProvisioningSocketProvider/useStore';
import { dateForFilename } from 'utils/dateFormatting';

const NotificationsCard = () => {
  const { t } = useTranslation();
  const { availableLogTypes, hiddenLogIds, setHiddenLogIds, logs } = useProvisioningStore((state) => ({
    logs: state.allMessages,
    availableLogTypes: state.availableLogTypes,
    hiddenLogIds: state.hiddenLogIds,
    setHiddenLogIds: state.setHiddenLogIds,
  }));

  const labels = {
    1: t('logs.one'),
    1000: t('logs.venue_upgrade'),
    2000: t('logs.venue_config'),
    3000: t('logs.venue_reboot'),
  };

  const data = React.useMemo(() => {
    const arr = logs.filter(
      (log) =>
        log.type === 'NOTIFICATION' &&
        log.data.type === 'NOTIFICATION' &&
        (log.data.data.type_id === 1000 || log.data.data.type_id === 2000 || log.data.data.type_id === 3000),
    );

    return arr.reverse() as {
      type: 'NOTIFICATION';
      data: {
        type: 'NOTIFICATION';
        data: {
          notification_id: number;
          type?: 'venue_fw_upgrade' | 'venue_config_update' | 'venue_rebooter';
          type_id: 1000 | 2000 | 3000;
          content: {
            title: string;
            details: string;
            success: string[];
            noFirmware?: string[];
            notConnected?: string[];
            skipped?: string[];
            warning: string[];
            error: string[];
            timeStamp: number;
          };
        };
        log?: undefined;
        notificationTypes?: undefined;
      };
      timestamp: Date;
      id: string;
    }[];
  }, [logs]);

  type RowProps = { index: number; style: React.CSSProperties };
  const Row = React.useCallback(
    ({ index, style }: RowProps) => {
      const msg = data[index];
      if (msg) {
        if (msg.type === 'NOTIFICATION' && msg.data.type === 'NOTIFICATION') {
          return (
            <Box style={style}>
              <Flex w="100%">
                <Box flex="0 1 110px">
                  <Text>{msg.timestamp.toLocaleTimeString()}</Text>
                </Box>
                <Box flex="0 1 230px" textAlign="left">
                  <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" w="230px">
                    {msg.data.data.content.title ?? '-'}
                  </Text>
                </Box>
                <Box flex="0 1 140px">
                  <Text>{labels[msg.data.data.type_id]}</Text>
                </Box>
                <Box textAlign="left" w="calc(100% - 80px - 220px - 140px - 60px)">
                  <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                    {JSON.stringify(msg.data.data.content)}
                  </Text>
                </Box>
              </Flex>
            </Box>
          );
        }
      }
      return null;
    },
    [t, data],
  );

  const downloadableLogs = React.useMemo(
    () =>
      data.map((msg) => ({
        timestamp: msg.timestamp.toLocaleString(),
        serialNumber: labels[msg.data.data.type_id] ?? '-',
        type: labels[msg.data.data.type_id] ?? '-',
        data: JSON.stringify(msg.data.data),
      })),
    [data],
  );

  return (
    <>
      <CardHeader px={4} pt={4}>
        <Spacer />
        <HStack spacing={2}>
          <ShownLogsDropdown
            availableLogTypes={availableLogTypes}
            setHiddenLogIds={setHiddenLogIds}
            hiddenLogIds={hiddenLogIds}
            helperLabels={labels}
          />
          <CSVLink
            filename={`logs_${dateForFilename(new Date().getTime() / 1000)}.csv`}
            data={downloadableLogs as object[]}
          >
            <Tooltip label={t('logs.export')} hasArrow>
              <IconButton aria-label={t('logs.export')} icon={<Download />} colorScheme="blue" />
            </Tooltip>
          </CSVLink>
        </HStack>
      </CardHeader>
      <CardBody p={4}>
        <Box overflowX="auto" w="100%">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th w="110px">{t('common.time')}</Th>
                <Th w="250px">{t('contacts.title')}</Th>
                <Th w="120px" pl={0}>
                  {t('common.type')}
                </Th>
                <Th>{t('analytics.raw_data')}</Th>
              </Tr>
            </Thead>
          </Table>
          <Box ml={4} h="calc(70vh)">
            <ReactVirtualizedAutoSizer>
              {({ height, width }) => (
                <List height={height} width={width} itemCount={data.length} itemSize={35}>
                  {Row}
                </List>
              )}
            </ReactVirtualizedAutoSizer>
          </Box>
        </Box>
      </CardBody>
    </>
  );
};

export default NotificationsCard;
