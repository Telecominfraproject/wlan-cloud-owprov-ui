import React, { useEffect, useMemo } from 'react';
import { Alert, Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import ResultCard from './ResultCard';
import { ScanChannel, WifiScanResult, DeviceScanResult } from 'models/Device';
import { parseDbm } from 'utils/stringHelper';

interface Props {
  results: WifiScanResult;
  setCsvData: (data: DeviceScanResult[]) => void;
}

const WifiScanResultDisplay = (
  {
    results,
    setCsvData
  }: Props
) => {
  const { t } = useTranslation();

  const scanResults = useMemo(() => {
    const createdChannels: { [key: string]: ScanChannel } = {};
    const listCsv: DeviceScanResult[] = [];

    for (const scan of results.results.status.scan) {
      if (!createdChannels[scan.channel]) {
        const channel: ScanChannel = {
          channel: scan.channel,
          devices: [],
        };
        for (const deviceResult of results.results.status.scan) {
          if (deviceResult.channel === scan.channel) {
            let ssid = '';
            const signal: number | string = parseDbm(deviceResult.signal);
            if (deviceResult.ssid && deviceResult.ssid.length > 0) ssid = deviceResult.ssid;
            else ssid = deviceResult.meshid && deviceResult.meshid.length > 0 ? deviceResult.meshid : 'N/A';
            channel.devices.push({ ssid, signal });
            listCsv.push({ ...deviceResult, ssid, signal });
          }
        }
        createdChannels[scan.channel] = channel;
      }
    }
    return { scanList: Object.keys(createdChannels).map((k) => createdChannels[k] as ScanChannel), listCsv };
  }, [results]);

  useEffect(() => {
    setCsvData(scanResults.listCsv);
  }, [scanResults]);

  return (
    <>
      {results.errorCode === 1 && (
        <Heading size="sm">
          <Alert colorScheme="red">{t('commands.wifiscan_error_1')}</Alert>
        </Heading>
      )}
      <Heading size="sm">
        {t('commands.execution_time')}: {Math.floor(results.executionTime / 1000)}s
      </Heading>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        {scanResults.scanList.map((channel) => (
          <ResultCard key={uuid()} channelInfo={channel} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default WifiScanResultDisplay;
