import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Box, Button, CloseButton, Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import ModalHeader from 'components/ModalHeader';
import { useTranslation } from 'react-i18next';
import { ArrowsOut } from 'phosphor-react';
import ColumnPicker from 'components/ColumnPicker';
import DataTable from 'components/DataTable';
import FormattedDate from 'components/FormattedDate';
import { minimalSecondsToDetailed } from 'utils/dateFormatting';
import { useGetGatewayUi } from 'hooks/Network/Endpoints';
import { arrayMoveIndex } from 'utils/arrayHelpers';

const propTypes = {
  data: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  tableOptions: PropTypes.shape({
    prioritizedColumns: PropTypes.arrayOf(PropTypes.string),
  }),
};
const defaultProps = {
  data: null,
  tableOptions: null,
};

const VenueDashboardTableModal = ({ data, isOpen, onOpen, onClose, tableOptions }) => {
  const { t } = useTranslation();
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const { data: gwUi } = useGetGatewayUi();
  const handleOpenInGateway = (serialNumber) => window.open(`${gwUi}/#/devices/${serialNumber}`, '_blank');

  const serialCell = useCallback(
    (cell) => (
      <Button
        onClick={() => handleOpenInGateway(cell.row.values.serialNumber)}
        variant="link"
        fontFamily="monospace"
        fontSize="0.8rem"
      >
        {cell.row.values.serialNumber}
      </Button>
    ),
    [],
  );

  const dateCell = useCallback(
    (cell, key) => (cell.row.values[key] ? <FormattedDate date={cell.row.values[key]} key={uuid()} /> : '-'),
    [],
  );
  const healthCell = useCallback((cell) => `${cell.row.values.health}%`, []);
  const statusCell = useCallback(
    (cell) => (cell.row.values.connected ? t('common.connected') : t('common.disconnected')),
    [],
  );
  const memoryCell = useCallback((cell) => `${Math.floor(cell.row.values.memory)}%`, []);
  const durationCell = useCallback(
    (cell, key) => (cell.row.values[key] !== undefined ? minimalSecondsToDetailed(cell.row.values[key], t) : ''),
    [],
  );

  const columns = React.useMemo(() => {
    let cols = [
      {
        id: 'serialNumber',
        Header: t('inventory.serial_number'),
        Footer: '',
        accessor: 'serialNumber',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        Cell: ({ cell }) => serialCell(cell),
        hasPopover: true,
        alwaysShow: true,
      },
      {
        id: 'connected',
        Header: t('common.status'),
        Footer: '',
        accessor: 'connected',
        Cell: ({ cell }) => statusCell(cell),
        customMinWidth: '1%',
      },
      {
        id: 'lastConnection',
        Header: t('analytics.last_connection'),
        Footer: '',
        accessor: 'lastConnection',
        Cell: ({ cell }) => dateCell(cell, 'lastConnection'),
        customMinWidth: '1%',
      },
      {
        id: 'lastPing',
        Header: t('analytics.last_ping'),
        Footer: '',
        accessor: 'lastPing',
        Cell: ({ cell }) => dateCell(cell, 'lastPing'),
        customMinWidth: '1%',
      },
      {
        id: 'lastContact',
        Header: t('analytics.last_contact'),
        Footer: '',
        Cell: ({ cell }) => dateCell(cell, 'lastContact'),
        accessor: 'lastContact',
        customMinWidth: '1%',
      },
      {
        id: 'health',
        Header: t('analytics.health'),
        Footer: '',
        accessor: 'health',
        Cell: ({ cell }) => healthCell(cell),
        customMinWidth: '1%',
      },
      {
        id: 'lastHealth',
        Header: t('analytics.last_health'),
        Footer: '',
        Cell: ({ cell }) => dateCell(cell, 'lastHealth'),
        accessor: 'lastHealth',
        customMinWidth: '1%',
      },
      {
        id: '2g',
        Header: '2G',
        Footer: '',
        accessor: 'associations_2g',
        customMinWidth: '1%',
      },
      {
        id: '5g',
        Header: '5G',
        Footer: '',
        accessor: 'associations_5g',
        customMinWidth: '1%',
      },
      {
        id: '6g',
        Header: '6G',
        Footer: '',
        accessor: 'associations_6g',
        customMinWidth: '1%',
      },
      {
        id: 'memory',
        Header: t('analytics.memory'),
        Footer: '',
        accessor: 'memory',
        Cell: ({ cell }) => memoryCell(cell),
        customMinWidth: '1%',
      },
      {
        id: 'uptime',
        Header: t('analytics.uptime'),
        Footer: '',
        accessor: 'uptime',
        Cell: ({ cell }) => durationCell(cell, 'uptime'),
        customMinWidth: '1%',
      },
      {
        id: 'deviceType',
        Header: t('inventory.device_type'),
        Footer: '',
        accessor: 'deviceType',
      },
      {
        id: 'lastFirmware',
        Header: t('analytics.firmware'),
        Footer: '',
        accessor: 'lastFirmware',
      },
    ];

    if (tableOptions?.prioritizedColumns?.length > 0) {
      cols = arrayMoveIndex(
        cols,
        cols.find((col) => col.id === tableOptions.prioritizedColumns[0]),
        1,
      );
    }

    return cols;
  }, []);

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen} isDisabled={!data} rightIcon={<ArrowsOut size={20} />}>
        {t('analytics.raw_data')}
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
          <ModalHeader
            title={t('crud.create_object', { obj: t('contacts.one') })}
            right={<CloseButton ml={2} onClick={onClose} />}
          />
          <ModalBody>
            <Box textAlign="right">
              <ColumnPicker
                columns={columns}
                hiddenColumns={hiddenColumns}
                setHiddenColumns={setHiddenColumns}
                preference="provisioning.venue.dashboard.hiddenColumns"
              />
            </Box>
            <Box overflowX="auto" w="100%">
              <DataTable
                sortBy={[
                  {
                    id: 'serialNumber',
                    desc: false,
                  },
                ]}
                columns={columns}
                data={data ? [...data.devices, ...data.ignoredDevices] : []}
                hiddenColumns={hiddenColumns}
                obj={t('devices.title')}
                saveSettingsId="venue.dashboard.table"
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

VenueDashboardTableModal.propTypes = propTypes;
VenueDashboardTableModal.defaultProps = defaultProps;
export default VenueDashboardTableModal;
