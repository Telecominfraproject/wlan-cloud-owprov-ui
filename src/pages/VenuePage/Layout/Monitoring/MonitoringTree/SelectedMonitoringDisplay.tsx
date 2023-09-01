import * as React from 'react';
import { Box, Flex, Grid, GridItem, Heading, IconButton, Tooltip } from '@chakra-ui/react';
import { ArrowSquareOut } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import { useGetGatewayUi } from 'hooks/Network/Endpoints';
import { AnalyticsAssociationData, AnalyticsRadioData, AnalyticsSsidData } from 'models/Analytics';
import { bytesString, formatNumberToScientificBasedOnMax } from 'utils/stringHelper';

const SelectedMonitoringDisplay = () => {
  const { t } = useTranslation();
  const { selectedItem } = useVenueMonitoring();
  const { data: gwUi } = useGetGatewayUi();

  if (!selectedItem) return null;

  if (selectedItem.type === 'AP') {
    return (
      <Box w="100%">
        <Flex>
          <Heading textDecoration="underline" size="md">
            {selectedItem.data.serialNumber}
          </Heading>
          <Tooltip hasArrow label={t('common.view_in_gateway')} placement="top">
            <IconButton
              aria-label={t('common.view_in_gateway')}
              ml={2}
              colorScheme="blue"
              icon={<ArrowSquareOut size={20} />}
              size="xs"
              onClick={() => window.open(`${gwUi}/#/devices/${selectedItem.data.serialNumber}`, '_blank')}
            />
          </Tooltip>
        </Flex>
        <Grid templateColumns="repeat(3, 1fr)" gap={0}>
          <GridItem colSpan={1}>
            <b>{t('analytics.health')}:</b>
          </GridItem>
          <GridItem colSpan={2}>{selectedItem.data.dashboardData.health}%</GridItem>
          <GridItem colSpan={1}>
            <b>{t('analytics.memory_used')}:</b>
          </GridItem>
          <GridItem colSpan={2}>{Math.floor(selectedItem.data.dashboardData.memory)}%</GridItem>
          <GridItem colSpan={1}>
            <b>{t('common.type')}:</b>
          </GridItem>
          <GridItem colSpan={2}>{selectedItem.data.dashboardData.deviceType}</GridItem>
          <GridItem colSpan={1}>
            <b>{t('analytics.firmware')}:</b>
          </GridItem>
          <GridItem colSpan={2}>
            {selectedItem.data.dashboardData.lastFirmware?.split('/')[1] ?? t('common.unknown')}
          </GridItem>
          <GridItem colSpan={1}>
            <b>2G Clients:</b>
          </GridItem>
          <GridItem colSpan={2}>{selectedItem.data.dashboardData.associations_2g}</GridItem>
          <GridItem colSpan={1}>
            <b>5G Clients:</b>
          </GridItem>
          <GridItem colSpan={2}>{selectedItem.data.dashboardData.associations_5g}</GridItem>
          <GridItem colSpan={1}>
            <b>6G Clients:</b>
          </GridItem>
          <GridItem colSpan={2}>{selectedItem.data.dashboardData.associations_6g}</GridItem>
          <GridItem colSpan={3} mt={4}>
            <Heading size="sm" textDecoration="underline">
              Last 10 Minutes:
            </Heading>
          </GridItem>
          <GridItem colSpan={1}>
            <b>Tx:</b>
          </GridItem>
          <GridItem colSpan={2}>{bytesString(selectedItem.data.deltas.txBytes)}</GridItem>
          <GridItem colSpan={1}>
            <b>Tx Packets:</b>
          </GridItem>
          <GridItem colSpan={2}>{selectedItem.data.deltas.txPackets.toLocaleString()}</GridItem>
          <GridItem colSpan={1}>
            <b>Rx:</b>
          </GridItem>
          <GridItem colSpan={2}>{bytesString(selectedItem.data.deltas.rxBytes)}</GridItem>
          <GridItem colSpan={1}>
            <b>Rx Packets:</b>
          </GridItem>
          <GridItem colSpan={2}>{selectedItem.data.deltas.rxPackets.toLocaleString()}</GridItem>
        </Grid>
      </Box>
    );
  }

  if (selectedItem.type === 'RADIO') {
    const latestTimepoint = selectedItem.data.timepoints[selectedItem.data.timepoints.length - 1] as AnalyticsRadioData;
    return (
      <Box w="100%">
        <Heading textDecoration="underline" size="md">
          {selectedItem.serialNumber} - {selectedItem.data.band}G Band
        </Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={0}>
          <GridItem colSpan={1}>
            <b>{t('analytics.noise')}:</b>
          </GridItem>
          <GridItem colSpan={2}>{selectedItem.data.averageRssi} dB</GridItem>
          <GridItem colSpan={1}>
            <b>{t('analytics.channel')}:</b>
          </GridItem>
          <GridItem colSpan={2}>{latestTimepoint.channel}</GridItem>
          <GridItem colSpan={1}>
            <b>{t('analytics.temperature')}:</b>
          </GridItem>
          <GridItem colSpan={2}>{latestTimepoint.temperature}&#8451;</GridItem>
          <GridItem colSpan={1}>
            <b>{t('analytics.airtime')}:</b>
          </GridItem>
          <GridItem colSpan={2}>{latestTimepoint.transmit_pct.toFixed(2)}%</GridItem>
          <GridItem colSpan={1}>
            <b>{t('analytics.active')}:</b>
          </GridItem>
          <GridItem colSpan={2}>{latestTimepoint.active_pct.toFixed(2)}%</GridItem>
          <GridItem colSpan={1}>
            <b>{t('analytics.busy')}:</b>
          </GridItem>
          <GridItem colSpan={2}>{latestTimepoint.busy_pct.toFixed(2)}%</GridItem>
          <GridItem colSpan={1}>
            <b>{t('analytics.receive')}:</b>
          </GridItem>
          <GridItem colSpan={2}>{latestTimepoint.receive_pct.toFixed(2)}%</GridItem>
        </Grid>
      </Box>
    );
  }

  if (selectedItem.type === 'SSID') {
    const latestTimepoint = selectedItem.data.timepoints[selectedItem.data.timepoints.length - 1] as AnalyticsSsidData;

    return (
      <Box w="100%">
        <Heading textDecoration="underline" size="md">
          {selectedItem.data.band}G - {selectedItem.data.ssid}
        </Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={0}>
          <GridItem colSpan={1}>
            <b>BSSID:</b>
          </GridItem>
          <GridItem colSpan={2}>{selectedItem.data.bssid}</GridItem>
          <GridItem colSpan={1}>
            <b>{t('analytics.noise')}:</b>
          </GridItem>
          <GridItem colSpan={2}>{selectedItem.data.averageRssi} dB</GridItem>
          <GridItem colSpan={3}>
            <b>TX {t('analytics.bandwidth')} (avg / min / max)</b>
          </GridItem>
          <GridItem colSpan={3}>
            {bytesString(latestTimepoint.tx_bytes_bw.avg)} / {bytesString(latestTimepoint.tx_bytes_bw.min)} /{' '}
            {bytesString(latestTimepoint.tx_bytes_bw.max)}
          </GridItem>
          <GridItem colSpan={3}>
            <b>TX {t('analytics.packets')} /s</b>
          </GridItem>
          <GridItem colSpan={3}>
            {latestTimepoint.tx_packets_bw.avg.toFixed(2)} / {latestTimepoint.tx_packets_bw.min.toFixed(2)} /{' '}
            {latestTimepoint.tx_packets_bw.max.toFixed(2)}
          </GridItem>
          <GridItem colSpan={3}>
            <b>RX {t('analytics.bandwidth')} (avg / min / max)</b>
          </GridItem>
          <GridItem colSpan={3}>
            {bytesString(latestTimepoint.rx_bytes_bw.avg)} / {bytesString(latestTimepoint.rx_bytes_bw.min)} /{' '}
            {bytesString(latestTimepoint.rx_bytes_bw.max)}
          </GridItem>
          <GridItem colSpan={3}>
            <b>RX {t('analytics.packets')} /s</b>
          </GridItem>
          <GridItem colSpan={3}>
            {latestTimepoint.rx_packets_bw.avg.toFixed(2)} / {latestTimepoint.rx_packets_bw.min.toFixed(2)} /{' '}
            {latestTimepoint.rx_packets_bw.max.toFixed(2)}
          </GridItem>
        </Grid>
      </Box>
    );
  }

  if (selectedItem.type === 'UE') {
    const latestTimepoint = selectedItem.data.timepoints[
      selectedItem.data.timepoints.length - 1
    ] as AnalyticsAssociationData;

    return (
      <Box w="100%">
        <Heading textDecoration="underline" size="md">
          {selectedItem.data.station}
        </Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={0}>
          <GridItem>Connected to:</GridItem>
          <GridItem colSpan={2} pl={2}>
            <b>
              {selectedItem.data.band}G - {selectedItem.data.ssid}
            </b>
          </GridItem>
          <GridItem colSpan={3}>
            <b>Data (TX / RX)</b>
          </GridItem>
          <GridItem colSpan={1}>{t('analytics.total_data')}</GridItem>
          <GridItem colSpan={2}>
            {bytesString(latestTimepoint.tx_bytes)} / {bytesString(latestTimepoint.rx_bytes)}
          </GridItem>
          <GridItem colSpan={1}>{t('analytics.delta')}</GridItem>
          <GridItem colSpan={2}>
            {bytesString(selectedItem.data.deltas.txBytes)} / {bytesString(selectedItem.data.deltas.rxBytes)}
          </GridItem>
          <GridItem colSpan={1}>{t('analytics.bandwidth')}</GridItem>
          <GridItem colSpan={2}>
            {bytesString(latestTimepoint.tx_bytes_bw)} / {bytesString(latestTimepoint.rx_bytes_bw)}
          </GridItem>
          <GridItem colSpan={1}>{t('analytics.packets')} /s</GridItem>
          <GridItem colSpan={2}>
            {formatNumberToScientificBasedOnMax(latestTimepoint.tx_packets_bw)} /{' '}
            {formatNumberToScientificBasedOnMax(latestTimepoint.rx_packets_bw)}
          </GridItem>
          <GridItem colSpan={1}>MCS</GridItem>
          <GridItem colSpan={2}>
            {latestTimepoint.tx_rate.mcs} / {latestTimepoint.rx_rate.mcs}
          </GridItem>
          <GridItem colSpan={1}>NSS</GridItem>
          <GridItem colSpan={2}>
            {latestTimepoint.tx_rate.nss} / {latestTimepoint.rx_rate.nss}
          </GridItem>
        </Grid>
      </Box>
    );
  }

  return <pre>{JSON.stringify(selectedItem, null, 2)}</pre>;
};

export default SelectedMonitoringDisplay;
