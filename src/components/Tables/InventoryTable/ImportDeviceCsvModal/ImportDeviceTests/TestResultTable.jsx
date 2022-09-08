import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';

const propTypes = {
  isShowingError: PropTypes.bool,
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      SerialNumber: PropTypes.string,
      DeviceType: PropTypes.string,
      Name: PropTypes.string,
      Description: PropTypes.string,
      Note: PropTypes.string,
      error: PropTypes.string,
    }),
  ).isRequired,
};
const defaultProps = {
  isShowingError: false,
};

const TestResultTable = ({ devices, isShowingError }) => {
  const { t } = useTranslation();

  const columns = useMemo(() => {
    const baseColumns = [
      {
        id: 'serialNumber',
        Header: t('inventory.serial_number'),
        Footer: '',
        accessor: 'SerialNumber',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        isMonospace: true,
      },
      {
        id: 'deviceType',
        Header: t('inventory.device_type'),
        Footer: '',
        accessor: 'DeviceType',
      },
    ];

    if (isShowingError) {
      baseColumns.push({
        id: 'error',
        Header: t('common.error'),
        Footer: '',
        accessor: 'error',
      });
    }

    return baseColumns;
  }, []);

  return (
    <Box overflowY="auto" maxH="200px">
      <DataTable columns={columns} data={devices} obj={t('devices.title')} minHeight="200px" />
    </Box>
  );
};

TestResultTable.propTypes = propTypes;
TestResultTable.defaultProps = defaultProps;
export default TestResultTable;
