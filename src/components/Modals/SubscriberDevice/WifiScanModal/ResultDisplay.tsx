import React, { useMemo } from 'react';
import { Alert, Heading, SimpleGrid } from '@chakra-ui/react';
import { ScanChannel, WifiScanResult } from 'models/Device';
import { useTranslation } from 'react-i18next';
import { parseDbm } from 'utils/stringHelper';
import { v4 as uuid } from 'uuid';
import ResultCard from './ResultCard';

interface Props {
  results: WifiScanResult;
}
const WifiScanResultDisplay: React.FC<Props> = ({ results }) => {
  const { t } = useTranslation();

  const scanChannelList = useMemo(() => {
    const createdChannels: { [key: string]: ScanChannel } = {};

    for (const scan of results.results.status.scan) {
      if (!createdChannels[scan.channel]) {
        const channel: ScanChannel = {
          channel: scan.channel,
          devices: [],
        };
        for (const deviceResult of results.results.status.scan) {
          if (deviceResult.channel === scan.channel) {
            let ssid: string = '';
            const signal: number = parseDbm(deviceResult.signal);
            if (deviceResult.ssid && deviceResult.ssid.length > 0) ssid = deviceResult.ssid;
            else ssid = deviceResult.meshid && deviceResult.meshid.length > 0 ? deviceResult.meshid : 'N/A';
            channel.devices.push({ ssid, signal });
          }
        }
        createdChannels[scan.channel] = channel;
      }
    }
    return createdChannels;
  }, [results]);

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
        {Object.keys(scanChannelList).map((k) => (
          <ResultCard key={uuid()} channelInfo={scanChannelList[k] as ScanChannel} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default WifiScanResultDisplay;
