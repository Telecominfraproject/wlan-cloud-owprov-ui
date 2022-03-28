import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, Heading } from '@chakra-ui/react';
import DataTable from 'components/DataTable';

const parseDbm = (value) => {
  if (!value) return '-';
  if (value > -150 && value < 100) return value;
  return (4294967295 - value) * -1;
};

const getAssociationsFromStats = (statsInfo) => {
  const associations = [];

  if (!statsInfo) return null;

  for (const deviceInterface of statsInfo?.interfaces ?? []) {
    if ('counters' in deviceInterface && 'ssids' in deviceInterface) {
      for (const ssid of deviceInterface.ssids) {
        // Information common between all associations
        const radioInfo = {
          found: false,
        };

        if (ssid.phy !== undefined) {
          radioInfo.radio = statsInfo.radios.findIndex((element) => element.phy === ssid.phy);
          radioInfo.found = radioInfo.radio !== undefined;
          radioInfo.radioIndex = radioInfo.radio;
        }

        if (!radioInfo.found && ssid.radio !== undefined) {
          const radioArray = ssid.radio.$ref.split('/');
          const radioIndex = radioArray !== undefined ? radioArray[radioArray.length - 1] : '-';
          radioInfo.found = statsInfo.radios[radioIndex] !== undefined;
          radioInfo.radio = radioIndex;
          radioInfo.radioIndex = radioIndex;
        }

        if (!radioInfo.found) {
          radioInfo.radio = '-';
        }

        if ('associations' in ssid) {
          for (const association of ssid.associations) {
            const assoc = {
              radio: radioInfo,
              bssid: association.bssid,
              ssid: ssid.ssid,
              rssi: association.rssi ? parseDbm(association.rssi) : '-',
            };
            associations.push(assoc);
          }
        }
      }
    }
  }
  return associations;
};

const columns = [
  {
    id: 'radio',
    Header: 'R',
    Footer: '',
    accessor: 'radio.radio',
    customMaxWidth: '20px',
    customWidth: '20px',
    customMinWidth: '20px',
    alwaysShow: true,
    disableSortBy: true,
  },
  {
    id: 'bssid',
    Header: 'BSSID',
    Footer: '',
    accessor: 'bssid',
    disableSortBy: true,
  },
  {
    id: 'ssid',
    Header: 'SSID',
    Footer: '',
    accessor: 'ssid',
    disableSortBy: true,
  },
  {
    id: 'rssi',
    Header: 'RSSI',
    Footer: '',
    accessor: 'rssi',
    customMaxWidth: '40px',
    customWidth: '40px',
    customMinWidth: '40px',
    disableSortBy: true,
  },
];

const propTypes = {
  statsInfo: PropTypes.instanceOf(Object),
};

const defaultProps = {
  statsInfo: null,
};

const AssociationsTable = ({ statsInfo }) => {
  const { t } = useTranslation();

  const associations = getAssociationsFromStats(statsInfo);

  if (!statsInfo) {
    return (
      <Heading size="sm" mt={2}>
        0 {t('devices.associations')}
      </Heading>
    );
  }

  return (
    <>
      <Heading size="sm" mt={2}>
        {associations.length} {t('devices.associations')}
      </Heading>
      {associations.length > 0 && (
        <Box overflowY="auto" maxH="150px" w="100%">
          <DataTable columns={columns} data={associations} hideControls obj={t('devices.associations')} />
        </Box>
      )}
    </>
  );
};

AssociationsTable.propTypes = propTypes;
AssociationsTable.defaultProps = defaultProps;
export default AssociationsTable;
