import React, { useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DataTable from 'components/DataTable';

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

const PushResultTable = ({ devices, isShowingError }) => {
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

PushResultTable.propTypes = propTypes;
PushResultTable.defaultProps = defaultProps;
export default PushResultTable;
